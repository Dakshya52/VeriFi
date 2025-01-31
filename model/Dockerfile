# Use an official Python runtime as base image
FROM python:3.10-slim

# Set environment variables
ENV MODEL_PATH=/app/news_classification_model

# Set the working directory
WORKDIR /app

# Copy necessary files
COPY news_classification_model ./news_classification_model
COPY app.py ./app.py
COPY requirements.txt ./requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Run the API server
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
