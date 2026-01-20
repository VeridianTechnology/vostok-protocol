import { ReactNode } from 'react';

const matrixStreams = [
  { left: '8%', delay: '0s', duration: '26s', text: '1010VOSTOK0101' },
  { left: '24%', delay: '6s', duration: '28s', text: 'PROTOCOLACTIVE' },
  { left: '48%', delay: '3s', duration: '24s', text: 'FORMPRESENCE' },
  { left: '72%', delay: '10s', duration: '30s', text: 'STRUCTURE001' },
  { left: '88%', delay: '14s', duration: '26s', text: 'JAWNECKTONE' },
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
        <div className="absolute top-[10%] left-[5%] w-48 h-32 hud-box rotate-12 animate-float opacity-30" />
        <div className="absolute top-[30%] right-[8%] w-64 h-20 hud-box -rotate-6 animate-float-slow opacity-20" />
        <div className="absolute top-[60%] left-[15%] w-40 h-40 hud-box rotate-3 animate-float opacity-25" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[75%] right-[20%] w-56 h-24 hud-box -rotate-12 animate-float-slow opacity-20" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[45%] left-[60%] w-32 h-48 hud-box rotate-6 animate-float opacity-15" style={{ animationDelay: '1s' }} />
        
        {/* Small accent boxes */}
        <div className="absolute top-[20%] left-[40%] w-16 h-16 hud-box rotate-45 animate-pulse-glow" />
        <div className="absolute top-[80%] left-[70%] w-20 h-12 hud-box -rotate-12 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        
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
