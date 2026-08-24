import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useMemo, useState } from 'react';
import { Quote, Star } from 'lucide-react';
import { Testimonial } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '120px 0px',
  });
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const normalizedTestimonials = useMemo(
    () =>
      testimonials.map((testimonial, index) => ({
        ...testimonial,
        quote: testimonial.quote?.trim() ?? '',
        relationshipType: testimonial.relationshipType ?? 'colleague',
        date: testimonial.date ?? '',
        company: testimonial.company ?? '',
        position: testimonial.position ?? '',
        name: testimonial.name ?? 'Anonymous',
        id: testimonial.id ?? index + 1,
      })),
    [testimonials],
  );

  const availableTypes = useMemo(
    () => new Set(normalizedTestimonials.map((item) => item.relationshipType)),
    [normalizedTestimonials],
  );

  const filterOptions = [
    { key: 'all', label: t('testimonials.filterAll') },
    { key: 'manager', label: t('testimonials.filterManager') },
    { key: 'colleague', label: t('testimonials.filterColleague') },
    { key: 'teacher', label: t('testimonials.filterTeacher') },
    { key: 'client', label: t('testimonials.filterClient') },
  ].filter((option) => option.key === 'all' || availableTypes.has(option.key as Testimonial['relationshipType']));

  const filteredTestimonials =
    activeFilter === 'all'
      ? normalizedTestimonials
      : normalizedTestimonials.filter((testimonial) => testimonial.relationshipType === activeFilter);
  const featuredTestimonial =
    filteredTestimonials.find(
      (testimonial) =>
        testimonial.relationshipType === 'manager' || testimonial.relationshipType === 'client',
    ) ?? filteredTestimonials[0];
  const featuredLabel =
    t('testimonials.featured') === 'testimonials.featured'
      ? 'Featured recommendation'
      : t('testimonials.featured');

  const toggleExpanded = (id: number) => {
    setExpandedCards((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-golden-orange to-golden-orange-dark bg-clip-text text-transparent">
            {t('testimonials.heading')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-golden-orange to-golden-orange-dark mx-auto mb-8" />
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('testimonials.subheading')}
          </p>
        </motion.div>

        {filterOptions.length > 2 && (
          <motion.div
            variants={itemVariants}
            role="group"
            aria-label={t('testimonials.filterLabel')}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {filterOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setActiveFilter(option.key)}
                aria-pressed={activeFilter === option.key}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === option.key
                    ? 'bg-gradient-to-r from-golden-orange to-golden-orange-dark text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-golden-orange/40'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}

        {filteredTestimonials.length === 0 ? (
          <p className="text-center py-12 text-gray-500 dark:text-gray-400">
            {t('testimonials.none') === 'testimonials.none'
              ? 'No quotes for this filter yet.'
              : t('testimonials.none')}
          </p>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredTestimonials.map((testimonial) => {
              const isLong = testimonial.quote.length > 220;
              const isFeatured = testimonial.id === featuredTestimonial?.id;
              const relationshipLabel = t(
                `testimonials.relationshipTypes.${testimonial.relationshipType}`,
              );
              const shownQuote =
                !isLong || expandedCards.has(testimonial.id)
                  ? testimonial.quote
                  : `${testimonial.quote.slice(0, 220)}...`;

              return (
                <motion.article
                  key={testimonial.id}
                  variants={itemVariants}
                  className={`flex h-full flex-col rounded-2xl border p-6 shadow-sm ${
                    isFeatured
                      ? 'border-golden-orange/30 bg-gradient-to-br from-golden-orange/10 via-white to-white md:col-span-2 dark:from-golden-orange/15 dark:via-gray-800 dark:to-gray-800'
                      : 'border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <Quote className={`${isFeatured ? 'h-10 w-10' : 'h-8 w-8'} text-golden-orange`} />
                    {isFeatured && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-golden-orange/10 px-3 py-1 text-xs font-semibold text-golden-orange">
                        <Star className="h-3.5 w-3.5" />
                        {featuredLabel}
                      </span>
                    )}
                  </div>
                  <blockquote
                    className={`mb-4 flex-1 leading-relaxed ${
                      isFeatured
                        ? 'max-w-4xl text-lg text-gray-800 dark:text-gray-100 md:text-xl'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    “{shownQuote}”
                  </blockquote>
                  {isLong && (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(testimonial.id)}
                      className="text-sm font-medium text-golden-orange hover:text-golden-orange-dark mb-4"
                    >
                      {expandedCards.has(testimonial.id)
                        ? t('testimonials.readLess')
                        : t('testimonials.readMore')}
                    </button>
                  )}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-golden-orange to-golden-orange-dark rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {testimonial.position}
                        {testimonial.company ? ` · ${testimonial.company}` : ''}
                      </p>
                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {relationshipLabel ===
                        `testimonials.relationshipTypes.${testimonial.relationshipType}`
                          ? testimonial.relationship
                          : relationshipLabel}
                        {testimonial.date ? ` · ${testimonial.date}` : ''}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Testimonials;
