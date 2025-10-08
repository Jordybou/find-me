import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "@/pages/Menu";
import Rapide from "@/pages/Rapide";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Accueil */}
        <Route path="/" element={<Menu />} />

        {/* Mode rapide */}
        <Route path="/rapide" element={<Rapide />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
