import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { TechStack } from './TechStack';

vi.mock('../../hooks/useReveal', () => ({
  useReveal: () => ({
    ref: { current: null },
    isRevealed: true,
  }),
}));

vi.mock('../../data', () => ({
  techStack: [
    { name: 'React', icon: () => null, color: '#61DAFB', level: 90 },
    { name: 'TypeScript', icon: () => null, color: '#3178C6', level: 85 },
    { name: 'Node.js', icon: () => null, color: '#339933', level: 80 },
  ],
}));

describe('TechStack Component', () => {
  it('deve renderizar o título da seção', () => {
    render(<TechStack />);
    
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
    expect(screen.getByText(/Tecnologias que/)).toBeInTheDocument();
  });

  it('deve renderizar as tecnologias', () => {
    render(<TechStack />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('deve ter o id correto para navegação', () => {
    const { container } = render(<TechStack />);
    
    const section = container.querySelector('#tecnologias');
    expect(section).toBeInTheDocument();
  });

  it('deve renderizar a mensagem de aprendizado contínuo', () => {
    render(<TechStack />);
    
    expect(screen.getByText(/Continuamente explorando novas tecnologias para manter excelência/i)).toBeInTheDocument();
  });
});
