import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import i18n from '../../../i18n';
import { Chatbot } from './Chatbot';

const mockStart = vi.fn();
const mockStop = vi.fn();
let lastRecognition: MockSpeechRecognition | null = null;

class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = '';
  onresult: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  onend: (() => void) | null = null;
  start = mockStart;
  stop = mockStop;

  constructor() {
    lastRecognition = this;
  }
}

describe('Chatbot voice input', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    vi.clearAllMocks();
    lastRecognition = null;
    Object.defineProperty(window, 'SpeechRecognition', {
      writable: true,
      configurable: true,
      value: MockSpeechRecognition,
    });
    Object.defineProperty(window, 'webkitSpeechRecognition', {
      writable: true,
      configurable: true,
      value: MockSpeechRecognition,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(window, 'SpeechRecognition', {
      writable: true,
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(window, 'webkitSpeechRecognition', {
      writable: true,
      configurable: true,
      value: undefined,
    });
  });

  const openChat = async (user: ReturnType<typeof userEvent.setup>) => {
    render(<Chatbot />);
    await user.click(await screen.findByTitle('Open chatbot'));
    expect(await screen.findByPlaceholderText('Type your question...')).toBeInTheDocument();
  };

  it('shows an error when speech recognition is not supported', async () => {
    const user = userEvent.setup();
    Object.defineProperty(window, 'SpeechRecognition', {
      writable: true,
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(window, 'webkitSpeechRecognition', {
      writable: true,
      configurable: true,
      value: undefined,
    });

    await openChat(user);

    const micButton = screen.getByTitle(
      'Voice recognition is not supported in this browser. Try Chrome, Edge, or Safari.'
    );
    await user.click(micButton);

    await waitFor(() =>
      expect(
        screen.getByText(
          'Voice recognition is not supported in this browser. Try Chrome, Edge, or Safari.'
        )
      ).toBeInTheDocument()
    );
  });

  it('toggles recording when speech recognition is supported', async () => {
    const user = userEvent.setup();
    await openChat(user);

    const micButton = screen.getByTitle('Start voice input');
    await user.click(micButton);

    await waitFor(() => expect(mockStart).toHaveBeenCalledTimes(1));
    expect(screen.getByTitle('Stop voice input')).toBeInTheDocument();

    await user.click(micButton);
    await waitFor(() => expect(mockStop).toHaveBeenCalledTimes(1));
  });

  it('writes the recognized transcript into the input field', async () => {
    const user = userEvent.setup();
    await openChat(user);

    const micButton = screen.getByTitle('Start voice input');
    await user.click(micButton);
    await waitFor(() => expect(mockStart).toHaveBeenCalledTimes(1));

    expect(lastRecognition).not.toBeNull();

    act(() => {
      lastRecognition!.onresult?.({
        results: [[{ transcript: 'Quais são suas tecnologias?' }]],
      });
    });

    const input = screen.getByPlaceholderText('Type your question...') as HTMLInputElement;
    await waitFor(() => expect(input.value).toBe('Quais são suas tecnologias?'));
  });

  it('shows an error for an HTTP failure even if the body claims success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ success: true, response: 'invalid success' }),
    }));
    const user = userEvent.setup();
    await openChat(user);
    await user.type(screen.getByPlaceholderText('Type your question...'), 'Hello{Enter}');
    expect(await screen.findByText(i18n.t('chatbot_error'))).toBeInTheDocument();
    expect(screen.queryByText('invalid success')).not.toBeInTheDocument();
  });

  it('aborts an outstanding request when the component unmounts', async () => {
    let signal: AbortSignal | undefined;
    vi.stubGlobal('fetch', vi.fn((_url, options) => {
      signal = options.signal;
      return new Promise((_resolve, reject) => {
        signal!.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });
    }));
    const user = userEvent.setup();
    const { unmount } = render(<Chatbot />);
    await user.click(await screen.findByTitle('Open chatbot'));
    await user.type(screen.getByPlaceholderText('Type your question...'), 'Hello{Enter}');
    await waitFor(() => expect(signal).toBeDefined());
    unmount();
    expect(signal!.aborted).toBe(true);
  });

  it('does not start recording if permission resolves after the chat closes', async () => {
    let allowMicrophone!: (stream: MediaStream) => void;
    const stopTrack = vi.fn();
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: vi.fn(() => new Promise<MediaStream>(resolve => { allowMicrophone = resolve; })) },
    });
    try {
      const user = userEvent.setup();
      await openChat(user);
      await user.click(screen.getByTitle('Start voice input'));
      await user.click(screen.getByRole('button', { name: 'Close chatbot' }));
      await act(async () => allowMicrophone({ getTracks: () => [{ stop: stopTrack }] } as unknown as MediaStream));
      expect(stopTrack).toHaveBeenCalledTimes(1);
      expect(mockStart).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: undefined });
    }
  });
});
