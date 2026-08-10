import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatbaseWidget from "@/components/ChatbaseWidget";
import Landing from "./pages/Landing";

const Radio = lazy(() => import("./pages/radio/Radio"));
const Agora = lazy(() => import("./pages/agora/Agora"));

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
        <Route path="/agora" element={<Agora />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </Suspense>
    <ChatbaseWidget />
  </BrowserRouter>
);

export default App;
