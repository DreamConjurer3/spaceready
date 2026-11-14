import { Pillar, PILLARS, DriftTier } from './config';

export interface PillarScores {
  sleep: number;
  nutrition: number;
  exercise: number;
  stress: number;
  social: number;
  recovery: number;
}

export interface WeeklyAssessment {
  id: string;
  user_id: string;
  week_number: number;
  date: string;
  pillar_scores: PillarScores;
  pillar_raws: PillarScores;
  composite_score: number;
  drift: number; // baseline - composite (or 0 if baseline not locked)
  drift_tier: DriftTier;
  rolling_sleep: number;
  rolling_stress: number;
}

export interface QuestionResponse {
  id: string;
  assessment_id: string;
  pillar: Pillar;
  question_id: number;
  score: number; // 0-4
}

export interface AnnualReport {
  id: string;
  user_id: string;
  year: number;
  annual_score: number;
  annual_drift: number;
  pillar_breakdown: PillarScores;
  yoy_change: number | null;
  alerts_triggered: string[];
  ready_for_l60: boolean;
  total_weeks: number;
}

export interface Alert {
  id: string;
  user_id: string;
  date: string;
  type: 'tier_change' | 'trend_alert' | 'decline_alert' | 'red_year' | 'pillar_drop';
  pillar: Pillar | null;
  message: string;
  severity: 'yellow' | 'orange' | 'red' | 'info';
  acknowledged: boolean;
  actionRecommendation: string;
}

/**
 * Calculates raw score (sum of 0-4) and 0-100 pillar score from 5 question responses
 */
export function calculatePillarScore(scores: number[]): { raw: number; score: number } {
  const raw = scores.reduce((sum, s) => sum + s, 0); // 0 to 20
  const score = Math.max(0, Math.min(100, Math.round(((20 - raw) / 20) * 100)));
  return { raw, score };
}

/**
 * Calculates 3-week rolling average for a pillar
 */
export function calculateRollingAverage(currentScore: number, previousScores: number[]): number {
  const window = [currentScore, ...previousScores.slice(0, 2)];
  const sum = window.reduce((a, b) => a + b, 0);
  return Math.round(sum / window.length);
}

/**
 * Computes composite readiness score using:
 * - Rolling Sleep (weight 1.0)
 * - Rolling Stress (weight 1.0)
 * - Nutrition (weight 1.0)
 * - Exercise (weight 1.0)
 * - Social (weight 1.0)
 * - Recovery (weight 0.8)
 * Total weights = 5.8
 */
export function calculateComposite(
  scores: PillarScores,
  rollingSleep: number,
  rollingStress: number
): number {
  const weightedSum =
    rollingSleep * PILLARS.sleep.weight +
    rollingStress * PILLARS.stress.weight +
    scores.nutrition * PILLARS.nutrition.weight +
    scores.exercise * PILLARS.exercise.weight +
    scores.social * PILLARS.social.weight +
    scores.recovery * PILLARS.recovery.weight;

  const totalWeights =
    PILLARS.sleep.weight +
    PILLARS.stress.weight +
    PILLARS.nutrition.weight +
    PILLARS.exercise.weight +
    PILLARS.social.weight +
    PILLARS.recovery.weight; // 5.8

  return Math.round(weightedSum / totalWeights);
}

/**
 * Evaluates drift tier based on Drift = Baseline - Current Composite
 */
export function getDriftTier(drift: number): DriftTier {
  if (drift <= 5) return 'green';
  if (drift <= 15) return 'yellow';
  if (drift <= 20) return 'orange';
  return 'red';
}

/**
 * Returns user-friendly status badge label & styling for drift tiers
 */
