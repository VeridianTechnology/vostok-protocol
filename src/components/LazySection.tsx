import { cn } from "@/lib/utils";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

type LazySectionProps = {
  id: string;
  minHeightClass?: string;
  children: ReactNode;
};

export const LazySection = ({ id, minHeightClass, children }: LazySectionProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!ref.current || active) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px 0px", threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [active]);

  return (
    <section id={id} ref={ref} className={cn(minHeightClass)}>
      {active ? <Suspense fallback={null}>{children}</Suspense> : null}
    </section>
  );
};
