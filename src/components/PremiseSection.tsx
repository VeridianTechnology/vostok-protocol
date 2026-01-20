import { useEffect, useState } from 'react';

const premiseStatements = [
  'This is the protocol—your exit.',
  'Become the Stacy you were always meant to be.',
  'Genetics decide the ceiling. Discipline decides how close you get.',
  'You train your body. Why wouldn’t you train your face?',
  'People don’t care about the item. They care about the face carrying it.',
  'The gym makes you bigger. The protocol makes you prettier.',
  'Pretty people live in a different reality.',
  'Your face decides how much effort you need to put in.',
  'Life is easier when you’re hot. This is how you get there.',
  'The halo effect isn’t theory. It’s daily life.',
  'The world is shallow. Adapt or cope.',
  'Status starts at the face. Everything else is decoration.',
  'You don’t need game if your face does the work.',
  'The prettier you are, the more people fill in the gaps for you.',
  'Nobody respects effort. They respect results.',
  'Your face determines how forgiving people are.',
  'You’re not ignored because you’re boring. You’re ignored because you’re mid.',
  'This is the difference between chasing and being chosen.',
  'Attraction is automatic when structure is right.',
  'You can’t talk your way past a bad first impression.',
  'The face is the first résumé.',
  'Make the mirror work for you, not against you.',
  'Soft faces live hard lives.',
  'The protocol is the exit from being overlooked.',
  'You don’t rise socially. You’re ranked.',
  'Pretty privilege isn’t fair. It’s real.',
  'The face is the gatekeeper.',
  'You don’t need confidence. You need better geometry.',
  'Your face decides how seriously your words land.',
  'The prettier you are, the less you have to explain.',
  'The world treats beauty like truth.',
  'Become undeniable.',
  'You don’t glow up by accident.',
  'Facial structure is destiny—unless you intervene.',
  'Train until your face carries authority.',
  'Most people decay quietly. You don’t have to.',
  'Stop coping. Start sculpting.',
  'This is not self-love. This is self-control.',
  'You were never ugly. You were undertrained.',
  'The protocol doesn’t lie. The mirror does.',
  'Choose discipline—or accept the rank you’re given.',
];

const fadeDuration = 700;
const minDisplayDuration = 6000;
const maxDisplayDuration = 9000;

const getDisplayDuration = (text: string) => {
  const normalized = Math.min(text.length / 90, 1);
  return Math.round(minDisplayDuration + (maxDisplayDuration - minDisplayDuration) * normalized);
};

const PremiseSection = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const displayDuration = getDisplayDuration(premiseStatements[messageIndex]);
    const visibleDuration = Math.max(displayDuration - fadeDuration, 2000);
    
    let fadeTimeout: ReturnType<typeof setTimeout>;
    const rotateTimeout = setTimeout(() => {
      setIsFading(true);
      fadeTimeout = setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % premiseStatements.length);
        setIsFading(false);
      }, fadeDuration);
    }, visibleDuration);

    return () => {
      clearTimeout(rotateTimeout);
      clearTimeout(fadeTimeout);
    };
  }, [messageIndex]);

  return (
    <section className="py-24 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="divider-neon mb-16" />
        
        <div className="space-y-8 text-center">
          <p
            className={`text-4xl md:text-5xl lg:text-6xl text-vostok-neon font-semibold text-glow transition-opacity duration-700 leading-tight ${
              isFading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {premiseStatements[messageIndex]}
          </p>
        </div>
        
        <div className="divider-neon mt-16" />
      </div>
    </section>
  );
};

export default PremiseSection;
