import { useState } from 'react';

const modules = [
  { number: '01', title: 'Anti Tech Neck', backTitle: 'Neck', image: '/Mini_Sections/01.png' },
  { number: '02', title: 'The Jaw', backTitle: 'Jaw', image: '/Mini_Sections/02.png' },
  { number: '03', title: 'The Lips', backTitle: 'Lips', image: '/Mini_Sections/03.png' },
  { number: '04', title: 'The Eyes', backTitle: 'Eyes', image: '/Mini_Sections/04.png' },
  { number: '05', title: 'The Cheeks', backTitle: 'Cheeks', image: '/Mini_Sections/05.png' },
  { number: '06', title: 'Forehead', backTitle: 'Scalp', image: '/Mini_Sections/06.png' },
  { number: '07', title: 'Nose Modification', backTitle: 'Nose', image: '/Mini_Sections/07.png' },
  { number: '08', title: 'The Tongue', backTitle: 'Tongue', image: '/Mini_Sections/08.png' },
  { number: '09', title: 'The Ears', backTitle: 'Ears', image: '/Mini_Sections/09.png' },
  { number: '10', title: 'The Neck', backTitle: 'Neck', image: '/Mini_Sections/10.png' },
  { number: '11', title: 'Maintence', backTitle: 'Life', image: '/Mini_Sections/11.png' },
];

const ModulesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 md:px-8 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <p className="font-mono text-sm text-vostok-neon tracking-widest uppercase">
            [ CHAPTER OVERVIEW ]
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-vostok-text">
            Protocol Structure
          </h2>
        </div>
        
        {/* Horizontal scrolling modules */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-vostok-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-vostok-bg to-transparent z-10 pointer-events-none" />
          
          <div className="flex gap-6 overflow-x-auto pb-4 modules-scroll snap-x snap-mandatory px-4">
            {modules.map((module, index) => {
              const isFlipped = hoveredIndex === index || tappedIndex === index;
              return (
              <div
                key={module.number}
                className={`flex-shrink-0 w-56 module-card snap-start animate-fade-in-up ${
                  isFlipped ? 'is-flipped' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setTappedIndex((prev) => (prev === index ? null : index))}
              >
                <div className="module-card-inner glass-card-hover rounded-xl p-4">
                  <div className="module-card-front pb-1">
                    <div className="font-mono text-sm text-vostok-neon mb-2">
                      MODULE {module.number}
                    </div>
                    <h3 className="text-xl font-semibold text-vostok-text">
                      {module.title}
                    </h3>
                    <div className="mt-4 h-1 bg-vostok-deep rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-vostok-neon to-vostok-mid"
                        style={{ width: `${((index + 1) / modules.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="module-card-back">
                    <div className="flex items-center justify-between gap-4 w-full">
                      <span className="text-xl font-semibold text-vostok-neon pl-4">
                        {module.backTitle}
                      </span>
                      <div className="pr-3">
                        <img
                          src={module.image}
                          alt={module.backTitle}
                          className="w-[110px] h-[110px] rounded-md border border-vostok-neon/25 object-cover block"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
