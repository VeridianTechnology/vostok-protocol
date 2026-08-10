import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.tsx";
import DeferredPixels from "./components/DeferredPixels.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <DeferredPixels />
    <Analytics />
  </>
);
