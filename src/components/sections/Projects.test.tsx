import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import { Projects } from './Projects';

vi.mock('../../hooks/useReveal', () => ({
  useReveal: () => ({
    ref: { current: null },
    isRevealed: true,
  }),
}));


vi.mock('../../data', () => ({
  projects: [
    {
      id: 1,
      title: 'Projeto Teste 1',
      description: 'Descrição do projeto teste 1',
      fullDescription: 'Descrição completa do projeto 1',
      technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      category: 'Web App',
      gradient: 'from-cyan-500 to-blue-500',
      github: 'https://github.com/test/project1',
      demo: 'https://project1.demo.com',
      features: ['Feature 1', 'Feature 2'],
    },
    {
      id: 2,
      title: 'Projeto Teste 2',
      description: 'Descrição do projeto teste 2',
      technologies: ['Java', 'Spring Boot'],
      category: 'API',
      gradient: 'from-green-500 to-emerald-500',
      github: 'https://github.com/test/project2',
    },
  ],
}));

describe('Projects Component', () => {
  it('deve renderizar o título da seção', () => {
    render(<Projects />);
    
    expect(screen.getByText('Trabalhos')).toBeInTheDocument();
    expect(screen.getByText('Projetos')).toBeInTheDocument();
    expect(screen.getByText('em destaque')).toBeInTheDocument();
  });

  it('deve renderizar os projetos', () => {
    render(<Projects />);
    
    expect(screen.getByText('Projeto Teste 1')).toBeInTheDocument();
    expect(screen.getByText('Projeto Teste 2')).toBeInTheDocument();
  });

  it('deve renderizar as categorias dos projetos', () => {
    render(<Projects />);
    
    expect(screen.getByText('Web App')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
  });

  it('deve mostrar apenas 3 tecnologias + contador', () => {
    render(<Projects />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('deve abrir modal ao clicar em um projeto', () => {
    render(<Projects />);
    
    const projectCard = screen.getByText('Projeto Teste 1').closest('[class*="glass-card"]');
    if (projectCard) {
      fireEvent.click(projectCard);
    }
    
    // Verifica se o modal apareceu com a descrição completa
    expect(screen.getByText('Descrição completa do projeto 1')).toBeInTheDocument();
  });

  it('deve ter o id correto para navegação', () => {
    const { container } = render(<Projects />);
    
    const section = container.querySelector('#projetos');
    expect(section).toBeInTheDocument();
  });
});
