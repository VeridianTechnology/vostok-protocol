import { Check } from 'lucide-react';

const items = [
  '276-page comprehensive PDF',
  'Structured daily routines',
  'Progress tracking guidance',
  'Free community access (Discord)',
  'Lifetime download access',
  'Future updates included',
];

const IncludedSection = () => {
  return (
    <section className="py-24 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12 space-y-4">
            <p className="font-mono text-sm text-vostok-neon tracking-widest uppercase">
              [ PACKAGE CONTENTS ]
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-vostok-text">
              What's Included
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item, index) => (
              <div 
                key={item}
                className="flex items-center gap-4 p-4 rounded-lg bg-vostok-deep/50 border border-vostok-neon/10 hover:border-vostok-neon/30 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-8 h-8 rounded-full bg-vostok-mid flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-vostok-neon" />
                </div>
                <span className="text-vostok-text text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IncludedSection;
