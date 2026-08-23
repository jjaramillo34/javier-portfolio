import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const FAMILY = ['Cris', 'Sofia', 'Mateo'];

const Motivation = () => {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const title = t('motivation.title');
  const heading = title === 'motivation.title' ? t('motivation.heading') : title;
  const text = t('motivation.text');
  const body =
    text === 'motivation.text'
      ? 'This portfolio was created with love for my wife Cris, my daughter Sofia, and my son Mateo. It reflects my journey as a developer, educator, and lifelong learner.'
      : text;

  return (
    <section
      id="motivation"
      className="relative py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-3xl mx-auto px-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-golden-orange/20 shadow-lg p-8 md:p-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-golden-orange/10 text-golden-orange font-semibold text-sm">
            <Heart className="w-4 h-4" />
            {t('navigation.story') === 'navigation.story' ? 'Story' : t('navigation.story')}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-snug">
            {heading}
          </h2>

          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {body}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {FAMILY.map((name) => (
              <span
                key={name}
                className="px-4 py-1.5 rounded-full bg-golden-orange/10 text-golden-orange-dark dark:text-golden-orange text-sm font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Motivation;
