# AIzaSyCQTQGQAIMhNFoquFzpAkIvITJkEpKL7rk - google fact checker api
# 6d03e6ee518e4a6bb882787ca015ff3b - news api
import requests

# Google Fact Check Explorer API
def fetch_google_fact_check(query, api_key):
    """
    Fetch fact-check results from Google Fact Check Explorer API.
    """
    url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
    params = {"query": query, "key": api_key}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        results = []
        for claim in data.get("claims", []):
            status = claim.get("reviewRating", {}).get("text", "Unverified")
            source = claim.get("publisher", {}).get("name", "Unknown Source")
            results.append({"status": status, "source": source, "api": "Google Fact Check"})
        
        return results

    except requests.exceptions.RequestException as e:
        print(f"Google API Error: {e}")
        return []

# News API
def fetch_news_articles(query, news_api_key):
    """
    Fetch news articles related to the query from the News API.
    """
    url = "https://newsapi.org/v2/everything"
    params = {"q": query, "apiKey": news_api_key, "pageSize": 5}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        results = []
        for article in data.get("articles", []):
            title = article.get("title", "No Title")
            source = article.get("source", {}).get("name", "Unknown Source")
            url = article.get("url", "")
            results.append({"status": "Unverified", "source": source, "title": title, "url": url, "api": "News API"})
        
        return results

    except requests.exceptions.RequestException as e:
        print(f"News API Error: {e}")
        return []

# Unified Fact-Checking Function
def unified_fact_check(query, google_api_key, news_api_key):
    """
    Fetch fact-check results from both Google and News APIs and combine them.
    """
    google_results = fetch_google_fact_check(query, google_api_key)
    news_results = fetch_news_articles(query, news_api_key)

    combined_results = google_results + news_results
    return combined_results

# Replace these with your actual API keys
GOOGLE_API_KEY = "AIzaSyCQTQGQAIMhNFoquFzpAkIvITJkEpKL7rk"
NEWS_API_KEY = "6d03e6ee518e4a6bb882787ca015ff3b"

# Query to fact-check
query = "Covid-19 vaccines are harmless"

# Perform unified fact-checking
fact_check_results = unified_fact_check(query, GOOGLE_API_KEY, NEWS_API_KEY)

# Display results
print(f"Fact-check results for query: '{query}'")
for i, result in enumerate(fact_check_results, 1):
    print(f"{i}. Status: {result['status']}")
    print(f"   Source: {result['source']}")
    if 'title' in result:
        print(f"   Title: {result['title']}")
    if 'url' in result:
        print(f"   URL: {result['url']}")
    print(f"   API: {result['api']}")




