"""
TruthLens AI Microservice — FastAPI Application
Provides 6 AI-powered endpoints for news analysis.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import time

# Load env vars from parent .env
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

app = FastAPI(
    title="TruthLens AI Service",
    description="AI-powered news analysis microservice for TruthLens",
    version="1.0.0",
)

# CORS — allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health Check ──────────────────────────────────────────────

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "TruthLens AI",
        "version": "1.0.0",
        "timestamp": time.time(),
    }


# ── Request/Response Models ───────────────────────────────────

class TextRequest(BaseModel):
    text: str


class ChatRequestBody(BaseModel):
    message: str
    context: str | None = None
    history: list[dict] | None = None


class DomainRequest(BaseModel):
    domain: str


class SummarizeRequestBody(BaseModel):
    text: str
    max_length: int = 200
    min_length: int = 50


# ── Endpoints ─────────────────────────────────────────────────

@app.post("/fake-news")
async def fake_news_endpoint(req: TextRequest):
    """Analyze text for fake news indicators using BART-MNLI zero-shot classification."""
    if not req.text or len(req.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text must be at least 10 characters")
    
    from models.fake_news import analyze
    result = analyze(req.text)
    return result.model_dump()


@app.post("/sentiment")
async def sentiment_endpoint(req: TextRequest):
    """Analyze sentiment of text using DistilBERT."""
    if not req.text or len(req.text.strip()) < 5:
        raise HTTPException(status_code=400, detail="Text must be at least 5 characters")
    
    from models.sentiment import analyze
    result = analyze(req.text)
    return result.model_dump()


@app.post("/summarize")
async def summarize_endpoint(req: SummarizeRequestBody):
    """Summarize text using BART-CNN."""
    if not req.text or len(req.text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Text must be at least 50 characters for summarization")
    
    from models.summarizer import analyze
    result = analyze(req.text, req.max_length, req.min_length)
    return result.model_dump()


@app.post("/claims")
async def claims_endpoint(req: TextRequest):
    """Extract claims and named entities using BERT-NER."""
    if not req.text or len(req.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text must be at least 10 characters")
    
    from models.claim_extractor import analyze
    result = analyze(req.text)
    return result.model_dump()


@app.post("/chat")
async def chat_endpoint(req: ChatRequestBody):
    """AI chat about fact-checking and media literacy."""
    if not req.message or len(req.message.strip()) < 2:
        raise HTTPException(status_code=400, detail="Message must not be empty")
    
    from models.chatbot import analyze
    result = await analyze(req.message, req.context, req.history)
    return result.model_dump()


@app.post("/credibility")
async def credibility_endpoint(req: DomainRequest):
    """Check source credibility for a given domain."""
    if not req.domain or len(req.domain.strip()) < 3:
        raise HTTPException(status_code=400, detail="Please provide a valid domain")
    
    from models.credibility import analyze
    result = analyze(req.domain)
    return result.model_dump()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
