from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

# Initialize FastAPI app
app = FastAPI()

# Define request model
class TextRequest(BaseModel):
    text: str

# Load model and tokenizer
model_path = "news_classification_model"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path, trust_remote_code=True)
print(model.config.id2label)  # Check class labels

@app.post("/predict")
def predict(request: TextRequest):  # ✅ FastAPI now expects JSON in request body
    inputs = tokenizer(request.text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
    return {"label": predictions.argmax().item(), "scores": predictions.tolist()}
