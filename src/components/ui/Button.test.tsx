import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { Button } from './Button';

describe('Button Component', () => {
  it('deve renderizar o texto do botão', () => {
    render(<Button>Clique aqui</Button>);
    
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('deve aplicar a variante primary por padrão', () => {
    render(<Button>Primary</Button>);
    
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-accent');
  });

  it('deve aplicar a variante secondary', () => {
    render(<Button variant="secondary">Secondary</Button>);
    
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-white');
  });

  it('deve aplicar a variante ghost', () => {
    render(<Button variant="ghost">Ghost</Button>);
    
    const button = screen.getByText('Ghost');
    expect(button).toHaveClass('text-gray-700');
  });

  it('deve aplicar os tamanhos corretos', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toHaveClass('px-4', 'py-2');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByText('Medium')).toHaveClass('px-6', 'py-3');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toHaveClass('px-8', 'py-4');
  });

  it('deve estar desabilitado quando a prop disabled é passada', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-60', 'cursor-not-allowed');
  });

  it('deve mostrar loading spinner quando isLoading é true', () => {
    render(<Button isLoading>Loading</Button>);
    
    const button = screen.getByText('Loading');
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('deve aplicar className adicional', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByText('Custom');
    expect(button).toHaveClass('custom-class');
  });
});
