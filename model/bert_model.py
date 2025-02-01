import requests
from config import FASTAPI_URL

def predict_with_bert(text):
    """
    Sends text to the FastAPI model running in Docker and gets a prediction.
    """
    try:
        url = f"{FASTAPI_URL}/predict"
        payload = {"text": text}
        headers = {"Content-Type": "application/json"}

        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        result = response.json()

        return result.get("prediction", 0)  # Default to Fake if response is invalid
    except requests.RequestException as e:
        print(f"Error calling model API: {e}")
        return 0  # Default to Fake if API fails
