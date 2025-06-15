import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { Quote, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '../../types/portfolio';
import { useLanguage } from '../../contexts/LanguageContext';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { t } = useLanguage();
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const filterOptions = [
    { key: 'all', label: t('testimonials.filterAll') },
    { key: 'manager', label: t('testimonials.filterManager') },
    { key: 'colleague', label: t('testimonials.filterColleague') },
    { key: 'teacher', label: t('testimonials.filterTeacher') },
    { key: 'client', label: t('testimonials.filterClient') },
  ];

  const filteredTestimonials = activeFilter === 'all' 
    ? testimonials 
    : testimonials.filter(testimonial => testimonial.relationshipType === activeFilter);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
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

  const getRelationshipTypeLabel = (type: string) => {
    return t(`testimonials.relationshipTypes.${type}`);
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-golden-orange to-golden-orange-dark bg-clip-text text-transparent">
            {t('testimonials.heading')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('testimonials.subheading')}
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => {
                setActiveFilter(option.key);
                setCurrentIndex(0);
              }}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === option.key
                  ? 'bg-gradient-to-r from-golden-orange to-golden-orange-dark text-white shadow-lg shadow-golden-orange/25 scale-105'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-golden-orange/5 dark:hover:bg-golden-orange/10 hover:text-golden-orange border border-golden-orange/20 dark:border-golden-orange/20'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              {option.label}
            </button>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div variants={itemVariants} className="relative">
          {filteredTestimonials.length > 0 && (
            <>
              {/* Main Testimonial */}
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
                <motion.div
                  key={`${activeFilter}-${currentIndex}`}
                  className="p-8 md:p-12"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Quote Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-green-500 rounded-full flex items-center justify-center">
                        <Quote className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        "{filteredTestimonials[currentIndex]?.quote}"
                      </blockquote>
                      
                      {/* Author Info */}
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                        <div className="flex items-start gap-4">
                          {/* Avatar Placeholder */}
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">
                              {filteredTestimonials[currentIndex]?.name.charAt(0)}
                            </span>
                          </div>
                          
                          {/* Details */}
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                              {filteredTestimonials[currentIndex]?.name}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                              {filteredTestimonials[currentIndex]?.position}
                            </p>
                            <p className="text-gray-500 dark:text-gray-500">
                              {t('testimonials.at')} {filteredTestimonials[currentIndex]?.company}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm bg-gradient-to-r from-orange-100 to-green-100 dark:from-orange-900 dark:to-green-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full">
                                {getRelationshipTypeLabel(filteredTestimonials[currentIndex]?.relationshipType || '')}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {filteredTestimonials[currentIndex]?.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Navigation Controls */}
              {filteredTestimonials.length > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={prevTestimonial}
                    className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  {/* Dots Indicator */}
                  <div className="flex gap-2">
                    {filteredTestimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? 'bg-gradient-to-r from-orange-500 to-green-500 scale-125'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextTestimonial}
                    className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}

              {/* Counter */}
              <div className="text-center mt-6">
                <p className="text-gray-500 dark:text-gray-400">
                  {currentIndex + 1} / {filteredTestimonials.length} testimonials
                </p>
              </div>
            </>
          )}
        </motion.div>

        {/* All Testimonials Grid (Optional - for showing more) */}
        {filteredTestimonials.length > 3 && (
          <motion.div variants={itemVariants} className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              All {filterOptions.find(f => f.key === activeFilter)?.label} Testimonials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4 sm:px-6">
              {filteredTestimonials.slice(0, 6).map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                  
                  <blockquote className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    "{expandedCards.has(testimonial.id) 
                      ? testimonial.quote 
                      : truncateText(testimonial.quote)
                    }"
                  </blockquote>
                  
                  {testimonial.quote.length > 200 && (
                    <button
                      onClick={() => toggleExpanded(testimonial.id)}
                      className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mt-2 font-medium"
                    >
                      {expandedCards.has(testimonial.id) 
                        ? t('testimonials.readLess')
                        : t('testimonials.readMore')
                      }
                    </button>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      {getRelationshipTypeLabel(testimonial.relationshipType)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {testimonial.date}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Testimonials;
