import { useEffect } from 'react';
import { createPortal } from 'react-dom';

type AccessProtocolModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AccessProtocolModal = ({ isOpen, onClose }: AccessProtocolModalProps) => {
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-3 sm:px-6">
      <div className="absolute inset-0 bg-black/85" onClick={onClose} aria-hidden="true" />
      <div className="relative w-[98vw] h-[92vh] sm:w-[95vw] sm:h-[90vh] max-w-[96vw] bg-vostok-bg border border-vostok-neon/30 shadow-2xl rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute z-20 w-12 h-12 rounded-full border-2 border-vostok-neon text-vostok-neon text-3xl hover:bg-vostok-neon/20 transition bg-vostok-bg shadow-lg flex items-center justify-center"
          style={{ top: '2.5rem', right: '2.5rem' }}
          aria-label="Close access protocol"
        >
          X
        </button>
        <div className="protocol-scroll h-full w-full flex flex-col items-center justify-center gap-4 p-5 sm:p-8 overflow-y-auto">
          <div className="w-full max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 place-items-center justify-items-center">
            {[
              {
                title: '1. Creator Direct (Gumroad) — Recommended',
                bullets: [
                  'Best for you. Best for the author. Unlimited updates.',
                  'Instant PDF download',
                  'Free future editions forever (always get the newest version)',
                  'DRM-free, offline access',
                  'Supports creators directly—highest revenue share',
                ],
                cta: 'Gumroad',
                href: 'https://vostokmethod.gumroad.com/l/vostokmethod',
                color: '#7CFF73',
              },
              {
                title: '2. Fast Checkout (Lemon Squeezy)',
                bullets: [
                  'Great for EU buyers + still supports updates.',
                  'Clean, minimal checkout',
                  'Includes access to future updates',
                  'Handles VAT automatically (EU-friendly)',
                  'Secure digital delivery',
                ],
                cta: 'Lemon Squeezy',
                href: 'https://vostok.lemonsqueezy.com/checkout/buy/216d8b44-36c9-4967-8e39-c9da543f5006',
                color: '#C4FF88',
              },
              {
                title: '3. Kindle Edition (Amazon Books)',
                bullets: [
                  'Best for Kindle readers. Limited flexibility.',
                  'Works on all Kindle devices',
                  'Cloud-sync reading',
                  'Formatting converted to Kindle layout',
                  'No automatic updates — new editions must be repurchased',
                  'Least supportive to creators',
                ],
                cta: 'Amazon Books',
                href: 'https://www.amazon.com/dp/B0GJ68C73Q',
                color: '#FFCA5F',
              },
              {
                title: '4. Apple Books Edition',
                bullets: [
                  'For people deeply inside the Apple ecosystem.',
                  'Seamless reading on iPhone/iPad/Mac',
                  'iCloud sync',
                  'Updates require store approval',
                  'Apple takes a large cut, less direct support',
                  'Most restricted version',
                ],
                cta: 'Apple Books Edition',
                disabled: true,
                color: '#FF7A6B',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="flex w-full max-w-[240px] min-h-[360px] flex-col justify-between rounded-2xl border border-vostok-neon/25 bg-black/60 p-4 pt-5 shadow-lg"
              >
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-vostok-neon">{card.title}</h3>
                  <ul className="space-y-1 text-xs text-vostok-muted list-disc list-inside">
                    {card.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
                {card.href ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 w-full rounded-full px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110 text-center"
                    style={{ backgroundColor: card.color }}
                  >
                    {card.cta}
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled={card.disabled}
                    className={`mt-4 w-full rounded-full px-5 py-3 text-sm font-semibold text-black transition ${
                      card.disabled ? 'cursor-not-allowed opacity-50' : 'hover:brightness-110'
                    }`}
                    style={{ backgroundColor: card.color }}
                  >
                    {card.cta}
                  </button>
                )}
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AccessProtocolModal;
