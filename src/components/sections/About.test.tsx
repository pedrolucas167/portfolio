import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { About } from './About';

vi.mock('../../hooks/useReveal', () => ({
  useReveal: () => ({
    ref: { current: null },
    isRevealed: true,
  }),
}));

describe('About Component', () => {
  it('deve renderizar o título da seção', () => {
    render(<About />);
    
    expect(screen.getByText('Sobre mim')).toBeInTheDocument();
    expect(screen.getByText(/Transformando ideias em/)).toBeInTheDocument();
    expect(screen.getByText(/Brainly.*2016.*2025|2016.*2025/)).toBeInTheDocument();
    expect(screen.getByText(/1\.800|\b1800\b/)).toBeInTheDocument();
    expect(screen.getByText(/12\.000|\b12000\b/)).toBeInTheDocument();
    expect(screen.getByText(/Atualmente.*disponibilidade regular/i)).toBeInTheDocument();
    expect(screen.getByText(/Fluente em IA/)).toBeInTheDocument();
    expect(screen.getByText(/Um modelo de linguagem é.*próximo token/i)).toBeInTheDocument();
  });

  it('deve renderizar os cards de skills', () => {
    render(<About />);
    
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
    expect(screen.getByText('IA & LLMs')).toBeInTheDocument();
  });

  it('deve renderizar as tecnologias de cada skill', () => {
    render(<About />);
    
    expect(screen.getByText('React, TypeScript, Tailwind CSS')).toBeInTheDocument();
    expect(screen.getByText('Java, Spring Boot, Node.js')).toBeInTheDocument();
    expect(screen.getByText('Docker, AWS, CI/CD')).toBeInTheDocument();
  });

  it('deve renderizar os highlights', () => {
    render(<About />);
    
    expect(screen.getByText('Pensamento Criativo')).toBeInTheDocument();
    expect(screen.getByText('Alta Performance')).toBeInTheDocument();
    expect(screen.getByText('Colaboração')).toBeInTheDocument();
  });

  it('deve ter o id correto para navegação', () => {
    const { container } = render(<About />);
    
    const section = container.querySelector('#sobre');
    expect(section).toBeInTheDocument();
  });
});
