import torch
import requests
from dotenv import load_dotenv
import os
import spacy
from textblob import TextBlob
from transformers import BertForSequenceClassification, BertTokenizer
from PIL import Image
from io import BytesIO
import torchvision.transforms as T
from torchvision import models
import numpy as np

load_dotenv()

# Load NLP Model
nlp = spacy.load("en_core_web_sm")

# API Keys
API_KEYS = {
    "TAVILY": os.getenv("TAVILY_API"),
    "NEWSAPI": os.getenv("NEWS_API"),
}


# # Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# model.to(device)

# ------------------------ #
#      BERT Prediction     #
# ------------------------ #
FASTAPI_URL = os.getenv("FASTAPI_URL", "http://localhost:8000")  # Use env variable or default to localhost

def predict_with_bert(text):
    """
    Sends text to the FastAPI model running in Docker and gets a prediction.
    """
    try:
        url = f"{FASTAPI_URL}/predict"
        payload = {"text": text}
        headers = {"Content-Type": "application/json"}

        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  # Raise an error for bad responses

        result = response.json()
        return result.get("prediction", 0)  # Default to Fake if response is invalid

    except requests.RequestException as e:
        print(f"Error calling model API: {e}")
        return 0  # Default to Fake if API fails
print(predict_with_bert("Breaking: NASA confirms discovery of new habitable planet!"))

# ------------------------ #
#      Media Verification  #
# ------------------------ #

