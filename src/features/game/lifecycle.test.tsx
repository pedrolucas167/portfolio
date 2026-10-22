import { act, renderHook, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useGameTimers } from './useGameTimers';
import { useGameEngine } from './useGameEngine';
import { Game } from './Game';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('game lifecycle', () => {
  it('starts the arcade, renders a frame and cancels animation on unmount', () => {
    let nextId = 0;
    const frames = new Map<number, FrameRequestCallback>();
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
      frames.set(++nextId, callback);
      return nextId;
    }));
    vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => frames.delete(id)));
    const gradient = { addColorStop: vi.fn() };
    const drawText = vi.fn();
    const context = new Proxy({}, {
      get(_target, key) {
        if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => gradient;
        if (key === 'fillText') return drawText;
        return vi.fn();
      },
      set() { return true; },
    });
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as never);
    const { unmount } = render(<Game />);
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Missão/ }));
    expect(frames.size).toBe(1);
    act(() => {
      const [id, callback] = frames.entries().next().value!;
      frames.delete(id);
      callback(16);
    });
    expect(drawText).toHaveBeenCalledWith('SCORE', 18, 52);
    unmount();
    expect(frames.size).toBe(0);
  });
  it('refreshes a power-up and cancels pending effects on unmount', () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useGameTimers());
    act(() => result.current.schedule(callback, 1000, 'coffee'));
    act(() => vi.advanceTimersByTime(500));
    act(() => result.current.schedule(callback, 1000, 'coffee'));
    act(() => vi.advanceTimersByTime(500));
    expect(callback).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(500));
    expect(callback).toHaveBeenCalledTimes(1);
    act(() => result.current.schedule(callback, 1000));
    unmount();
    act(() => vi.advanceTimersByTime(1000));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('resets game state and pending effects for a new session', () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useGameEngine());
    act(() => {
      result.current.setGameState(state => ({ ...state, score: 300, lives: 0 }));
      result.current.schedule(callback, 1000);
    });
    act(() => result.current.startGame());
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.lives).toBe(5);
    expect(result.current.gameState.isPlaying).toBe(true);
    act(() => vi.advanceTimersByTime(1000));
    expect(callback).not.toHaveBeenCalled();
  });
});
