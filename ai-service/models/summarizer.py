"""
Text Summarization using facebook/bart-large-cnn
"""
from transformers import pipeline
from pydantic import BaseModel
import time
import re

# Lazy-loaded model
_summarizer = None


def _get_summarizer():
    global _summarizer
    if _summarizer is None:
        print("[summarizer] Loading facebook/bart-large-cnn model...")
        _summarizer = pipeline(
            "summarization",
            model="facebook/bart-large-cnn",
            device=-1,
        )
        print("[summarizer] Model loaded successfully.")
    return _summarizer


class SummarizeRequest(BaseModel):
    text: str
    max_length: int = 200
    min_length: int = 50


class SummarizeResponse(BaseModel):
    summary: str
    bullet_points: list[str]
    original_length: int
    summary_length: int
    compression_ratio: float
    processing_time_ms: int


def _extract_bullet_points(summary: str) -> list[str]:
    """Break summary into key bullet points."""
    # Split on sentence boundaries
    sentences = re.split(r'(?<=[.!?])\s+', summary.strip())
    bullets = [s.strip() for s in sentences if len(s.strip()) > 15]
    return bullets[:5]  # Max 5 bullet points


def analyze(text: str, max_length: int = 200, min_length: int = 50) -> SummarizeResponse:
    start = time.time()
    
    summarizer = _get_summarizer()
    
    # BART-CNN has a 1024 token limit; truncate input text
    truncated = text[:4000]
    original_length = len(text)
    
    # Ensure min_length < max_length and text is long enough
    if len(truncated) < min_length:
        min_length = max(10, len(truncated) // 2)
    if min_length >= max_length:
        min_length = max(10, max_length - 20)
    
    result = summarizer(
        truncated,
        max_length=max_length,
        min_length=min_length,
        do_sample=False,
    )
    
    summary_text = result[0]["summary_text"]
    bullet_points = _extract_bullet_points(summary_text)
    
    elapsed_ms = int((time.time() - start) * 1000)
    
    return SummarizeResponse(
        summary=summary_text,
        bullet_points=bullet_points,
        original_length=original_length,
        summary_length=len(summary_text),
        compression_ratio=round(len(summary_text) / max(original_length, 1), 4),
        processing_time_ms=elapsed_ms,
    )
