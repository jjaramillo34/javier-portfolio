import { Mail, Linkedin } from 'lucide-react';
import { PersonalInfo } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';

interface FooterProps {
  personalInfo: PersonalInfo;
}

const Footer = ({ personalInfo }: FooterProps) => {
  const { t, language } = useLanguage();
  const year = new Date().getFullYear();

  const label = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const credit = label(
    'footer.credit',
    language === 'es' ? 'Hecho con React' : 'Built with React'
  );
  const links = [
    personalInfo.email && {
      href: `mailto:${personalInfo.email}`,
      label: label('footer.email', language === 'es' ? 'Correo' : 'Email'),
      icon: Mail,
      external: false,
    },
    personalInfo.linkedin && {
      href: personalInfo.linkedin,
      label: label('footer.linkedin', 'LinkedIn'),
      icon: Linkedin,
      external: true,
    },
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: typeof Mail;
    external: boolean;
  }>;

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="h-0.5 bg-gradient-to-r from-golden-orange via-golden-orange-light to-golden-orange-dark" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {personalInfo.name}
            </p>
            {personalInfo.title && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {personalInfo.title}
              </p>
            )}
          </div>

          {links.length > 0 && (
            <nav aria-label={label('footer.connect', language === 'es' ? 'Conectar' : 'Connect')} className="flex items-center gap-3">
              {links.map(({ href, label: linkLabel, icon: Icon, external }) => (
                <a
                  key={linkLabel}
                  href={href}
                  aria-label={linkLabel}
                  title={linkLabel}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:text-golden-orange hover:border-golden-orange/50 hover:bg-golden-orange/10 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </nav>
          )}
        </div>

        <p className="mt-8 text-sm text-gray-400 dark:text-gray-500">
          © {year} {personalInfo.name}
          {credit ? ` · ${credit}` : ''}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
