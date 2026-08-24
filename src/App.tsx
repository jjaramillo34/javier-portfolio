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
import Motivation from './components/sections/Motivation';
import Footer from './components/sections/Footer';
import ScrollToTop from './components/ScrollToTop';
import type { PortfolioData } from './types/portfolio';

function AppContent({ data }: { data: PortfolioData }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 max-w-[100vw] mx-auto overflow-x-hidden">
      <div className="flex flex-col lg:flex-row w-full">
        <VerticalNavigation />
        
        <main className="flex-1 w-full">
          <section id="hero">
            <Hero personalInfo={data.personalInfo} achievements={data.achievements} />
          </section>
          
          <section id="about">
            <About 
              personalInfo={data.personalInfo} 
              achievements={data.achievements}
              education={data.education}
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

          <Motivation />
          
          <section id="contact">
            <Contact personalInfo={data.personalInfo} />
          </section>
          
          <Footer personalInfo={data.personalInfo} />
        </main>
      </div>
      <ScrollToTop />
    </div>
  );
}

function App() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return <Loading />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
          <p className="text-xl text-gray-300 mb-8">{error || 'Failed to load portfolio data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-golden-orange to-golden-orange-dark rounded-lg font-semibold hover:from-golden-orange-dark hover:to-golden-orange transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider translations={data.translations}>
        <AppContent data={data} />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
