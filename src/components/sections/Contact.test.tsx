import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { Contact } from './Contact';

vi.mock('../../hooks/useReveal', () => ({
  useReveal: () => ({
    ref: { current: null },
    isRevealed: true,
  }),
}));

vi.mock('../../data', () => ({
  contactLinks: [
    { name: 'Email', label: 'contact_link_email_label', value: 'test@test.com', href: 'mailto:test@test.com', icon: () => null, color: 'from-cyan-500 to-blue-500' },
    { name: 'GitHub', label: 'contact_link_github_label', value: 'GitHub', href: 'https://github.com/test', icon: () => null, color: 'from-purple-500 to-pink-500' },
    { name: 'LinkedIn', label: 'contact_link_linkedin_label', value: 'LinkedIn', href: 'https://linkedin.com/in/test', icon: () => null, color: 'from-blue-500 to-cyan-500' },
    { name: 'Location', label: 'contact_link_location_label', value: 'contact_link_location_value', icon: () => null, color: 'from-green-500 to-emerald-500' },
  ],
  socialLinks: {
    email: 'test@test.com',
    github: 'https://github.com/test',
    linkedin: 'https://linkedin.com/in/test',
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Contact Component', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('deve renderizar o título da seção', () => {
    render(<Contact />);
    
    expect(screen.getByText('Contato')).toBeInTheDocument();
    expect(screen.getAllByText(/Vamos/).length).toBeGreaterThan(0);
  });

  it('deve renderizar os campos do formulário', () => {
    render(<Contact />);
    
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /e-mail/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Assunto')).toBeInTheDocument();
    expect(screen.getByLabelText('Mensagem')).toBeInTheDocument();
  });

  it('deve renderizar o botão de enviar', () => {
    render(<Contact />);
    
    expect(screen.getByText('Enviar Mensagem')).toBeInTheDocument();
  });

  it('deve ter o id correto para navegação', () => {
    const { container } = render(<Contact />);
    
    const section = container.querySelector('#contato');
    expect(section).toBeInTheDocument();
  });

  it('deve renderizar os links de contato', () => {
    render(<Contact />);
    
    expect(screen.getAllByText(/E-mail/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('GitHub').length).toBeGreaterThan(0);
    expect(screen.getAllByText('LinkedIn').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Localiza/i).length).toBeGreaterThan(0);
  });

  it('deve renderizar o formulário de contato', () => {
    render(<Contact />);
    
    expect(screen.getByRole('textbox', { name: /nome/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });
});
