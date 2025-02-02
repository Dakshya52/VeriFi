from fastapi import FastAPI
from transformers import AutoModel, AutoTokenizer
import torch
import uvicorn

app = FastAPI()

# Provide the full path to the local model directory
MODEL_PATH = "./model"  # <-- Update this

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, local_files_only=True)
model = AutoModel.from_pretrained(MODEL_PATH, local_files_only=True)

@app.get("/")
def home():
    return {"message": "Model is running!"}

@app.post("/predict/")
def predict(text: str):
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    
    return {"output": outputs.last_hidden_state.tolist()}

if __name__ == "_main_":
    uvicorn.run(app, host="0.0.0.0", port=8000)