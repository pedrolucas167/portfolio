import { useState, FormEvent } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaCheck, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SectionWrapper, GlassCard } from '../ui';
import { useReveal } from '../../hooks/useReveal';
import { socialLinks, contactLinks as dataContactLinks } from '../../data'; // Import dataContactLinks
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function Contact() {
  const { t } = useTranslation(); // Initialize useTranslation
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { ref, isRevealed } = useReveal({ threshold: 0.1 });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contact_form_name_required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contact_form_email_required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact_form_email_invalid');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('contact_form_subject_required');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact_form_message_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/xeobzpbb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError(t('contact_form_submit_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const contactLinks = dataContactLinks.map(link => ({
    ...link,
    label: t(link.label),
    value: link.name === 'Location' ? t(link.value) : link.value, // Translate location value
  }));

  return (
    <SectionWrapper id="contato">
      <div 
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`transition-all duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="text-center mb-8 sm:mb-10">
          <span className="badge-premium accent mb-3 sm:mb-4 inline-block">{t('contact_badge')}</span>
          <h2 className="section-title mb-3 sm:mb-4">
            {t('contact_title_part1')}{' '}
            <span className="text-gradient-animated">{t('contact_title_part2')}</span>
          </h2>
          <p className="section-subtitle mx-auto px-2 sm:px-0">
            {t('contact_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                {t('contact_work_together_title')}
              </h3>
              <p className="text-[#94a3b8] leading-relaxed text-sm sm:text-base">
                {t('contact_work_together_text')}
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {contactLinks.map((link, index) => (
                link.href ? (
                  <a
                    key={link.name} // Corrected key
                    href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    className={`contact-link-premium transition-all duration-700 ${
                      isRevealed 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className={`icon-wrapper bg-gradient-to-br ${link.color}`}>
                      <link.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-[#64748b]">{link.label}</p>
                      <p className="text-white font-medium text-sm sm:text-base group-hover:text-[var(--color-accent)] transition-colors">
                        {link.value}
                      </p>
                    </div>
                  </a>
                ) : (
                  <div
                    key={link.name} // Corrected key
                    className={`contact-link-premium cursor-default transition-all duration-700 ${
                      isRevealed 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className={`icon-wrapper bg-gradient-to-br ${link.color}`}>
                      <link.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-[#64748b]">{link.label}</p>
                      <p className="text-white font-medium text-sm sm:text-base">{link.value}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          
          <GlassCard 
            className={`p-5 sm:p-6 lg:p-8 transition-all duration-700 delay-300 ${
              isRevealed 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center h-full py-8 sm:py-12 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center mb-4 sm:mb-6 animate-scale-in">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--color-accent)]/30 flex items-center justify-center">
                    <FaCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-accent)]" />
                  </div>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {t('contact_form_success_title')}
                </h4>
                <p className="text-[#94a3b8] text-sm sm:text-base">
                  {t('contact_form_success_message')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                
                <div className="space-y-1.5 sm:space-y-2">
                  <label 
                    htmlFor="name" 
                    className={`block text-xs sm:text-sm font-medium transition-colors ${
                      focusedField === 'name' ? 'text-[var(--color-accent)]' : 'text-[#94a3b8]'
                    }`}
                  >
                    {t('contact_form_name_label')}
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder={t('contact_form_name_placeholder')}
                    value={formData.name}
                    onChange={handleChange('name')}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`input-premium ${errors.name ? 'error' : formData.name ? 'valid' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                
                <div className="space-y-1.5 sm:space-y-2">
                  <label 
                    htmlFor="email" 
                    className={`block text-xs sm:text-sm font-medium transition-colors ${
                      focusedField === 'email' ? 'text-[var(--color-accent)]' : 'text-[#94a3b8]'
                    }`}
                  >
                    {t('contact_form_email_label')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t('contact_form_email_placeholder')}
                    value={formData.email}
                    onChange={handleChange('email')}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`input-premium ${errors.email ? 'error' : formData.email ? 'valid' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                
                <div className="space-y-1.5 sm:space-y-2">
                  <label 
                    htmlFor="subject" 
                    className={`block text-xs sm:text-sm font-medium transition-colors ${
                      focusedField === 'subject' ? 'text-[var(--color-accent)]' : 'text-[#94a3b8]'
                    }`}
                  >
                    {t('contact_form_subject_label')}
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder={t('contact_form_subject_placeholder')}
                    value={formData.subject}
                    onChange={handleChange('subject')}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    className={`input-premium ${errors.subject ? 'error' : formData.subject ? 'valid' : ''}`}
                  />
                  {errors.subject && (
                    <p className="text-red-400 text-xs mt-1">{errors.subject}</p>
                  )}
                </div>

                
                <div className="space-y-1.5 sm:space-y-2">
                  <label 
                    htmlFor="message" 
                    className={`block text-xs sm:text-sm font-medium transition-colors ${
                      focusedField === 'message' ? 'text-[var(--color-accent)]' : 'text-[#94a3b8]'
                    }`}
                  >
                    {t('contact_form_message_label')}
                  </label>
                  <textarea
                    id="message"
                    placeholder={t('contact_form_message_placeholder')}
                    rows={4}
                    value={formData.message}
                    onChange={handleChange('message')}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className={`input-premium resize-none ${errors.message ? 'error' : formData.message ? 'valid' : ''}`}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                {submitError && (
                  <div className="p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400 text-xs sm:text-sm">{submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-premium btn-primary-premium w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{t('contact_form_sending_button')}</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{t('contact_form_send_button')}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </SectionWrapper>
  );
}