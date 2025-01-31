import requests
from dotenv import load_dotenv
import os
import spacy  # Install using: pip install spacy
from textblob import TextBlob  # Install using: pip install textblob

load_dotenv()

# API Keys
API_KEYS = {
    "TAVILY": os.getenv("TAVILY_API"),
    "NEWSAPI": os.getenv("NEWS_API"),
}

# Load NLP Model
nlp = spacy.load("en_core_web_sm")  # You can also use a transformer-based model


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
        print(response)
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
        "answer": data.get("answer", ""),  # Extracting the answer field
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

def analyze_tavily_answer(answer):
    if not answer:
        return 0, "No answer provided by Tavily"

    doc = nlp(answer)
    blob = TextBlob(answer)
    sentiment = blob.sentiment.polarity  # -1 (negative) to 1 (positive)

    # Basic heuristic scoring
    credibility_score = 0
    analysis_summary = ""

    if sentiment < -0.2:
        credibility_score -= 10  # Misinformation often has negative sentiment
        analysis_summary += "Answer has negative sentiment, indicating possible bias.\n"

    if any(token.text.lower() in ["fake", "hoax", "misleading"] for token in doc):
        credibility_score -= 15
        analysis_summary += "Detected keywords related to misinformation.\n"

    if any(ent.label_ in ["ORG", "GPE"] for ent in doc.ents):
        credibility_score += 5  # Named entities indicate informative content
        analysis_summary += "Contains references to credible organizations.\n"

    return credibility_score, analysis_summary


def format_newsapi_data(data):
    return {
        "articles": [
            {
                "source": article.get("source", {}).get("name", "Unknown"),
                "title": article.get("title", ""),
                "url": article.get("url", ""),
                "publishedAt": article.get("publishedAt", "")
            }
            for article in data.get("articles", [])[:3]
        ]
    }

# Main Analysis Function
def analyze_text(text):
    tavily_data = analyze_with_tavily(text)
    print(tavily_data)
    newsapi_data = analyze_with_newsapi(text)
    return process_results(tavily_data, newsapi_data)

# Main processing function
def process_results(tavily, newsapi):
    score = 50
    factors = []

    # Analyze Tavily's extracted answer
    if tavily and "answer" in tavily:
        credibility_score, analysis_summary = analyze_tavily_answer(tavily["answer"])
        score += credibility_score
        factors.append(f"Tavily Answer Analysis: {analysis_summary}")

    # Tavily sources credibility check
    if tavily and tavily.get("results"):
        credible_sources = sum(
            1
            for r in tavily["results"]
            if any(domain in r.get("source", "").lower() for domain in [".gov", ".edu", "who.int"])
        )
        score += credible_sources * 5
        factors.append(f"Tavily: {credible_sources} authoritative sources")

    # NewsAPI credibility check
    if newsapi and newsapi.get("articles"):
        credible_outlets = ["reuters", "associated press", "bbc", "new york times", "guardian"]
        credible_articles = sum(
            1 for a in newsapi["articles"] if any(outlet in a["source"].lower() for outlet in credible_outlets)
        )
        score += credible_articles * 7
        factors.append(f"NewsAPI: {credible_articles} credible news articles")

    final_score = max(0, min(100, round(score)))
    return {
        "confidence": final_score,
        "isLikelyFake": final_score < 40,
        "summary": "\n".join(factors) or "Insufficient data for analysis",
        "rawData": {
            "tavilyData": tavily,
            "newsapiData": newsapi,
        },
    }

if __name__ == "__main__":
    query = "COVID-19 vaccines are carcinogenic"
    result = analyze_text(query)
    print(result)