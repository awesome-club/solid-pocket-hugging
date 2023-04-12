from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from typing import List

sentiment = pipeline("sentiment-analysis")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
tagger = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

app = FastAPI()

@app.get("/ai/summarize")
def get_summary(text: str):
    return summarizer(text)

@app.get("/ai/sentiment")
def get_sentiment(text: str):
    return sentiment(text)

@app.get("/ai/tags")
def get_tags(text: str, labels: str):
    return tagger(
        text,
        candidate_labels = labels.split(",")
    )