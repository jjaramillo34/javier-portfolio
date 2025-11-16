import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Building, MapPin, Calendar, CheckCircle, Briefcase, BarChart3, Users, Code as CodeIcon } from 'lucide-react';
import { WorkExperience } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';

interface ExperienceProps {
  workExperience: WorkExperience[];
}

const Experience = ({ workExperience }: ExperienceProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { t } = useLanguage();

  const getDisplayYearRange = (job: WorkExperience): string | null => {
    if (job.year && job.yearEnd) {
      return `${job.year} - ${job.yearEnd}`;
    }

    if (!job.period) return null;

    const yearMatches = job.period.match(/(\d{4})/g);
    if (!yearMatches || yearMatches.length === 0) {
      return null;
    }

    const startYear = parseInt(yearMatches[0], 10);
    let endYear: number;

    if (yearMatches.length > 1) {
      endYear = parseInt(yearMatches[1], 10);
    } else if (/present/i.test(job.period)) {
      endYear = new Date().getFullYear();
    } else {
      endYear = startYear;
    }

    if (!Number.isFinite(startYear) || !Number.isFinite(endYear)) {
      return null;
    }

    return `${startYear} - ${endYear}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const timelineVariants = {
    hidden: { height: 0 },
    visible: {
      height: '100%',
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  const achievementsEmptyLabel = t('experience.noAchievements') ?? 'Highlights coming soon.';

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Enhanced Background effects */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        {/* Large blurred gradient shapes */}
        <div className="absolute top-0 left-1/4 w-[32rem] h-[32rem] bg-gradient-to-br from-orange-300/30 to-green-300/20 dark:from-orange-500/40 dark:to-green-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-gradient-to-tl from-green-300/20 to-orange-300/30 dark:from-green-500/30 dark:to-orange-500/40 rounded-full blur-3xl"></div>
        {/* Extra color layer */}
        <div className="absolute top-1/2 left-1/2 w-[20rem] h-[20rem] bg-gradient-to-br from-orange-200/20 to-green-200/20 dark:from-orange-400/20 dark:to-green-400/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        {/* Animated floating icons */}
        {[
          { Icon: Briefcase, color: 'text-orange-200 dark:text-orange-900', size: 'w-24 h-24', style: { left: '2%', top: '10%' } },
          { Icon: Building, color: 'text-green-200 dark:text-green-900', size: 'w-20 h-20', style: { left: '5%', bottom: '15%' } },
          { Icon: BarChart3, color: 'text-yellow-200 dark:text-yellow-900', size: 'w-20 h-20', style: { right: '8%', top: '18%' } },
          { Icon: Users, color: 'text-blue-200 dark:text-blue-900', size: 'w-24 h-24', style: { right: '3%', bottom: '10%' } },
          { Icon: CodeIcon, color: 'text-purple-200 dark:text-purple-900', size: 'w-16 h-16', style: { left: '50%', top: '5%' } },
          { Icon: Briefcase, color: 'text-orange-300 dark:text-orange-800', size: 'w-16 h-16', style: { left: '10%', top: '60%' } },
          { Icon: Building, color: 'text-green-300 dark:text-green-800', size: 'w-14 h-14', style: { right: '12%', top: '70%' } },
          { Icon: BarChart3, color: 'text-yellow-300 dark:text-yellow-800', size: 'w-12 h-12', style: { left: '20%', bottom: '5%' } },
          { Icon: Users, color: 'text-blue-300 dark:text-blue-800', size: 'w-16 h-16', style: { right: '18%', bottom: '20%' } },
          { Icon: CodeIcon, color: 'text-purple-300 dark:text-purple-800', size: 'w-12 h-12', style: { right: '40%', top: '10%' } },
        ].map(({ Icon, color, size, style }, i) => (
          <motion.div
            key={i}
            className={`absolute ${color} ${size} opacity-40 blur-xl`}
            style={style}
            animate={{
              y: [0, 20, 0],
              opacity: [0.25, 0.5, 0.25],
            }}
            transition={{
              duration: 8 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Icon />
          </motion.div>
        ))}
        {/* Animated floating particles */}
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-orange-300 to-green-300 dark:from-orange-400 dark:to-green-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent"
          >
            {t('experience.heading')}
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-orange-500 to-green-500 mx-auto mb-6"></motion.div>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col gap-2 items-center justify-center max-w-3xl mx-auto mb-6">
          <motion.span variants={itemVariants} className="text-gray-500 text-sm">
            {t('experience.subheading')}
          </motion.span>
          <motion.span variants={itemVariants} className="text-gray-500 text-sm">
            {t('experience.subheading2')}
          </motion.span>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 w-1 bg-gray-700 h-full">
            <motion.div
              className="w-full bg-gradient-to-b from-orange-500 to-green-500 origin-top"
              variants={timelineVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            />
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-12"
          >
            {workExperience.map((job, index) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                className={`relative flex flex-col md:flex-row items-start ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -translate-y-2">
                  <motion.div
                    className="w-6 h-6 bg-gradient-to-br from-orange-500 to-green-500 rounded-full border-4 border-gray-900 shadow-lg"
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                  />
                </div>

                {/* Content card */}
                <div className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  <motion.div
                    className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-300 dark:border-white/10 hover:border-orange-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                        <div className="flex items-center gap-2 text-orange-400 mb-2">
                          <Building className="w-4 h-4" />
                          <span className="font-semibold">{job.company}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{job.period}</span>
                          </div>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {job.achievements && job.achievements.length > 0 ? (
                        job.achievements.map((achievement, achIndex) => (
                          <motion.li
                            key={achIndex}
                            className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.2 + achIndex * 0.1 + 0.8 }}
                          >
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{achievement}</span>
                          </motion.li>
                        ))
                      ) : (
                        <li className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm italic">
                          <CheckCircle className="w-4 h-4 text-gray-400" />
                          {achievementsEmptyLabel}
                        </li>
                      )}
                    </ul>
                  </motion.div>
                </div>

                {/* Year range column (desktop) */}
                <div className="hidden md:flex md:w-5/12 items-center justify-center">
                  <motion.div
                    variants={itemVariants}
                    className="inline-flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border border-orange-400/40 bg-gradient-to-br from-orange-500/90 to-green-500/80 shadow-lg text-white"
                  >
                    <div className="flex items-center gap-2 text-sm uppercase tracking-wide">
                      <Calendar className="w-4 h-4 text-white dark:text-white text-xl" />
                      <h2 className="font-semibold text-white text-xl">
                        {getDisplayYearRange(job)}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/90">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
