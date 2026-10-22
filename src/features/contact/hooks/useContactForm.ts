import { useState, useRef, useEffect, type FormEvent } from 'react';
import type { TFunction } from 'i18next';
import { submitContact } from '../api/contactClient';
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


export function useContactForm(t: TFunction) {
  const requestRef = useRef<AbortController | null>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { requestRef.current?.abort(); if (successTimer.current) clearTimeout(successTimer.current); }, []);
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

    if (requestRef.current) return;
    setIsSubmitting(true);

    try {
      const controller = new AbortController();
      requestRef.current = controller;
      await submitContact(formData, controller.signal);
      if (controller.signal.aborted) return;

      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      successTimer.current = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      if (!requestRef.current?.signal.aborted) setSubmitError(t('contact_form_submit_error'));
    } finally {
      if (!requestRef.current?.signal.aborted) setIsSubmitting(false);
      requestRef.current = null;
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


  return { formData, errors, isSubmitting, isSuccess, submitError, handleSubmit, handleChange };
}
