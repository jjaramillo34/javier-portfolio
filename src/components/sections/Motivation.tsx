import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart } from 'lucide-react';
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
          variants={itemVariants}
          className="max-w-2xl mx-auto text-center space-y-4"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{body}</p>
          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">{thanks}</p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Motivation;
