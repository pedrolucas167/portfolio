import { useState, FormEvent } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaCheck, FaGithub, FaLinkedin } from 'react-icons/fa';
import { Button, Input, Textarea } from '../ui';
import { useIntersectionObserver } from '../../hooks';
import { socialLinks } from '../../data';

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

  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Assunto é obrigatório';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
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
      setSubmitError('Ocorreu um erro ao enviar a mensagem. Tente novamente.');
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

  return (
    <section id="contato" className="py-20 bg-gray-50 dark:bg-dark-bg">
      <div className="container mx-auto px-6 max-w-6xl">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Entre em <span className="text-accent">Contato</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Tem um projeto em mente? Vamos conversar!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Vamos trabalhar juntos?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Estou sempre aberto a novas oportunidades e projetos interessantes. 
                  Se você tem uma ideia ou precisa de ajuda com desenvolvimento, 
                  não hesite em entrar em contato!
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-xl hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="p-3 bg-accent/20 rounded-lg group-hover:bg-accent/30 transition-colors">
                    <FaEnvelope className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">E-mail</p>
                    <p className="text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                      {socialLinks.email}
                    </p>
                  </div>
                </a>

                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-xl hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                    <FaGithub className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">GitHub</p>
                    <p className="text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                      @pedrolucas167
                    </p>
                  </div>
                </a>

                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-xl hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <FaLinkedin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">LinkedIn</p>
                    <p className="text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                      /in/pedrolucas167
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-xl">
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <FaMapMarkerAlt className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Localização</p>
                    <p className="text-gray-900 dark:text-white">Brasil</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 lg:p-8 shadow-md border border-gray-100 dark:border-dark-border">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                    <FaCheck className="w-8 h-8 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Mensagem Enviada!
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Obrigado pelo contato. Responderei em breve!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Nome"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={handleChange('name')}
                    error={errors.name}
                  />

                  <Input
                    label="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange('email')}
                    error={errors.email}
                  />

                  <Input
                    label="Assunto"
                    placeholder="Assunto da mensagem"
                    value={formData.subject}
                    onChange={handleChange('subject')}
                    error={errors.subject}
                  />

                  <Textarea
                    label="Mensagem"
                    placeholder="Sua mensagem..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange('message')}
                    error={errors.message}
                  />

                  {submitError && (
                    <p className="text-red-500 text-sm">{submitError}</p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Enviando...'
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
