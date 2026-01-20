import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What even is this? Is this a fitness guide or a face hack?',
    answer:
      'This is a comprehensive manual on facial exercise and myofunctional therapy. It blends modern fitness science, anatomical research, and clinical facial rehab to build strength and tone in the musculature that shapes your face. It is structured for measurable improvements across ages and ethnicities.',
  },
  {
    question: 'Does this stuff actually work, bro? Or is this just more TikTok cope?',
    answer:
      'It is grounded in anatomy. Muscles adapt to targeted resistance. When you follow these drills, you will feel real muscular fatigue. Initial puffiness signals adaptation. With disciplined sessions, you gain definition, lift, and tone that materially change facial presentation.',
  },
  {
    question: 'Fr tho, how long until I see results? A week? A month? Be honest.',
    answer:
      'Expect to invest 80–100 hours for dramatic change. Start by completing one chapter per focused session. If 10 hours into the fundamentals you feel no new facial awareness or activation, this method might not be aligned with your goals. The returns come from cumulative work.',
  },
  {
    question: 'What if I just don’t like it? Can I get my bread back?',
    answer:
      'All sales are final. The value is in the knowledge and the digital format makes returns impossible to verify. This is for people serious about investing in their appearance. Treat it like acquiring a skill, not buying a disposable product.',
  },
  {
    question: 'How does this voodoo even work? Explain it like I’m 5.',
    answer:
      'You have 40+ muscles in your face. Just like the gym, when you train and load them properly they grow stronger and provide better structural support. That support sharpens contours, improves lift, and refines how light hits your features.',
  },
  {
    question: 'Is this for dudes only, or can girls do it too?',
    answer:
      'Human facial anatomy is universal. Women, men, and anyone experiencing volume loss or laxity benefit from rebuilding muscular support. The routines adapt to different needs but the science is the same.',
  },
  {
    question: 'Do I need to buy a bunch of weird gadgets? Or can I just start?',
    answer:
      'You can start with clean hands, a mirror, a timer, and a light facial oil for glide. Later chapters introduce optional rollers, Gua Sha stones, and fascia release tools, but none are mandatory for progress.',
  },
  {
    question: 'Is this, like, medical advice? Are you a doctor?',
    answer:
      'No. This is educational content. Anyone with dental work, TMJ issues, or skin conditions should consult their dermatologist, dentist, or physician before beginning.',
  },
  {
    question: 'Will this make me look weird or overdone? I don’t wanna look like a PS2 character.',
    answer:
      'The goal is natural refinement by strengthening what you already have. It works with your anatomy to produce a healthier, more defined version of you—no uncanny outcomes.',
  },
  {
    question: 'How much time do I need to commit per day? I’m not trying to make this my personality.',
    answer:
      'Plan for 3–5 hours a week, broken into 30–60 minute sessions. Consistency beats intensity. Treat it like the gym: regular, manageable blocks deliver the best compounding results.',
  },
  {
    question: 'What if I skip a day? Is all my progress cooked?',
    answer:
      'No. Muscle tone fades slowly. Missing a day—or even a week—won’t erase gains. Just resume with proper form and keep a maintenance rhythm once you reach your goal structure.',
  },
  {
    question: 'Can I just do the exercises I like and skip the rest?',
    answer:
      'Not recommended. Your face is an interconnected system. Training one region while neglecting antagonists can create imbalances. Follow the sequence for balanced, harmonious changes.',
  },
  {
    question: 'My face hurts after one exercise. Did I break it?',
    answer:
      'A burn or mild soreness is normal. Sharp pain or joint discomfort is not. If you feel that, stop, assess your form, reduce intensity, and consult a professional if pain persists.',
  },
  {
    question: 'What’s the most important exercise I shouldn’t skip?',
    answer:
      'Focus on the midface—zygomatic and masseter complexes. They lift the center of the face and define the jawline. Neglecting them limits total transformation.',
  },
  {
    question: 'Do I need to be in a gym or can I do this in my room?',
    answer:
      'Your room is perfect. You’ll need privacy, a mirror, and focus. These movements look intense; you’ll want a controlled environment to concentrate.',
  },
  {
    question: 'Is there a best time of day to do this? Morning vs. night?',
    answer:
      'Choose any time you can be consistent and undisturbed. Morning energizes, evening decompresses. Habit > clock.',
  },
  {
    question: 'Do I need to take “before” pics? Lowkey don’t wanna.',
    answer:
      'Do it anyway. Change is gradual, and your brain adapts. Standardized photos in consistent lighting are your objective proof and motivation.',
  },
  {
    question: 'Do I need to change my diet for this to work?',
    answer:
      'While the guide focuses on training, low inflammation, adequate protein, and hydration will dramatically improve recovery, skin quality, and overall results.',
  },
  {
    question: 'Can I still get cosmetic surgery after doing this?',
    answer:
      'Yes. Surgeons often prefer patients with strong muscular support. It improves healing and may allow for more conservative procedures. Always disclose your routine to your surgeon.',
  },
  {
    question: 'What’s your source for all this? Did you just make it up?',
    answer:
      'It’s a synthesis of myofunctional therapy, clinical rehab, community experimentation, and years of personal testing. Everything included has been vetted for safety and repeatability.',
  },
  {
    question: 'Why should I listen to you? What’s your background?',
    answer:
      'I’ve spent years cross-referencing anatomical science with real-world outcomes, running protocols on myself and others, refining what consistently works. This book is that distilled knowledge.',
  },
  {
    question: 'Is there a secret or a hack to make it work faster?',
    answer:
      'No hacks. The closest thing is supporting habits: elite oral hygiene, low inflammatory lifestyle, no smoking, quality sleep, and tight sugar control. They amplify your training.',
  },
  {
    question: 'What’s the biggest mistake people make?',
    answer:
      'Thinking the face is fixed. It isn’t. Once you accept it’s plastic and trainable, you’ll put in the intensity required for noticeable change.',
  },
  {
    question: 'My jaw clicks when I do this. Is that a W or an L?',
    answer:
      'It’s an L. Clicking signals TMJ stress. Stop, reset form, relax the jaw, and consult a professional if it persists before continuing jaw-centric drills.',
  },
  {
    question: 'What if I’m already decent-looking? Will this still do anything?',
    answer:
      'Yes. This is about optimization. It takes you from decent to undeniable by upgrading symmetry, projection, and overall presence.',
  },
  {
    question: 'Can I listen to music or watch a show while I do this?',
    answer:
      'You can have background audio, but your attention must stay on form and muscle engagement. Distraction kills effectiveness.',
  },
  {
    question: 'What’s the most slept-on exercise in the whole guide?',
    answer:
      'Forehead and scalp drills. Strengthening frontalis and antagonists improves skin tension and lifts the brow. It won’t make your forehead bigger—it smooths it.',
  },
  {
    question: 'Is this just for your face, or does it help your body too?',
    answer:
      'It’s face, head, and neck specific. Improved posture and breathing are side benefits, but this is not a general body program.',
  },
  {
    question: 'Will my face snap back to normal if I stop?',
    answer:
      'No. Like any trained muscle, tone fades slowly. Maintain with lighter sessions once you reach your target look.',
  },
  {
    question: 'Okay, but is this all just massive cope? Give it to me straight.',
    answer:
      'The results are tangible: stronger social reception, improved confidence, and better romantic outcomes. Genetics sets the baseline; this maximizes what you have.',
  },
];

