import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

type MotionProviderProps = {
  children: ReactNode;
};

const MotionProvider = ({ children }: MotionProviderProps) => (
  <LazyMotion features={domAnimation}>{children}</LazyMotion>
);

export default MotionProvider;
