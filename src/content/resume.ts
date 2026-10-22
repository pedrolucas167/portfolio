export const resumeUrl = import.meta.env.BASE_URL + 'resume/Curriculum%20-%20Pedro%20Marques.pdf';
export function downloadResume() {
  const link = document.createElement('a');
  link.href = resumeUrl;
  link.download = 'resume_pedro_marques.pdf';
  link.click();
}
export function isResumeRequest(text: string): boolean {
  return /(?:curr[ií]culo|curriculum|resume|\bcv\b|baixar|download|lebenslauf|简历|descargar)/i.test(text);
}
