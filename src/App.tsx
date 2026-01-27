import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { track } from "@vercel/analytics";
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

const AnalyticsEvents = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/lite") {
      return;
    }

    const threshold = 50;
    let firedScrollDepth = false;
    let ticking = false;
    let rafId: number | null = null;

    const onScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      rafId = window.requestAnimationFrame(() => {
        ticking = false;
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop;
        const scrollHeight = doc.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) {
          return;
        }
        const percent = Math.round((scrollTop / scrollHeight) * 100);
        if (percent >= threshold && !firedScrollDepth) {
          firedScrollDepth = true;
          track("scroll_depth", { percent: threshold });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let engagedTimer: number | null = null;
    let visibleStartedAt: number | null = null;
    let accumulatedMs = 0;
    let engagedFired = false;

    const fireEngaged = () => {
      if (engagedFired) {
        return;
      }
      engagedFired = true;
      track("engaged_30s", { page: window.location.pathname });
    };

    const scheduleEngaged = () => {
      if (engagedFired) {
        return;
      }
      const remaining = 30000 - accumulatedMs;
      if (remaining <= 0) {
        fireEngaged();
        return;
      }
      if (engagedTimer !== null) {
        window.clearTimeout(engagedTimer);
      }
      engagedTimer = window.setTimeout(fireEngaged, remaining);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        visibleStartedAt = performance.now();
        scheduleEngaged();
        return;
      }

      if (visibleStartedAt !== null) {
        accumulatedMs += performance.now() - visibleStartedAt;
        visibleStartedAt = null;
      }
      if (engagedTimer !== null) {
        window.clearTimeout(engagedTimer);
        engagedTimer = null;
      }
    };

    if (document.visibilityState === "visible") {
      visibleStartedAt = performance.now();
      scheduleEngaged();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (engagedTimer !== null) {
        window.clearTimeout(engagedTimer);
      }
    };
  }, [location.pathname]);

  return null;
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
      <AnalyticsEvents />
      <ThirdPartyScripts />
      <AnalyticsGate />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
