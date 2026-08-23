import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Building, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { WorkExperience } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';

interface ExperienceProps {
  workExperience: WorkExperience[];
}

const isCurrentRole = (job: WorkExperience) => /present/i.test(job.period ?? '');

const Experience = ({ workExperience }: ExperienceProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '120px 0px',
  });
  const { t } = useLanguage();

  const heading = t('experience.heading');
  const subheading = t('experience.subheading');
  const emptyLabel =
    t('experience.noAchievements') === 'experience.noAchievements'
      ? 'Highlights coming soon.'
      : t('experience.noAchievements');
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-14"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-golden-orange to-golden-orange-dark bg-clip-text text-transparent"
          >
            {heading}
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-golden-orange to-golden-orange-dark mx-auto mb-6" />
          {subheading && subheading !== 'experience.subheading' && (
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {subheading}
            </motion.p>
          )}
        </motion.div>

        <div className="relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-golden-orange/30" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            {workExperience.map((job) => {
              const current = isCurrentRole(job);

              return (
                <motion.article
                  key={job.id}
                  variants={itemVariants}
                  className="relative pl-10"
                >
                  <div
                    className={`absolute left-0 top-3 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900 ${
                      current
                        ? 'bg-gradient-to-br from-golden-orange to-golden-orange-dark'
                        : 'bg-golden-orange/40'
                    }`}
                  />

                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-golden-orange">
                        <Calendar className="w-4 h-4" />
                        {job.period}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="inline-flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                        <Building className="w-4 h-4 text-golden-orange" />
                        {job.company}
                      </span>
                      {job.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                      )}
                    </div>

                    {job.achievements?.length ? (
                      <ul className="space-y-2">
                        {job.achievements.map((achievement) => (
                          <li
                            key={achievement}
                            className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                          >
                            <CheckCircle className="w-4 h-4 text-golden-orange mt-1 flex-shrink-0" />
                            <span className="leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm italic text-gray-500 dark:text-gray-400">{emptyLabel}</p>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
