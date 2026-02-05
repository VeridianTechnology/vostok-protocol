import { useState } from 'react';

const features = [
  {
    title: 'A Perfect Jaw',
    description:
      'Rebuild your jaw into the main focal point of your face: cleaner lines, sharper angles, and a silhouette that’s genuinely jaw-dropping.',
    image: '/Examples/jaw.jpg',
  },
  {
    title: 'High Set Cheekbones',
    description:
      'Shape the kind of cheekbones makeup can’t fake — built through controlled tension work, massages, and midface reshaping drills.',
    image: '/Examples/cheeks.jpg',
  },
  {
    title: 'Hunter Eyes',
    description:
      'Train the muscles around your eyes for a focused, seductive stare — the aesthetic that makes people freeze, notice, and respond.',
    image: '/Examples/eyes.jpg',
  },
  {
    title: 'An Elegant Neck',
    description:
      'Rebuild your neck foundation with specialized exercises that enhance symmetry, posture, and the overall elegance of your silhouette.',
    image: '/Examples/skull.jpg',
  },
  {
    title: 'Quiet Irresistibility',
    description:
      'Learn discreet techniques that refine micro-features and enhance your entire presence. These are trade secrets you won’t find anywhere else.',
    image: '/Examples/ears.jpg',
  },
  {
    title: 'Restructure Your Nose',
    description:
      'Non-surgical nose refinement — correct asymmetries, tension patterns, and cartilage drift through advanced manual techniques.',
    image: '/Examples/face.jpg',
  },
];

const LearnSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  return (
    <section id="learn" className="section section-tight-mobile">
      <div className="section-inner">
        <div className="section-header">
          <h2 className="text-4xl md:text-5xl font-bold text-vostok-text">
            The Next Evolution of Your Face
          </h2>
        </div>
        
        <div className="card-grid md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const isFlipped = hoveredIndex === index || tappedIndex === index;
            const isDarkCard =
              feature.title === 'Hunter Eyes' || feature.title === 'Restructure Your Nose';
            return (
              <div
                key={feature.title}
                className={`learn-card glass-card-hover rounded-xl animate-fade-in-up ${
                  isFlipped ? 'is-flipped' : ''
                } ${isDarkCard ? 'dark-card' : ''} soft-opacity-card`}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setTappedIndex((prev) => (prev === index ? null : index))}
              >
                <div className="learn-card-inner rounded-xl p-5 md:p-7">
                  <div className="learn-card-front space-y-2 md:space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-vostok-text">
                      {feature.title}
                    </h3>
                    <div className="learn-card-accent" />
                  </div>
                  <div className="learn-card-back">
                    <div className="learn-card-back-content">
                      <div className="learn-card-back-text space-y-0 md:space-y-2">
                        <h3 className="text-sm sm:text-base font-semibold text-vostok-text">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-vostok-muted leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <div className="learn-card-thumb">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          loading="lazy"
                          decoding="async"
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
    </section>
  );
};

export default LearnSection;
