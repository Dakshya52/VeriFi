import { TavilyResponse, NewsAPIResponse, ModelResponse, AnalysisResult } from '../types';

// Helper function to add controlled randomness
const addWeightedVariance = (baseScore: number): number => {
  // Calculate variance based on position in confidence range
  const variance = baseScore < 30 || baseScore > 70 ? 
    Math.random() * 5 :  // Less variance at extremes
    Math.random() * 15;  // More variance in ambiguous middle range

  // Add random noise with probability weighting
  const noise = baseScore < 45 ? 
    variance * -0.5 :    // Tend to lower fake news scores
    variance * 0.5;      // Tend to boost credible scores

  return baseScore + noise;
};

export const processResults = (
  tavilyData: TavilyResponse | null,
  newsapiData: NewsAPIResponse | null,
  modelData: ModelResponse | null
): AnalysisResult => {
  let score = 50;
  const factors: string[] = [];
  let isDebunked = false;

  // 1. Tavily Analysis (Enhanced detection)
  if (tavilyData?.answer) {
    const debunkedKeywords = [
      "no evidence", "debunked", "false", "unfounded", "misleading", "hoax",
      "not true", "disproven", "refuted", "inaccurate", "baseless", "fake",
      "incorrect", "unsubstantiated", "not supported", "misrepresented",
      "fabricated", "conspiracy", "discredited", "exaggerated", "manipulated",
      "doctored", "satire", "parody", "clickbait", "pseudoscience", "no information",
      "no verified data", "not ended", "not confirmed", "not true", "not real", "not accurate",
      "not supported", "not based", "not reliable", "not trustworthy", "not valid", "not credible",
      "not justified", "not proven", "not backed", "not justified", "not verified", "not confirmed",
      "not substantiated", "not corroborated", "not validated", "not authenticated", "not legitimated",
      "no reported"
    ];
    
    const answerLower = tavilyData.answer.toLowerCase();
    const debunkCount = debunkedKeywords.filter(keyword => 
      answerLower.includes(keyword)
    ).length;

    if (debunkCount > 0) {
      score -= 30 + (debunkCount * 2); // Scale penalty with keyword matches
      isDebunked = true;
      factors.push(`Debunked by ${debunkCount} fact-check indicators`);
    } else {
      score += 15 + (tavilyData.results?.length || 0); // Reward multiple sources
      factors.push('Verified by web sources');
    }
  }

  // 2. NewsAPI Scoring (Enhanced credibility check)
  if (newsapiData?.articles && newsapiData.articles.length > 0) {
    const credibilityScore = newsapiData.articles.reduce((acc, article) => {
      const source = (article.source || '').toLowerCase();
      if (source.includes('reuters') || source.includes('associated press')) {
        return acc + 8;
      }
      if (source.includes('factcheck') || source.includes('snopes')) {
        return acc + 12;
      }
      return acc - 3; // Penalize unverified sources
    }, 0);

    score += isDebunked ? credibilityScore * -0.5 : credibilityScore * 0.7;
  }

  // 3. AI Model Scoring (Weighted uncertainty)
  if (modelData) {
    const modelWeight = modelData.confidence / 100;
    if (modelData.isFake) {
      score -= 25 * modelWeight;
    } else {
      score += 15 * modelWeight;
    }
  }

  // Apply controlled randomness
  let finalScore = addWeightedVariance(score);
  
  // Final adjustments with smoothing
  finalScore = Math.min(95, Math.max(5, finalScore)); // Keep within 5-95
  finalScore = Math.round(finalScore); // Remove decimal places

  return {
    confidence: finalScore,
    isLikelyFake: finalScore < (45), // Fuzzy threshold
    summary: factors.join('\n') || 'Analysis inconclusive',
    rawData: {
      tavily: tavilyData,
      newsapi: newsapiData,
    },
  };
};