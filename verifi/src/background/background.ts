import { analyzeWithTavily } from './api/tavily';
import { analyzeWithNewsAPI } from './api/newsapi';
import { analyzeWithLocalModel } from './api/model';
import { processResults } from './utils/processResults';
import { AnalysisResult } from './types';

const analyzeTweet = async (text: string): Promise<AnalysisResult> => {
  try {
    const [tavilyData, newsapiData, modelData] = await Promise.all([
      analyzeWithTavily(text),
      analyzeWithNewsAPI(text),
      analyzeWithLocalModel(text),
    ]);

    return processResults(tavilyData, newsapiData, modelData);
  } catch (error) {
    console.error('Analysis Error:', error);
    return {
      confidence: 0,
      isLikelyFake: false,
      summary: 'Analysis failed',
      rawData: null,
    };
  }
};

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.type === 'ANALYZE_TWEET') {
      analyzeTweet(request.text).then((response) => sendResponse(response));
      return true; // Keep the message channel open for async response
    }
  });