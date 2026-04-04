"""
AI Chatbot using Gemini API with zero-shot fallback
"""
from pydantic import BaseModel
from typing import Optional
import httpx
import os
import time
import json


class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None  # Optional submission/analysis context
    history: Optional[list[dict]] = None  # Previous messages [{role, content}]


class ChatResponse(BaseModel):
    reply: str
    source: str  # "gemini" or "fallback"
    processing_time_ms: int


SYSTEM_PROMPT = """You are TruthLens AI Assistant — an expert in media literacy, fact-checking, and misinformation detection.

Your role:
- Help users understand news credibility, bias, and misinformation tactics
- Explain AI analysis results from the TruthLens platform
- Provide guidance on how to verify information independently
- Answer questions about media literacy and critical thinking

Guidelines:
- Be concise but thorough
- Cite reasoning, not just conclusions
- If unsure, say so — never fabricate information
- Keep responses focused on the topic of information verification"""


async def analyze(message: str, context: str | None = None, history: list[dict] | None = None) -> ChatResponse:
    start = time.time()
    
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    if gemini_key:
        try:
            reply = await _call_gemini(message, context, history, gemini_key)
            elapsed_ms = int((time.time() - start) * 1000)
            return ChatResponse(reply=reply, source="gemini", processing_time_ms=elapsed_ms)
        except Exception as e:
            print(f"[chatbot] Gemini API error: {e}, falling back to offline mode")
    
    # Fallback: simple rule-based response
    reply = _fallback_response(message)
    elapsed_ms = int((time.time() - start) * 1000)
    return ChatResponse(reply=reply, source="fallback", processing_time_ms=elapsed_ms)


async def _call_gemini(message: str, context: str | None, history: list[dict] | None, api_key: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    
    # Build conversation contents
    contents = []
    
    # Add system context
    system_message = SYSTEM_PROMPT
    if context:
        system_message += f"\n\nCurrent analysis context:\n{context}"
    
    contents.append({
        "role": "user",
        "parts": [{"text": system_message + "\n\nPlease acknowledge and respond to the following conversation."}]
    })
    contents.append({
        "role": "model",
        "parts": [{"text": "I understand. I'm TruthLens AI Assistant, ready to help with fact-checking and media literacy questions. How can I help you?"}]
    })
    
    # Add conversation history
    if history:
        for msg in history[-6:]:  # Last 6 messages for context window
            role = "user" if msg.get("role", "").upper() == "USER" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg["content"]}]
            })
    
    # Add current message
    contents.append({
        "role": "user",
        "parts": [{"text": message}]
    })
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json={
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 1024,
            }
        })
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]


def _fallback_response(message: str) -> str:
    """Simple keyword-based fallback when Gemini is unavailable."""
    message_lower = message.lower()
    
    if any(w in message_lower for w in ["fake news", "misinformation", "disinformation"]):
        return ("Misinformation is false or inaccurate information spread regardless of intent. "
                "To identify it, look for: sensational headlines, anonymous sources, lack of citations, "
                "emotional language, and check if multiple reputable outlets report the same story. "
                "Use TruthLens's analysis tools to verify specific claims.")
    
    if any(w in message_lower for w in ["bias", "biased"]):
        return ("Media bias can manifest as selection bias (what stories are covered), "
                "presentation bias (how stories are framed), or confirmation bias (favoring information "
                "that confirms existing beliefs). Check our Source Database for bias ratings of specific outlets.")
    
    if any(w in message_lower for w in ["verify", "check", "fact"]):
        return ("To fact-check a claim: 1) Identify the specific claim being made. "
                "2) Search for the original source. 3) Check if multiple independent outlets report it. "
                "4) Look for expert opinions. 5) Use TruthLens's AI analysis for automated verification.")
    
    if any(w in message_lower for w in ["score", "trust", "credibility"]):
        return ("TruthLens Trust Scores range from 0-100. Scores above 80 indicate high reliability "
                "with multiple corroborating sources. Scores 50-80 suggest some supporting evidence. "
                "Scores below 50 indicate limited or contradictory evidence. The score factors in "
                "source credibility, claim verifiability, and AI analysis confidence.")
    
    return ("I'm TruthLens AI Assistant. I can help you understand fact-checking, media bias, "
            "and misinformation detection. Try asking about how to verify a specific claim, "
            "understand bias in media, or interpret your analysis results. "
            "Note: I'm currently in offline mode. Full AI capabilities require the Gemini API connection.")
