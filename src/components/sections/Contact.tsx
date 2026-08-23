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
    threshold: 0.05,
    rootMargin: '120px 0px',
  });
  const { t } = useLanguage();

  const FORM_ID = import.meta.env.VITE_FORMSPREE_ID;
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const isLocalHost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const showCaptcha = Boolean(RECAPTCHA_SITE_KEY) && !isLocalHost;

  const [state, handleSubmit] = useForm(FORM_ID);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const submissionError = Array.isArray(state.errors) ? state.errors[0]?.message : null;

  const label = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const contactInfo = useMemo(() => {
    const entries = [
      personalInfo.email && {
        icon: Mail,
        label: label('contact.emailLabel', 'Email'),
        value: personalInfo.email,
        href: `mailto:${personalInfo.email}`,
        external: false,
      },
      personalInfo.phone && {
        icon: Phone,
        label: label('contact.phoneLabel', 'Phone'),
        value: personalInfo.phone,
        href: `tel:${personalInfo.phone}`,
        external: false,
      },
      personalInfo.location && {
        icon: MapPin,
        label: label('contact.locationLabel', 'Location'),
        value: personalInfo.location,
        href: null,
        external: false,
      },
      personalInfo.linkedin && {
        icon: Linkedin,
        label: 'LinkedIn',
        value: label('hero.linkedinProfile', 'LinkedIn Profile'),
        href: personalInfo.linkedin,
        external: true,
      },
    ];
    return entries.filter(Boolean) as {
      icon: typeof Mail;
      label: string;
      value: string;
      href: string | null;
      external: boolean;
    }[];
  }, [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, t]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } },
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
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-golden-orange to-golden-orange-dark bg-clip-text text-transparent"
          >
            {t('contact.heading')}
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-golden-orange to-golden-orange-dark mx-auto mb-8" />
          <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('contact.subheading')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start"
          >
            {contactInfo.map((contact) => {
              const content = (
                <>
                  <div className="p-3 bg-gradient-to-br from-golden-orange to-golden-orange-dark rounded-xl text-white">
                    <contact.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-white">{contact.label}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{contact.value}</p>
                  </div>
                </>
              );

              const className = 'flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm';

              if (!contact.href) {
                return (
                  <div key={contact.label} className={className}>
                    {content}
                  </div>
                );
              }

              return (
                <a
                  key={contact.label}
                  href={contact.href}
                  className={`${className} hover:border-golden-orange/40 transition-colors`}
                  target={contact.external ? '_blank' : undefined}
                  rel={contact.external ? 'noopener noreferrer' : undefined}
                >
                  {content}
                </a>
              );
            })}
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {label('contact.sendAMessage', 'Send a message')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              {t('contact.messagePlaceholder')}
            </p>

            {state.succeeded ? (
              <div className="flex items-start gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-3 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{label('contact.successTitle', 'Message sent')}</p>
                  <p className="text-sm">
                    {label('contact.success', 'Thanks for reaching out. I’ll get back to you shortly.')}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
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
                {showCaptcha && (
                  <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={setCaptcha} />
                )}
                <button
                  type="submit"
                  disabled={(showCaptcha && !captcha) || state.submitting}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-golden-orange to-golden-orange-dark text-white px-6 py-3 rounded-lg font-semibold hover:from-golden-orange-dark hover:to-golden-orange transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
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
