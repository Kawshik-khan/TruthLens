"""
Sentiment Analysis using distilbert-base-uncased-finetuned-sst-2-english
"""
from transformers import pipeline
from pydantic import BaseModel
import time

# Lazy-loaded model
_classifier = None


def _get_classifier():
    global _classifier
    if _classifier is None:
        print("[sentiment] Loading distilbert-base-uncased-finetuned-sst-2-english model...")
        _classifier = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
            device=-1,
            top_k=None,  # Return all scores
        )
        print("[sentiment] Model loaded successfully.")
    return _classifier


class SentimentRequest(BaseModel):
    text: str


class SentimentResponse(BaseModel):
    sentiment: str  # POSITIVE, NEGATIVE
    confidence: float
    scores: dict[str, float]
    processing_time_ms: int


def analyze(text: str) -> SentimentResponse:
    start = time.time()
    
    classifier = _get_classifier()
    
    # Truncate to model max length (512 tokens ~ 2000 chars)
    truncated = text[:2000]
    results = classifier(truncated)
    
    # results is a list of lists: [[{label, score}, ...]]
    scores_list = results[0] if isinstance(results[0], list) else results
    
    scores = {}
    top_label = ""
    top_score = 0.0
    
    for item in scores_list:
        label = item["label"].upper()
        score = item["score"]
        scores[label] = round(score, 4)
        if score > top_score:
            top_score = score
            top_label = label
    
    elapsed_ms = int((time.time() - start) * 1000)
    
    return SentimentResponse(
        sentiment=top_label,
        confidence=round(top_score, 4),
        scores=scores,
        processing_time_ms=elapsed_ms,
    )
