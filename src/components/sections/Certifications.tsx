import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Calendar, ExternalLink, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CertificationCategory } from '../../types/portfolio';

interface CertificationsProps {
  certifications: CertificationCategory;
}

const Certifications = ({ certifications }: CertificationsProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '120px 0px',
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  const label = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const categories = [
    { key: 'all', label: label('certifications.all', 'All') },
    { key: 'backendDevelopment', label: t('certifications.backendDevelopment') },
    { key: 'computerVisionAI', label: t('certifications.computerVisionAI') },
    { key: 'dataAnalysis', label: t('certifications.dataAnalysis') },
    { key: 'excelVBA', label: t('certifications.excelVBA') },
    { key: 'security', label: t('certifications.security') },
  ];
  const filterLabel = label('certifications.filterLabel', 'Filter certifications');
  const resultsLabel = label('certifications.results', 'Showing results');

  const allCertifications = useMemo(
    () => Object.values(certifications).flat(),
    [certifications],
  );

  const filteredCertifications = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const baseList =
      selectedCategory === 'all'
        ? allCertifications
        : (certifications[selectedCategory as keyof CertificationCategory] ?? []);

    if (!normalizedSearch) return baseList;

    return baseList.filter((cert) =>
      [cert.title, cert.institution, ...(cert.skills ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [allCertifications, certifications, searchTerm, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-golden-orange to-golden-orange-dark bg-clip-text text-transparent"
          >
            {t('certifications.heading')}
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-golden-orange to-golden-orange-dark mx-auto mb-8" />
          <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {label('certifications.subheading', 'Courses and credentials across data, development, and cloud.')}
          </motion.p>
        </motion.div>

        <div className="flex flex-col gap-5 mb-10">
          <div className="relative max-w-md mx-auto w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              aria-label={label('certifications.searchLabel', 'Search certifications')}
              placeholder={label('certifications.search', 'Search certifications...')}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white"
            />
          </div>
          <div
            className="flex flex-wrap justify-center gap-2"
            role="group"
            aria-label={filterLabel}
          >
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                aria-pressed={selectedCategory === category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
                  selectedCategory === category.key
                    ? 'bg-gradient-to-r from-golden-orange to-golden-orange-dark text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-golden-orange/40'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {resultsLabel}: {filteredCertifications.length} / {allCertifications.length}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredCertifications.map((cert, index) => {
            const showCredentialLink = cert.link && cert.link !== '#';
            return (
              <motion.article
                key={cert.id ?? `${cert.title}-${index}`}
                variants={itemVariants}
                className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white leading-tight mb-2">
                      {cert.title}
                    </h3>
                    <p className="text-sm font-medium text-golden-orange">{cert.institution}</p>
                    <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Calendar className="w-4 h-4" />
                      {t('certifications.issued')}: {cert.issueDate}
                    </p>
                  </div>
                  <div className="p-2 bg-golden-orange/10 rounded-xl">
                    <Award className="w-5 h-5 text-golden-orange" />
                  </div>
                </div>

                {cert.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    {cert.description}
                  </p>
                )}

                {(cert.skills ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-golden-orange/10 text-golden-orange-dark dark:text-golden-orange text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {showCredentialLink && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-golden-orange hover:text-golden-orange-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                  >
                    {t('certifications.viewCredential')}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </motion.article>
            );
          })}
        </motion.div>

        {filteredCertifications.length === 0 && (
          <p className="text-center py-12 text-gray-500 dark:text-gray-400">
            {label('certifications.none', 'No certifications match this filter.')}
          </p>
        )}
      </div>
    </section>
  );
};

export default Certifications;
