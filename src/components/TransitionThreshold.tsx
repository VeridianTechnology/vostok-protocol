import { m } from "framer-motion";

type TransitionThresholdProps = {
  variant: "crossing" | "chamber" | "fracture";
};

const TransitionThreshold = ({ variant }: TransitionThresholdProps) => {
  const mobileHeightClass = variant === "crossing" ? "h-[28vh]" : "h-[8vh]";

  if (variant === "crossing") {
    return (
      <section className="relative left-1/2 right-1/2 h-[28vh] w-screen -translate-x-1/2 overflow-hidden bg-black md:h-[7.173vw]">
        <img
          src="/section_wallpaper/break/1.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </section>
    );
  }

  if (variant === "chamber") {
    return (
      <section className="relative left-1/2 right-1/2 h-[28vh] w-screen -translate-x-1/2 overflow-hidden bg-black md:h-[7.173vw]">
        <img
          src="/section_wallpaper/break/2.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </section>
    );
  }

  if (variant === "fracture") {
    return (
      <section className="relative left-1/2 right-1/2 h-[28vh] w-screen -translate-x-1/2 overflow-hidden bg-black md:h-[7.173vw]">
        <img
          src="/section_wallpaper/break/3.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </section>
    );
  }

  return (
    <section className={`relative left-1/2 right-1/2 ${mobileHeightClass} w-screen -translate-x-1/2 overflow-hidden bg-[#050608] md:h-[44vh]`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025),transparent_36%),linear-gradient(180deg,rgba(0,0,0,0.96)_0%,rgba(4,5,8,0.98)_100%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.012)_0px,rgba(255,255,255,0.012)_1px,transparent_1px,transparent_3px)]" />
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.18)_18%,rgba(255,255,255,0.18)_82%,transparent_100%)]" />

      {variant === "crossing" ? (
        <div className="absolute inset-0">
          <m.div
            className="absolute left-1/2 top-1/2 h-[74%] w-[5.5rem] -translate-x-1/2 -translate-y-1/2 border border-white/10 bg-[linear-gradient(180deg,rgba(18,20,24,0.82)_0%,rgba(5,6,8,0.96)_100%)]"
            animate={{ y: ["-50%", "-48.5%", "-50%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <m.div
            className="absolute left-1/2 top-1/2 h-[70%] w-[10px] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(180deg,transparent_0%,rgba(245,247,250,0.92)_50%,transparent_100%)] opacity-90"
            animate={{ opacity: [0.7, 0.95, 0.7] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      ) : null}

      {variant === "chamber" ? (
        <div className="absolute inset-0">
          <m.div
            className="absolute left-1/2 top-1/2 h-[13rem] w-[13rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute left-1/2 top-1/2 h-[8.5rem] w-[8.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          <div className="absolute left-1/2 top-1/2 h-[2px] w-[18rem] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.16)_50%,transparent_100%)]" />
        </div>
      ) : null}

      {variant === "fracture" ? (
        <div className="absolute inset-0">
          <m.div
            className="absolute left-[42%] top-1/2 h-[8rem] w-[3.3rem] -translate-y-1/2 rotate-[8deg] border border-white/10 bg-[linear-gradient(180deg,rgba(24,26,30,0.82)_0%,rgba(6,7,9,0.98)_100%)]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: "linear" }}
          />
          <m.div
            className="absolute left-1/2 top-1/2 h-[11rem] w-[4rem] -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] border border-white/10 bg-[linear-gradient(180deg,rgba(26,28,32,0.86)_0%,rgba(6,7,9,0.98)_100%)]"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <m.div
            className="absolute left-[58%] top-1/2 h-[7rem] w-[3rem] -translate-y-1/2 rotate-[11deg] border border-white/10 bg-[linear-gradient(180deg,rgba(22,24,28,0.8)_0%,rgba(5,6,8,0.98)_100%)]"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : null}
    </section>
  );
};

export default TransitionThreshold;
