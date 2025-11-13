import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Calendar, CheckCircle, Code, Award } from 'lucide-react';
import { useMemo } from 'react';
import { Project } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProjectsProps {
  projects: Project[];
}

const Projects = ({ projects }: ProjectsProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { t } = useLanguage();

  const totalProjects = projects.length;
  const sanitizedProjects = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        technologies: project.technologies ?? [],
        achievements: project.achievements ?? [],
        link: project.link && project.link !== '#' ? project.link : null,
      })),
    [projects],
  );

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-golden-orange/20 to-golden-orange-light/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tl from-golden-orange-light/20 to-golden-orange/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-golden-orange to-golden-orange-dark bg-clip-text text-transparent"
          >
            {t('projects.heading')}
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-golden-orange to-golden-orange-dark mx-auto mb-8"></motion.div>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {(() => {
              const subheading = t('projects.subheading');
              return subheading === 'projects.subheading'
                ? 'Showcasing innovative solutions that blend data analysis with modern technology.'
                : subheading;
            })()}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white shadow rounded-full border border-orange-100 text-sm text-gray-600"
          >
            <Award className="w-4 h-4 text-golden-orange" />
            <span>
              {(() => {
                const totalLabel = t('projects.totalCount');
                return totalLabel === 'projects.totalCount'
                  ? `Total projects: ${totalProjects}`
                  : totalLabel.replace('{{count}}', String(totalProjects));
              })()}
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {sanitizedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover="hover"
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              {/* Card header with gradient */}
              <div className="h-2 bg-gradient-to-r from-golden-orange to-golden-orange-dark"></div>
              
              <div className="p-8">
                {/* Project header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-golden-orange dark:group-hover:text-golden-orange transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{project.period}</span>
                    </div>
                  </div>
                  <motion.div
                    className="p-3 bg-gradient-to-br from-orange-100 to-green-100 rounded-xl group-hover:from-orange-200 group-hover:to-green-200 transition-all duration-300"
                    whileHover={{ rotate: 12 }}
                  >
                    <Code className="w-6 h-6 text-orange-600" />
                  </motion.div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('projects.technologiesUsed')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {(project.technologies.length ? project.technologies : ['N/A']).map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        className="px-3 py-1 bg-gradient-to-r from-orange-100 to-green-100 text-orange-700 text-sm font-medium rounded-full border border-orange-200"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                        transition={{ delay: index * 0.1 + techIndex * 0.05 + 0.5 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('projects.keyAchievements')}</h4>
                  <ul className="space-y-2">
                    {project.achievements.length > 0 ? (
                      project.achievements.map((achievement, achIndex) => (
                        <motion.li
                          key={achIndex}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.2 + achIndex * 0.1 + 0.8 }}
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </motion.li>
                      ))
                    ) : (
                      <li className="flex items-center gap-2 text-sm text-gray-400 italic">
                        <CheckCircle className="w-4 h-4 text-gray-300" />
                        {t('projects.noAchievements') ?? 'Full project details coming soon.'}
                      </li>
                    )}
                  </ul>
                </div>

                {/* Project link */}
                {project.link ? (
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-300 group-hover:shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{t('projects.viewProject')}</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-xl cursor-not-allowed">
                    <ExternalLink className="w-4 h-4" />
                    <span>{t('projects.viewProjectUnavailable') ?? 'Live link unavailable'}</span>
                  </div>
                )}
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-100/50 to-green-100/50 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
