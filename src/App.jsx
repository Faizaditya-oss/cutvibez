import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Beranda from "./pages/Beranda.jsx";
import DetailPaket from "./pages/DetailPaket.jsx";
import Pesanan from "./pages/Pesanan.jsx";
import SerahTerima from "./pages/SerahTerima.jsx";
import EditorDashboard from "./pages/EditorDashboard.jsx";
import EditorPermintaan from "./pages/EditorPermintaan.jsx";
import EditorWorkspace from "./pages/EditorWorkspace.jsx";
import EditorPencairan from "./pages/EditorPencairan.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Beranda />} />
          <Route path="detail-paket" element={<DetailPaket />} />
          <Route path="pesanan" element={<Pesanan />} />
          <Route path="serah-terima" element={<SerahTerima />} />
          <Route path="editor/dashboard" element={<EditorDashboard />} />
          <Route path="editor/permintaan" element={<EditorPermintaan />} />
          <Route path="editor/workspace" element={<EditorWorkspace />} />
          <Route path="editor/pencairan" element={<EditorPencairan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
