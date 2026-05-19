import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import { Header } from './Header';
import type { i18n as I18nInstance } from 'i18next';

vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: vi.fn() },
  useTranslation: () => ({
    t: (key: string) => ({
      nav_home: 'Início',
      nav_about: 'Sobre',
      nav_tech: 'Tecnologias',
      nav_projects: 'Projetos',
      nav_game: '🎮 Jogo',
      nav_contact: 'Contato',
      speak_to_me: 'Fale Comigo',
    }[key] ?? key),
  }),
}));

const mockI18n = {
  language: 'pt',
  changeLanguage: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
} as unknown as I18nInstance;

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
    render(<Header i18n={mockI18n} />);

    const logos = screen.getAllByText('PL');
    expect(logos.length).toBeGreaterThan(0);
  });

  it('deve renderizar os links de navegação no desktop', () => {
    render(<Header i18n={mockI18n} />);

    expect(screen.getAllByText('Início').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sobre').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tecnologias').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Projetos').length).toBeGreaterThan(0);
    expect(screen.getAllByText('🎮 Jogo').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Contato').length).toBeGreaterThan(0);
  });

  it('deve renderizar o botão CTA', () => {
     render(<Header i18n={mockI18n} />);

    const ctaButtons = screen.getAllByText('Fale Comigo');
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it('deve renderizar o botão do menu mobile', () => {
    render(<Header i18n={mockI18n} />);

    const menuButton = screen.getByLabelText('Abrir menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('deve abrir o menu mobile ao clicar no botão', () => {
    render(<Header i18n={mockI18n} />);

    const menuButton = screen.getByLabelText('Abrir menu');
    fireEvent.click(menuButton);
    
    const closeButtons = screen.getAllByLabelText('Fechar menu');
    expect(closeButtons.length).toBeGreaterThan(0);
  });

  it('deve fechar o menu mobile ao clicar no botão fechar', () => {
    render(<Header i18n={mockI18n} />);

    const openButton = screen.getByLabelText('Abrir menu');
    fireEvent.click(openButton);
    
    const closeButtons = screen.getAllByLabelText('Fechar menu');
    expect(closeButtons.length).toBeGreaterThan(0);

    const firstCloseButton = closeButtons[0];
    expect(firstCloseButton).toBeDefined();
    fireEvent.click(firstCloseButton!);
    
    expect(screen.getByLabelText('Abrir menu')).toBeInTheDocument();
  });

  it('deve ter os hrefs corretos nos links de navegação', () => {
    render(<Header i18n={mockI18n} />);

    const allLinks = screen.getAllByRole('link');
    const hrefs = allLinks.map(link => link.getAttribute('href'));
    
    expect(hrefs).toContain('#inicio');
    expect(hrefs).toContain('#sobre');
    expect(hrefs).toContain('#tecnologias');
    expect(hrefs).toContain('#projetos');
    expect(hrefs).toContain('#contato');
  });
});
