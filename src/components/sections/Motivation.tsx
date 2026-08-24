import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Motivation = () => {
  const { t, language } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '120px 0px',
  });

  const label = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const heading = label(
    'motivation.heading',
    language === 'es' ? 'Por qué creé este portafolio' : 'Why I built this portfolio'
  );
  const lead = label(
    'motivation.lead',
    language === 'es'
      ? 'Lo hice con amor para Cris, Sofía y Mateo.'
      : 'I built this with love for Cris, Sofia, and Mateo.'
  );
  const body = label(
    'motivation.body',
    language === 'es'
      ? 'Refleja mi camino como desarrollador, educador y aprendiz de por vida. Trabajo en análisis de datos, desarrollo full-stack y tecnología educativa, y me importa crear herramientas que ayuden a otras personas.'
      : 'It reflects my path as a developer, educator, and lifelong learner. I work across data analytics, full-stack development, and educational technology, and I care about building tools that help other people.'
  );
  const thanks = label(
    'motivation.thanks',
    language === 'es'
      ? 'Gracias a mi familia por el apoyo, y a los mentores, colegas y estudiantes que me han acompañado.'
      : 'Thank you to my family for the support, and to the mentors, colleagues, and students who have walked with me.'
  );
  const storyLabel = label(
    'motivation.storyLabel',
    language === 'es' ? 'El camino' : 'The journey',
  );
  const dedicationLabel = label(
    'motivation.dedicationLabel',
    language === 'es' ? 'Dedicación' : 'Dedication',
  );
  const dedicationBody = label(
    'motivation.dedicationBody',
    language === 'es'
      ? 'A Cris, Sofía y Mateo: gracias por ser parte de la inspiración detrás de cada paso.'
      : 'For Cris, Sofia, and Mateo: thank you for being part of the inspiration behind every step.',
  );

  const family = [
    { name: 'Cris', role: label('motivation.wife', language === 'es' ? 'Esposa' : 'Wife') },
    { name: language === 'es' ? 'Sofía' : 'Sofia', role: label('motivation.daughter', language === 'es' ? 'Hija' : 'Daughter') },
    { name: 'Mateo', role: label('motivation.son', language === 'es' ? 'Hijo' : 'Son') },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section
      id="motivation"
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="max-w-4xl mx-auto px-6"
      >
        <div className="text-center mb-12">
          <motion.p
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-golden-orange/10 text-golden-orange font-semibold text-sm"
          >
            <Heart className="w-4 h-4" />
            {label('navigation.story', language === 'es' ? 'Historia' : 'Story')}
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-golden-orange to-golden-orange-dark bg-clip-text text-transparent"
          >
            {heading}
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-golden-orange to-golden-orange-dark mx-auto"
          />
        </div>

        <motion.blockquote
          variants={itemVariants}
          className="text-center text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white leading-snug mb-10"
        >
          {lead}
        </motion.blockquote>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          {family.map((person) => (
            <motion.div
              key={person.name}
              variants={itemVariants}
              className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-6 text-center shadow-sm"
            >
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{person.name}</p>
              <p className="mt-1 text-sm text-golden-orange font-medium">{person.role}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-5 md:grid-cols-[1.15fr_0.85fr]"
        >
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-golden-orange">
              {storyLabel}
            </p>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">{body}</p>
            <p className="mt-5 border-t border-gray-100 pt-5 text-base leading-relaxed text-gray-500 dark:border-gray-700 dark:text-gray-400">
              {thanks}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-golden-orange/25 bg-gradient-to-br from-golden-orange/10 via-white to-white p-6 shadow-sm dark:from-golden-orange/15 dark:via-gray-800 dark:to-gray-800 md:p-8"
          >
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-golden-orange">
              <Sparkles className="h-4 w-4" />
              {dedicationLabel}
            </p>
            <p className="text-xl font-semibold leading-relaxed text-gray-900 dark:text-white">
              {dedicationBody}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Motivation;
