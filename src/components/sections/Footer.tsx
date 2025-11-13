import { motion } from 'framer-motion';
import { Heart, Mail, Linkedin, MapPin, ArrowUp } from 'lucide-react';
import { useMemo } from 'react';
import { PersonalInfo } from '../../types/portfolio';

interface FooterProps {
  personalInfo: PersonalInfo;
}

const quickLinks: Array<{ label: string; href: string }> = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

const Footer = ({ personalInfo }: FooterProps) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();
  const sanitizedEmail = personalInfo.email ?? 'hello@example.com';
  const sanitizedLocation = personalInfo.location ?? 'Remote';
  const sanitizedLinkedIn = personalInfo.linkedin ?? '#';
  const tagline =
    personalInfo.summary ||
    'Transforming data into insights and ideas into reality. Always ready for the next challenge.';
  const sortedQuickLinks = useMemo(() => quickLinks, []);

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-green-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
              {personalInfo.name}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {tagline}
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{sanitizedLocation}</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h4 className="text-xl font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3">
              {sortedQuickLinks.map(({ label, href }) => (
                <li key={label}>
                  <motion.a
                    href={href}
                    className="text-gray-400 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2 group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-1 h-1 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h4 className="text-xl font-semibold text-white">Let's Connect</h4>
            <div className="space-y-4">
              <motion.a
                href={`mailto:${sanitizedEmail}`}
                className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors duration-300 group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-2 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{sanitizedEmail}</span>
              </motion.a>
              <motion.a
                href={sanitizedLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors duration-300 group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors duration-300">
                  <Linkedin className="w-4 h-4" />
                </div>
                <span>LinkedIn Profile</span>
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-gray-400 flex items-center gap-2"
          >
            <span>© {currentYear} {personalInfo.name}. Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </motion.div>
            <span>and React.js</span>
          </motion.div>

          <motion.button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-green-500/20 hover:from-orange-500/30 hover:to-green-500/30 border border-orange-500/30 rounded-xl transition-all duration-300 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
            <span>Back to Top</span>
          </motion.button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-green-500 to-orange-500"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-orange-400 to-green-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;