const getRandomSubset = (size: number, exclude: number[] = []) => {
  const availableIndices = faqs
    .map((_, index) => index)
    .filter((index) => !exclude.includes(index));
  const subset: number[] = [];
  const pool = [...availableIndices];

  while (subset.length < size && pool.length > 0) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    subset.push(pool.splice(randomIndex, 1)[0]);
  }

  return subset;
};

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visibleIndices, setVisibleIndices] = useState<number[]>(() => {
    return getRandomSubset(4);
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let fadeTimeout: ReturnType<typeof setTimeout> | undefined;
    let cycleTimeout: ReturnType<typeof setTimeout> | undefined;

    if (openIndex === null) {
      cycleTimeout = setTimeout(() => {
        setIsTransitioning(true);
        fadeTimeout = setTimeout(() => {
          const newSubset = getRandomSubset(4);
          if (newSubset.length === 4) {
            setVisibleIndices(newSubset);
            setOpenIndex(null);
          }
          setIsTransitioning(false);
        }, 500);
      }, 20000);
    }

    return () => {
      if (cycleTimeout) clearTimeout(cycleTimeout);
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, [visibleIndices, openIndex]);

  return (
    <section className="py-24 px-4 md:px-8">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16 space-y-4">
          <p className="font-mono text-sm text-vostok-neon tracking-widest uppercase">
            [ COMMON QUERIES ]
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-vostok-text">
            FAQ
          </h2>
        </div>
        
        <div className={`space-y-4 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {visibleIndices.map((faqIndex) => (
            <div
              key={faqIndex}
              className="glass-card rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === faqIndex ? null : faqIndex)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-vostok-deep/30 transition-colors"
              >
                <span className="text-lg font-semibold text-vostok-text pr-4">
                  {faqs[faqIndex].question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-vostok-neon flex-shrink-0 transition-transform duration-300 ${
                    openIndex === faqIndex ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                openIndex === faqIndex ? 'max-h-[800px]' : 'max-h-0'
              }`}>
                <p className="px-6 pb-6 text-vostok-muted leading-relaxed">
                  {faqs[faqIndex].answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
