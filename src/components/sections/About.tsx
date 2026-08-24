import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Users, Award, Calendar, GraduationCap, Workflow, Code2 } from 'lucide-react';
import { PersonalInfo, Achievements, Education } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';

interface AboutProps {
  personalInfo: PersonalInfo;
  achievements: Achievements;
  education?: Education[];
}

const About = ({ personalInfo, achievements, education = [] }: AboutProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { t, language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const statsData = [
    {
      icon: Calendar,
      value: achievements.yearsOfExperience,
      suffix: '+',
      label: t('about.yearsExperience'),
      color: 'from-golden-orange to-golden-orange-dark',
    },
    {
      icon: TrendingUp,
      value: achievements.projectsCompleted,
      suffix: '+',
      label: t('about.projectsCompleted'),
      color: 'from-golden-orange-dark to-golden-orange',
    },
    {
      icon: Users,
      value: achievements.dataPointsProcessed,
      suffix: '',
      label: t('about.dataPointsProcessed'),
      color: 'from-golden-orange to-golden-orange-light',
    },
    {
      icon: Award,
      value: achievements.satisfactionRate,
      suffix: '%',
      label: t('about.clientSatisfaction'),
      color: 'from-golden-orange-light to-golden-orange',
    },
  ];

  const focusAreas = [
    {
      icon: TrendingUp,
      title: language === 'es' ? 'Datos accionables' : 'Actionable data',
      description:
        language === 'es'
          ? 'Convierto datos complejos en decisiones claras y medibles.'
          : 'Turning complex data into clear, measurable decisions.',
    },
    {
      icon: Workflow,
      title: language === 'es' ? 'Procesos eficientes' : 'Efficient processes',
      description:
        language === 'es'
          ? 'Automatizo el trabajo repetitivo para que los equipos se enfoquen en lo importante.'
          : 'Automating repetitive work so teams can focus on what matters.',
    },
    {
      icon: Code2,
      title: language === 'es' ? 'Productos útiles' : 'Useful products',
      description:
        language === 'es'
          ? 'Construyo aplicaciones que conectan personas, sistemas y resultados.'
          : 'Building applications that connect people, systems, and outcomes.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-golden-orange to-golden-orange-dark bg-clip-text text-transparent"
          >
            {t('about.heading')}
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-golden-orange to-golden-orange-dark mx-auto mb-8"></motion.div>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            {personalInfo.summary}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid gap-4 md:grid-cols-3 mb-10"
        >
          {focusAreas.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="rounded-2xl border border-golden-orange/15 bg-white/80 p-5 shadow-sm dark:bg-gray-800/80"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-golden-orange/10 text-golden-orange">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${stat.color} mb-4`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                {stat.value}{stat.suffix}
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {education.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="mt-12"
          >
            <motion.h3
              variants={itemVariants}
              className="text-lg font-semibold text-gray-800 dark:text-white mb-5 text-center"
            >
              {t('about.education') === 'about.education' ? 'Education' : t('about.education')}
            </motion.h3>
            <div className="space-y-3">
              {education.map((item) => (
                <motion.div
                  key={`${item.school}-${item.degree}`}
                  variants={itemVariants}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-golden-orange/10 text-golden-orange">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-white">{item.degree}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.school}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {[item.period, item.location].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default About;
