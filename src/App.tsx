import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import FaceStudy from "./pages/FaceStudy";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<FaceStudy />} />
      <Route path="/radio" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
