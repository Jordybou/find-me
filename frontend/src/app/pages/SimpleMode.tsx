import { useEffect, useMemo, useState } from "react";
import { fetchQuestions, fetchCategories, shuffle, type ApiCategory } from "@/services/questions.service";
import type { NormalizedQuestion, Difficulty } from "@/services/questions.service";
import ReturnMenu from "@/components/ReturnButton";

// Difficuty
const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: "easy", label: "Facile" },
  { id: "medium", label: "Moyenne" },
  { id: "hard", label: "Difficile" },
];

export default function SimpleMode() {
  // State
  const [questions, setQuestions] = useState<NormalizedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(10);

  // State UI
  const [loading, setLoading] = useState(false);      // chargement des questions
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);      // false = écran sélection ; true = quiz

  // Categories
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);

  // Sélections utilisateur
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  // Chargement des catégories

  useEffect(() => {
    (async () => {
      try {
        setCatLoading(true);
        const list = await fetchCategories("fr");
        setCategories(list);
      } catch (e: any) {
        setCatError(e?.message ?? "Impossible de charger les catégories");
      } finally {
        setCatLoading(false);
      }
    })();
  }, []);

  // Helpers UI & logic

  const isLast = currentIndex === questions.length - 1;

  // Hook for button start
  const canStart = useMemo(() => {
    return selectedCategories.length > 0 && !!selectedDifficulty;
  }, [selectedCategories.length, selectedDifficulty]);

  // Check/Uncheck categories
  function toggleCategory(catId: number) {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  }

  function chooseDifficulty(diffId: Difficulty) {
    setSelectedDifficulty(diffId);
  }

  // Start game

  async function startGame() {
    // Categories or difficulty choice
    if (!canStart || !selectedDifficulty) return;
    // Spinner
    setLoading(true);
    setError(null);
    try {
      // choice number question (min 1, max 50)
      const amountNeeded = Math.min(Math.max(questionCount, 1), 50);

      // One call with API
      if (selectedCategories.length <= 1) {
        const one = await fetchQuestions({
          amount: amountNeeded,
          categoryId: selectedCategories[0], // undefined if null
          difficulty: selectedDifficulty,
          type: "multiple",
          language: "fr",
        });

        // Error if 0 question
        if (one.length === 0) {
          setError("Aucune question trouvée pour ces critères.");
          setPlaying(false);
          return;
        }

        // Start if find questions  
        setQuestions(one.slice(0, amountNeeded));
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setScore(0);
        setPlaying(true);
        return;
      }

      // Multi categories distributed equitably
      const perCat = Math.floor(amountNeeded / selectedCategories.length);
      const remainder = amountNeeded - perCat * selectedCategories.length;

      const calls = selectedCategories.map((catId, idx) =>
        fetchQuestions({
          amount: perCat + (idx < remainder ? 1 : 0),
          categoryId: catId,
          difficulty: selectedDifficulty,
          type: "multiple",
          language: "fr",
        })
      );

      // Merge call API
      const batches = await Promise.all(calls);
      const merged = batches.flat();
      // Merge questions
      const picked = shuffle(merged).slice(0, amountNeeded);

      if (picked.length === 0) {
        setError("Aucune question trouvée pour ces critères.");
        setPlaying(false);
        return;
      }

      setQuestions(picked);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setPlaying(true);
    } catch (e: any) {
      console.error("[SimpleMode] fetch error", e);
      setError(e?.message ?? "Erreur lors du chargement des questions");
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  }

  // Handlers quiz

  const currentQuestion = questions[currentIndex];

  // Clic on answer
  function handleAnswer(answer: string) {
    if (!playing) return;
    if (!currentQuestion || selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correctAnswer) {
      setScore((s) => s + 1);
    }
  }

  // Check if question is true and answer is selected
  function handleNext() {
    if (!currentQuestion) return;
    if (selectedAnswer === null) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      // End game, return menu and state reset
      setPlaying(false);
      setQuestions([]);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setScore(0);
    }
  }

  // UI states

  // Loading overlay/spinner with fetch question
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-sky-200">
        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-[550px] mx-auto">
          <header className="flex items-center justify-between mb-4 text-sm [color:#0B1221]">
            <div className="flex flex-col items-start">
              <span className="invisible">Question 0 / 10</span>
              <span className="invisible">Score : 0</span>
            </div>
            <ReturnMenu to="/" label="Menu" />
          </header>
          {/* Spinner */}
          <div role="status" aria-live="polite" className="flex flex-col items-center text-center">
            <svg
              aria-hidden="true"
              className="block animate-spin origin-center"
              width="42" height="42"
              viewBox="0 0 100 101"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#151516ff"
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              />
              <path
                fill="#1915faff"
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326Z"
              />
            </svg>
            <p className="mt-3 text-sm [color:#0369A1] font-medium">Loading…</p>
          </div>
        </div>
      </div>
    );
  }

  // Selection screen
  if (!playing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-sky-200">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-[700px] mx-auto">
          <header className="mb-6 grid [grid-template-columns:1fr_auto_1fr] items-center">
            <div />

            <h1 className="text-2xl font-extrabold tracking-tight [color:#030303] text-center m-0">
              Mode Simple
            </h1>

            <div className="flex justify-end">
              <ReturnMenu to="/" label="Menu" />
            </div>
          </header>

          {/* Categories */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold [color:#0B1221] mb-2">Catégories</h2>

            {catLoading ? (
              <p className="text-sm [color:#0369A1]">Chargement des catégories…</p>
            ) : catError ? (
              <p className="text-sm [color:#B91C1C]">{catError}</p>
            ) : (
              <div className="grid [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))] sm:[grid-template-columns:repeat(auto-fit,minmax(160px,1fr))] gap-3">
                {categories.map((c) => {
                  const active = selectedCategories.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCategory(c.id)}
                      className={[
                        "rounded-lg py-3 px-3 border text-sm font-medium transition-all duration-150",
                        active
                          ? "[background:#BBF7D0] [border-color:#16A34A] [color:#14532D] shadow-[0_4px_10px_rgba(0,0,0,0.25)] scale-[1.01]"
                          : "bg-white [color:#1E40AF] [border-color:#1E40AF] hover:[background:#F0F9FF]",
                      ].join(" ")}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Difficulty (one choice) */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold [color:#0B1221] mb-2">Difficulté</h2>
            <div role="radiogroup" aria-label="Choix de la difficulté" className="flex flex-wrap gap-3">
              {DIFFICULTIES.map((d) => {
                const active = selectedDifficulty === d.id;
                return (
                  <button
                    key={d.id}
                    role="radio"
                    aria-checked={active}
                    type="button"
                    onClick={() => chooseDifficulty(d.id)}
                    className={[
                      "rounded-full py-2 px-4 border transition-all duration-150 text-sm font-semibold",
                      active
                        ? "bg-amber-100 [color:#92400E] border-amber-600 shadow-[0_0_0_3px_rgba(245,158,11,0.55)]"
                        : "bg-white [color:#1E40AF] [border-color:#1E40AF] hover:[background:#F0F9FF]",
                    ].join(" ")}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Number questions */}
          <section className="mb-6 mt-4">
            <h2 className="text-lg font-semibold [color:#0B1221] mb-2">
              Nombre de questions
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Slider */}
              <input
                type="range"
                min={1}
                max={50}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full cursor-pointer"
              />

              {/* Affichage + input direct */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={questionCount}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (Number.isNaN(value)) return;
                    setQuestionCount(Math.min(Math.max(value, 1), 50));
                  }}
                  className="w-16 border rounded-md px-2 py-1 text-sm [border-color:#1E40AF] [color:#0B1221]"
                />
                <span className="text-sm [color:#030303]">/ 50 max</span>
              </div>
            </div>
          </section>

          {/* Bouton Start */}
          <div className="mt-8 text-center">
            <button
              onClick={startGame}
              disabled={!canStart}
              className={[
                "inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold shadow transition disabled:opacity-50",
                canStart
                  ? "[background:#1E40AF] [color:#ffffff] hover:[filter:brightness(1.05)] active:[transform:scale(0.98)]"
                  : "bg-gray-200 [color:#6B7280]",
              ].join(" ")}
            >
              Start
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm [color:#B91C1C] font-medium text-center">{error}</p>
          )}
        </div>
      </div>
    );
  }

  // Quiz report

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-sky-200">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-[550px] mx-auto text-center">
        <header className="flex items-end justify-between mb-4 text-sm [color:#0B1221]">
          <div className="flex flex-col items-start">
            <span>Question {currentIndex + 1} / {questions.length}</span>
            <span className="font-semibold [color:#030303]">Score : {score}</span>
          </div>
          <div className="flex items-center gap-3">
            <ReturnMenu to="/" label="Menu" />
          </div>
        </header>

        <h2 className="text-2xl font-bold mb-4 [color:#030303]">
          {currentQuestion?.question}
        </h2>

        <div className="grid gap-10">
          {/* Answers */}
          <div className="answers">
            {(currentQuestion?.answers ?? []).map((option, i) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion?.correctAnswer;
              const showState = selectedAnswer !== null;

              const base =
                "w-full min-h-[44px] px-4 py-2 rounded-lg border-2 font-medium transition-colors duration-200 select-none";
              const idle =
                "bg-white border-gray-300 [color:#111827] hover:bg-sky-50";
              const good =
                "bg-green-100 border-green-600 shadow-[0_0_0_4px_rgba(34,197,94,1)] [color:#14532D]";
              const bad =
                "bg-red-100 border-red-600 shadow-[0_0_0_4px_rgba(239,68,68,1)] [color:#7F1D1D]";
              const neutral =
                "bg-gray-50 [color:#4B5563] border-gray-300";

              let classes = `${base} ${idle}`;
              if (showState) {
                if (isSelected && isCorrect) classes = `${base} ${good}`;
                else if (isSelected && !isCorrect) classes = `${base} ${bad}`;
                else if (!isSelected && isCorrect) classes = `${base} ${good}`;
                else classes = `${base} ${neutral}`;
              }

              return (
                <button
                  key={`${currentQuestion?.id}-${i}`}
                  type="button"
                  onClick={() => {
                    if (selectedAnswer) return;
                    handleAnswer(option);
                  }}
                  disabled={!!selectedAnswer}
                  className={classes}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          <div className="min-h-[0.8rem]">
            {selectedAnswer && (
              <p
                className={`font-medium ${selectedAnswer === currentQuestion?.correctAnswer
                  ? "[color:#16A34A]"
                  : "[color:#DC2626]"
                  }`}
              >
                {selectedAnswer === currentQuestion?.correctAnswer
                  ? "Bonne réponse !"
                  : `Mauvaise réponse… La bonne réponse était : ${currentQuestion?.correctAnswer}`}
              </p>
            )}
          </div>

          {/* Next / End */}
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="justify-self-center w-1/2 [background:#1E40AF] [color:#ffffff] font-semibold py-2 px-6 rounded-lg shadow hover:[filter:brightness(1.05)] active:[transform:scale(0.98)] transition disabled:opacity-60"
          >
            {isLast && selectedAnswer !== null ? "Terminer" : "Suivant"}
          </button>
        </div>
      </div>
    </div>
  );
}