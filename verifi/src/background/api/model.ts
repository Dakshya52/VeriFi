import { ModelResponse } from '../types';

const MODEL_API_ENDPOINT = process.env.MODEL_API_ENDPOINT || '';

export const analyzeWithLocalModel = async (text: string): Promise<ModelResponse | null> => {
  try {
    const response = await fetch(`${MODEL_API_ENDPOINT}?text=${encodeURIComponent(text)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Model API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return {
      isFake: data.prediction === 1,
      confidence: data.confidence || 0,
    };
  } catch (error) {
    console.error('Local Model Error:', error);
    return null;
  }
};
