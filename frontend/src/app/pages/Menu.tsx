import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div className="mx-auto max-w-md sm:max-w-lg">
      {/* Carte */}
      <div className="bg-white rounded-[16px] shadow-[0_20px_40px_rgba(0,0,0,0.35)] text-center isolate">
        {/* Wrapper interne = padding garanti */}
        <div
          id="pad"
          className="p-[42px] rounded-[12px] bg-white transition-shadow duration-300"
        >
          <h1 className="m-0 text-5xl font-extrabold tracking-tight text-sky-700">
            <span className="text-blue-600">Find</span> Me
          </h1>

          <p className="m-0 text-slate-600 text-lg">
            Teste tes connaissances et deviens le meilleur !
          </p>

          <div className="mt-8 grid gap-4">
            {/* Simple Mode */}
            <Link to="/simple" className="block no-underline">
              <div className="btn-card border border-sky-600 text-sky-700 font-semibold py-3 shadow transition-all duration-200 hover:bg-sky-50 hover:shadow-md hover:scale-[1.02]">
                Mode Simple
              </div>
            </Link>

            {/* Partie Rapide */}
            <Link to="/rapide" className="block no-underline">
              <div className="btn-card border border-sky-600 text-sky-700 font-semibold py-3 shadow transition-all duration-200 hover:bg-sky-50 hover:shadow-md hover:scale-[1.02]">
                Partie Rapide
              </div>
            </Link>

            {/* Mode Histoire (V.2) */}
            <Link to="/histoire" className="block no-underline pointer-events-none">
              <div className="btn-card border border-emerald-600 text-emerald-700 font-semibold py-3 opacity-60 cursor-not-allowed">
                Mode Histoire (V.2)
              </div>
            </Link>

            {/* Mode Équipe */}
            <Link to="/equipe" className="block no-underline">
              <div className="btn-card border border-amber-500 text-amber-600 font-semibold py-3 shadow transition-all duration-200 hover:bg-amber-50 hover:shadow-md hover:scale-[1.02]">
                Mode Équipe
              </div>
            </Link>

            {/* Options */}
            <Link to="/options" className="block no-underline">
              <div className="btn-card border border-slate-700 text-slate-800 font-semibold py-3 shadow transition-all duration-200 hover:bg-slate-50 hover:shadow-md hover:scale-[1.02]">
                Options
              </div>
            </Link>
          </div>

          <p className="mt-8 mb-0 text-xs text-slate-500">Version - 1.0</p>
        </div>
      </div>
    </div>
  );
}