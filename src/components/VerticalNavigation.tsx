import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Briefcase, 
  FolderOpen, 
  Code, 
  Award, 
  MessageSquareQuote,
  Mail, 
  Sun, 
  Moon,
  Heart
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const VerticalNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: 'hero', label: t('navigation.home'), icon: Home },
    { id: 'about', label: t('navigation.about'), icon: User },
    { id: 'experience', label: t('navigation.experience'), icon: Briefcase },
    { id: 'projects', label: t('navigation.projects'), icon: FolderOpen },
    { id: 'skills', label: t('navigation.skills'), icon: Code },
    { id: 'certifications', label: t('navigation.certifications'), icon: Award },
    { id: 'testimonials', label: t('navigation.testimonials'), icon: MessageSquareQuote },
    { id: 'contact', label: t('navigation.contact'), icon: Mail },
    { id: 'motivation', label: t('motivation.heading'), icon: Heart },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const currentSection = sections.find(section => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, isOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (isMobile) setIsOpen(false);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <motion.button
          className="fixed top-6 left-6 z-50 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg border border-golden-orange/20"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-golden-orange" />
          ) : (
            <Menu className="w-6 h-6 text-golden-orange" />
          )}
        </motion.button>
      )}

      {/* Navigation Sidebar */}
      <motion.nav
        className={`fixed left-0 top-0 h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-r border-golden-orange/20 shadow-2xl z-40 ${
          isMobile ? 'w-full max-w-xs overflow-x-hidden' : 'w-20 lg:w-24'
        }`}
        variants={sidebarVariants}
        initial={isMobile ? "closed" : "open"}
        animate={isMobile ? (isOpen ? "open" : "closed") : "open"}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Profile Section */}
          <motion.div
            className="pt-8 pb-6 px-3 lg:px-4 flex justify-center"
            initial={isMobile ? "closed" : "open"}
            animate={isMobile ? (isOpen ? "open" : "closed") : "open"}
            variants={itemVariants}
          >
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-golden-orange to-golden-orange-dark rounded-2xl flex items-center justify-center shadow-lg shadow-golden-orange/25">
              <span className="text-white font-bold text-xl lg:text-2xl">J</span>
            </div>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex-1 px-2 lg:px-3 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  custom={index}
                  initial={isMobile ? "closed" : "open"}
                  animate={isMobile ? (isOpen ? "open" : "closed") : "open"}
                >
                  <motion.button
                    onClick={() => scrollToSection(item.id)}
                    className={`relative w-full p-3 lg:p-4 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-gradient-to-r from-golden-orange to-golden-orange-dark text-white shadow-lg shadow-golden-orange/25'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-golden-orange/10 dark:hover:bg-golden-orange/10 hover:text-golden-orange dark:hover:text-golden-orange'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Icon */}
                    <Icon className="w-6 h-6 lg:w-7 lg:h-7 mx-auto" />
                    
                    {/* Label for mobile */}
                    {isMobile && (
                      <span className="block mt-2 text-sm font-medium">{item.label}</span>
                    )}
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute -right-2 top-0 bottom-0 my-auto w-2 h-full bg-gradient-to-b from-golden-orange to-golden-orange-dark rounded-l-full shadow-lg shadow-golden-orange/30"
                        layoutId="activeIndicator"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    
                    {/* Tooltip for desktop */}
                    {!isMobile && (
                      <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                        {item.label}
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                      </div>
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* Control Buttons */}
          <div className="pb-8 px-2 lg:px-3 space-y-3">
            {/* Language Toggle */}
            <motion.button
              onClick={toggleLanguage}
              className={`relative w-full p-3 lg:p-4 rounded-2xl transition-all duration-300 group ${
                language === 'es'
                  ? 'bg-gradient-to-r from-golden-orange to-golden-orange-dark text-white shadow-lg shadow-golden-orange/25'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-golden-orange/10 dark:hover:bg-golden-orange/10 hover:text-golden-orange dark:hover:text-golden-orange'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={isMobile ? "closed" : "open"}
              animate={isMobile ? (isOpen ? "open" : "closed") : "open"}
              variants={itemVariants}
              title={`Language: ${language === 'en' ? 'English' : 'Español'} - Click to switch`}
            >
              <div className="flex flex-col items-center justify-center text-xs lg:text-sm font-medium">
                <span className="text-lg lg:text-xl mb-1">{language === 'en' ? '🇺🇸' : '🇪🇸'}</span>
                <span className="text-xs">{language === 'en' ? 'EN' : 'ES'}</span>
              </div>
              
              {/* Mobile Label */}
              {isMobile && (
                <span className="block mt-1 text-sm font-medium">
                  {language === 'en' ? 'English' : 'Español'}
                </span>
              )}
              
              {/* Active Indicator */}
              {language === 'es' && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-golden-orange to-golden-orange-dark rounded-l-full" />
              )}
              
              {/* Tooltip for desktop */}
              {!isMobile && (
                <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                  {language === 'en' ? 'Switch to Español' : 'Switch to English'}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                </div>
              )}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="w-full p-3 lg:p-4 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-golden-orange/10 dark:hover:bg-golden-orange/10 hover:text-golden-orange dark:hover:text-golden-orange transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={isMobile ? "closed" : "open"}
              animate={isMobile ? (isOpen ? "open" : "closed") : "open"}
              variants={itemVariants}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6 lg:w-7 lg:h-7 mx-auto" />
              ) : (
                <Moon className="w-6 h-6 lg:w-7 lg:h-7 mx-auto" />
              )}
              
              {/* Mobile Label */}
              {isMobile && (
                <span className="block mt-2 text-sm font-medium">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
              
              {/* Tooltip for desktop */}
              {!isMobile && (
                <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                </div>
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content Spacer for Desktop */}
      {!isMobile && <div className="w-20 lg:w-24 flex-shrink-0" />}
    </>
  );
};

export default VerticalNavigation;
