export interface AnalysisResult {
    confidence: number;
    isLikelyFake: boolean;
    summary: string;
    rawData: {
      tavily?: TavilyResult;
      newsapi?: NewsAPIResult;
    } | null;
  }
  
  export interface TavilyResult {
    results: {
      title: string;
      content: string;
      url: string;
      source: string;
    }[];
    answer: string | null;
  }
  
  export interface NewsAPIResult {
    articles: {
      source: string;
      title: string;
      url: string;
      publishedAt: string;
    }[];
  }