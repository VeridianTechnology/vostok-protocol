import { useState } from 'react';

const features = [
  {
    title: 'Jaw & Neck Foundation',
    description: 'Strengthen the structural base that defines your entire facial silhouette.',
    image: '/Examples/jaw.png',
  },
  {
    title: 'Cheeks & Midface Tone',
    description: 'Refine volume, lift, and symmetry across the central face.',
    image: '/Examples/cheeks.png',
  },
  {
    title: 'Eyes & Expression',
    description: 'Train the orbital muscles that shape intensity and presence.',
    image: '/Examples/eyes.png',
  },
  {
    title: 'Skin & Lifestyle',
    description: 'Daily systems that keep definition visible and consistent.',
    image: '/Examples/skull.png',
  },
  {
    title: 'De-Puffing & Habits',
    description: 'Rebalance fullness and structure for a more defined profile.',
    image: '/Examples/ears.png',
  },
  {
    title: 'Consistency Framework',
    description: 'Structure your sessions for compounding, predictable progress.',
    image: '/Examples/face.png',
  },
];

const LearnSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  return (
    <section id="learn" className="py-10 md:py-14 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10 space-y-2">
          <p className="font-mono text-sm text-vostok-neon tracking-widest uppercase">
            [ PROTOCOL MODULES ]
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-vostok-text">
            What You'll Learn
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const isFlipped = hoveredIndex === index || tappedIndex === index;
            return (
              <div
                key={feature.title}
                className={`learn-card glass-card-hover rounded-xl animate-fade-in-up ${
                  isFlipped ? 'is-flipped' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setTappedIndex((prev) => (prev === index ? null : index))}
              >
                <div className="learn-card-inner rounded-xl p-7">
                  <div className="learn-card-front space-y-3">
                    <h3 className="text-xl font-semibold text-vostok-text">
                      {feature.title}
                    </h3>
                    <div className="learn-card-accent" />
                    <p className="text-vostok-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="learn-card-back">
                    <div className="learn-card-back-content">
                      <div className="learn-card-back-text">
                        <h3 className="text-xl font-semibold text-vostok-neon">
                          {feature.title}
                        </h3>
                        <p className="text-vostok-muted leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <div className="learn-card-thumb">
                        <img src={feature.image} alt={feature.title} loading="lazy" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LearnSection;
