import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Users, Award, Calendar } from 'lucide-react';
import { PersonalInfo, Achievements } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';

interface AboutProps {
  personalInfo: PersonalInfo;
  achievements: Achievements;
}

const About = ({ personalInfo, achievements }: AboutProps) => {
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

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-golden-orange/20 to-golden-orange-light/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-golden-orange-light/20 to-golden-orange/20 rounded-full blur-3xl"></div>
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
            {t('about.heading')}
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-golden-orange to-golden-orange-dark mx-auto mb-8"></motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-700 leading-relaxed"
            >
              I'm a passionate Data Analyst and Full Stack Developer with over 15 years of experience 
              transforming complex data into actionable insights and building innovative software solutions. 
              My journey spans across education, healthcare, and technology sectors, where I've consistently 
              delivered results that drive business growth and operational efficiency.
            </motion.p>

            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-700 leading-relaxed"
            >
              My expertise lies in bridging the gap between data and technology, creating automated systems 
              that reduce manual work while providing clear, visual insights. I specialize in Power BI, 
              Tableau, React.js, and Python, always focusing on user-centric solutions that make complex 
              data accessible to everyone.
            </motion.p>

            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-700 leading-relaxed"
            >
              When I'm not coding or analyzing data, I'm constantly learning new technologies and 
              methodologies to stay at the forefront of the rapidly evolving tech landscape. I believe 
              in the power of data-driven decisions and elegant code to solve real-world problems.
            </motion.p>
          </motion.div>

          {/* Personal Photo */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative"
          >
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-golden-orange to-golden-orange-dark rounded-3xl transform rotate-6 scale-105 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-golden-orange-dark to-golden-orange rounded-3xl transform -rotate-3 scale-110 opacity-10"></div>
              
              {/* Main photo container */}
              <div className="relative bg-white p-4 rounded-3xl shadow-2xl">
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src="/images/myself.png"
                    alt={personalInfo.name}
                    className="w-full h-96 object-cover object-center"
                  />
                </div>
                
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-golden-orange to-golden-orange-dark text-white px-6 py-3 rounded-2xl shadow-lg shadow-golden-orange/25">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{achievements.yearsOfExperience}+</div>
                    <div className="text-sm opacity-90">Years</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} mb-4`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <motion.div
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
              >
                {stat.value}{stat.suffix}
              </motion.div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
