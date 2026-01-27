import { ReactNode } from 'react';

const matrixStreams = [
  { left: '12%', delay: '0s', duration: '26s', text: '1010VOSTOK0101' },
  { left: '48%', delay: '4s', duration: '28s', text: 'FORMPRESENCE' },
  { left: '82%', delay: '9s', duration: '30s', text: 'STRUCTURE001' },
];

interface HudBackgroundProps {
  children: ReactNode;
}

const HudBackground = ({ children }: HudBackgroundProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden scanlines">
      {/* Base gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-vostok-bg via-vostok-deep to-vostok-bg" />
      
      {/* Floating HUD rectangles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large floating boxes */}
        <div className="absolute top-[12%] left-[6%] w-48 h-32 hud-box rotate-12 animate-float opacity-30" />
        <div className="absolute top-[38%] right-[10%] w-64 h-20 hud-box -rotate-6 animate-float-slow opacity-20" />
        <div className="absolute top-[60%] left-[18%] w-40 h-40 hud-box rotate-3 animate-float opacity-25" style={{ animationDelay: '2s' }} />
        
        {/* Small accent boxes */}
        <div className="absolute top-[20%] left-[40%] w-16 h-16 hud-box rotate-45 animate-pulse-glow" />
        
        {/* Code strings / data streams */}
        <div className="absolute top-[15%] right-[30%] font-mono text-xs text-vostok-neon/10 rotate-90 whitespace-nowrap">
          0x7EF381::VOSTOK_PROTOCOL_v2.4
        </div>
        <div className="absolute top-[50%] left-[3%] font-mono text-xs text-vostok-neon/10 -rotate-90 whitespace-nowrap">
          STRUCT::BASELINE_RESET//ACTIVE
        </div>
        <div className="absolute bottom-[20%] right-[5%] font-mono text-xs text-vostok-neon/10 rotate-12 whitespace-nowrap">
          MODULE_06::MAINTENANCE_LOOP
        </div>

        {/* Matrix-style floating streams */}
        {matrixStreams.map((stream, index) => (
          <div
            key={`matrix-stream-${index}`}
            className="matrix-stream"
            style={{
              left: stream.left,
              animationDelay: stream.delay,
              animationDuration: stream.duration,
            }}
          >
            {stream.text}
          </div>
        ))}
      </div>
      
      {/* Gradient overlay for depth */}
      <div className="fixed inset-0 bg-gradient-to-t from-vostok-bg/50 via-transparent to-vostok-bg/30 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default HudBackground;
