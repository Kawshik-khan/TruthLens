export interface VerificationResult {
    accuracy: number;
    status: "VERIFIED" | "FLAGGED" | "RELIABLE" | "FAKE";
    citations: { title: string; url: string; source: string }[];
}

export async function verifyNews(url: string, title: string): Promise<VerificationResult> {
    const apiKey = process.env.SERPER_API_KEY;

    if (!apiKey) {
        console.warn("SERPER_API_KEY missing. Returning mock verification.");
        return {
            accuracy: 88,
            status: "VERIFIED",
            citations: [
                { title: "Matching Report 1", url: "https://example.com/1", source: "Example News" },
                { title: "Matching Report 2", url: "https://example.com/2", source: "Auth Source" }
            ]
        };
    }

    try {
        // Search for the news title to find corroborating reports
        const response = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                q: title,
                num: 10,
            }),
        });

        const data = await response.json();
        const results = data.organic || [];

        // If no results are found, it's likely fake
        if (results.length === 0) {
            return {
                accuracy: 0,
                status: "FAKE",
                citations: [],
            };
        }

        // Filter out the original URL and analyze matching sources
        const originalDomain = new URL(url).hostname.replace("www.", "");
        const citations = results
            .filter((res: any) => !res.link.includes(originalDomain))
            .map((res: any) => ({
                title: res.title,
                url: res.link,
                source: new URL(res.link).hostname.replace("www.", ""),
            }));

        // Basic accuracy algorithm
        // More citations from diverse sources = higher accuracy
        const uniqueSources = new Set(citations.map((c: any) => c.source));
        let accuracy = Math.min(uniqueSources.size * 15 + 30, 98);

        // If very few sources found (e.g. only 1 or 2), flag it
        let status: "VERIFIED" | "FLAGGED" | "RELIABLE" | "FAKE" = "RELIABLE";
        if (accuracy > 85) status = "VERIFIED";
        else if (accuracy < 50) status = "FLAGGED";

        if (citations.length === 0) {
            accuracy = 0;
            status = "FAKE";
        }

        return {
            accuracy,
            status,
            citations: citations.slice(0, 5),
        };
    } catch (error) {
        console.error("Verification logic error:", error);
        return {
            accuracy: 50,
            status: "FLAGGED",
            citations: [],
        };
    }
}
