import spacy
from textblob import TextBlob

nlp = spacy.load("en_core_web_sm")

def analyze_tavily_answer(answer):
    if not answer:
        return 0, "No answer provided by Tavily"

    doc = nlp(answer)
    blob = TextBlob(answer)
    sentiment = blob.sentiment.polarity

    credibility_score = 0
    analysis_summary = ""

    if sentiment < -0.2:
        credibility_score -= 10
        analysis_summary += "Answer has negative sentiment, indicating possible bias.\n"

    if any(token.text.lower() in ["fake", "hoax", "misleading"] for token in doc):
        credibility_score -= 15
        analysis_summary += "Detected keywords related to misinformation.\n"

    if any(ent.label_ in ["ORG", "GPE"] for ent in doc.ents):
        credibility_score += 5
        analysis_summary += "Contains references to credible organizations.\n"

    return credibility_score, analysis_summary

def process_results(tavily, newsapi):
    score = 50
    factors = []

    if tavily and "answer" in tavily:
        credibility_score, analysis_summary = analyze_tavily_answer(tavily["answer"])
        score += credibility_score
        factors.append(f"Tavily Analysis: {analysis_summary}")

    if newsapi and newsapi.get("articles"):
        credible_outlets = ["reuters", "associated press", "bbc", "new york times", "guardian"]
        credible_articles = sum(
            1 for a in newsapi["articles"] if any(outlet in a["source"].lower() for outlet in credible_outlets)
        )
        score += credible_articles * 7
        factors.append(f"NewsAPI: {credible_articles} credible news articles found.")

    final_score = max(0, min(50, round(score)))
    return {
        "fact_check_score": final_score,
        "isLikelyFake": final_score < 20,
        "summary": "\n".join(factors) or "Insufficient data for analysis",
    }
