type SectionSideTabProps = {
  label: string;
  className?: string;
};

const SectionSideTab = ({ label, className = "" }: SectionSideTabProps) => {
  return (
    <div
      className={`pointer-events-none absolute left-0 top-0 z-20 ${className}`}
      aria-hidden="true"
    >
      <span className="inline-block bg-black px-5 py-2 text-[20px] font-medium uppercase tracking-[0.28em] text-white md:px-6 md:text-[22px]">
        {label}
      </span>
    </div>
  );
};

export default SectionSideTab;
