import { useState, useEffect } from "react";
import { fetchQuestions } from "@/services/questions.service";
import type { NormalizedQuestion } from "@/services/questions.service";
import ReturnMenu from "@/components/ReturnButton";
export default function Rapide() {
  // State
  const [questions, setQuestions] = useState<NormalizedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load questions from API
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const questions = await fetchQuestions({ amount: 10, language: "fr", type: "multiple" });
        if (!alive) return;
        setQuestions(questions);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setScore(0);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Erreur lors du chargement des questions");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const currentQuestion = questions[currentIndex];

  // One answer by question, save a choice and compared with correct answer + Score 
  function handleAnswer(answer: string) {
    if (!currentQuestion || selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correctAnswer) {
      setScore((s) => s + 1);
    }
  }

  // Restart a game with new questions
  async function restart() {
    setLoading(true);
    setError(null);
    try {
      const questions = await fetchQuestions({ amount: 10, language: "fr", type: "multiple" });
      setQuestions(questions);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setScore(0);
    } catch (e: any) {
      setError(e?.message ?? "Erreur lors du chargement des questions");
    } finally {
      setLoading(false);
    }
  }

  // Condition and button for restart a game
  function handleNext() {
    if (!currentQuestion) return;
    if (selectedAnswer === null) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      restart();
    }
  }

  // UI states, early return 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-sky-200">
        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-[550px] mx-auto">
          <header className="flex items-center justify-between mb-4 text-sm text-sky-800">
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
              {/*Background circle*/}
              <path
                fill="#151516ff"
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              />
              {/* Rotating arc*/}
              <path
                fill="#1915faff"
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326Z"
              />
            </svg>
            <p className="mt-3 text-sm text-sky-700 font-medium">Loading…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="bg-white/80 border rounded-xl p-6 shadow">
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={restart}
            className="mt-4 bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-sky-700 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-gray-600">Aucune question disponible.</p>
      </div>
    );
  }

  // logic UI for last question
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-sky-200">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-[550px] mx-auto text-center">
        <header className="flex items-center justify-between mb-4 text-sm text-sky-800">
          <div className="flex flex-col items-start">
            <span>Question {currentIndex + 1} / {questions.length}</span>
            <span className="font-semibold text-sky-700">Score : {score}</span>
          </div>
          <ReturnMenu to="/" label="Menu" />
        </header>
        <h2 className="text-2xl font-bold mb-4 [color:#1E40AF]">
          {currentQuestion.question}
        </h2>
        {/* Encompasses the 3 blocks */}
        <div className="grid gap-10">
          {/* Answer block */}
          <div className="answers">
            {currentQuestion.answers.map((option, i) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const showState = selectedAnswer !== null;

              const base =
                "w-full min-h-[44px] px-4 py-2 rounded-lg border-2 font-medium transition-colors duration-200 select-none";
              const idle =
                "bg-white border-gray-300 text-gray-900 hover:bg-sky-50";
              const good =
                "!bg-green-100 !text-green-900 !border-green-600 shadow-[0_0_0_4px_rgba(34,197,94,1)]";
              const bad =
                "!bg-red-100 !text-red-900 !border-red-600 shadow-[0_0_0_4px_rgba(239,68,68,1)]";
              const neutral =
                "bg-gray-50 text-gray-600 border-gray-300";

              let classes = `${base} ${idle}`;
              if (showState) {
                if (isSelected && isCorrect) classes = `${base} ${good}`;
                else if (isSelected && !isCorrect) classes = `${base} ${bad}`;
                else if (!isSelected && isCorrect) classes = `${base} ${good}`;
                else classes = `${base} ${neutral}`;
              }

              return (
                <button
                  key={`${currentQuestion.id}-${i}`}
                  type="button"
                  onClick={() => {
                    if (selectedAnswer) return;
                    handleAnswer(option);
                  }}
                  className={classes}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback text under the answers */}
          <div className="min-h-[0.8rem]">
            {selectedAnswer && (
              <p
                className={`font-medium ${selectedAnswer === currentQuestion.correctAnswer
                  ? "text-green-700"
                  : "text-red-700"
                  }`}
              >
                {selectedAnswer === currentQuestion.correctAnswer
                  ? "Bonne réponse !"
                  : `Mauvaise réponse… La bonne réponse était : ${currentQuestion.correctAnswer}`}
              </p>
            )}
          </div>

          {/* Button Next/Replay */}
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null && !isLast}
            className="justify-self-center w-1/2 bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-sky-700 transition disabled:opacity-60"
          >
            {isLast && selectedAnswer !== null ? "Rejouer" : "Suivant"}
          </button>
        </div>
      </div>
    </div>
  );
}