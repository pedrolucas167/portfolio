import { useState, useRef, useEffect } from 'react';
import type { TFunction } from 'i18next';
import { requestChat } from '../api/chatClient';
import { downloadResume, isResumeRequest } from '../../../content/resume';
interface Message { role: 'user' | 'assistant'; content: string; showDownload?: boolean }
export function useChat(language: string, t: TFunction) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  useEffect(() => () => { requestRef.current?.abort(); requestRef.current = null; }, []);
  const sendMessage = async () => {
    if (!input.trim() || isLoading || requestRef.current) return;

    const currentInput = input;
    const userMessage: Message = { role: 'user', content: currentInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    if (isResumeRequest(currentInput)) {
      downloadResume();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t('chatbot_resume_response'),
        showDownload: true,
      }]);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await requestChat(currentInput, language, controller.signal);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      if (requestRef.current === controller) {
        setMessages(prev => [...prev, { role: 'assistant', content: t('chatbot_error') }]);
      }
    } finally {
      clearTimeout(timeout);
      if (requestRef.current === controller) {
        requestRef.current = null;
        setIsLoading(false);
      }
    }
  };


  return { messages, input, setInput, isLoading, sendMessage };
}
