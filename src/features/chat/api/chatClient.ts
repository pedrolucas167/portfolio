export function isChatbotAvailable(): boolean {
  const hostname = window.location.hostname;
  return !!import.meta.env.VITE_CHAT_API_URL || hostname.endsWith('.vercel.app') || hostname === 'localhost' || hostname === '127.0.0.1';
}
export async function requestChat(message: string, language: string, signal: AbortSignal): Promise<string> {
  const url = import.meta.env.VITE_CHAT_API_URL || (import.meta.env.PROD ? '/api/chat' : 'http://localhost:3001/api/chat');
  const response = await fetch(url, { method: 'POST', signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, language }) });
  const data = await response.json();
  signal.throwIfAborted();
  if (!response.ok || !data?.success || typeof data.response !== 'string' || !data.response.trim()) throw new Error('Invalid chat response');
  return data.response.trim();
}
