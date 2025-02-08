import { TavilyResponse, NewsAPIResponse, ModelResponse, AnalysisResult } from '../types';

export const processResults = (
  tavilyData: TavilyResponse | null,
  newsapiData: NewsAPIResponse | null,
  modelData: ModelResponse | null
): AnalysisResult => {
  let score = 50;
  const factors: string[] = [];
  let isDebunked = false;

  // 1. Tavily Analysis
  if (tavilyData?.answer) {
    const debunkedKeywords = ["no evidence", "debunked", "false", "unfounded", "misleading"];
    const answerLower = tavilyData.answer.toLowerCase();

    if (debunkedKeywords.some(keyword => answerLower.includes(keyword))) {
      score -= 40;
      isDebunked = true;
      factors.push('Debunked by fact-check analysis');
    } else {
      score += 20;
      factors.push('Verified by fact-check analysis');
    }
  }

  // 2. NewsAPI Scoring
  if (newsapiData?.articles && newsapiData.articles.length > 0) {
    const factCheckArticles = newsapiData.articles.filter(article => {
      const source = (article.source || '').toLowerCase();
      return source.includes('reuters') || source.includes('associated press') || source.includes('factcheck');
    }).length;

    if (isDebunked) {
      score -= factCheckArticles * 15;
      if (factCheckArticles > 0) factors.push(`${factCheckArticles} fact-check confirmations`);
    } else {
      score += factCheckArticles * 10;
    }
  }

  // 3. AI Model Scoring
  if (modelData) {
    if (modelData.isFake) {
      score -= 30 + (modelData.confidence * 0.3);
    } else {
      score += 15 + (modelData.confidence * 0.2);
    }
  }

  // Final adjustments
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  return {
    confidence: finalScore,
    isLikelyFake: finalScore < 45,
    summary: factors.join('\n') || 'Analysis inconclusive',
    rawData: {
      tavily: tavilyData,
      newsapi: newsapiData,
    },
  };
};