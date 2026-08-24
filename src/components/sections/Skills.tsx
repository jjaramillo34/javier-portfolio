import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useMemo } from 'react';
import {
  Code,
  Database,
  Cloud,
  BarChart3,
  Globe,
  Wrench,
  Award,
} from 'lucide-react';
import { Skill, SkillCategory } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';

interface SkillsProps {
  skills: SkillCategory;
}

const CORE_LEVEL = 85;

const Skills = ({ skills }: SkillsProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '120px 0px',
  });
  const { t, language } = useLanguage();

  const normalizedSkills = useMemo(
    () => ({
      languages: skills.languages ?? [],
      frontend: skills.frontend ?? [],
      dataVisualization: skills.dataVisualization ?? [],
      cloud: skills.cloud ?? [],
      databases: skills.databases ?? [],
      tools: skills.tools ?? [],
    }),
    [skills],
  );

  const skillCategories = [
    { title: t('skills.programmingLanguages'), icon: Code, skills: normalizedSkills.languages },
    { title: t('skills.frontendDevelopment'), icon: Globe, skills: normalizedSkills.frontend },
    { title: t('skills.dataVisualization'), icon: BarChart3, skills: normalizedSkills.dataVisualization },
    { title: t('skills.cloudPlatforms'), icon: Cloud, skills: normalizedSkills.cloud },
    { title: t('skills.databases'), icon: Database, skills: normalizedSkills.databases },
    { title: t('skills.toolsTechnologies'), icon: Wrench, skills: normalizedSkills.tools },
  ];

  const featuredSkills = useMemo(() => {
    const allSkills = Object.values(normalizedSkills).flat();
    return [...allSkills]
      .sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
      .filter((skill, index, list) => list.findIndex((item) => item.name === skill.name) === index)
      .slice(0, 8)
      .map((skill) => skill.name);
  }, [normalizedSkills]);

  const splitSkills = (categorySkills: Skill[]) => {
    const sorted = [...categorySkills].sort((a, b) => (b.level ?? 0) - (a.level ?? 0));
    return {
      core: sorted.filter((skill) => (skill.level ?? 0) >= CORE_LEVEL),
      familiar: sorted.filter((skill) => (skill.level ?? 0) < CORE_LEVEL),
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const coreLabel = t('skills.core') === 'skills.core' ? 'Core' : t('skills.core');
  const familiarLabel = t('skills.familiar') === 'skills.familiar' ? 'Also use' : t('skills.familiar');

  const SkillChips = ({ items, featured = false }: { items: Skill[]; featured?: boolean }) => (
    <div className="flex flex-wrap gap-2">
      {items.map((skill) => (
        <span
          key={skill.name}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
            featured
              ? 'bg-golden-orange text-white border-golden-orange'
              : 'bg-golden-orange/10 text-golden-orange-dark dark:text-golden-orange border-golden-orange/20'
          }`}
        >
          {skill.name}
        </span>
      ))}
    </div>
  );

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
            {t('skills.heading')}
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-golden-orange to-golden-orange-dark mx-auto mb-8" />
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            {t('skills.subheading') === 'skills.subheading'
              ? language === 'es'
                ? 'Las herramientas que más uso para datos, aplicaciones y el trabajo del día a día.'
                : 'The tools I use most for data, apps, and day-to-day delivery.'
              : t('skills.subheading')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {skillCategories.map((category) => {
            const { core, familiar } = splitSkills(category.skills);
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-golden-orange/10 rounded-xl">
                    <Icon className="w-6 h-6 text-golden-orange" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category.title}</h3>
                </div>

                {core.length === 0 && familiar.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400 italic">
                    <Award className="w-4 h-4" />
                    {t('skills.noSkills') === 'skills.noSkills' ? 'Skills coming soon.' : t('skills.noSkills')}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {core.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-golden-orange mb-2">
                          {coreLabel}
                        </p>
                        <SkillChips items={core} featured />
                      </div>
                    )}
                    {familiar.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                          {familiarLabel}
                        </p>
                        <SkillChips items={familiar} />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {featuredSkills.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mt-16 text-center"
          >
            <motion.p
              variants={itemVariants}
              className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4"
            >
              {t('skills.featured') === 'skills.featured' ? 'Most used' : t('skills.featured')}
            </motion.p>
            <motion.div variants={itemVariants} className="inline-flex flex-wrap items-center justify-center gap-3">
              {featuredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-5 py-2 bg-white dark:bg-gray-800 border border-golden-orange/30 text-gray-800 dark:text-white font-semibold rounded-full"
                >
                  {skill}
                </span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Skills;
