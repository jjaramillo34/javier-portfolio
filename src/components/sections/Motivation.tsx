import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Sparkle, Users, GraduationCap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const backgroundIcons = [
  { Icon: Heart, left: '12%', top: '18%', delay: 0 },
  { Icon: Sparkle, left: '78%', top: '12%', delay: 0.8 },
  { Icon: Users, left: '24%', top: '68%', delay: 0.3 },
  { Icon: GraduationCap, left: '60%', top: '75%', delay: 1.2 },
  { Icon: Sparkle, left: '85%', top: '52%', delay: 0.6 },
] as const;

const Motivation = () => {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="motivation"
      className="relative py-20 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        {backgroundIcons.map(({ Icon, left, top, delay }, index) => (
          <motion.div
            key={index}
            className="absolute text-orange-300 dark:text-orange-900 opacity-30 dark:opacity-20 blur-sm"
            style={{ left, top }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 7, repeat: Infinity, delay }}
          >
            <Icon className="w-12 h-12 md:w-16 md:h-16" />
          </motion.div>
        ))}
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 mb-6 rounded-full bg-white shadow border border-orange-100 text-orange-600 font-semibold">
          <Heart className="w-5 h-5" />
          {t('motivation.heading')}
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-snug"
        >
          {(() => {
            const title = t('motivation.title');
            return title === 'motivation.title' ? 'Why I Built This Portfolio' : title;
          })()}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line"
        >
          {(() => {
            const text = t('motivation.text');
            return text === 'motivation.text'
              ? 'This portfolio was created with love for my wife Cris, my daughter Sofia, and my son Mateo. It reflects my journey as a developer, educator, and lifelong learner. My experience spans data analytics, full-stack development, and educational technology, and I am passionate about building tools that empower others. Thank you to my family for their unwavering support and to all the mentors, colleagues, and students who have inspired me along the way.'
              : text;
          })()}
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Motivation;

