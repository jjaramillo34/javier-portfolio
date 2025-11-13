import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Calendar, ExternalLink, Search, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CertificationCategory, Certification } from '../../types/portfolio';

interface CertificationsProps {
  certifications: CertificationCategory;
}

const Certifications = ({ certifications }: CertificationsProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const categories = [
    { key: 'all', label: 'All Certifications' },
    { key: 'backendDevelopment', label: t('certifications.backendDevelopment') },
    { key: 'computerVisionAI', label: t('certifications.computerVisionAI') },
    { key: 'dataAnalysis', label: t('certifications.dataAnalysis') },
    { key: 'excelVBA', label: t('certifications.excelVBA') },
    { key: 'security', label: t('certifications.security') },
  ];

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

    if (!normalizedSearch) {
      return baseList;
    }

    return baseList.filter((cert) =>
      [cert.title, cert.institution, ...(cert.skills ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [allCertifications, certifications, searchTerm, selectedCategory]);

  const totalCertifications = allCertifications.length;
  const displayedCertifications = filteredCertifications.length;
  const hasActiveFilters = selectedCategory !== 'all' || searchTerm.trim() !== '';
  const activeCategoryLabel =
    categories.find((category) => category.key === selectedCategory)?.label ?? categories[0]?.label;
  const searchPlaceholder =
    selectedCategory === 'all'
      ? 'Search certifications...'
      : `Search ${activeCategoryLabel?.toLowerCase()}...`;

  const getInstitutionColor = (institution: string): string => {
    const colors = {
      'Nucamp': 'from-blue-500 to-blue-600',
      'Coderhouse': 'from-purple-500 to-purple-600',
      'Udemy': 'from-orange-500 to-red-500',
      'Coursera': 'from-blue-600 to-indigo-600',
      'PyImageSearch': 'from-green-500 to-teal-500',
      'Coders Data': 'from-gray-600 to-gray-700',
      'Esri': 'from-green-600 to-green-700',
      'General Assembly': 'from-red-500 to-pink-500',
    };
    return colors[institution as keyof typeof colors] || 'from-golden-orange to-golden-orange-dark';
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-golden-orange/20 to-golden-orange-light/20 dark:from-golden-orange/10 dark:to-golden-orange-light/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-golden-orange-light/20 to-golden-orange/20 dark:from-golden-orange-light/10 dark:to-golden-orange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-golden-orange to-golden-orange-dark bg-clip-text text-transparent"
          >
            {t('certifications.heading')}
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-golden-orange to-golden-orange-dark mx-auto mb-8"></motion.div>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Professional certifications and continuous learning across diverse technology domains
          </motion.p>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <motion.div variants={itemVariants} className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-gray-800 dark:text-white"
              />
            </motion.div>

            {/* Category Filter */}
            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-gray-800 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300 mt-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full">
              <Award className="w-4 h-4 text-golden-orange" />
              <span>
                Showing <strong>{displayedCertifications}</strong> of{' '}
                <strong>{totalCertifications}</strong> certifications
              </span>
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                className="text-golden-orange hover:text-golden-orange-dark font-semibold transition-colors"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Certifications Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {filteredCertifications.map((cert, index) => {
            const showCredentialLink = cert.link && cert.link !== '#';
            return (
            <motion.div
              key={cert.id ?? `${cert.title}-${index}`}
              variants={cardVariants}
              whileHover="hover"
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              {/* Card header with gradient */}
              <div className={`h-2 bg-gradient-to-r ${getInstitutionColor(cert.institution)}`}></div>
              
              <div className="p-6">
                {/* Certificate header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 leading-tight">
                      {cert.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-semibold">{cert.institution}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{t('certifications.issued')}: {cert.issueDate}</span>
                    </div>
                  </div>
                  <motion.div
                    className={`p-3 bg-gradient-to-br ${getInstitutionColor(cert.institution)} rounded-xl`}
                    whileHover={{ rotate: 12 }}
                  >
                    <Award className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                {/* Credential ID */}
                {cert.credentialId && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">{t('certifications.credentialId')}:</span> {cert.credentialId}
                    </p>
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  {cert.description}
                </p>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('certifications.skills')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {(cert.skills ?? []).map((skill, skillIndex) => (
                      <motion.span
                        key={skillIndex}
                        className={`px-3 py-1 bg-gradient-to-r ${getInstitutionColor(cert.institution)} bg-opacity-10 text-xs font-medium rounded-full border border-orange-200 dark:border-orange-800 text-white dark:text-white`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                        transition={{ delay: index * 0.1 + skillIndex * 0.05 + 0.5 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* View Credential Link */}
                {showCredentialLink && (
                  <motion.a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getInstitutionColor(cert.institution)} hover:opacity-90 text-white text-sm font-semibold rounded-lg transition-all duration-300 group-hover:shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{t('certifications.viewCredential')}</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.a>
                )}
              </div>

              {/* Decorative elements */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${getInstitutionColor(cert.institution)} opacity-5 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500`}></div>
            </motion.div>
            );
          })}
        </motion.div>

        {/* No results message */}
        {filteredCertifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No certifications found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Certifications;
