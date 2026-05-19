import { useState, useEffect } from 'react';
import { articles as fallbackArticles, Article } from '../data';

interface Rss2JsonItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  thumbnail: string;
  categories: string[];
}

interface Rss2JsonResponse {
  status: string;
  items: Rss2JsonItem[];
}

const GRADIENTS = [
  'from-violet-500 to-purple-600',
  'from-green-500 to-emerald-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-blue-700',
];

const EMOJIS = ['🤖', '⚡', '🏜️', '🚀', '✍️', '💡', '🧠', '🔬'];

function estimateReadingTime(description: string): string {
  const text = description.replace(/<[^>]+>/g, '');
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

export interface DynamicArticle extends Omit<Article, 'titleKey' | 'descriptionKey'> {
  title: string;
  description: string;
}

export function useMediumArticles(username: string) {
  const [dynamicArticles, setDynamicArticles] = useState<DynamicArticle[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchArticles() {
      try {
        const rssUrl = `https://medium.com/feed/@${username}`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=10`;

        const res = await fetch(apiUrl, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch');

        const data: Rss2JsonResponse = await res.json();
        if (data.status !== 'ok' || !data.items?.length) throw new Error('Invalid response');

        const mapped: DynamicArticle[] = data.items.map((item, i) => ({
          id: i + 1,
          title: item.title,
          description: stripHtml(item.description).slice(0, 160) + '…',
          url: item.link,
          tag: item.categories?.[0] ?? 'Medium',
          gradient: GRADIENTS[i % GRADIENTS.length],
          emoji: EMOJIS[i % EMOJIS.length],
          readingTime: estimateReadingTime(item.description),
        }));

        setDynamicArticles(mapped);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
    return () => controller.abort();
  }, [username]);

  return { dynamicArticles, loading, error };
}

export { fallbackArticles };
