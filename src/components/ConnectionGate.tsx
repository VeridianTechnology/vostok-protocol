import { ReactElement } from "react";
import { useConnectionQuality } from "@/lib/useConnectionQuality";
import { useSiteMode } from "@/lib/useSiteMode";

type ConnectionGateProps = {
  full: ReactElement;
  lite: ReactElement;
};

const ConnectionGate = ({ full, lite }: ConnectionGateProps) => {
  const connection = useConnectionQuality();
  const { mode, loading } = useSiteMode(connection);

  if (loading) {
    return null;
  }

  return mode === "full" ? full : lite;
};

export default ConnectionGate;
