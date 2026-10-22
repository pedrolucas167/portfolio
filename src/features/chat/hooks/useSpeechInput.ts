import { useEffect, useRef, useState } from 'react';
import type { TFunction } from 'i18next';
interface RecognitionResultEvent { results: ArrayLike<ArrayLike<{ transcript: string }>> }
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type RecognitionConstructor = new () => SpeechRecognitionInstance;
declare global { interface Window { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor; } }

function getRecognitionLang(language: string): string {
  const lang = language.toLowerCase();
  if (lang.startsWith('pt')) return 'pt-BR';
  if (lang.startsWith('en')) return 'en-US';
  if (lang.startsWith('es')) return 'es-ES';
  if (lang.startsWith('de')) return 'de-DE';
  if (lang.startsWith('zh')) return 'zh-CN';
  return language;
}


export function useSpeechInput({ isOpen, language, t, onTranscript }: { isOpen: boolean; language: string; t: TFunction; onTranscript: (text: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(() => typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition));
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const voiceAttemptRef = useRef(0);
  const voiceStartingRef = useRef(false);
  const handleRecognitionError = (error: string) => {
    switch (error) {
      case 'not-allowed':
      case 'service-not-allowed':
        setRecordingError(t('chatbot_voice_permission_denied'));
        break;
      case 'no-speech':
        setRecordingError(t('chatbot_voice_no_speech'));
        break;
      case 'audio-capture':
      case 'not-found':
        setRecordingError(t('chatbot_voice_no_device'));
        break;
      default:
        setRecordingError(t('chatbot_voice_start_error'));
    }
    setIsRecording(false);
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    setIsSpeechSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getRecognitionLang(language);

    recognition.onresult = (event: RecognitionResultEvent) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (!transcript) return;
      onTranscript(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: { error: string }) => {
      handleRecognitionError(event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      voiceAttemptRef.current++;
      voiceStartingRef.current = false;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        // Ignore if already stopped
      }
      recognitionRef.current = null;
    };
  }, [language, t, onTranscript]);

  // Stop recording when the chat is closed
  useEffect(() => {
    if (!isOpen) {
      voiceAttemptRef.current++;
      voiceStartingRef.current = false;
    }
    if (!isOpen && isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore if already stopped
      }
      setIsRecording(false);
    }
  }, [isOpen, isRecording]);

  const toggleRecording = async () => {
    if (voiceStartingRef.current) return;
    if (!recognitionRef.current) {
      setRecordingError(t('chatbot_voice_unsupported'));
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
      setIsRecording(false);
      return;
    }

    setRecordingError(null);
    const attempt = ++voiceAttemptRef.current;
    const recognition = recognitionRef.current;
    voiceStartingRef.current = true;

    try {
      // Explicitly request microphone access so the browser prompt is shown
      // and we can surface a friendly message if permission is denied.
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      if (attempt !== voiceAttemptRef.current) return;
      voiceStartingRef.current = false;
      const err = error as Error;
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setRecordingError(t('chatbot_voice_permission_denied'));
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setRecordingError(t('chatbot_voice_no_device'));
      } else {
        setRecordingError(t('chatbot_voice_start_error'));
      }
      return;
    }

    if (attempt !== voiceAttemptRef.current || recognitionRef.current !== recognition) {
      voiceStartingRef.current = false;
      return;
    }
    voiceStartingRef.current = false;
    try {
      recognitionRef.current.lang = getRecognitionLang(language);
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Speech recognition start error:', error);
      setRecordingError(t('chatbot_voice_start_error'));
    }
  };


  return { isRecording, recordingError, setRecordingError, isSpeechSupported, toggleRecording };
}