def verify_image(image_url):
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
        
        # Preprocess image for classification
        transform = T.Compose([
            T.Resize(256),
            T.CenterCrop(224),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        img_tensor = transform(img).unsqueeze(0).to(device)

        # Load a pre-trained ResNet50 model for image classification
        resnet_model = models.resnet50(pretrained=True)
        resnet_model.to(device)
        resnet_model.eval()

        with torch.no_grad():
            output = resnet_model(img_tensor)
            _, predicted_class = torch.max(output, 1)

        # Define a threshold for classifying an image as fake or real based on predictions
        # You can customize this threshold based on your trained model or heuristics
        fake_class = 951  # Example class index for fake images (replace with correct class from model)
        if predicted_class.item() == fake_class:
            return "Fake"
        else:
            return "Real"

    except requests.RequestException as e:
        print(f"Error fetching image: {e}")
        return "Error"

# ------------------------ #
#    Tavily & NewsAPI      #
# ------------------------ #
def analyze_with_tavily(text):
    try:
        url = "https://api.tavily.com/search"
        headers = {"Content-Type": "application/json"}
        payload = {
            "api_key": API_KEYS["TAVILY"],
            "query": text,
            "search_depth": "advanced",
            "include_answer": True,
        }
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return format_tavily_data(response.json())
    except requests.RequestException as e:
        print("Tavily Error:", e)
        return None

def analyze_with_newsapi(text):
    try:
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": text,
            "sortBy": "publishedAt",
            "language": "en",
            "apiKey": API_KEYS["NEWSAPI"],
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return format_newsapi_data(response.json())
    except requests.RequestException as e:
        print("NewsAPI Error:", e)
        return None

def format_tavily_data(data):
    return {
        "answer": data.get("answer", ""),
        "results": [
            {
                "title": result.get("title", ""),
                "content": result.get("content", ""),
                "url": result.get("url", ""),
                "source": result.get("source", ""),
            }
            for result in data.get("results", [])[:3]
        ],
    }

def format_newsapi_data(data):
    return {
        "articles": [
            {
                "source": article.get("source", {}).get("name", "Unknown"),
                "title": article.get("title", ""),
                "url": article.get("url", ""),
                "publishedAt": article.get("publishedAt", ""),
            }
            for article in data.get("articles", [])[:3]
        ]
    }

# ------------------------ #
#  Fact-Checking Analysis  #
# ------------------------ #

def process_results(tavily, newsapi):
    score = 50
    factors = []

    if tavily and "answer" in tavily:
        credibility_score, analysis_summary = analyze_tavily_answer(tavily["answer"])
        score += credibility_score
        factors.append(f"Tavily Analysis: {analysis_summary}")

    if tavily and tavily.get("results"):
        credible_sources = sum(
            1 for r in tavily["results"] if any(domain in r.get("source", "").lower() for domain in [".gov", ".edu", "who.int"])
        )
        score += credible_sources * 5
        factors.append(f"Tavily: {credible_sources} authoritative sources found.")

    if newsapi and newsapi.get("articles"):
        credible_outlets = ["reuters", "associated press", "bbc", "new york times", "guardian"]
        credible_articles = sum(
            1 for a in newsapi["articles"] if any(outlet in a["source"].lower() for outlet in credible_outlets)
        )
        score += credible_articles * 7
        factors.append(f"NewsAPI: {credible_articles} credible news articles found.")

    final_score = max(0, min(50, round(score)))  # Ensure score remains within 0-50
    return {
        "fact_check_score": final_score,
        "isLikelyFake": final_score < 20,
        "summary": "\n".join(factors) or "Insufficient data for analysis",
        "rawData": {"tavilyData": tavily, "newsapiData": newsapi},
    }

# ------------------------ #
#  Unified Result Function #
# ------------------------ #

def analyze_text(text, media_url=None):
    # BERT Prediction (50 Points)
    bert_prediction = predict_with_bert(text)
    bert_score = 50 if bert_prediction == 1 else 0  # 50 if Real, 0 if Fake

    # Media Verification (Optional)
    media_score = 0
    is_media_fake = False
    if media_url:
        media_verification = verify_image(media_url)
        if media_verification == "Fake":
            media_score -= 10  # Deduct points if the image is fake
            is_media_fake = True  # Mark the media as fake

    # Fact-Checking APIs (50 Points)
    tavily_data = analyze_with_tavily(text)
    newsapi_data = analyze_with_newsapi(text)
    fact_check_result = process_results(tavily_data, newsapi_data)

    fact_check_score = fact_check_result["fact_check_score"]
    
    # Check if any model or API score is 0, or if the media is fake
    if is_media_fake or bert_score == 0 or fact_check_score == 0:
        is_fake = True
    else:
        # Final Score out of 100 (No fake flag yet)
        final_score = bert_score + fact_check_score + media_score
        is_fake = final_score < 40  # News is considered fake if final score is less than 40

    return {
        "final_score": bert_score + fact_check_score + media_score,  # Final score after adjustments
        "isLikelyFake": is_fake,
        "bert_score": bert_score,
        "fact_check_score": fact_check_score,
        "media_score": media_score,
        "bert_prediction": "Real" if bert_prediction == 1 else "Fake",
        "fact_check_analysis": fact_check_result["summary"],
        "rawData": fact_check_result["rawData"],
    }


# ------------------------ #
#  Fact-Checking Analysis  #
# ------------------------ #
def analyze_tavily_answer(answer):
    if not answer:
        return 0, "No answer provided by Tavily"

    doc = nlp(answer)
    blob = TextBlob(answer)
    sentiment = blob.sentiment.polarity

    credibility_score = 0
    analysis_summary = ""

    if sentiment < -0.2:
        credibility_score -= 10
        analysis_summary += "Answer has negative sentiment, indicating possible bias.\n"

    if any(token.text.lower() in ["fake", "hoax", "misleading"] for token in doc):
        credibility_score -= 15
        analysis_summary += "Detected keywords related to misinformation.\n"

    if any(ent.label_ in ["ORG", "GPE"] for ent in doc.ents):
        credibility_score += 5
        analysis_summary += "Contains references to credible organizations.\n"

    return credibility_score, analysis_summary

# Sample Text and Media URL
text = "AOC is far more educated than Trump."
media_url = "https://pbs.twimg.com/media/GiQSmwSbwAA4-OR?format=jpg&name=small"  # Optional: Provide a media URL for verification

# Call the function to analyze text and media
result = analyze_text(text, media_url)

# Output the results
print(f"Final Misinformation Score: {result['final_score']}")
print(f"Is Likely Fake: {result['isLikelyFake']}")
print(f"Fact-Check Analysis: {result['fact_check_analysis']}")
