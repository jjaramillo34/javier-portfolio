import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Linkedin, MapPin, Phone, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { PersonalInfo } from '../../types/portfolio';
import { useMemo, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useForm } from '@formspree/react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ContactProps {
  personalInfo: PersonalInfo;
}

const Contact = ({ personalInfo }: ContactProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { t } = useLanguage();

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
  };

  const FORM_ID = import.meta.env.VITE_FORMSPREE_ID;
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const [state, handleSubmit] = useForm(FORM_ID);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const submissionError = Array.isArray(state.errors) ? state.errors[0]?.message : null;
  const contactInfo = useMemo(() => {
    const entries = [
      personalInfo.email && {
        icon: Mail,
        label: t('contact.emailLabel') ?? 'Email',
        value: personalInfo.email,
        href: `mailto:${personalInfo.email}`,
        color: 'from-orange-500 to-orange-600',
      },
      personalInfo.phone && {
        icon: Phone,
        label: 'Phone',
        value: personalInfo.phone,
        href: `tel:${personalInfo.phone}`,
        color: 'from-green-500 to-green-600',
      },
      personalInfo.location && {
        icon: MapPin,
        label: 'Location',
        value: personalInfo.location,
        href: '#',
        color: 'from-golden-orange to-golden-orange-dark',
      },
      personalInfo.linkedin && {
        icon: Linkedin,
        label: 'LinkedIn',
        value: t('hero.linkedinProfile') ?? 'LinkedIn',
        href: personalInfo.linkedin,
        color: 'from-golden-orange-dark to-golden-orange',
      },
    ];
    return entries.filter(Boolean) as {
      icon: typeof Mail;
      label: string;
      value: string;
      href: string;
      color: string;
    }[];
  }, [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, t]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-golden-orange/20 to-golden-orange-light/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-golden-orange-light/20 to-golden-orange/20 rounded-full blur-3xl"></div>
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
            {t('contact.heading')}
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-golden-orange to-golden-orange-dark mx-auto mb-8"></motion.div>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('contact.subheading')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-2xl font-bold text-gray-800 dark:text-white mb-8"
            >
              {t('contact.getInTouch')}
            </motion.h3>

            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8"
            >
              {t('contact.subheading')}
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((contact, index) => (
                <motion.a
                  key={index}
                  href={contact.href}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200"
                  target={contact.label === 'LinkedIn' ? '_blank' : undefined}
                  rel={contact.label === 'LinkedIn' ? 'noopener noreferrer' : undefined}
                >
                  <div className={`p-3 bg-gradient-to-br ${contact.color} rounded-xl text-white group-hover:scale-110 transition-transform duration-300`}>
                    <contact.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                      {contact.label}
                    </p>
                    <p className="text-gray-600 text-sm">{contact.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {t('contact.getInTouch')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('contact.messagePlaceholder')}
                </p>
              </div>
            </div>
            {state.succeeded ? (
              <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{t('contact.sendMessage')}</p>
                  <p className="text-sm text-green-600">
                    Thanks for reaching out! I’ll get back to you shortly.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.nameLabel')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.emailLabel')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.messageLabel')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  />
                </div>
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={setCaptcha}
                />
                <button
                  type="submit"
                  disabled={!captcha || state.submitting}
                  className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                      {t('contact.sendMessage')}
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('contact.sendMessage')}
                    </>
                  )}
                </button>
                {submissionError && (
                  <div className="flex items-start gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    <span>{submissionError}</span>
                  </div>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default Contact;
