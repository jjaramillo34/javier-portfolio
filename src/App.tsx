import { useEffect } from 'react';
import { usePortfolioData } from './hooks/usePortfolioData';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import VerticalNavigation from './components/VerticalNavigation';
import Loading from './components/Loading';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Certifications from './components/sections/Certifications';
import Testimonials from './components/sections/Testimonials';
import Contact from './components/sections/Contact';
import Footer from './components/sections/Footer';

function AppContent() {
  const { data, loading, error } = usePortfolioData();

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
          <p className="text-xl text-gray-300 mb-8">
            {error || 'Failed to load portfolio data'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-green-500 rounded-lg font-semibold hover:from-orange-600 hover:to-green-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex">
        <VerticalNavigation />
        
        <main className="flex-1">
          <section id="hero">
            <Hero personalInfo={data.personalInfo} />
          </section>
          
          <section id="about">
            <About 
              personalInfo={data.personalInfo} 
              achievements={data.achievements} 
            />
          </section>
          
          <section id="experience">
            <Experience workExperience={data.workExperience} />
          </section>
          
          <section id="projects">
            <Projects projects={data.projects} />
          </section>
          
          <section id="skills">
            <Skills skills={data.skills} />
          </section>
          
          <section id="certifications">
            <Certifications certifications={data.certifications} />
          </section>
          
          <section id="testimonials">
            <Testimonials testimonials={data.testimonials} />
          </section>
          
          <section id="contact">
            <Contact personalInfo={data.personalInfo} />
          </section>
          
          <Footer personalInfo={data.personalInfo} />
        </main>
      </div>
    </div>
  );
}

function App() {
  const { data, loading } = usePortfolioData();

  if (loading || !data) {
    return <Loading />;
  }

  return (
    <ThemeProvider>
      <LanguageProvider translations={data.translations}>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
