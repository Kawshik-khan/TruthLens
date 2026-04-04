"""
Fake News Detection using facebook/bart-large-mnli (Zero-Shot Classification)
"""
from transformers import pipeline
from pydantic import BaseModel
from typing import Optional
import time

# Lazy-loaded model
_classifier = None


def _get_classifier():
    global _classifier
    if _classifier is None:
        print("[fake_news] Loading facebook/bart-large-mnli model...")
        _classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",
            device=-1,  # CPU; set to 0 for GPU
        )
        print("[fake_news] Model loaded successfully.")
    return _classifier


class FakeNewsRequest(BaseModel):
    text: str
    candidate_labels: Optional[list[str]] = None


class FakeNewsResponse(BaseModel):
    label: str  # TRUE, FALSE, MISLEADING, UNCERTAIN
    confidence: float
    explanation: str
    scores: dict[str, float]
    processing_time_ms: int


def analyze(text: str, candidate_labels: list[str] | None = None) -> FakeNewsResponse:
    start = time.time()
    
    labels = candidate_labels or [
        "This is a true and factual statement",
        "This is false or fabricated information",
        "This is misleading or out of context",
        "This cannot be verified",
    ]
    
    classifier = _get_classifier()
    result = classifier(text, labels, multi_label=False)
    
    # Map model output to our label system
    label_map = {
        "This is a true and factual statement": "TRUE",
        "This is false or fabricated information": "FALSE",
        "This is misleading or out of context": "MISLEADING",
        "This cannot be verified": "UNCERTAIN",
    }
    
    top_label_raw = result["labels"][0]
    top_label = label_map.get(top_label_raw, "UNCERTAIN")
    top_score = result["scores"][0]
    
    scores = {}
    for lbl, score in zip(result["labels"], result["scores"]):
        mapped = label_map.get(lbl, lbl)
        scores[mapped] = round(score, 4)
    
    # Generate explanation
    if top_label == "TRUE":
        explanation = f"This statement appears to be factual with {top_score:.0%} confidence based on linguistic analysis."
    elif top_label == "FALSE":
        explanation = f"This statement shows strong indicators of being fabricated or false ({top_score:.0%} confidence)."
    elif top_label == "MISLEADING":
        explanation = f"This statement appears to be misleading or taken out of context ({top_score:.0%} confidence)."
    else:
        explanation = f"This statement could not be confidently classified. Further verification is recommended."
    
    elapsed_ms = int((time.time() - start) * 1000)
    
    return FakeNewsResponse(
        label=top_label,
        confidence=round(top_score, 4),
        explanation=explanation,
        scores=scores,
        processing_time_ms=elapsed_ms,
    )
