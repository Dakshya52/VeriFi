import requests

response = requests.post("http://localhost:8000/predict", json={"text": "Breaking news: AI is revolutionizing the industry!"})
print(response.json())  # Output: {'label': 2, 'scores': [...]}
