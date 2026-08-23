import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Calendar, CheckCircle, Award } from 'lucide-react';
import { useMemo } from 'react';
import { Project } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProjectsProps {
  projects: Project[];
}

const COVER_IMAGES = [
  '/images/workspace.png',
  '/images/data-visualization.jpg',
  '/images/coding-bg.jpg',
  '/images/pattern-bg.jpg',
  '/images/hero.png',
];

const getProjectInitials = (title: string) => {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const Projects = ({ projects }: ProjectsProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '120px 0px',
  });
  const { t } = useLanguage();

  const totalProjects = projects.length;
  const sanitizedProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => (a.order ?? a.id) - (b.order ?? b.id))
        .map((project, index) => ({
          ...project,
          technologies: project.technologies ?? [],
          achievements: project.achievements ?? [],
          link: project.link && project.link !== '#' ? project.link : null,
          cover: project.image || COVER_IMAGES[index % COVER_IMAGES.length],
          initials: getProjectInitials(project.title),
        })),
    [projects],
  );

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

  const subheading = t('projects.subheading');
  const totalLabel = t('projects.totalCount');

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
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
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            {subheading === 'projects.subheading'
              ? 'Showcasing innovative solutions that blend data analysis with modern technology.'
              : subheading}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 shadow rounded-full border border-orange-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300"
          >
            <Award className="w-4 h-4 text-golden-orange" />
            <span>
              {totalLabel === 'projects.totalCount'
                ? `Total projects: ${totalProjects}`
                : totalLabel.replace('{{count}}', String(totalProjects))}
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {sanitizedProjects.map((project) => (
            <motion.article
              key={project.id}
              variants={itemVariants}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={project.cover}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-golden-orange/20"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-golden-orange text-white font-bold flex items-center justify-center">
                    {project.initials}
                  </div>
                  {project.technologies[0] && (
                    <span className="px-3 py-1 text-xs font-semibold text-white bg-white/15 backdrop-blur-sm rounded-full border border-white/20">
                      {project.technologies[0]}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-golden-orange transition-colors duration-300">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{project.period}</span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('projects.technologiesUsed')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {(project.technologies.length ? project.technologies : ['N/A']).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-golden-orange/10 text-golden-orange-dark dark:text-golden-orange text-sm font-medium rounded-full border border-golden-orange/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {project.achievements.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('projects.keyAchievements')}</h4>
                    <ul className="space-y-2">
                      {project.achievements.map((achievement) => (
                        <li
                          key={achievement}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                        >
                          <CheckCircle className="w-4 h-4 text-golden-orange mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-golden-orange to-golden-orange-dark hover:from-golden-orange-dark hover:to-golden-orange text-white font-semibold rounded-xl transition-all duration-300"
                  >
                    <span>{t('projects.viewProject')}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
