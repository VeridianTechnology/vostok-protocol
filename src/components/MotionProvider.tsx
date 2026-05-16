import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

type MotionProviderProps = {
  children: ReactNode;
};

const MotionProvider = ({ children }: MotionProviderProps) => (
  <MotionConfig reducedMotion="user">
    <LazyMotion features={domAnimation}>{children}</LazyMotion>
  </MotionConfig>
);

export default MotionProvider;
