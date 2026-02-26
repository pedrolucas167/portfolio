import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { GlassCard } from './GlassCard';

describe('GlassCard Component', () => {
  it('deve renderizar os children', () => {
    render(
      <GlassCard>
        <p>Conteúdo do card</p>
      </GlassCard>
    );
    
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument();
  });

  it('deve aplicar a classe glass-card', () => {
    const { container } = render(
      <GlassCard>
        <p>Card</p>
      </GlassCard>
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('glass-card');
  });

  it('deve aplicar className adicional', () => {
    const { container } = render(
      <GlassCard className="p-8 custom-class">
        <p>Card</p>
      </GlassCard>
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('p-8');
  });
});
