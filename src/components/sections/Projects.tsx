import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Calendar, CheckCircle, Award } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Project } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

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

type ProjectCard = Project & {
  technologies: string[];
  achievements: string[];
  link: string | null;
  cover: string;
  initials: string;
};

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
  const { t, language } = useLanguage();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const label = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const detailsLabel = label('projects.details', language === 'es' ? 'Detalles' : 'Details');
  const visitLabel = label('projects.viewProject', language === 'es' ? 'Ver proyecto' : 'View Project');
  const techLabel = label('projects.technologiesUsed', language === 'es' ? 'Tecnologías' : 'Technologies');
  const highlightsLabel = label('projects.keyAchievements', language === 'es' ? 'Logros clave' : 'Key achievements');

  const sanitizedProjects = useMemo<ProjectCard[]>(
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

  const selected = sanitizedProjects.find((project) => project.id === selectedId) ?? null;
  const totalProjects = sanitizedProjects.length;
  const subheading = t('projects.subheading');
  const totalLabel = t('projects.totalCount');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-golden-orange to-golden-orange-dark bg-clip-text text-transparent"
          >
            {t('projects.heading')}
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-golden-orange to-golden-orange-dark mx-auto mb-8" />
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            {subheading === 'projects.subheading'
              ? language === 'es'
                ? 'Sitios y herramientas que combinan datos, producto y un diseño claro.'
                : 'Sites and tools that mix data, product, and a clear design.'
              : subheading}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 shadow rounded-full border border-orange-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300"
          >
            <Award className="w-4 h-4 text-golden-orange" />
            <span>
              {totalLabel === 'projects.totalCount'
                ? `${language === 'es' ? 'Proyectos' : 'Total projects'}: ${totalProjects}`
                : totalLabel.replace('{{count}}', String(totalProjects))}
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {sanitizedProjects.map((project) => {
            const previewTech = project.technologies.slice(0, 3);
            const extraTech = project.technologies.length - previewTech.length;

            return (
              <motion.article
                key={project.id}
                variants={itemVariants}
                className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(project.id)}
                  className="text-left"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={project.cover}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-golden-orange/20" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-golden-orange text-white font-bold flex items-center justify-center">
                        {project.initials}
                      </div>
                      {project.technologies[0] && (
                        <span className="px-3 py-1 text-xs font-semibold text-white bg-white/15 backdrop-blur-sm rounded-full border border-white/20">
                          {project.technologies[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 pb-0">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-golden-orange transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{project.period}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 min-h-[3.25rem]">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {previewTech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 bg-golden-orange/10 text-golden-orange-dark dark:text-golden-orange text-xs font-medium rounded-full border border-golden-orange/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {extraTech > 0 && (
                        <span className="px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                          +{extraTech}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                <div className="p-6 pt-5 mt-auto flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedId(project.id)}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-golden-orange/30 text-golden-orange-dark dark:text-golden-orange font-semibold hover:bg-golden-orange/10 transition-colors"
                  >
                    {detailsLabel}
                  </button>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-golden-orange to-golden-orange-dark text-white font-semibold rounded-xl hover:from-golden-orange-dark hover:to-golden-orange transition-all"
                    >
                      {visitLabel}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>

      <Dialog open={selectedId !== null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-900">
          {selected && (
            <>
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img src={selected.cover} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
              </div>
              <div className="p-6 sm:p-8">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-2xl sm:text-3xl text-gray-900 dark:text-white">
                    {selected.title}
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {selected.period}
                  </DialogDescription>
                </DialogHeader>

                <p className="mt-5 text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selected.description}
                </p>

                {selected.technologies.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{techLabel}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-golden-orange/10 text-golden-orange-dark dark:text-golden-orange text-sm font-medium rounded-full border border-golden-orange/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selected.achievements.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{highlightsLabel}</h4>
                    <ul className="space-y-2">
                      {selected.achievements.map((achievement) => (
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

                {selected.link && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-golden-orange to-golden-orange-dark text-white font-semibold rounded-xl hover:from-golden-orange-dark hover:to-golden-orange transition-all"
                  >
                    {visitLabel}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;
