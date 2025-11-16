import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown, Mail, Linkedin, MapPin, Phone } from 'lucide-react';
import { useMemo } from 'react';
import { PersonalInfo } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeroProps {
  personalInfo: PersonalInfo;
}

const Hero = ({ personalInfo }: HeroProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { t } = useLanguage();

  const sanitizedEmail = personalInfo.email?.trim() ?? '';
  const sanitizedLinkedIn = personalInfo.linkedin?.trim() ?? '';
  const sanitizedLocation = personalInfo.location?.trim() ?? t('contact.locationFallback') ?? 'Global';

  const taglineSegments = useMemo(() => {
    return personalInfo.tagline
      ?.split('|')
      .map((segment) => segment.trim())
      .filter(Boolean)
      .slice(0, 8);
  }, [personalInfo.tagline]);

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

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/hero.png')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/70 via-blue-900/50 to-green-800/60"></div>
      </div>

      {/* Animated geometric patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-green-500/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-tl from-green-400/20 to-orange-500/20 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        ref={ref}
        className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
            <MapPin className="w-4 h-4" />
            {sanitizedLocation}
          </span>
        </motion.div>

        {/* Heading*/}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-golden-orange via-white to-golden-orange-light bg-clip-text text-transparent">
            {t('hero.heading')}
          </h1>
        </motion.div>
        {/* Subheading  & Subheading2*/}
        <motion.div variants={itemVariants} className="mb-6 flex flex-col gap-2">
          <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed uppercase">
            {t('hero.subheading')}
          </p>
          <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed uppercase">
            {t('hero.subheading2')}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
            <Phone className="w-4 h-4" />
            {personalInfo.phone}
          </span>
        </motion.div>

        {/* Personal Photo */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative mx-auto w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
            <div className="absolute inset-0 bg-gradient-to-br from-golden-orange to-golden-orange-dark rounded-full animate-pulse"></div>
            <img
              src="/images/myself.png"
              alt={personalInfo.name}
              className="relative w-full h-full object-cover rounded-full border-4 border-golden-orange/30 shadow-2xl"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-golden-orange via-golden-orange-light to-golden-orange rounded-full opacity-30 blur-lg animate-pulse"></div>
          </div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-golden-orange via-white to-golden-orange-light bg-clip-text text-transparent"
        >
          {personalInfo.name}
        </motion.h1>

        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-4 text-golden-orange-light">
            {personalInfo.title}
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            {personalInfo.tagline}
          </p>
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          {personalInfo.summary}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a
            href={sanitizedEmail ? `mailto:${sanitizedEmail}` : '#'}
            className={`group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-golden-orange to-golden-orange-dark text-white font-semibold rounded-xl transition-all duration-300 ${
              sanitizedEmail
                ? 'hover:from-golden-orange-dark hover:to-golden-orange hover:scale-105 hover:shadow-2xl hover:shadow-golden-orange/25'
                : 'opacity-60 cursor-not-allowed'
            }`}
            aria-disabled={!sanitizedEmail}
          >
            <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            {t('hero.getInTouch')}
          </a>
          <a
            href={sanitizedLinkedIn || '#'}
            target={sanitizedLinkedIn ? '_blank' : undefined}
            rel={sanitizedLinkedIn ? 'noopener noreferrer' : undefined}
            className={`group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-golden-orange/20 to-golden-orange/30 text-golden-orange border-2 border-golden-orange font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm ${
              sanitizedLinkedIn
                ? 'hover:from-golden-orange/30 hover:to-golden-orange/40 hover:scale-105 hover:shadow-2xl hover:shadow-golden-orange/25'
                : 'opacity-60 cursor-not-allowed'
            }`}
            aria-disabled={!sanitizedLinkedIn}
          >
            <Linkedin className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            {t('hero.linkedinProfile')}
          </a>
        </motion.div>

        {taglineSegments && taglineSegments.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {taglineSegments.map((segment, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm md:text-base text-white/85 backdrop-blur-sm"
              >
                {segment}
              </span>
            ))}
          </motion.div>
        )}

        <motion.button
          variants={itemVariants}
          onClick={scrollToNext}
          className="group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDown className="w-8 h-8 text-white/70 group-hover:text-white transition-colors duration-300 animate-bounce" />
        </motion.button>
      </motion.div>

      {/* Parallax scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
