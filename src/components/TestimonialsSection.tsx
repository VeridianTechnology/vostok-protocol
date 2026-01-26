import { useEffect, useMemo, useState } from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "This made me realize I wasn’t unlucky. I was untrained.",
    name: "H.J.",
    tag: "7 months",
  },
  {
    quote: "The protocol made the whole process feel logical instead of overwhelming.",
    name: "R.P.",
    tag: "3 months",
  },
  {
    quote: "The jaw work alone was worth it. Everything else amplified the result.",
    name: "C.D.",
    tag: "Day 75",
  },
  {
    quote: "My resting face used to betray me. Now it finally matches who I am.",
    name: "B.N.",
    tag: "5 months",
  },
  {
    quote: "The biggest change wasn’t aesthetic—it was how grounded I felt.",
    name: "J.F.",
    tag: "Day 120",
  },
  {
    quote: "I wish I started earlier. The compound effect is insane.",
    name: "M.H.",
    tag: "8 months",
  },
  {
    quote: "People assume I got more sleep. I didn’t. I just fixed my structure.",
    name: "S.E.",
    tag: "Day 60",
  },
  {
    quote: "The exercises look simple on paper. They are not. They’re precise.",
    name: "D.K.",
    tag: "2 months",
  },
  {
    quote: "My before-and-after looks unreal, but I earned every millimeter.",
    name: "A.R.",
    tag: "9 months",
  },
  {
    quote: "I stopped feeling invisible. That alone made it worth it.",
    name: "P.N.",
    tag: "Day 45",
  },
  {
    quote: "It’s subtle. But once it clicks, everything starts improving at once.",
    name: "G.M.",
    tag: "6 months",
  },
  {
    quote: "My friends thought I was just ‘more confident.’ They had no idea.",
    name: "Z.O.",
    tag: "Day 100",
  },
  {
    quote: "The neck module changed my whole silhouette. Didn’t expect that.",
    name: "E.J.",
    tag: "3 months",
  },
  {
    quote: "This made aging feel optional. Not inevitable.",
    name: "C.K.",
    tag: "10 months",
  },
  {
    quote: "I used to think my face was fixed. Turns out my habits weren’t.",
    name: "Y.S.",
    tag: "Day 70",
  },
  {
    quote: "My eyes stopped looking tired. That alone changed how people treated me.",
    name: "V.L.",
    tag: "4 months",
  },
  {
    quote: "There’s no fluff. Everything serves a purpose. Everything compounds.",
    name: "K.T.",
    tag: "Day 95",
  },
  {
    quote: "It gave me structure. It gave me control. That changed everything.",
    name: "W.C.",
    tag: "11 months",
  },
];

const TestimonialsSection = () => {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStartIndex((prev) => (prev + 3) % testimonials.length);
    }, 20000);

    return () => window.clearInterval(interval);
  }, []);

  const displayedTestimonials = useMemo(() => {
    return Array.from({ length: 3 }, (_, index) => testimonials[(startIndex + index) % testimonials.length]);
  }, [startIndex]);

  return (
    <section className="hidden py-10 md:py-14 px-4 md:px-8" aria-hidden="true">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <p className="font-mono text-sm text-vostok-neon tracking-widest uppercase">
            [ FIELD REPORTS ]
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-vostok-text">
            From the Protocol
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {displayedTestimonials.map((testimonial, index) => (
            <div
              key={`${startIndex}-${testimonial.name}`}
              className="glass-card rounded-xl p-8 space-y-6 animate-fade-in-up testimonial-card"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Quote className="w-10 h-10 text-vostok-neon/40" />
              
              <p className="text-lg text-vostok-text leading-relaxed testimonial-quote">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-vostok-neon/20">
                <span className="font-semibold text-vostok-text">
                  {testimonial.name}
                </span>
                <span className="font-mono text-sm text-vostok-muted">
                  {testimonial.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
