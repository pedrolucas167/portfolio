import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner, FaDownload, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  showDownload?: boolean;
}

// Type declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognition = any;

// Check if chatbot API is available (Vercel or localhost, not GitHub Pages)
function isChatbotAvailable(): boolean {
  const hostname = window.location.hostname;
  // Only available on Vercel or localhost, not on GitHub Pages
  return hostname.includes('vercel.app') || hostname === 'localhost' || hostname === '127.0.0.1';
}

export function Chatbot() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setIsAvailable(isChatbotAvailable());
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = i18n.language === 'pt' ? 'pt-BR' : i18n.language;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [i18n.language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.lang = i18n.language === 'pt' ? 'pt-BR' : i18n.language;
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Don't render if chatbot is not available (e.g., GitHub Pages)
  if (!isAvailable) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const RESUME_URL = `${import.meta.env.BASE_URL}resume/resume_pedromarques.pdf`;

  const isResumeRequest = (text: string): boolean => {
    const lower = text.toLowerCase();
    const keywords = [
      'currículo', 'curriculo', 'curriculum', 'resume', 'cv',
      'baixar', 'download', 'lebenslauf', '简历', 'descargar'
    ];
    return keywords.some(kw => lower.includes(kw));
  };

  const triggerDownload = () => {
    const a = document.createElement('a');
    a.href = RESUME_URL;
    a.download = 'resume_pedro_marques.pdf';
    a.click();
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    const userMessage: Message = { role: 'user', content: currentInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    if (isResumeRequest(currentInput)) {
      triggerDownload();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t('chatbot_resume_response'),
        showDownload: true,
      }]);
      return;
    }

    setIsLoading(true);

    const API_URL = import.meta.env.PROD 
      ? '/api/chat' 
      : 'http://localhost:3001/api/chat';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInput,
          language: i18n.language 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: t('chatbot_error') }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: t('chatbot_error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
        title={t('chatbot_open')}
      >
        <FaRobot size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaRobot className="text-white" size={20} />
          <div>
            <h3 className="text-white font-semibold">{t('chatbot_title')}</h3>
            <p className="text-cyan-100 text-xs">{t('chatbot_subtitle')}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-cyan-200 transition-colors"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-900">
        {messages.length === 0 && (
          <div className="flex flex-col items-center text-gray-400 py-6 gap-4">
            <FaRobot size={40} className="text-cyan-500" />
            <p className="text-center text-sm">{t('chatbot_welcome')}</p>
            <div className="flex flex-wrap justify-center gap-2 w-full mt-1">
              {(['chatbot_suggestion_1', 'chatbot_suggestion_2', 'chatbot_suggestion_3', 'chatbot_suggestion_resume'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => { setInput(t(key)); }}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/70 px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-gray-800 text-gray-200 border border-gray-700'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.showDownload && (
                <button
                  onClick={triggerDownload}
                  className="mt-2 flex items-center gap-2 text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-full transition-all duration-200 w-full justify-center"
                >
                  <FaDownload size={11} />
                  {t('chatbot_resume_download_btn')}
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-3 rounded-2xl border border-gray-700">
              <FaSpinner className="animate-spin text-cyan-500" size={16} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chatbot_placeholder')}
            className="flex-1 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={toggleRecording}
            disabled={isLoading}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            {isRecording ? <FaMicrophoneSlash size={18} /> : <FaMicrophone size={18} />}
          </button>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
