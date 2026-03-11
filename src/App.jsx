import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import CursosPage from "@/pages/CursosPage";
import UsuariosPage from "@/pages/UsuariosPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cursos" element={<CursosPage />} />
          <Route path="/alumnos" element={<UsuariosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
