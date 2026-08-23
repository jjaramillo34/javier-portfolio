import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 480);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-golden-orange to-golden-orange-dark text-white shadow-lg shadow-golden-orange/30 hover:scale-105 transition-transform"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 mx-auto" />
    </button>
  );
};

export default ScrollToTop;
