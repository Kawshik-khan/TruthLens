export interface SourceMetrics {
  submissionCount: number;
  averageTrustScore: number;
  userReports: number;
  ageInDays: number;
  lastUpdated: Date;
}

export interface BiasScoringFactors {
  credibilityWeight: number;
  recencyWeight: number;
  usageWeight: number;
  reportWeight: number;
}

export class BiasScoringAlgorithm {
  private static readonly FACTORS: BiasScoringFactors = {
    credibilityWeight: 0.4,    // Base credibility score
    recencyWeight: 0.2,      // How recently updated
    usageWeight: 0.25,        // How frequently used
    reportWeight: 0.15         // User feedback reports
  };

  /**
   * Calculate dynamic credibility score for a source
   */
  static calculateCredibilityScore(
    baseBiasIndex: number,
    metrics: SourceMetrics
  ): number {
    const { FACTORS } = this;

    // 1. Base credibility score (inverted from bias index)
    const baseCredibility = Math.max(0, 100 - baseBiasIndex);

    // 2. Recency factor (sources updated recently get higher scores)
    const recencyFactor = this.calculateRecencyFactor(metrics.ageInDays);

    // 3. Usage factor (frequently used sources get slight boost)
    const usageFactor = this.calculateUsageFactor(metrics.submissionCount);

    // 4. User report factor (sources with many reports get penalized)
    const reportFactor = this.calculateReportFactor(metrics.userReports);

    // 5. Calculate weighted score
    const weightedScore = 
      (baseCredibility * FACTORS.credibilityWeight) +
      (recencyFactor * FACTORS.recencyWeight) +
      (usageFactor * FACTORS.usageWeight) +
      (reportFactor * FACTORS.reportWeight);

    // 6. Apply category-specific adjustments
    const categoryAdjustment = this.getCategoryAdjustment(baseBiasIndex);
    const finalScore = Math.max(0, Math.min(100, weightedScore + categoryAdjustment));

    return Math.round(finalScore * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Calculate recency factor based on how recently the source was updated
   */
  private static calculateRecencyFactor(ageInDays: number): number {
    if (ageInDays <= 7) return 100;      // Updated within week
    if (ageInDays <= 30) return 95;     // Updated within month
    if (ageInDays <= 90) return 85;     // Updated within quarter
    if (ageInDays <= 365) return 70;    // Updated within year
    return 50;                             // Updated over year ago
  }

  /**
   * Calculate usage factor based on submission frequency
   */
  private static calculateUsageFactor(submissionCount: number): number {
    if (submissionCount === 0) return 50;
    if (submissionCount <= 5) return 70;
    if (submissionCount <= 20) return 85;
    if (submissionCount <= 50) return 95;
    return 100; // High usage sources get max boost
  }

  /**
   * Calculate report factor based on user feedback
   */
  private static calculateReportFactor(userReports: number): number {
    if (userReports === 0) return 100;
    if (userReports <= 2) return 90;
    if (userReports <= 5) return 75;
    if (userReports <= 10) return 60;
    return 40; // High number of reports
  }

  /**
   * Get category-specific credibility adjustments
   */
  private static getCategoryAdjustment(biasIndex: number): number {
    // Government and educational sources get slight benefit
    // Social media and forums get slight penalty
    if (biasIndex <= 20) return +5;   // Low bias sources
    if (biasIndex <= 40) return 0;    // Medium bias sources
    if (biasIndex <= 60) return -5;   // High bias sources
    return -10;                         // Very high bias sources
  }

  /**
   * Determine source tier based on credibility score
   */
  static determineTier(credibilityScore: number): "TRUSTED" | "QUESTIONABLE" | "DISINFO" {
    if (credibilityScore >= 80) return "TRUSTED";
    if (credibilityScore >= 50) return "QUESTIONABLE";
    return "DISINFO";
  }

  /**
   * Get color coding for credibility score
   */
  static getCredibilityColor(score: number): string {
    if (score >= 80) return "#22c55e"; // Green
    if (score >= 60) return "#f59e0b"; // Amber
    if (score >= 40) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  }

  /**
   * Generate credibility description
   */
  static getCredibilityDescription(score: number): string {
    if (score >= 90) return "Highly credible source with strong editorial standards";
    if (score >= 80) return "Generally reliable with minor concerns";
    if (score >= 70) return "Moderately reliable, verify with other sources";
    if (score >= 60) return "Some reliability concerns, use caution";
    if (score >= 50) return "Questionable reliability, cross-verify essential";
    if (score >= 40) return "Low reliability, likely biased content";
    return "Unreliable source, high probability of misinformation";
  }

  /**
   * Batch update credibility scores for multiple sources
   */
  static async batchUpdateScores(
    sources: Array<{ id: string; biasIndex: number; metrics: SourceMetrics }>
  ): Promise<Array<{ id: string; newScore: number; newTier: string }>> {
    return sources.map(source => ({
      id: source.id,
      newScore: this.calculateCredibilityScore(source.biasIndex, source.metrics),
      newTier: this.determineTier(
        this.calculateCredibilityScore(source.biasIndex, source.metrics)
      )
    }));
  }

  /**
   * Calculate trend analysis for bias history
   */
  static calculateTrend(biasHistory: Array<{ biasIndex: number; auditDate: Date }>): {
    trend: "IMPROVING" | "DECLINING" | "STABLE";
    change: number;
    period: number;
  } {
    if (biasHistory.length < 2) {
      return { trend: "STABLE", change: 0, period: 0 };
    }

    const sorted = [...biasHistory].sort((a, b) => 
      new Date(a.auditDate).getTime() - new Date(b.auditDate).getTime()
    );

    const oldest = sorted[0];
    const newest = sorted[sorted.length - 1];
    const change = newest.biasIndex - oldest.biasIndex;
    
    let trend: "IMPROVING" | "DECLINING" | "STABLE";
    if (Math.abs(change) < 2) {
      trend = "STABLE";
    } else if (change < 0) {
      trend = "IMPROVING";
    } else {
      trend = "DECLINING";
    }

    const period = Math.floor(
      (new Date(newest.auditDate).getTime() - new Date(oldest.auditDate).getTime()) 
      / (1000 * 60 * 60 * 24)
    );

    return { trend, change, period };
  }
}
