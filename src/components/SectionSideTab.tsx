type SectionSideTabProps = {
  label: string;
  className?: string;
  labelClassName?: string;
};

const SectionSideTab = ({ label, className = "", labelClassName = "" }: SectionSideTabProps) => {
  return (
    <div
      className={`pointer-events-none absolute left-0 top-0 z-20 ${className}`}
      aria-hidden="true"
    >
      <span className={`inline-block px-5 py-2 text-[20px] font-medium uppercase tracking-[0.28em] text-white md:px-6 md:text-[22px] ${labelClassName}`}>
        {label}
      </span>
    </div>
  );
};

export default SectionSideTab;