export function getTierDetails(tier: DriftTier): {
  label: string;
  color: string;
  bg: string;
  border: string;
  description: string;
} {
  switch (tier) {
    case 'green':
      return {
        label: 'ON TRACK',
        color: '#34d399',
        bg: 'rgba(52, 211, 153, 0.12)',
        border: 'rgba(52, 211, 153, 0.3)',
        description: 'Readiness matches or exceeds your baseline standard (drift ≤ 5 pts).',
      };
    case 'yellow':
      return {
        label: 'EARLY WARNING',
        color: '#facc15',
        bg: 'rgba(250, 204, 21, 0.12)',
        border: 'rgba(250, 204, 21, 0.3)',
        description: 'Readiness starting to drift (5–15 pts). Review targeted lifestyle habits.',
      };
    case 'orange':
      return {
        label: 'ACTION NEEDED',
        color: '#fb923c',
        bg: 'rgba(251, 146, 60, 0.12)',
        border: 'rgba(251, 146, 60, 0.3)',
        description: 'Significant drift (15–20 pts). Immediate countermeasure intervention recommended.',
      };
    case 'red':
      return {
        label: 'SIGNIFICANT DECREMENT',
        color: '#f87171',
        bg: 'rgba(248, 113, 113, 0.15)',
        border: 'rgba(248, 113, 113, 0.4)',
        description: 'Severe readiness drift (> 20 pts). Exceeds NASA −20% risk threshold.',
      };
  }
}

/**
 * Calculates annual reports for all completed training years
 */
export function computeAnnualReports(
  assessments: WeeklyAssessment[],
  baseline: number | null
): AnnualReport[] {
  if (assessments.length === 0) return [];

  // Group assessments by training year (52 weeks per year)
  const yearsMap: Record<number, WeeklyAssessment[]> = {};
  assessments.forEach((a) => {
    const year = Math.floor((a.week_number - 1) / 52) + 1;
    if (!yearsMap[year]) yearsMap[year] = [];
    yearsMap[year].push(a);
  });

  const reports: AnnualReport[] = [];
  const sortedYears = Object.keys(yearsMap)
    .map(Number)
    .sort((a, b) => a - b);

  let prevYearScore: number | null = null;
  const allYearsWithin5: boolean[] = [];

  sortedYears.forEach((year) => {
    const weeksInYear = yearsMap[year];
    const avgScore = Math.round(
      weeksInYear.reduce((sum, w) => sum + w.composite_score, 0) / weeksInYear.length
    );

    const pillarBreakdown: PillarScores = {
      sleep: Math.round(weeksInYear.reduce((sum, w) => sum + w.pillar_scores.sleep, 0) / weeksInYear.length),
      nutrition: Math.round(weeksInYear.reduce((sum, w) => sum + w.pillar_scores.nutrition, 0) / weeksInYear.length),
      exercise: Math.round(weeksInYear.reduce((sum, w) => sum + w.pillar_scores.exercise, 0) / weeksInYear.length),
      stress: Math.round(weeksInYear.reduce((sum, w) => sum + w.pillar_scores.stress, 0) / weeksInYear.length),
      social: Math.round(weeksInYear.reduce((sum, w) => sum + w.pillar_scores.social, 0) / weeksInYear.length),
      recovery: Math.round(weeksInYear.reduce((sum, w) => sum + w.pillar_scores.recovery, 0) / weeksInYear.length),
    };

    const annualDrift = baseline !== null ? Math.round(baseline - avgScore) : 0;
    const yoyChange = prevYearScore !== null ? avgScore - prevYearScore : null;
    prevYearScore = avgScore;

    const alertsTriggered: string[] = [];
    if (annualDrift >= 20) {
      alertsTriggered.push('red_year');
    }
    if (yoyChange !== null && yoyChange <= -10) {
      alertsTriggered.push('decline_alert');
    }

    const isWithin5 = annualDrift <= 5;
    allYearsWithin5.push(isWithin5);

    reports.push({
      id: `report-year-${year}`,
      user_id: 'astronaut-1',
      year,
      annual_score: avgScore,
      annual_drift: annualDrift,
      pillar_breakdown: pillarBreakdown,
      yoy_change: yoyChange,
      alerts_triggered: alertsTriggered,
      ready_for_l60: false, // Calculated after checking all years
      total_weeks: weeksInYear.length,
    });
  });

  // Check multi-year trend alerts across sequential years
  for (let i = 1; i < reports.length; i++) {
    const prev = reports[i - 1];
    const curr = reports[i];
    if (curr.annual_drift > prev.annual_drift && curr.annual_drift > 5) {
      curr.alerts_triggered.push('trend_alert');
    }
  }

  // Set ready_for_l60 if all completed years remain within 5 pts of baseline
  const isReady = allYearsWithin5.length > 0 && allYearsWithin5.every(Boolean);
  reports.forEach((r) => {
    r.ready_for_l60 = isReady;
  });

  return reports;
}
