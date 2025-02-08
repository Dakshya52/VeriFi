import { TavilyResponse} from '../types';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';

export const analyzeWithTavily = async (text: string): Promise<TavilyResponse | null> => {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: text,
        search_depth: 'advanced',
        include_answer: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      results: data.results?.slice(0, 3).map((result: any) => ({
        title: result.title || 'No title',
        content: result.content || 'No content available',
        url: result.url || '#',
        source: result.source || 'Unknown source',
      })),
      answer: data.answer || null,
    };
  } catch (error) {
    console.error('Tavily API Error:', error);
    return null;
  }
};