import { motion } from 'framer-motion';
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
  Heart,
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
    { id: 'certifications', label: language === 'es' ? 'Cursos' : 'Certs', icon: Award },
    { id: 'testimonials', label: language === 'es' ? 'Voces' : 'Quotes', icon: MessageSquareQuote },
    { id: 'motivation', label: language === 'es' ? 'Historia' : 'Story', icon: Heart },
    { id: 'contact', label: t('navigation.contact'), icon: Mail },
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
      const sections = navItems
        .map((item) => document.getElementById(item.id))
        .filter((section): section is HTMLElement => Boolean(section));

      const currentSection = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [language]);

  useEffect(() => {
    document.body.style.overflow = isMobile && isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, isOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (isMobile) setIsOpen(false);
    }
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    closed: {
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  return (
    <>
      {isMobile && (
        <button
          type="button"
          className="fixed top-6 left-6 z-50 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg border border-golden-orange/20"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-golden-orange" />
          ) : (
            <Menu className="w-6 h-6 text-golden-orange" />
          )}
        </button>
      )}

      {isMobile && isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-gray-950/50 backdrop-blur-[1px]"
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <motion.nav
        id="primary-navigation"
        className={`fixed left-0 top-0 h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-r border-golden-orange/20 shadow-2xl z-40 ${
          isMobile ? 'w-full max-w-xs overflow-x-hidden' : 'w-24'
        }`}
        variants={sidebarVariants}
        initial={isMobile ? 'closed' : 'open'}
        animate={isMobile ? (isOpen ? 'open' : 'closed') : 'open'}
        aria-label="Primary"
      >
        <div className="flex flex-col h-full">
          <div className="pt-6 pb-4 px-3 flex justify-center">
            <button
              type="button"
              onClick={() => scrollToSection('hero')}
              className="w-12 h-12 bg-gradient-to-br from-golden-orange to-golden-orange-dark rounded-2xl flex items-center justify-center shadow-lg shadow-golden-orange/25"
              aria-label={t('navigation.home')}
            >
              <span className="text-white font-bold text-xl">J</span>
            </button>
          </div>

          <div className="flex-1 px-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  aria-label={item.label}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative w-full px-2 py-2.5 rounded-xl transition-colors duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-golden-orange to-golden-orange-dark text-white shadow-md shadow-golden-orange/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-golden-orange/10 hover:text-golden-orange'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto" />
                  <span className={`block mt-1 text-[10px] leading-tight font-medium ${isMobile ? 'text-sm mt-2' : ''}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pb-6 pt-3 px-2 space-y-2 border-t border-golden-orange/10">
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="relative w-full px-2 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-golden-orange/10 hover:text-golden-orange transition-colors duration-200"
              title={language === 'en' ? 'Switch to Español' : 'Switch to English'}
              aria-label={language === 'en' ? 'Switch to Español' : 'Switch to English'}
            >
              <span className="block text-sm font-semibold">{language === 'en' ? 'EN' : 'ES'}</span>
              {isMobile && (
                <span className="block mt-1 text-sm font-medium">
                  {language === 'en' ? 'English' : 'Español'}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="w-full px-2 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-golden-orange/10 hover:text-golden-orange transition-colors duration-200"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 mx-auto" />
              ) : (
                <Moon className="w-5 h-5 mx-auto" />
              )}
              {isMobile && (
                <span className="block mt-2 text-sm font-medium">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {!isMobile && <div className="w-24 flex-shrink-0" />}
    </>
  );
};

export default VerticalNavigation;
