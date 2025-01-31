import tweepy
import snscrape.modules.twitter as sntwitter
import pandas as pd
import os
import time
from urllib.parse import urlparse
from dotenv import load_dotenv

# Load API keys from .env file
load_dotenv()

API_KEY = os.getenv("TWITTER_API_KEY")
print(API_KEY)
API_SECRET = os.getenv("TWITTER_API_SECRET")
ACCESS_TOKEN = os.getenv("TWITTER_ACCESS_TOKEN")
ACCESS_SECRET = os.getenv("TWITTER_ACCESS_SECRET")

# Authenticate with Twitter API
auth = tweepy.OAuthHandler(API_KEY, API_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)
api = tweepy.API(auth, wait_on_rate_limit=True)

# Search Queries
queries = ["politics", "healthcare", "government", "public health"]
max_tweets = 500  # Adjust as needed

# Store results
data = []

# Function to extract source domain
def extract_source_domain(url):
    try:
        return urlparse(url).netloc if url else None
    except:
        return None

# Fetch tweets using Tweepy API
def fetch_tweets_tweepy():
    global data
    for query in queries:
        try:
            for tweet in tweepy.Cursor(api.search_tweets, q=query, lang="en", tweet_mode="extended").items(max_tweets):
                title = tweet.full_text
                news_url = tweet.entities["urls"][0]["expanded_url"] if tweet.entities["urls"] else None
                source_domain = extract_source_domain(news_url)
                tweet_num = tweet.favorite_count + tweet.retweet_count  # Engagement metric
                
                data.append([title, news_url, source_domain, tweet_num])
        except Exception as e:
            print(f"Error with Tweepy: {e}")
            return False
    return True

# Fetch tweets using SNScrape (No API key required)
def fetch_tweets_snscrape():
    global data
    for query in queries:
        try:
            for i, tweet in enumerate(sntwitter.TwitterSearchScraper(f"{query} lang:en since:2024-01-01").get_items()):
                if i >= max_tweets:
                    break
                news_url = tweet.url
                source_domain = extract_source_domain(news_url)
                tweet_num = tweet.likeCount + tweet.retweetCount  # Engagement metric
                
                data.append([tweet.content, news_url, source_domain, tweet_num])
        except Exception as e:
            print(f"Error with SNScrape: {e}")

# Try Tweepy first, fallback to SNScrape if necessary
if not fetch_tweets_tweepy():
    print("Using SNScrape as a fallback...")
    fetch_tweets_snscrape()

# Convert to DataFrame
df = pd.DataFrame(data, columns=["title", "news_url", "source_domain", "tweet_num"])

# Save as CSV
df.to_csv("twitter_news_data.csv", index=False)

print("Scraping complete! Data saved as twitter_news_data.csv")
