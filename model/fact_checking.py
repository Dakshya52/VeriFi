import requests
from config import API_KEYS

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
        return response.json()
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
        return response.json()
    except requests.RequestException as e:
        print("NewsAPI Error:", e)
        return None
