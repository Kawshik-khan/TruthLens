"""
Text Summarization using facebook/bart-large-cnn.
Falls back to an extractive summary if model load/inference fails.
"""
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from pydantic import BaseModel
import time
import re
import torch

# Lazy-loaded model/tokenizer
_tokenizer = None
_model = None
_model_load_error = None


def _get_model_and_tokenizer():
    global _tokenizer, _model, _model_load_error
    if _tokenizer is not None and _model is not None:
        return _tokenizer, _model

    if _model_load_error is not None:
        raise RuntimeError(_model_load_error)

    try:
        print("[summarizer] Loading facebook/bart-large-cnn model...")
        _tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
        _model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn")
        _model.eval()
        print("[summarizer] Model loaded successfully.")
        return _tokenizer, _model
    except Exception as exc:
        _model_load_error = str(exc)
        raise


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


def _fallback_summary(text: str, max_chars: int = 700) -> str:
    """Simple extractive fallback to keep endpoint functional without model inference."""
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    if not sentences:
        return text[:max_chars].strip()

    picked: list[str] = []
    total = 0
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        if len(sentence) < 30 and picked:
            continue
        picked.append(sentence)
        total += len(sentence)
        if len(picked) >= 4 or total >= max_chars:
            break
    return " ".join(picked).strip() or text[:max_chars].strip()


def analyze(text: str, max_length: int = 200, min_length: int = 50) -> SummarizeResponse:
    start = time.time()

    # BART-CNN has a 1024 token limit; truncate input text
    truncated = text[:4000]
    original_length = len(text)

    # Ensure min_length < max_length and text is long enough
    if len(truncated) < min_length:
        min_length = max(10, len(truncated) // 2)
    if min_length >= max_length:
        min_length = max(10, max_length - 20)

    try:
        tokenizer, model = _get_model_and_tokenizer()
        inputs = tokenizer(
            truncated,
            return_tensors="pt",
            max_length=1024,
            truncation=True,
        )

        with torch.no_grad():
            output_ids = model.generate(
                input_ids=inputs["input_ids"],
                attention_mask=inputs.get("attention_mask"),
                max_length=max_length,
                min_length=min_length,
                num_beams=4,
                do_sample=False,
                early_stopping=True,
            )
        summary_text = tokenizer.decode(output_ids[0], skip_special_tokens=True).strip()
    except Exception as exc:
        print(f"[summarizer] Model inference failed, using fallback summary: {exc}")
        summary_text = _fallback_summary(truncated)

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
