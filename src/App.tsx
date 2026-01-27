import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Lite from "./pages/Lite";
import NotFound from "./pages/NotFound";

const AppRoutes = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const liteParam = params.get("lite") === "1";
  const isLiteRoute = location.pathname === "/lite";

  if (liteParam && !isLiteRoute) {
    return <Navigate to="/lite" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/lite" element={<Lite />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AnalyticsGate = () => {
  const location = useLocation();
  if (location.pathname === "/lite") {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
};

const ThirdPartyScripts = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/lite") {
      return;
    }

    if (document.getElementById("gtag-js")) {
      return;
    }

    let cancelled = false;
    let idleId: number | null = null;

    const loadGtag = () => {
      if (cancelled || document.getElementById("gtag-js")) {
        return;
      }

      const script = document.createElement("script");
      script.id = "gtag-js";
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=AW-17890818079";
      document.head.appendChild(script);

      const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
      w.dataLayer = w.dataLayer || [];
      const gtag = (...args: unknown[]) => {
        w.dataLayer?.push(args);
      };
      w.gtag = gtag;
      gtag("js", new Date());
      gtag("config", "AW-17890818079");
    };

    const onFirstInteraction = () => {
      cleanup();
      loadGtag();
    };

    const cleanup = () => {
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
      if (idleId !== null && "cancelIdleCallback" in window) {
        (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idleId);
      }
    };

    window.addEventListener("scroll", onFirstInteraction, { once: true, passive: true });
    window.addEventListener("click", onFirstInteraction, { once: true });

    if ("requestIdleCallback" in window) {
      idleId = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number })
        .requestIdleCallback?.(loadGtag, { timeout: 3000 }) ?? null;
    } else {
      window.setTimeout(loadGtag, 3000);
    }

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [location.pathname]);

  return null;
};

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <AppRoutes />
      <ThirdPartyScripts />
      <AnalyticsGate />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
