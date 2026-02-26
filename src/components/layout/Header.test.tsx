import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import { Header } from './Header';

vi.mock('../../hooks', () => ({
  useScrollPosition: () => ({
    scrollY: 0,
    scrollDirection: 'up',
  }),
  useSmoothScroll: () => ({
    scrollTo: vi.fn(),
  }),
  useMediaQuery: () => false,
}));

describe('Header Component', () => {
  it('deve renderizar o logo', () => {
    render(<Header />);
    
    const logos = screen.getAllByText('PL');
    expect(logos.length).toBeGreaterThan(0);
  });

  it('deve renderizar os links de navegação no desktop', () => {
    render(<Header />);
    
    expect(screen.getAllByText('Início').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sobre').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tecnologias').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Projetos').length).toBeGreaterThan(0);
    expect(screen.getAllByText('🎮 Game').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Contato').length).toBeGreaterThan(0);
  });

  it('deve renderizar o botão CTA', () => {
    render(<Header />);
    
    const ctaButtons = screen.getAllByText('Fale Comigo');
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it('deve renderizar o botão do menu mobile', () => {
    render(<Header />);
    
    const menuButton = screen.getByLabelText('Abrir menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('deve abrir o menu mobile ao clicar no botão', () => {
    render(<Header />);
    
    const menuButton = screen.getByLabelText('Abrir menu');
    fireEvent.click(menuButton);
    
    // Após abrir, deve mostrar o botão de fechar (haverá dois)
    const closeButtons = screen.getAllByLabelText('Fechar menu');
    expect(closeButtons.length).toBeGreaterThan(0);
  });

  it('deve fechar o menu mobile ao clicar no botão fechar', () => {
    render(<Header />);
    
    // Abre o menu
    const openButton = screen.getByLabelText('Abrir menu');
    fireEvent.click(openButton);
    
    // Fecha o menu
    const closeButtons = screen.getAllByLabelText('Fechar menu');
    expect(closeButtons.length).toBeGreaterThan(0);

    const firstCloseButton = closeButtons[0];
    expect(firstCloseButton).toBeDefined();
    fireEvent.click(firstCloseButton!);
    
    // Verifica se voltou ao estado inicial
    expect(screen.getByLabelText('Abrir menu')).toBeInTheDocument();
  });

  it('deve ter os hrefs corretos nos links de navegação', () => {
    render(<Header />);
    
    // Pega todos os links e verifica se contém os hrefs corretos
    const allLinks = screen.getAllByRole('link');
    const hrefs = allLinks.map(link => link.getAttribute('href'));
    
    expect(hrefs).toContain('#inicio');
    expect(hrefs).toContain('#sobre');
    expect(hrefs).toContain('#tecnologias');
    expect(hrefs).toContain('#projetos');
    expect(hrefs).toContain('#contato');
  });
});
