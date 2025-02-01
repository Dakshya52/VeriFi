import os
from dotenv import load_dotenv

load_dotenv()

API_KEYS = {
    "TAVILY": os.getenv("TAVILY_API"),
    "NEWSAPI": os.getenv("NEWS_API"),
}

FASTAPI_URL = os.getenv("FASTAPI_URL", "http://localhost:8000")
