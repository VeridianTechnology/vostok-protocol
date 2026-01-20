import { useEffect } from 'react';
import { createPortal } from 'react-dom';

type PdfModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pdfSrc: string;
};

const PdfModal = ({ isOpen, onClose, pdfSrc }: PdfModalProps) => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} aria-hidden="true" />
      <div className="relative w-[98vw] h-[90vh] sm:w-[95vw] sm:h-[85vh] max-w-[95vw] bg-black border border-vostok-neon/30 shadow-2xl rounded-xl overflow-hidden">
        <div
          className="absolute left-4 z-10 px-4 py-2 bg-vostok-bg/90 border border-vostok-neon/30 text-vostok-neon font-mono text-xs tracking-[0.3em] uppercase rounded-full shadow-lg"
          style={{ top: '1vh' }}
        >
          The Vostok Method Sampler
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute z-20 w-12 h-12 rounded-full border-2 border-vostok-neon text-vostok-neon text-3xl hover:bg-vostok-neon/20 transition bg-vostok-bg shadow-lg flex items-center justify-center"
          style={{ top: 'calc(3.5rem + 5vh)', right: 'calc(3.5rem + 3vw)' }}
          aria-label="Close preview"
        >
          X
        </button>
        <div className="pdf-frame w-full h-full">
          <iframe
            title="The Vostok Method Sampler"
            src={`${pdfSrc}#toolbar=0&navpanes=0&scrollbar=0`}
            className="pdf-embed"
            loading="lazy"
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PdfModal;
