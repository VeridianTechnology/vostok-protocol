import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ChatbaseWidget from "@/components/ChatbaseWidget";
import Landing from "./pages/Landing";

const Radio = lazy(() => import("./pages/radio/Radio"));
const Polaris = lazy(() => import("./pages/agora/Agora"));

const RouteFallback = () => (
  <div className="route-loader" role="status" aria-live="polite">
    Loading Vostok…
  </div>
);

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/radio" element={<Radio />} />
        <Route path="/polaris" element={<Polaris />} />
        <Route path="/agora" element={<Navigate to="/polaris" replace />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </Suspense>
    <ChatbaseWidget />
  </BrowserRouter>
);

export default App;
