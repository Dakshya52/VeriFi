import { ModelResponse } from '../types';

const MODEL_API_ENDPOINT = process.env.MODEL_API_ENDPOINT || '';

export const analyzeWithLocalModel = async (text: string): Promise<ModelResponse | null> => {
  try {
    
const response = await fetch(`${MODEL_API_ENDPOINT}?text=${encodeURIComponent(text)}`, {
  method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.MODEL_API_KEY}`,
        "Content-Type": "application/json",},
    body: JSON.stringify({ inputs: text })
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // If the model is loading, wait and retry
      if (errorData.error?.includes("is currently loading")) {
        const estimatedTime = errorData.estimated_time || 20; // Default to 20 seconds
        console.log(`Model is loading. Retrying in ${estimatedTime} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, estimatedTime * 1000));
        return analyzeWithLocalModel(text); // Retry the request
      }
      
      throw new Error(`Model API Error: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json(); 
    console.log('Local Model response:',data);
    return {
      isFake: data.prediction === 1,
      confidence: data.confidence || 0,
    };
  } catch (error) {
    console.error('Local Model Error:', error);
    return null;
  }
};