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
          <h1 className="m-0 text-5xl font-extrabold tracking-tight [color:#0B1221]">
            <span className="[color:#f7f8fa]">Find Me</span>
          </h1>

          <p className="m-0 text-lg [color:#f7f8fa]">
            Teste tes connaissances et deviens le meilleur !
          </p>

          <div className="mt-8 grid gap-4">
            {/* Simple Mode */}
            <Link to="/simple" className="block no-underline">
              <div className="btn-card border [border-color:#1E40AF] [color:#1E40AF] font-semibold py-3 shadow transition-all duration-200 hover:[background:#F0F9FF] hover:shadow-md hover:scale-[1.02]">
                Mode Simple
              </div>
            </Link>

            {/* Partie Rapide */}
            <Link to="/rapide" className="block no-underline">
              <div className="btn-card border [border-color:#1E40AF] [color:#f5072b] font-semibold py-3 shadow transition-all duration-200 hover:[background:#F0F9FF] hover:shadow-md hover:scale-[1.02]">
                Partie Rapide
              </div>
            </Link>

            {/* Mode Histoire (V.2) */}
            <Link to="/histoire" className="block no-underline pointer-events-none">
              <div className="btn-card border [border-color:#10B981] [color:#047857] font-semibold py-3 opacity-60 cursor-not-allowed">
                Mode Histoire (V.2)
              </div>
            </Link>

            {/* Mode Équipe */}
            <Link to="/equipe" className="block no-underline">
              <div className="btn-card border [border-color:#F59E0B] [color:#D97706] font-semibold py-3 shadow transition-all duration-200 hover:[background:#FFF7ED] hover:shadow-md hover:scale-[1.02]">
                Mode Équipe
              </div>
            </Link>

            {/* Options */}
            <Link to="/options" className="block no-underline">
              <div className="btn-card border [border-color:#374151] [color:#1F2937] font-semibold py-3 shadow transition-all duration-200 hover:[background:#F8FAFC] hover:shadow-md hover:scale-[1.02]">
                Options
              </div>
            </Link>
          </div>

          <p className="mt-8 mb-0 text-xs [color:#030303]">Version - 1.0</p>
        </div>
      </div>
    </div>
  );
}