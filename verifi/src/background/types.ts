export interface TavilyResult {
    title: string;
    content: string;
    url: string;
    source: string;
  }
  
  export interface TavilyResponse {
    results: TavilyResult[];
    answer: string | null;
  }
  
  export interface NewsArticle {
    source: string;
    title: string;
    url: string;
    publishedAt: string;
  }
  
  export interface NewsAPIResponse {
    articles: NewsArticle[];
  }
  
  export interface ModelResponse {
    isFake: boolean;
    confidence: number;
  }
  
  export interface AnalysisResult {
    confidence: number;
    isLikelyFake: boolean;
    summary: string;
    rawData: {
      tavily: TavilyResponse | null;
      newsapi: NewsAPIResponse | null;
    } | null;
  }