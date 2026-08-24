import { Mail, Linkedin, Github, Download, Eye } from 'lucide-react';
import { PersonalInfo } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEffect, useState } from 'react';

interface FooterProps {
  personalInfo: PersonalInfo;
}

const Footer = ({ personalInfo }: FooterProps) => {
  const { t, language } = useLanguage();
  const year = new Date().getFullYear();
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  const label = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const credit = label(
    'footer.credit',
    language === 'es' ? 'Hecho con React' : 'Built with React'
  );
  const visitorLabel = label(
    'footer.visitors',
    language === 'es' ? 'Visitantes' : 'Visitors',
  );

  useEffect(() => {
    let active = true;

    fetch('/api/visitor-count')
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { count?: number | null } | null) => {
        if (active && typeof payload?.count === 'number') {
          setVisitorCount(payload.count);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);
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
    {
      href: personalInfo.github || 'https://github.com/jjaramillo34',
      label: label('footer.github', 'GitHub'),
      icon: Github,
      external: true,
    },
    {
      href: '/Javier_Jaramillo_Resume.pdf',
      label: label('footer.resume', language === 'es' ? 'Currículum' : 'Resume'),
      icon: Download,
      external: false,
      download: 'Javier_Jaramillo_Resume.pdf',
    },
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: typeof Mail;
    external: boolean;
    download?: string;
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
              {links.map(({ href, label: linkLabel, icon: Icon, external, download }) => (
                <a
                  key={linkLabel}
                  href={href}
                  aria-label={linkLabel}
                  title={linkLabel}
                  download={download}
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
        {visitorCount !== null && (
          <p className="mt-3 inline-flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {visitorLabel}: {visitorCount.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}
            </span>
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
