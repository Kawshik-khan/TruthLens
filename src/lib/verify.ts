export interface VerificationResult {
    accuracy: number;
    status: "VERIFIED" | "FLAGGED" | "RELIABLE" | "FAKE";
    citations: { title: string; url: string; source: string }[];
    aiAnalysis: string;
}

/**
 * Step 1: Search Google News RSS for real articles related to the claim.
 * This is FREE and requires no API key.
 */
async function searchGoogleNews(query: string): Promise<{ title: string; url: string; source: string }[]> {
    try {
        const encodedQuery = encodeURIComponent(query.slice(0, 150));
        const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en&gl=US&ceid=US:en`;

        const response = await fetch(rssUrl, {
            headers: { "User-Agent": "TruthLens/1.0" },
        });

        if (!response.ok) {
            console.error("Google News RSS error:", response.status);
            return [];
        }

        const xml = await response.text();

        // Parse RSS XML to extract articles
        const items: { title: string; url: string; source: string }[] = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(xml)) !== null && items.length < 8) {
            const itemXml = match[1];

            const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/);
            const linkMatch = itemXml.match(/<link>(.*?)<\/link>|<link><!\[CDATA\[(.*?)\]\]>/);
            const sourceMatch = itemXml.match(/<source[^>]*>(.*?)<\/source>|<source[^>]*><!\[CDATA\[(.*?)\]\]><\/source>/);

            const title = (titleMatch?.[1] || titleMatch?.[2] || "").trim();
            const url = (linkMatch?.[1] || linkMatch?.[2] || "").trim();
            const source = (sourceMatch?.[1] || sourceMatch?.[2] || "").trim();

            if (title && url) {
                let hostname = source;
                if (!hostname) {
                    try {
                        hostname = new URL(url).hostname.replace("www.", "");
                    } catch {
                        hostname = "News Source";
                    }
                }
                items.push({ title, url, source: hostname });
            }
        }

        return items;
    } catch (error) {
        console.error("Google News search error:", error);
        return [];
    }
}

/**
 * Step 2: Use Gemini API (WITHOUT grounding) to analyze the claim.
 * Grounding has strict rate limits; this avoids them.
 */
async function analyzeWithGemini(
    claim: string,
    newsArticles: { title: string; source: string }[]
): Promise<{ verdict: string; confidence: number; analysis: string }> {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
        return { verdict: "UNKNOWN", confidence: 0, analysis: "GEMINI_API_KEY not configured." };
    }

    const articleContext = newsArticles.length > 0
        ? `\n\nRelated news articles found online:\n${newsArticles.map((a, i) => `${i + 1}. "${a.title}" — ${a.source}`).join("\n")}`
        : "\n\nNo related news articles were found online for this claim.";

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `You are a fact-checking AI. Analyze the following claim and determine its truthfulness.

CLAIM: "${claim}"
${articleContext}

Based on the claim itself and the related articles found, determine if the claim is TRUE, MOSTLY_TRUE, MISLEADING, or FALSE.

Respond in EXACTLY this JSON format (no markdown, no code blocks, just raw JSON):
{
    "verdict": "TRUE" | "MOSTLY_TRUE" | "MISLEADING" | "FALSE",
    "confidence": <number 0-100>,
    "analysis": "<2-3 sentence explanation of your findings>"
}`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 1024,
                    }
                }),
            }
        );

        if (!response.ok) {
            console.warn("Gemini API returned", response.status, "— falling back to news-based analysis.");

            // Build a verdict purely from how many news articles were found
            let fallbackVerdict = "UNKNOWN";
            let fallbackConfidence = 30;
            let fallbackMsg = "";

            if (newsArticles.length >= 5) {
                fallbackVerdict = "MOSTLY_TRUE";
                fallbackConfidence = 65;
                fallbackMsg = `AI analysis unavailable, but ${newsArticles.length} related news articles were found from multiple outlets, suggesting this claim has significant coverage.`;
            } else if (newsArticles.length >= 2) {
                fallbackVerdict = "MOSTLY_TRUE";
                fallbackConfidence = 50;
                fallbackMsg = `AI analysis unavailable. ${newsArticles.length} related articles found — the claim appears to have some news coverage.`;
            } else if (newsArticles.length === 1) {
                fallbackVerdict = "UNKNOWN";
                fallbackConfidence = 35;
                fallbackMsg = `AI analysis unavailable. Only 1 related article found — insufficient data for a strong verdict.`;
            } else {
                fallbackVerdict = "UNKNOWN";
                fallbackConfidence = 20;
                fallbackMsg = `AI analysis unavailable and no related news articles found. This claim could not be verified.`;
            }

            return { verdict: fallbackVerdict, confidence: fallbackConfidence, analysis: fallbackMsg };
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        try {
            const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
            return JSON.parse(cleaned);
        } catch {
            // Fallback: extract what we can
            const isFalse = rawText.toLowerCase().includes('"false"');
            const isTrue = rawText.toLowerCase().includes('"true"');
            return {
                verdict: isFalse ? "FALSE" : isTrue ? "TRUE" : "MOSTLY_TRUE",
                confidence: isFalse ? 25 : isTrue ? 80 : 55,
                analysis: rawText.slice(0, 300),
            };
        }
    } catch (error) {
        console.error("Gemini API error:", error);
        return {
            verdict: "UNKNOWN",
            confidence: 0,
            analysis: "An error occurred during AI analysis.",
        };
    }
}

/**
 * Main verification function:
 * 1. Search Google News (free, no API key needed) for real article links
 * 2. Send claim + found articles to Gemini for AI-powered analysis (no grounding = no strict rate limit)
 */
export async function verifyNews(claim: string, title?: string): Promise<VerificationResult> {
    const searchQuery = title || claim.slice(0, 150);

    // Step 1: Get real news articles from Google News RSS (free)
    const newsArticles = await searchGoogleNews(searchQuery);

    // Step 2: Analyze with Gemini AI (without grounding tool)
    const geminiResult = await analyzeWithGemini(claim, newsArticles);

    // Map verdict to our status system
    let status: VerificationResult["status"];
    let accuracy: number;

    switch (geminiResult.verdict) {
        case "TRUE":
            status = "VERIFIED";
            accuracy = Math.max(geminiResult.confidence, 80);
            break;
        case "MOSTLY_TRUE":
            status = "RELIABLE";
            accuracy = Math.max(Math.min(geminiResult.confidence, 79), 55);
            break;
        case "MISLEADING":
            status = "FLAGGED";
            accuracy = Math.max(Math.min(geminiResult.confidence, 49), 20);
            break;
        case "FALSE":
            status = "FAKE";
            accuracy = Math.min(geminiResult.confidence, 25);
            break;
        default:
            // If AI couldn't determine, use article count as a signal
            if (newsArticles.length >= 4) {
                status = "RELIABLE";
                accuracy = 60;
            } else if (newsArticles.length >= 1) {
                status = "FLAGGED";
                accuracy = 40;
            } else {
                status = "FLAGGED";
                accuracy = 20;
            }
    }

    // Boost confidence if many diverse news sources corroborate
    const uniqueSources = new Set(newsArticles.map(a => a.source));
    if (uniqueSources.size >= 3 && status !== "FAKE") {
        accuracy = Math.min(accuracy + 5, 98);
    }

    return {
        accuracy,
        status,
        citations: newsArticles.slice(0, 8),
        aiAnalysis: geminiResult.analysis || `Claim analyzed. Found ${newsArticles.length} related articles.`,
    };
}
