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
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Localização')).toBeInTheDocument();
  });

  it('deve renderizar o formulário de contato', () => {
    render(<Contact />);
    
    expect(screen.getByRole('textbox', { name: /nome/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });
});
