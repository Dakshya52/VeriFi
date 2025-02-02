# VeriFi by SkyNet

## Overview
The Fake News Detection Chrome Extension is a powerful tool designed to help users identify misinformation on social media platforms like X (formerly Twitter). The extension uses advanced natural language processing (NLP) and fact-checking techniques to analyze text and media content, providing a credibility score and indicating whether the news is likely fake.

## Features
- **Text Analysis with BERT**: Uses a pre-trained BERT model to predict the likelihood of fake news.
- **Image Verification**: Checks media authenticity using AI-based image verification.
- **Fact-Checking API Integration**: Utilizes Tavily and NewsAPI for cross-referencing claims.
- **Comprehensive Scoring System**: Assigns a final credibility score based on text, media, and fact-checking results.
- **Chrome Extension Integration**: Works seamlessly with social media platforms.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Dakshya52/VeriFi
   ```
2. Navigate to the project directory:
   ```sh
   cd VeriFi
   ```
3. Install backend dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Start the FastAPI backend:
   ```sh
   uvicorn main:app --host 0.0.0.0 --port 8001
   ```
5. Load the Chrome extension:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extension` folder

## API Endpoints
### `POST /analyze/`
Analyzes a tweet's text and media content to determine credibility.
#### Request Body:
```json
{
  "text": "Breaking: Major event happening now!",
  "media_url": "https://example.com/image.jpg"
}
```
#### Response:
```json
{
  "final_score": 45,
  "isLikelyFake": false,
  "bert_score": 50,
  "fact_check_score": 5,
  "media_score": -10,
  "fact_check_analysis": "News partially verified by trusted sources."
}
```

## Marking System
The final credibility score is computed as follows:
- **BERT Prediction Score (50 or 0)**: Based on the text analysis model.
- **Fact-Checking Score (0-50)**: Derived from external API sources like Tavily and NewsAPI.
  
| Final Score | Likely Fake? |
|------------|--------------|
| 0 - 39    | ✅ Yes       |
| 40 - 100  | ❌ No        |

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Added new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a pull request

## License
This project is licensed under the MIT License.

## Contact
**Developers:** Dakshya and Dhruv 
**LinkedIn:** [linkedin.com/in/idhruvpal](https://linkedin.com/in/idhruvpal)

