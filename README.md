# VeriFi - Misinformation Classification Chrome Extension

## Overview
VeriFi is a Chrome extension designed to detect misinformation and fact-check news articles on social media. It combines machine learning models and API-based verification techniques to provide users with a reliability score for news articles and posts, helping them make informed decisions about the authenticity of the information they consume.

## How it Works

### 1. Tavily Analysis
- **Debunked Keywords:** Reduces score (-2 per keyword, -30 base penalty if found).
- **Verified Content:** Rewards score (+1 per supporting source, +15 base reward).

### 2. NewsAPI Scoring
- **Credible Sources:** +8 per article from Reuters/AP.
- **Fact-Checking Websites:** +12 per article from Snopes, FactCheck.org.
- **Unverified Sources:** -3 per unreliable article.

### 3. AI Model Scoring
- Predicts fake: Reduces score (-25 scaled by confidence level).
- Predicts credible: Increases score (+15 scaled by confidence level).

## Confidence Score Calculation
1. **Base Score:** 50
2. **Adjustments:** Based on Tavily, NewsAPI, and AI model results.
3. **Randomness:** Small variances to avoid rigid thresholds.
4. **Final Score:** Clamped between 5-95, rounded to whole number.

## Fake News Classification
- Threshold: **45 ±5** to avoid rigid boundaries.

## Example Outcomes
### Fake News
- Tavily: 5 debunking keywords (-40)
- AI Model: Predicts fake (90% confidence, -22.5)
- **Final Score:** 5 (Clamped) → **Likely Fake**

### Credible News
- Tavily: 3 supporting sources (+18)
- NewsAPI: 2 credible sources (+16)
- AI Model: Predicts credible (80% confidence, +12)
- **Final Score:** 95 → **Likely Credible**

### Borderline News
- Tavily: 1 supporting source (+16)
- NewsAPI: 1 unverified source (-3)
- AI Model: Predicts credible (50% confidence, +7.5)
- **Final Score:** 71 → **Likely Credible**


## [Fake-News-BERT Model](https://huggingface.co/dhruvpal/fake-news-bert)
The Fake-News-BERT model is a deep learning model fine-tuned for misinformation detection. It was developed using the following approach:

- [**Dataset**](https://www.kaggle.com/datasets/saurabhshahane/fake-news-classification): The model was trained on a dataset of 72,134 news articles with 35,028 real and 37,106 fake news. Dataset contains four columns: Serial number (starting from 0); Title (about the text news heading); Text (about the news content); and Label (0 = fake and 1 = real). 
- **Preprocessing**: Text cleaning, tokenization, and feature extraction were performed using NLP techniques.
- **Model Training**: A BERT-based transformer model was fine-tuned using supervised learning.
- **Evaluation**: The model was validated using accuracy, F1-score, and other performance metrics.

## Features
- **Real-time Fact-Checking**: VeriFi analyzes news articles and social media posts in real time.
- **Reliable Scoring System**: The hybrid approach ensures accurate misinformation detection.
- **Seamless Browser Integration**: Works as a Chrome extension with a simple UI for quick insights.
- **Secure & Efficient**: Processes data securely without storing user information.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Dakshya52/verifi.git
   ```
2. Navigate to the directory:
   ```bash
   cd verifi/verifi
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the extension:
   ```bash
   npm run build
   ```   
5. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `VeriFi/verifi/dist` folder
   
## Usage
- Once installed, you don't need to do anything further.
- Open X.com, and on the bottom left of every post, you will see a button.
- Click it to verify the credibility of the post—that's it!

## Contributors
- **Dakshya** - [GitHub](https://github.com/Dakshya52) | [LinkedIn](https://www.linkedin.com/in/dakshya-chauhan-942920261/)
- **Dhruv** - [GitHub](https://github.com/dhruvpal05) | [LinkedIn](https://linkedin.com/in/idhruvpal)

## License
This project is open-source and available under the MIT License.
