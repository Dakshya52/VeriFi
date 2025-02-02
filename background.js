// Updated API_KEYS and new model endpoint
const MODEL_API_ENDPOINT = 'http://127.0.0.1:8000/predict'; // Adjust endpoint path as needed


const API_KEYS = {
  TAVILY: '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', // Replace with your Tavily API key
  NEWSAPI: '6d03e6ee518e4a6bb882787ca015ff3b', // Replace with your NewsAPI key
};

// Log API responses for debugging
const logApiResponse = (apiName, response) => {
  console.log(`${apiName} Response:`, JSON.stringify(response, null, 2));
};

// New ML model analysis function
const analyzeWithLocalModel = async (text) => {
  try {
    const response = await fetch(`${MODEL_API_ENDPOINT}?text=${encodeURIComponent(text)}`, {
      method: 'POST', // or 'GET' if the API expects a GET request
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Model API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return {
      isFake: data.prediction === 1,
      confidence: data.confidence || 0
    };
  } catch (error) {
    console.error('Local Model Error:', error);
    return null;
  }
};

// Tavily API Call
const analyzeWithTavily = async (text) => {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: API_KEYS.TAVILY,
        query: text,
        search_depth: 'advanced',
        include_answer: true, // Include the summarized answer
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      results: data.results?.slice(0, 3).map((result) => ({
        title: result.title || 'No title',
        content: result.content || 'No content available',
        url: result.url || '#',
        source: result.source || 'Unknown source',
      })),
      answer: data.answer || null, // Include the summarized answer
    };
  } catch (error) {
    console.error('Tavily API Error:', error);
    return null;
  }
};
// NewsAPI Call
const analyzeWithNewsAPI = async (text) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        text
      )}&sortBy=publishedAt&language=en&apiKey=${API_KEYS.NEWSAPI}`
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
      articles: data.articles.slice(0, 3).map((article) => ({
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

// Process Results
// Updated processResults function
const processResults = (tavilyData, newsapiData, modelData) => {
  let score = 50;
  const factors = [];
  let isDebunked = false;

  // 1. Tavily Analysis (Most Weight)
  if (tavilyData?.answer) {
    const debunkedKeywords = ["no evidence", "debunked", "false", "unfounded", "misleading"];
    const answerLower = tavilyData.answer.toLowerCase();

    if (debunkedKeywords.some(keyword => answerLower.includes(keyword))) {
      score -= 40; // Strong penalty for debunking
      isDebunked = true;
      factors.push('Debunked by fact-check analysis');
    } else {
      score += 20; // Boost for credible summary
      factors.push('Verified by fact-check analysis');
    }
  }

  // 2. NewsAPI Scoring (Conditional Weight)
  if (newsapiData?.articles?.length > 0) {
    const factCheckArticles = newsapiData.articles.filter(article => {
      const source = (article.source || '').toLowerCase();
      return source.includes('reuters') ||
        source.includes('associated press') ||
        source.includes('factcheck');
    }).length;

    if (isDebunked) {
      // Only count fact-check articles when debunked
      score -= factCheckArticles * 15;
      if (factCheckArticles > 0) factors.push(`${factCheckArticles} fact-check confirmations`);
    } else {
      score += factCheckArticles * 10;
    }
  }

  // 3. AI Model Scoring (Hidden but Influential)
  if (modelData) {
    if (modelData.isFake) {
      score -= 30 + (modelData.confidence * 0.3); // Scale with confidence
      // No UI factor added for AI
    } else {
      score += 15 + (modelData.confidence * 0.2);
    }
  }

  // Final adjustments
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  return {
    confidence: finalScore,
    isLikelyFake: finalScore < 45, // More sensitive threshold
    summary: factors.join('\n') || 'Analysis inconclusive',
    rawData: {
      tavily: tavilyData,
      newsapi: newsapiData,
      // AI data is included but won't be displayed
    }
  };
};

// Updated analyzeTweet function
const analyzeTweet = async (text) => {
  try {
    const [tavilyData, newsapiData, modelData] = await Promise.all([
      analyzeWithTavily(text),
      analyzeWithNewsAPI(text),
      analyzeWithLocalModel(text)
    ]);

    return processResults(tavilyData, newsapiData, modelData);
  } catch (error) {
    console.error('Analysis Error:', error);
    return errorResponse();
  }
};

// Chrome Message Listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ANALYZE_TWEET') {
    analyzeTweet(request.text).then(sendResponse);
    return true; // Keep the message channel open for async response
  }
});