export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ApiCategory { id: number; name: string; }

export async function fetchCategories(language: "en"|"fr"="fr"): Promise<ApiCategory[]> {
  const res = await fetch("https://opentdb.com/api_category.php");
  if (!res.ok) throw new Error("Erreur de chargement des catégories");
  const data = await res.json();
  let cats: ApiCategory[] = (data.trivia_categories ?? [])
    .map((c: any) => ({ id: c.id, name: c.name }));

  // Optionnel: traduction FR si tu veux
  if (language === "fr") {
    // cats = await Promise.all(cats.map(async c => ({...c, name: await translateToFrench(c.name)})));
  }

  return cats;
}

// typer les options acceptées
export interface FetchQuestionsParams {
  amount?: number;               // 1..50 (limite OpenTDB)
  categoryId?: number;           // ex: 18 (Science: Computers)
  difficulty?: Difficulty;       // 'easy' | 'medium' | 'hard'
  type?: 'multiple' | 'boolean'; // 'multiple' par défaut 
  language?: 'en' | 'fr';        // 'fr' => utilisé dans translate()
  token?: string;                // token de session (pour éviter les doublons plus tard)
}

// renvoie de la question sous cette forme
export interface NormalizedQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  category?: string;
  difficulty?: Difficulty | string;
}

// Algorithme Fisher-Yates pour mélanger équitablement
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Décodage base64 → UTF-8
function b64ToUtf8(b64: string): string {
  try {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return b64;
  }
}

// Traduit une chaîne en français via un provider
async function translateToFrench(text: string): Promise<string> {
  return text;
}

// Traduit un tableau de chaîne en français
async function translateArrayToFrench(items: string[]): Promise<string[]> {
  return Promise.all(items.map(translateToFrench));
}

// Function for wait x ms
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Recovery function with error 429 (too many requests) 
async function smartFetch(url: string, retries = 5): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url);

    // Success
    if (res.ok) return res;

    // Fail
    if (res.status === 429) {
      console.warn(`⚠️ API trop sollicitée, tentative ${attempt}/${retries}`);
      const delay = attempt * 2000; // increase (2s, 4s, 6s, 8s and 10s)
      await wait(delay);
      continue; // retry
    }

    // If other fail
    throw new Error(`Erreur HTTP ${res.status}`);
  }

  // If all test fail
  throw new Error("Impossible de charger les questions après plusieurs tentatives");
}

export async function fetchQuestions({
  amount = 10,
  categoryId,
  difficulty,
  type = "multiple",
  language = "fr",
  token,
}: FetchQuestionsParams = {}): Promise<NormalizedQuestion[]> {
  // url construction
  const params = new URLSearchParams({
    amount: String(Math.min(Math.max(amount, 1), 50)),
    type,
    encode: "base64",
  });

  // add params (optional)
  if (categoryId) params.set("category", String(categoryId));
  if (difficulty) params.set("difficulty", difficulty);
  if (token) params.set("token", token);

  const url = `https://opentdb.com/api.php?${params.toString()}`;

  // call smartFetch to test only error 429 
  const res = await smartFetch(url);
  const data = await res.json();

  // Data normalization 
  const normalizedRaw: NormalizedQuestion[] = (data.results ?? []).map((q: any) => {
    const question = b64ToUtf8(q.question);
    const correct = b64ToUtf8(q.correct_answer);
    const incorrects = (q.incorrect_answers ?? []).map((a: string) => b64ToUtf8(a));
    const answers = shuffle([correct, ...incorrects]);

    return {
      id: crypto.randomUUID(),
      question,
      answers,
      correctAnswer: correct,
      category: q.category ? b64ToUtf8(q.category) : undefined,
      difficulty: q.difficulty,
    };
  });

  // Translate if language is 'fr'
  if (language === "fr") {
    const translated = await Promise.all(
      normalizedRaw.map(async (q) => {
        const [tQ, tAns] = await Promise.all([
          translateToFrench(q.question),
          translateArrayToFrench(q.answers),
        ]);

        const correctIndex = q.answers.findIndex((a) => a === q.correctAnswer);
        const newCorrect = tAns[correctIndex] ?? q.correctAnswer;

        return {
          ...q,
          question: tQ,
          answers: tAns,
          correctAnswer: newCorrect,
          category: q.category ? await translateToFrench(q.category) : q.category,
        };
      })
    );
    return translated;
  }

  return normalizedRaw;
}