import { cn } from "@/lib/utils";

type SectionLoaderProps = {
  label?: string;
  minHeightClass?: string;
  className?: string;
};

const SectionLoader = ({
  label = "Loading",
  minHeightClass = "min-h-[40vh]",
  className,
}: SectionLoaderProps) => (
  <div
    className={cn(
      "flex items-center justify-center bg-neutral-950 px-6 text-white/60",
      minHeightClass,
      className
    )}
  >
    <div className="flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.35em]">
      <span>{label}</span>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
    </div>
  </div>
);

export default SectionLoader;
