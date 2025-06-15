import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Database, Cloud, BarChart3, Globe, Wrench, FileCode, Coffee, FileText, Atom, Server, Code2, Wind, BarChart2, PieChart, FileSpreadsheet, CloudSun, Zap, Leaf, GitBranch, AppWindow, Repeat, Sliders } from 'lucide-react';
import { SkillCategory } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';

interface SkillsProps {
  skills: SkillCategory;
}

const Skills = ({ skills }: SkillsProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { t } = useLanguage();

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const skillCategories = [
    {
      title: t('skills.programmingLanguages'),
      icon: Code,
      skills: skills.languages,
      color: 'from-golden-orange to-golden-orange-dark',
      bgColor: 'from-golden-orange-light/20 to-golden-orange/20',
    },
    {
      title: t('skills.frontendDevelopment'),
      icon: Globe,
      skills: skills.frontend,
      color: 'from-golden-orange-dark to-golden-orange',
      bgColor: 'from-golden-orange/20 to-golden-orange-light/20',
    },
    {
      title: t('skills.dataVisualization'),
      icon: BarChart3,
      skills: skills.dataVisualization,
      color: 'from-golden-orange to-golden-orange-light',
      bgColor: 'from-golden-orange-light/30 to-golden-orange/10',
    },
    {
      title: t('skills.cloudPlatforms'),
      icon: Cloud,
      skills: skills.cloud,
      color: 'from-golden-orange-light to-golden-orange',
      bgColor: 'from-golden-orange/10 to-golden-orange-light/30',
    },
    {
      title: t('skills.databases'),
      icon: Database,
      skills: skills.databases,
      color: 'from-golden-orange-dark to-golden-orange-light',
      bgColor: 'from-golden-orange-light/25 to-golden-orange-dark/15',
    },
    {
      title: t('skills.toolsTechnologies'),
      icon: Wrench,
      skills: skills.tools,
      color: 'from-golden-orange-light to-golden-orange-dark',
      bgColor: 'from-golden-orange-dark/15 to-golden-orange-light/25',
    },
  ];

  const skillIcons: Record<string, JSX.Element> = {
    'Python': <Code className="w-5 h-5 text-blue-400 inline-block mr-2" />,
    'JavaScript': <FileCode className="w-5 h-5 text-yellow-400 inline-block mr-2" />,
    'TypeScript': <FileCode className="w-5 h-5 text-blue-500 inline-block mr-2" />,
    'SQL': <Database className="w-5 h-5 text-green-400 inline-block mr-2" />,
    'Java': <Coffee className="w-5 h-5 text-amber-800 inline-block mr-2" />,
    'VBA': <FileText className="w-5 h-5 text-purple-500 inline-block mr-2" />,
    'React.js': <Atom className="w-5 h-5 text-sky-400 inline-block mr-2" />,
    'Node.js': <Server className="w-5 h-5 text-green-500 inline-block mr-2" />,
    'HTML/CSS': <Code2 className="w-5 h-5 text-orange-400 inline-block mr-2" />,
    'Tailwind CSS': <Wind className="w-5 h-5 text-teal-400 inline-block mr-2" />,
    'Power BI': <BarChart3 className="w-5 h-5 text-yellow-400 inline-block mr-2" />,
    'Tableau': <BarChart2 className="w-5 h-5 text-blue-400 inline-block mr-2" />,
    'Qlik': <PieChart className="w-5 h-5 text-green-500 inline-block mr-2" />,
    'Excel': <FileSpreadsheet className="w-5 h-5 text-green-600 inline-block mr-2" />,
    'AWS': <Cloud className="w-5 h-5 text-orange-400 inline-block mr-2" />,
    'Azure': <CloudSun className="w-5 h-5 text-blue-500 inline-block mr-2" />,
    'Power Platform': <Zap className="w-5 h-5 text-purple-500 inline-block mr-2" />,
    'MongoDB': <Leaf className="w-5 h-5 text-green-600 inline-block mr-2" />,
    'SQL Server': <Database className="w-5 h-5 text-red-500 inline-block mr-2" />,
    'DB2': <Database className="w-5 h-5 text-blue-700 inline-block mr-2" />,
    'Git': <GitBranch className="w-5 h-5 text-orange-500 inline-block mr-2" />,
    'Power Apps': <AppWindow className="w-5 h-5 text-purple-500 inline-block mr-2" />,
    'Power Automate': <Repeat className="w-5 h-5 text-blue-500 inline-block mr-2" />,
    'Streamlit': <Sliders className="w-5 h-5 text-pink-400 inline-block mr-2" />,
  };

  const SkillBar = ({ skill, delay, color }: { skill: any, delay: number, color: string }) => {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">
            {skillIcons[skill.name] || null}{skill.name}
          </span>
          <span className="text-gray-200 text-sm font-semibold">{skill.level}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${color} rounded-full relative`}
            initial={{ width: 0 }}
            animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
            transition={{ duration: 1.5, delay, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                delay: delay + 1.5,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/coding-bg.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90"></div>
        </div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-golden-orange to-golden-orange-light rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
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
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-golden-orange to-golden-orange-light bg-clip-text text-transparent"
          >
            {t('skills.heading')}
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-golden-orange to-golden-orange-dark mx-auto mb-8"></motion.div>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Expertise across the full technology stack, from data analysis to full-stack development
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-orange-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-4 bg-gradient-to-br ${category.bgColor} rounded-xl`}>
                  <category.icon className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
              </div>

              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <SkillBar
                    key={skillIndex}
                    skill={skill}
                    delay={categoryIndex * 0.2 + skillIndex * 0.1}
                    color={category.color}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured skills highlight */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-16 text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex flex-wrap items-center justify-center gap-4">
            {['Python', 'React.js', 'Power BI', 'SQL', 'TypeScript', 'Tableau', 'AWS', 'Node.js'].map((skill, index) => (
              <motion.span
                key={skill}
                className="px-6 py-3 bg-gradient-to-r from-orange-500/20 to-green-500/20 border border-orange-500/30 text-white font-semibold rounded-full backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ delay: index * 0.1 + 1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
