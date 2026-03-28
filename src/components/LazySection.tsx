import { cn } from "@/lib/utils";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import SectionLoader from "@/components/SectionLoader";

type LazySectionProps = {
  id: string;
  minHeightClass?: string;
  loaderLabel?: string;
  eager?: boolean;
  children: ReactNode;
};

export const LazySection = ({
  id,
  minHeightClass,
  loaderLabel,
  eager = false,
  children,
}: LazySectionProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(eager);

  useEffect(() => {
    if (!ref.current || active) {
      return;
    }
    const rootMargin = window.matchMedia("(max-width: 767px)").matches
      ? "120px 0px"
      : "320px 0px";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold: 0.01 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [active]);

  return (
    <section id={id} ref={ref} className={cn(minHeightClass)}>
      {active ? (
        <Suspense
          fallback={<SectionLoader label={loaderLabel} minHeightClass={minHeightClass} />}
        >
          {children}
        </Suspense>
      ) : (
        <SectionLoader label={loaderLabel} minHeightClass={minHeightClass} />
      )}
    </section>
  );
};
