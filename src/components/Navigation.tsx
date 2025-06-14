import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, User, Briefcase, FolderOpen, Code, Mail, Award, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: 'hero', label: t('navigation.home'), icon: User },
    { id: 'about', label: t('navigation.about'), icon: User },
    { id: 'experience', label: t('navigation.experience'), icon: Briefcase },
    { id: 'projects', label: t('navigation.projects'), icon: FolderOpen },
    { id: 'skills', label: t('navigation.skills'), icon: Code },
    { id: 'certifications', label: t('navigation.certifications'), icon: Award },
    { id: 'contact', label: t('navigation.contact'), icon: Mail },
  ];

  // Add icon color map
  const iconColors = {
    hero: 'text-blue-500',
    about: 'text-green-500',
    experience: 'text-purple-500',
    projects: 'text-pink-500',
    skills: 'text-orange-500',
    certifications: 'text-yellow-500',
    contact: 'text-teal-500',
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);

      // Update active section based on scroll position
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className={`font-bold text-xl ${scrolled || theme === 'dark' ? 'text-gray-800 dark:text-white' : 'text-white'}`}>
                Javier Jaramillo
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  aria-label={item.label}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  className={`relative px-3 py-2 font-medium transition-colors duration-300 text-sm rounded-lg flex items-center gap-2
                    ${activeSection === item.id
                      ? (scrolled || theme === 'dark'
                          ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                          : 'text-orange-300 bg-orange-900/10 shadow-md')
                      : (scrolled || theme === 'dark'
                          ? 'text-gray-600 dark:text-gray-300 hover:text-orange-600'
                          : 'text-white/80 hover:text-white')}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className={`w-5 h-5 ${iconColors[item.id]}`} />
                  <span>{item.label}</span>
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-green-500"
                      layoutId="activeIndicator"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}

              {/* Controls */}
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
                {/* Language Selector */}
                <motion.div className="relative group">
                  <motion.button
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      scrolled || theme === 'dark'
                        ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Globe className="w-5 h-5" />
                  </motion.button>
                  
                  {/* Language Dropdown */}
                  <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => setLanguage('en')}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          language === 'en' ? 'text-orange-600 font-semibold' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        🇺🇸 English
                      </button>
                      <button
                        onClick={() => setLanguage('es')}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          language === 'es' ? 'text-orange-600 font-semibold' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        🇪🇸 Español
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Theme Toggle */}
                <motion.button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    scrolled || theme === 'dark'
                      ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Theme Toggle - Mobile */}
              <motion.button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  scrolled || theme === 'dark'
                    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    : 'text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  scrolled || theme === 'dark'
                    ? 'text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    : 'text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-xl border-b border-gray-200 dark:border-gray-700"
              initial={{ y: -40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -40, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    aria-label={item.label}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                    className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors duration-300 rounded-lg
                      ${activeSection === item.id
                        ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:bg-gray-50 dark:hover:bg-gray-700'}
                    `}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <item.icon className={`w-5 h-5 ${iconColors[item.id]}`} />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}

                {/* Language Selector - Mobile */}
                <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 px-6">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Language</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        language === 'en' 
                          ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      🇺🇸 English
                    </button>
                    <button
                      onClick={() => setLanguage('es')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        language === 'es' 
                          ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      🇪🇸 Español
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button for Mobile */}
      <motion.div
        className="fixed bottom-6 right-6 z-40 md:hidden"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-br from-orange-500 to-green-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </motion.div>
    </>
  );
};

export default Navigation;
