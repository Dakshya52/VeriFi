# VeriFi - Misinformation Detection Chrome Extension

## Overview
VeriFi is a Chrome extension designed to detect misinformation and fact-check news articles on social media. It combines machine learning models and API-based verification techniques to provide users with a reliability score for news articles and posts, helping them make informed decisions about the authenticity of the information they consume.

## How It Works
VeriFi assigns a total misinformation score out of 100 by integrating two components:

1. **[Fake-News-BERT Model](https://huggingface.co/dhruvpal/fake-news-bert) (50 points)**: A custom-trained BERT-based model that predicts the likelihood of a news article being real or fake based on textual analysis.
2. **API-Based Verification (50 points)**: VeriFi uses:
   - [**News API**]() to cross-check the credibility of the source.
   - [**Tavily API**]() to verify claims by searching for relevant fact-checked content.

Both methods independently provide scores between 0 and 50. The final score is the combined sum of these values, ensuring robustness—if one method underperforms, the other compensates.

## [Fake-News-BERT Model](https://huggingface.co/dhruvpal/fake-news-bert)
The Fake-News-BERT model is a deep learning model fine-tuned for misinformation detection. It was developed using the following approach:

- [**Dataset**](https://github.com/dhruvpal05): The model was trained on a dataset of 72,134 news articles with 35,028 real and 37,106 fake news. Dataset contains four columns: Serial number (starting from 0); Title (about the text news heading); Text (about the news content); and Label (0 = fake and 1 = real). 
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
   git clone https://github.com/dhruvpal05/verifi.git
   ```
2. Navigate to the directory:
   ```bash
   cd verifi/verify
   ```
3. Load the extension in Chrome:
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
