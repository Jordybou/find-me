import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-sky-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center border border-white/60"> {/* changer border pour le cadre */}
        {/* Logo / Titre */}
        <h1 className="text-5xl font-extrabold tracking-tight text-sky-800 drop-shadow-sm">
          <span className="text-blue-600">Find</span> Me
        </h1>
        <p className="mt-3 text-sky-700/90">
          Teste tes connaissances et deviens le meilleur !
        </p>

        {/* Boutons */}
        <div className="mt-8 grid gap-4">
          <Link
            to="/rapide"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-3 font-semibold shadow hover:bg-blue-700 active:scale-[.98] transition"
          >
            🎯 Partie Rapide
          </Link>

          <Link
            to="/histoire"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white py-3 font-semibold shadow hover:bg-emerald-700 active:scale-[.98] transition"
          >
            🌍 Mode Histoire
          </Link>

          <Link
            to="/equipe"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-white py-3 font-semibold shadow hover:bg-amber-600 active:scale-[.98] transition"
          >
            🤝 Mode Équipe
          </Link>

          <Link
            to="/options"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 text-white py-3 font-semibold shadow hover:bg-slate-900 active:scale-[.98] transition"
          >
            ⚙️ Options
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-sky-800/70">
          © 2025 Find Me — Tous droits réservés
        </p>
      </div>
    </div>
  );
};

export default Menu;