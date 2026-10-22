import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner, FaDownload, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { useChat } from '../hooks/useChat';
import { useSpeechInput } from '../hooks/useSpeechInput';
import { isChatbotAvailable } from '../api/chatClient';
import { downloadResume as triggerDownload } from '../../../content/resume';

export function Chatbot() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAvailable] = useState(isChatbotAvailable);
  const { messages, input, setInput, isLoading, sendMessage } = useChat(i18n.language, t);
  const { isRecording, recordingError, setRecordingError, isSpeechSupported, toggleRecording } = useSpeechInput({ isOpen, language: i18n.language, t, onTranscript: setInput });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  if (!isAvailable) return null;
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
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
          aria-label={t('chatbot_close')}
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
        {recordingError && (
          <div className="mb-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {recordingError}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setRecordingError(null);
            }}
            onKeyDown={handleKeyPress}
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
            title={isSpeechSupported ? (isRecording ? t('chatbot_voice_stop') : t('chatbot_voice_start')) : t('chatbot_voice_unsupported')}
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
