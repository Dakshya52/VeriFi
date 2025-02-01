from bert_model import predict_with_bert
from image_verification import verify_image
from fact_checking import analyze_with_tavily, analyze_with_newsapi
from scoring import process_results

def analyze_text(text, media_url=None):
    bert_prediction = predict_with_bert(text)
    bert_score = 50 if bert_prediction == 1 else 0

    media_score = 0
    is_media_fake = False
    if media_url:
        media_verification = verify_image(media_url)
        if media_verification == "Fake":
            media_score -= 10
            is_media_fake = True

    tavily_data = analyze_with_tavily(text)
    newsapi_data = analyze_with_newsapi(text)
    fact_check_result = process_results(tavily_data, newsapi_data)

    fact_check_score = fact_check_result["fact_check_score"]
    is_fake = is_media_fake or bert_score == 0 or fact_check_score == 0

    final_score = bert_score + fact_check_score + media_score
    is_fake = final_score < 40

    return {
        "final_score": final_score,
        "isLikelyFake": is_fake,
        "bert_score": bert_score,
        "fact_check_score": fact_check_score,
        "media_score": media_score,
        "fact_check_analysis": fact_check_result["summary"],
    }

if __name__ == "__main__":
    # docker run -p 8000:8000 bert-fastapi
    text = "AOC is far more educated than Trump."
    media_url = None  
    result = analyze_text(text, media_url)
    print(f"Final Score: {result['final_score']}, Likely Fake: {result['isLikelyFake']}")
