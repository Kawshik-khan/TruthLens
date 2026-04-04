"""
Source Credibility Scoring — Rule-based domain analysis
"""
from pydantic import BaseModel
from typing import Optional
import time


class CredibilityRequest(BaseModel):
    domain: str


class CredibilityFactor(BaseModel):
    name: str
    score: float  # 0-100
    description: str


class CredibilityResponse(BaseModel):
    domain: str
    score: float  # 0-100
    tier: str  # TRUSTED, QUESTIONABLE, DISINFO
    factors: list[CredibilityFactor]
    processing_time_ms: int


# Known source credibility database
KNOWN_SOURCES = {
    # Tier: TRUSTED (score 80-100)
    "reuters.com": {"score": 95, "tier": "TRUSTED", "name": "Reuters"},
    "apnews.com": {"score": 95, "tier": "TRUSTED", "name": "AP News"},
    "bbc.com": {"score": 90, "tier": "TRUSTED", "name": "BBC"},
    "bbc.co.uk": {"score": 90, "tier": "TRUSTED", "name": "BBC"},
    "npr.org": {"score": 88, "tier": "TRUSTED", "name": "NPR"},
    "pbs.org": {"score": 88, "tier": "TRUSTED", "name": "PBS"},
    "nytimes.com": {"score": 85, "tier": "TRUSTED", "name": "NY Times"},
    "washingtonpost.com": {"score": 85, "tier": "TRUSTED", "name": "Washington Post"},
    "theguardian.com": {"score": 83, "tier": "TRUSTED", "name": "The Guardian"},
    "economist.com": {"score": 88, "tier": "TRUSTED", "name": "The Economist"},
    "nature.com": {"score": 95, "tier": "TRUSTED", "name": "Nature"},
    "sciencemag.org": {"score": 95, "tier": "TRUSTED", "name": "Science Magazine"},
    "wsj.com": {"score": 85, "tier": "TRUSTED", "name": "Wall Street Journal"},
    "ft.com": {"score": 87, "tier": "TRUSTED", "name": "Financial Times"},
    
    # Tier: QUESTIONABLE (score 30-65)
    "dailymail.co.uk": {"score": 45, "tier": "QUESTIONABLE", "name": "Daily Mail"},
    "nypost.com": {"score": 50, "tier": "QUESTIONABLE", "name": "New York Post"},
    "foxnews.com": {"score": 55, "tier": "QUESTIONABLE", "name": "Fox News"},
    "msnbc.com": {"score": 55, "tier": "QUESTIONABLE", "name": "MSNBC"},
    "buzzfeed.com": {"score": 40, "tier": "QUESTIONABLE", "name": "BuzzFeed"},
    "huffpost.com": {"score": 55, "tier": "QUESTIONABLE", "name": "HuffPost"},
    
    # Tier: DISINFO (score 0-29)
    "infowars.com": {"score": 5, "tier": "DISINFO", "name": "InfoWars"},
    "naturalnews.com": {"score": 8, "tier": "DISINFO", "name": "Natural News"},
    "breitbart.com": {"score": 20, "tier": "DISINFO", "name": "Breitbart"},
}


def _clean_domain(domain: str) -> str:
    """Clean and normalize domain name."""
    domain = domain.lower().strip()
    # Remove protocol
    if "://" in domain:
        domain = domain.split("://", 1)[1]
    # Remove path
    domain = domain.split("/")[0]
    # Remove www.
    if domain.startswith("www."):
        domain = domain[4:]
    return domain


def _analyze_domain_heuristics(domain: str) -> list[CredibilityFactor]:
    """Apply heuristic rules to unknown domains."""
    factors = []
    
    # TLD analysis
    tld = domain.split(".")[-1] if "." in domain else ""
    if tld in ("edu", "gov"):
        factors.append(CredibilityFactor(
            name="Institutional TLD",
            score=90,
            description=f".{tld} domains are typically institutional and trustworthy"
        ))
    elif tld in ("org"):
        factors.append(CredibilityFactor(
            name="Organization TLD",
            score=65,
            description=".org domains are registered by organizations but require individual verification"
        ))
    elif tld in ("com", "net"):
        factors.append(CredibilityFactor(
            name="Commercial TLD",
            score=50,
            description="Commercial TLD — credibility depends entirely on the specific publication"
        ))
    else:
        factors.append(CredibilityFactor(
            name="Uncommon TLD",
            score=35,
            description=f".{tld} is less common and may require extra scrutiny"
        ))
    
    # Domain length heuristic (very long domains are often suspicious)
    domain_name = domain.split(".")[0]
    if len(domain_name) > 25:
        factors.append(CredibilityFactor(
            name="Domain Length",
            score=25,
            description="Unusually long domain name — often associated with misleading sites"
        ))
    elif len(domain_name) > 15:
        factors.append(CredibilityFactor(
            name="Domain Length",
            score=45,
            description="Moderately long domain name"
        ))
    else:
        factors.append(CredibilityFactor(
            name="Domain Length",
            score=60,
            description="Standard domain name length"
        ))
    
    # Check for suspicious keywords
    suspicious_words = ["truth", "patriot", "freedom", "real", "exposed", "uncensored", "breaking"]
    if any(word in domain_name.lower() for word in suspicious_words):
        factors.append(CredibilityFactor(
            name="Sensational Naming",
            score=20,
            description="Domain contains words commonly associated with low-credibility sources"
        ))
    
    # Check for number strings (often spam/auto-generated)
    import re
    if re.search(r'\d{3,}', domain_name):
        factors.append(CredibilityFactor(
            name="Numeric Patterns",
            score=15,
            description="Domain contains unusual numeric patterns"
        ))
    
    return factors


def analyze(domain: str) -> CredibilityResponse:
    start = time.time()
    
    clean = _clean_domain(domain)
    
    # Check known sources first
    if clean in KNOWN_SOURCES:
        source = KNOWN_SOURCES[clean]
        factors = [
            CredibilityFactor(
                name="Known Source",
                score=source["score"],
                description=f"{source['name']} is a recognized publication in our database"
            ),
            CredibilityFactor(
                name="Editorial Standards",
                score=source["score"],
                description="Evaluated based on editorial policies, corrections history, and journalistic standards"
            ),
        ]
        elapsed_ms = int((time.time() - start) * 1000)
        return CredibilityResponse(
            domain=clean,
            score=source["score"],
            tier=source["tier"],
            factors=factors,
            processing_time_ms=elapsed_ms,
        )
    
    # Unknown domain — apply heuristic analysis
    factors = _analyze_domain_heuristics(clean)
    avg_score = sum(f.score for f in factors) / len(factors) if factors else 50
    
    if avg_score >= 70:
        tier = "TRUSTED"
    elif avg_score >= 35:
        tier = "QUESTIONABLE"
    else:
        tier = "DISINFO"
    
    # Add an "Unknown Source" factor
    factors.insert(0, CredibilityFactor(
        name="Unknown Source",
        score=40,
        description=f"{clean} is not in our verified database. Ratings are based on heuristic analysis only."
    ))
    
    elapsed_ms = int((time.time() - start) * 1000)
    
    return CredibilityResponse(
        domain=clean,
        score=round(avg_score, 1),
        tier=tier,
        factors=factors,
        processing_time_ms=elapsed_ms,
    )
