import { NewsAPIResponse} from '../types';
import { logApiResponse } from '../utils/logger';

const NEWSAPI_API_KEY = process.env.NEWSAPI_API_KEY || '';

export const analyzeWithNewsAPI = async (text: string): Promise<NewsAPIResponse | null> => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        text
      )}&sortBy=publishedAt&language=en&apiKey=${NEWSAPI_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`NewsAPI Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logApiResponse('NewsAPI', data);

    if (!data.articles || data.articles.length === 0) {
      console.warn('NewsAPI: No articles found for query:', text);
      return null;
    }

    return {
      articles: data.articles.slice(0, 3).map((article: any) => ({
        source: article.source?.name || 'Unknown source',
        title: article.title || 'No title',
        url: article.url || '#',
        publishedAt: article.publishedAt || 'Unknown date',
      })),
    };
  } catch (error) {
    console.error('NewsAPI Error:', error);
    return null;
  }
};