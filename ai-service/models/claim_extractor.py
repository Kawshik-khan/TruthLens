"""
Claim & Entity Extraction using dslim/bert-base-NER
"""
from transformers import pipeline
from pydantic import BaseModel
import time
import re

# Lazy-loaded model
_ner_pipeline = None


def _get_ner():
    global _ner_pipeline
    if _ner_pipeline is None:
        print("[claim_extractor] Loading dslim/bert-base-NER model...")
        _ner_pipeline = pipeline(
            "ner",
            model="dslim/bert-base-NER",
            aggregation_strategy="simple",
            device=-1,
        )
        print("[claim_extractor] Model loaded successfully.")
    return _ner_pipeline


class ClaimExtractorRequest(BaseModel):
    text: str


class Entity(BaseModel):
    text: str
    type: str  # PER, ORG, LOC, MISC
    confidence: float


class Claim(BaseModel):
    text: str
    entities: list[str]


class ClaimExtractorResponse(BaseModel):
    claims: list[Claim]
    entities: list[Entity]
    entity_count: int
    processing_time_ms: int


def _extract_sentences(text: str) -> list[str]:
    """Split text into sentences."""
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s.strip() for s in sentences if len(s.strip()) > 10]


def _is_factual_claim(sentence: str) -> bool:
    """Heuristic to identify factual claims (sentences with entities, numbers, dates)."""
    # Contains numbers, dates, percentages, or named entities indicators
    claim_indicators = [
        r'\d+',  # numbers
        r'(?:January|February|March|April|May|June|July|August|September|October|November|December)',
        r'\d{4}',  # years
        r'%',  # percentages
        r'(?:according to|reported|announced|confirmed|stated|claimed)',
        r'(?:million|billion|trillion|thousand)',
    ]
    
    for pattern in claim_indicators:
        if re.search(pattern, sentence, re.IGNORECASE):
            return True
    return False


def analyze(text: str) -> ClaimExtractorResponse:
    start = time.time()
    
    ner = _get_ner()
    
    # Run NER on the full text (truncated to model max)
    truncated = text[:2000]
    ner_results = ner(truncated)
    
    # Deduplicate and organize entities
    entity_map: dict[str, Entity] = {}
    for item in ner_results:
        entity_text = item["word"].strip()
        if len(entity_text) < 2 or entity_text.startswith("##"):
            continue
        
        # Clean up subword tokens
        entity_text = entity_text.replace(" ##", "").replace("##", "")
        
        key = entity_text.lower()
        entity_type = item["entity_group"]
        confidence = item["score"]
        
        if key not in entity_map or confidence > entity_map[key].confidence:
            entity_map[key] = Entity(
                text=entity_text,
                type=entity_type,
                confidence=round(confidence, 4),
            )
    
    entities = sorted(entity_map.values(), key=lambda e: e.confidence, reverse=True)
    
    # Extract claims (sentences that contain entities or factual indicators)
    sentences = _extract_sentences(truncated)
    entity_texts_lower = {e.text.lower() for e in entities}
    
    claims = []
    for sentence in sentences:
        sentence_lower = sentence.lower()
        # Find entities in this sentence
        found_entities = [
            e.text for e in entities
            if e.text.lower() in sentence_lower
        ]
        
        if found_entities or _is_factual_claim(sentence):
            claims.append(Claim(
                text=sentence,
                entities=found_entities,
            ))
    
    elapsed_ms = int((time.time() - start) * 1000)
    
    return ClaimExtractorResponse(
        claims=claims[:10],  # Max 10 claims
        entities=entities[:20],  # Max 20 entities
        entity_count=len(entities),
        processing_time_ms=elapsed_ms,
    )
