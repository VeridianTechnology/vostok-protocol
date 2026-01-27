import { useMemo } from "react";
import { ConnectionScore } from "./useConnectionQuality";

export type SiteMode = {
  mode: "full" | "lite";
  loading: boolean;
};

export const useSiteMode = (connection: ConnectionScore): SiteMode => {
  return useMemo(() => {
    if (connection.loading) {
      return { mode: "lite", loading: true };
    }

    if (connection.score === "slow") {
      return { mode: "lite", loading: false };
    }

    if (connection.score === "fast" || connection.score === "medium") {
      return { mode: "full", loading: false };
    }

    return { mode: "lite", loading: false };
  }, [connection.loading, connection.score]);
};
