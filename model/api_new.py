import requests
import os
import spacy
from dotenv import load_dotenv
from textblob import TextBlob
from collections import Counter

# Load API Keys
load_dotenv()
API_KEYS = {
    "TAVILY": os.getenv("TAVILY_API"),
    "NEWSAPI": os.getenv("NEWS_API"),
}

# Load NLP Model
nlp = spacy.load("en_core_web_sm")

# Define trusted news sources
TRUSTED_SOURCES = ["bbc", "reuters", "associated press", "new york times", "guardian", "The Hindu", "Times of India", "NDTV", "India Today", "The Economic Times", "The Indian Express", "Hindustan Times", "Scroll.in", "Mint", "The Wire"]

# Function to fetch data from Tavily
def fetch_tavily_results(query):
    url = "https://api.tavily.com/search"
    headers = {"Content-Type": "application/json"}
    payload = {"api_key": API_KEYS["TAVILY"], "query": query, "search_depth": "advanced", "include_answer": True}

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Tavily Error: {e}")
        return None

# Function to fetch data from NewsAPI
def fetch_newsapi_results(query):
    url = "https://newsapi.org/v2/everything"
    params = {"q": query, "language": "en", "apiKey": API_KEYS["NEWSAPI"]}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"NewsAPI Error: {e}")
        return None

# Function to extract and process relevant information
def process_results(tavily, newsapi):
    score = 50
    factors = []

    # Extract Tavily answer
    tavily_answer = tavily.get("answer", "") if tavily else ""
    if tavily_answer:
        sentiment_score = TextBlob(tavily_answer).sentiment.polarity
        if sentiment_score < -0.2:
            score -= 10
            factors.append("Negative sentiment detected in Tavily answer.")
        elif sentiment_score > 0.2:
            score += 5
            factors.append("Positive sentiment detected, reducing potential misinformation.")

    # Extract credible sources from Tavily
    if tavily and "results" in tavily:
        credible_sources = sum(1 for r in tavily["results"] if any(src in r.get("source", "").lower() for src in TRUSTED_SOURCES))
        score += credible_sources * 5
        factors.append(f"Tavily: {credible_sources} reliable sources found.")

    # Extract credible sources from NewsAPI
    if newsapi and "articles" in newsapi:
        credible_articles = sum(1 for a in newsapi["articles"] if any(src in a["source"]["name"].lower() for src in TRUSTED_SOURCES))
        score += credible_articles * 7
        factors.append(f"NewsAPI: {credible_articles} articles from reliable sources.")

    # Cross-verification: Check if multiple sources report the same claim
    all_titles = [a["title"] for a in newsapi["articles"]] if newsapi else []
    most_common_title, count = Counter(all_titles).most_common(1)[0] if all_titles else ("", 0)

    if count >= 2:
        score += 10
        factors.append(f"Claim verified by multiple sources ({count} matching articles).")

    final_score = max(0, min(100, score))
    return {
        "confidence": final_score,
        "isLikelyFake": final_score < 40,
        "summary": "\n".join(factors),
        "rawData": {"tavilyData": tavily, "newsapiData": newsapi},
    }

# Main function
def analyze_text(text):
    tavily_data = fetch_tavily_results(text)
    newsapi_data = fetch_newsapi_results(text)
    return process_results(tavily_data, newsapi_data)

# Example run
if __name__ == "__main__":
    query = "arvind kejriwal is the new prime minister of india"
    result = analyze_text(query)
    print(result)