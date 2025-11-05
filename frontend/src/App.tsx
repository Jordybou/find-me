import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import SimpleMode from "@/pages/SimpleMode";
import Menu from "@/pages/Menu";
import Rapide from "@/pages/Rapide";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout path : AppLayout set the background image */}
        <Route element={<AppLayout />}>
          {/* Accueil */}
          <Route path="/" element={<Menu />} />

          {/* Rapide Mode */}
          <Route path="/rapide" element={<Rapide />} />

          {/* Simple Mode */}
          <Route path="/simple" element={<SimpleMode />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
