import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import i18n from '../../i18n';
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
});
