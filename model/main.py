from transformers import BertForSequenceClassification, BertTokenizer
import torch

# Specify the local directory
local_model_dir = "./news_classification_model"

# Load the model and tokenizer
model = BertForSequenceClassification.from_pretrained(local_model_dir)
tokenizer = BertTokenizer.from_pretrained(local_model_dir)

print("Model and tokenizer loaded successfully.")

def predict(text):
    # Tokenize the input
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)

    # Move inputs to the same device as the model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    inputs = {key: val.to(device) for key, val in inputs.items()}

    # Make prediction
    with torch.no_grad():  # Disable gradient calculation for inference
        outputs = model(**inputs)
        logits = outputs.logits
        prediction = torch.argmax(logits, dim=1).item()

    return "Real" if prediction == 1 else "Fake"

# Example usage
sample_title = "COVID-19 vaccines are carcinogenic"
print(f"Prediction: {predict(sample_title)}")
