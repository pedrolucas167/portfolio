import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { Hero } from './Hero';

vi.mock('../../hooks', () => ({
  useTypingEffect: () => 'Texto de teste',
  useMediaQuery: () => false,
  useScrollPosition: () => ({ scrollY: 0, scrollDirection: 'up' }),
  useSmoothScroll: () => ({ scrollTo: vi.fn() }),
  useReveal: () => ({ ref: { current: null }, isRevealed: true }),
}));

// Mock dos dados
vi.mock('../../data', () => ({
  personalInfo: {
    role: 'hero_role',
  },
  typingTexts: ['Texto 1', 'Texto 2'],
  socialLinks: {
    github: 'https://github.com/pedrolucas167',
    linkedin: 'https://linkedin.com/in/pedromarquesdev',
  },
}));

describe('Hero Component', () => {
  it('deve renderizar o nome corretamente', () => {
    render(<Hero />);
    
    // O nome "Pedro Lucas " e "Marques" estão em spans separados
    expect(screen.getByText(/Pedro/)).toBeInTheDocument();
    expect(screen.getByText('Marques')).toBeInTheDocument();
  });

  it('deve renderizar o cargo', () => {
    render(<Hero />);
    
    expect(screen.getByText('Desenvolvedor Full-Stack')).toBeInTheDocument();
  });

  it('deve renderizar o badge de status', () => {
    render(<Hero />);
    
    expect(screen.getByText('Disponível para projetos')).toBeInTheDocument();
  });

  it('deve renderizar os botões de CTA', () => {
    render(<Hero />);
    
    expect(screen.getByText('Explorar Trabalhos')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Conversa')).toBeInTheDocument();
  });

  it('deve renderizar os links sociais', () => {
    render(<Hero />);
    
    const githubLink = screen.getByLabelText('GitHub');
    const linkedinLink = screen.getByLabelText('LinkedIn');
    
    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/pedrolucas167');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/pedromarquesdev');
  });

  it('deve renderizar o avatar', () => {
    render(<Hero />);
    
    const avatar = screen.getByAltText('Pedro Lucas Marques');
    expect(avatar).toBeInTheDocument();
  });
});
