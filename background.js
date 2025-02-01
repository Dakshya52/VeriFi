

const API_KEYS = {
    GOOGLE_FACT_CHECK: '',
    TAVILY: '',
    NEWSAPI: '',
  };
  
  // Google Fact Check Tools API
  const analyzeWithGoogleFactCheck = async (text) => {
    try {
      const response = await fetch(
        `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(text)}&key=${API_KEYS.GOOGLE_FACT_CHECK}`
      );
      return formatGoogleData(await response.json());
    } catch (error) {
      console.error('Google Fact Check Error:', error);
      return null;
    }
  };
  
  // Tavily Web Search API
  const analyzeWithTavily = async (text) => {
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: API_KEYS.TAVILY,
          query: text,
          search_depth: 'advanced',
          include_answer: true
        })
      });
      return formatTavilyData(await response.json());
    } catch (error) {
      console.error('Tavily Error:', error);
      return null;
    }
  };
  
  // GDELT Document API
  const analyzeWithGDELT = async (text) => {
    try {
      const response = await fetch(
        `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(text)}&mode=artlist&format=json`
      );
      return formatGDELTData(await response.json());
    } catch (error) {
      console.error('GDELT Error:', error);
      return null;
    }
  };
  
  // NewsAPI Everything Endpoint
  const analyzeWithNewsAPI = async (text) => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(text)}&sortBy=publishedAt&language=en&apiKey=${API_KEYS.NEWSAPI}`
      );
      return formatNewsAPIData(await response.json());
    } catch (error) {
      console.error('NewsAPI Error:', error);
      return null;
    }
  };
  
  // Data Formatters
  const formatGoogleData = (data) => ({
    claims: (data.claims || []).slice(0, 3).map(claim => ({
      text: claim.text,
      claimReview: (claim.claimReview || []).map(review => ({
        publisher: review.publisher?.name || 'Unknown',
        textualRating: review.textualRating || 'Unrated',
        url: review.url
      }))
    }))
  });
  
  const formatTavilyData = (data) => ({
    results: (data.results || []).slice(0, 3).map(result => ({
      title: result.title,
      content: result.content,
      url: result.url,
      source: result.source
    }))
  });
  
  const formatGDELTData = (data) => ({
    articles: (data.articles || []).slice(0, 3).map(article => ({
      title: article.title,
      url: article.url,
      sentiment: article.sentiment || 0,
      source: article.domain
    }))
  });
  
  const formatNewsAPIData = (data) => ({
    articles: (data.articles || []).slice(0, 3).map(article => ({
      source: article.source?.name || 'Unknown',
      title: article.title,
      url: article.url,
      publishedAt: article.publishedAt
    }))
  });
  
  // Main Analysis Function
  const analyzeTweet = async (text) => {
    try {
      const [googleData, tavilyData, gdeltData, newsapiData] = await Promise.all([
        analyzeWithGoogleFactCheck(text),
        analyzeWithTavily(text),
        analyzeWithGDELT(text),
        analyzeWithNewsAPI(text)
      ]);
  
      return processResults(googleData, tavilyData, gdeltData, newsapiData);
    } catch (error) {
      console.error('Analysis Error:', error);
      return errorResponse();
    }
  };
  // Updated processResults function with error handling
const processResults = (google, tavily, gdelt, newsapi) => {
    let score = 50;
    const factors = [];
  
    // Google Fact Check Scoring
    if (google?.claims?.length > 0) {
      const claim = google.claims[0];
      const rating = claim.claimReview[0]?.textualRating?.toLowerCase() || 'neutral';
      
      if (rating.includes('false')) {
        score -= 30;
        factors.push('Google: False claim detected');
      } else if (rating.includes('true')) {
        score += 25;
        factors.push('Google: Verified claim');
      }
    }
  
    // Tavily Web Results (Updated with null checks)
    if (tavily?.results?.length > 0) {
      const credibleSources = tavily.results.filter(r => {
        const source = r.source?.toLowerCase() || r.url?.toLowerCase() || '';
        return source.includes('.gov') || 
               source.includes('.edu') ||
               source.includes('who.int');
      }).length;
      
      score += credibleSources * 5;
      factors.push(`Tavily: ${credibleSources} authoritative sources`);
    }
  
    // GDELT Sentiment Analysis (Updated with null checks)
    if (gdelt?.articles?.length > 0) {
      const validArticles = gdelt.articles.filter(a => typeof a.sentiment === 'number');
      const sentimentSum = validArticles.reduce((sum, a) => sum + a.sentiment, 0);
      const avgSentiment = validArticles.length > 0 ? sentimentSum / validArticles.length : 0;
      
      score += avgSentiment * 15;
      factors.push(`GDELT: ${(avgSentiment * 100).toFixed(0)}% sentiment`);
    }
  
    // NewsAPI Coverage (Updated with null checks)
    if (newsapi?.articles?.length > 0) {
      const credibleNewsOutlets = [
        'reuters', 'associated press', 'bbc',
        'new york times', 'guardian'
      ];
      
      const credibleArticles = newsapi.articles.filter(a => {
        const source = a.source?.toLowerCase() || '';
        return credibleNewsOutlets.some(outlet => source.includes(outlet));
      }).length;
      
      score += credibleArticles * 7;
      factors.push(`NewsAPI: ${credibleArticles} credible news articles`);
    }
  
    // Confidence Clamping with fallback
    const finalScore = Math.min(100, Math.max(0, Math.round(score))) || 50;
  
    return {
      confidence: finalScore,
      isLikelyFake: finalScore < 40,
      summary: factors.join('\n') || 'Insufficient data for analysis',
      rawData: {
        googleData: google || null,
        tavilyData: tavily || null,
        gdeltData: gdelt || null,
        newsapiData: newsapi || null
      }
    };
  };
  
  // Error Handling
  const errorResponse = () => ({
    confidence: 0,
    isLikelyFake: false,
    summary: 'Analysis failed - try again later',
    rawData: null
  });
  
  // Chrome Message Listener
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'ANALYZE_TWEET') {
      analyzeTweet(request.text).then(sendResponse);
      return true; // Keep message channel open
    }
  });