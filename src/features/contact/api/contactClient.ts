export interface ContactMessage { name: string; email: string; subject: string; message: string }
export async function submitContact(message: ContactMessage, signal: AbortSignal) {
  const response = await fetch('https://formspree.io/f/xeobzpbb', { method: 'POST', signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(message) });
  if (!response.ok) throw new Error('Contact delivery failed');
}
