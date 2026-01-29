import { useEffect, useRef, useState } from "react";

type LazySectionProps = {
  children: React.ReactNode;
  rootMargin?: string;
  minHeight?: number;
};

const LazySection = ({ children, rootMargin = "200px", minHeight = 1 }: LazySectionProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || isVisible) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={ref} style={{ minHeight }}>
      {isVisible ? children : null}
    </div>
  );
};

export default LazySection;
