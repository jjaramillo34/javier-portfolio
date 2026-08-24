import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Linkedin, MapPin, Download, Github } from 'lucide-react';
import { PersonalInfo } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeroProps {
  personalInfo: PersonalInfo;
}

const RESUME_HREF = '/Javier_Jaramillo_Resume.pdf';

const Hero = ({ personalInfo }: HeroProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { t, language } = useLanguage();

  const label = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const sanitizedEmail = personalInfo.email?.trim() ?? '';
  const sanitizedLinkedIn = personalInfo.linkedin?.trim() ?? '';
  const sanitizedGithub = personalInfo.github?.trim() || 'https://github.com/jjaramillo34';
  const sanitizedLocation = personalInfo.location?.trim() ?? t('contact.locationFallback') ?? 'Global';
  const resumeLabel = label(
    'hero.downloadResume',
    language === 'es' ? 'Descargar currículum' : 'Download Resume'
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/hero.png')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/70 via-blue-900/50 to-green-800/60"></div>
      </div>

      <motion.div
        ref={ref}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 text-white"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-10 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                <MapPin className="w-4 h-4" />
                {sanitizedLocation}
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-golden-orange via-white to-golden-orange-light bg-clip-text text-transparent"
            >
              {personalInfo.name}
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="text-xl md:text-2xl font-light mb-6 text-golden-orange-light"
            >
              {personalInfo.title}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-white/90 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed line-clamp-3"
            >
              {personalInfo.summary || personalInfo.tagline}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <a
                href={sanitizedEmail ? `mailto:${sanitizedEmail}` : '#contact'}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-golden-orange to-golden-orange-dark text-white font-semibold rounded-xl transition-all duration-300 hover:from-golden-orange-dark hover:to-golden-orange hover:scale-105 hover:shadow-2xl hover:shadow-golden-orange/25"
              >
                <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                {t('hero.getInTouch')}
              </a>
              <a
                href={RESUME_HREF}
                download="Javier_Jaramillo_Resume.pdf"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-golden-orange/20 to-golden-orange/30 text-golden-orange border-2 border-golden-orange font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm hover:from-golden-orange/30 hover:to-golden-orange/40 hover:scale-105 hover:shadow-2xl hover:shadow-golden-orange/25"
              >
                <Download className="w-5 h-5" />
                {resumeLabel}
              </a>
            </motion.div>

            {(sanitizedLinkedIn || sanitizedGithub) && (
              <motion.div
                variants={itemVariants}
                className="mt-6 flex items-center justify-center lg:justify-start gap-3"
              >
                {sanitizedLinkedIn && (
                  <a
                    href={sanitizedLinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label('hero.linkedinProfile', 'LinkedIn')}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white hover:border-golden-orange/60 hover:text-golden-orange transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {sanitizedGithub && (
                  <a
                    href={sanitizedGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label('hero.github', 'GitHub')}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white hover:border-golden-orange/60 hover:text-golden-orange transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
              </motion.div>
            )}
          </div>

          <motion.div variants={itemVariants} className="order-first lg:order-none mx-auto">
            <div className="relative w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64">
              <img
                src="/images/myself.png"
                alt={personalInfo.name}
                className="relative w-full h-full object-cover rounded-full border-4 border-golden-orange/30 shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <button
        type="button"
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-label={t('navigation.about')}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </button>
    </section>
  );
};

export default Hero;
