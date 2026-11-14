import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Pillar,
  QUESTION_BANK,
  PILLARS,
} from '../data/config';
import {
  WeeklyAssessment,
  QuestionResponse,
  AnnualReport,
  Alert,
  calculatePillarScore,
  calculateRollingAverage,
  calculateComposite,
  getDriftTier,
  computeAnnualReports,
  PillarScores,
} from '../data/scoring';

export interface UserProfile {
  id: string;
  name: string;
  callsign: string;
  training_start_date: string;
  training_end_date: string;
  baseline_score: number | null; // locked after week 4
}

interface SpaceReadyStore {
  user: UserProfile;
  assessments: WeeklyAssessment[];
  responses: QuestionResponse[];
  reports: AnnualReport[];
  alerts: Alert[];

  // Navigation
  activeTab: 'tool' | 'research' | 'statistic';
  toolSubTab: 'dashboard' | 'test' | 'history' | 'annual' | 'alerts';

  // Active quiz in progress
  currentTestAnswers: Record<number, number>; // questionId -> 0..4

  // Actions
  setActiveTab: (tab: 'tool' | 'research' | 'statistic') => void;
  setToolSubTab: (subTab: 'dashboard' | 'test' | 'history' | 'annual' | 'alerts') => void;
  setQuestionAnswer: (questionId: number, score: number) => void;
  clearCurrentTest: () => void;
  submitWeeklyAssessment: () => {
    success: boolean;
    assessment?: WeeklyAssessment;
    newAlerts?: Alert[];
    errors?: string[];
  };
  loadDemoTrajectory: () => void;
  resetAllData: () => void;
  acknowledgeAlert: (alertId: string) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'astro-ochmo-2026',
  name: 'CDR. Alex Mercer',
  callsign: 'Orion Prime',
  training_start_date: '2024-01-08',
  training_end_date: '2027-10-15',
  baseline_score: null,
};

/**
 * Creates 104 weeks (2 full training years) of realistic historical astronaut data
 * Weeks 1-4 establish an 88-point baseline
 * Year 1 experiences minor winter sleep drift
 * Year 2 experiences operational training stress drift
 */
function generateRealisticDemoData(): {
  user: UserProfile;
  assessments: WeeklyAssessment[];
  responses: QuestionResponse[];
  reports: AnnualReport[];
  alerts: Alert[];
} {
  const user: UserProfile = {
    ...DEFAULT_USER,
    baseline_score: 88, // Will be mathematically locked after week 4
  };

  const assessments: WeeklyAssessment[] = [];
  const responses: QuestionResponse[] = [];
  const alerts: Alert[] = [];

  const startDate = new Date('2024-01-08');

  // Generate 104 weeks of data
  for (let week = 1; week <= 104; week++) {
    const curDate = new Date(startDate);
    curDate.setDate(startDate.getDate() + (week - 1) * 7);
    const dateStr = curDate.toISOString().split('T')[0];

    // Define trend factors for realistic astronaut training phase
    let sleepDip = 0;
    let stressRise = 0;
    let exerciseMod = 0;

    if (week <= 4) {
      // Baseline calibration window: peak condition
      sleepDip = 0;
      stressRise = 0;
    } else if (week >= 20 && week <= 32) {
      // Winter centrifuge + NBL deep dive training in Year 1: slight sleep and recovery drift
      sleepDip = 12;
      stressRise = 10;
    } else if (week >= 65 && week <= 82) {
      // Year 2 wilderness survival & continuous EVA simulator: noticeable stress + fatigue drift
      sleepDip = 18;
      stressRise = 22;
      exerciseMod = 6;
    } else if (week >= 88) {
      // Countermeasure recovery regimen kicks in
      sleepDip = 4;
      stressRise = 6;
    }

    // Weekly raw points (0-20, where lower is better)
    const sleepRaw = Math.min(20, Math.max(0, Math.round(2 + (sleepDip / 100) * 8 + (Math.sin(week) * 1.5))));
    const nutritionRaw = Math.min(20, Math.max(0, Math.round(2 + (Math.cos(week * 0.5) * 1.2))));
    const exerciseRaw = Math.min(20, Math.max(0, Math.round(1 + (exerciseMod / 100) * 6 + (Math.sin(week * 0.3) * 1.0))));
    const stressRaw = Math.min(20, Math.max(0, Math.round(3 + (stressRise / 100) * 10 + (Math.cos(week * 0.7) * 1.5))));
    const socialRaw = Math.min(20, Math.max(0, Math.round(3 + (Math.sin(week * 0.2) * 1.5))));
    const recoveryRaw = Math.min(20, Math.max(0, Math.round(2 + ((sleepDip + stressRise) / 200) * 8)));

    const pScores: PillarScores = {
      sleep: Math.max(0, Math.min(100, Math.round(((20 - sleepRaw) / 20) * 100))),
      nutrition: Math.max(0, Math.min(100, Math.round(((20 - nutritionRaw) / 20) * 100))),
      exercise: Math.max(0, Math.min(100, Math.round(((20 - exerciseRaw) / 20) * 100))),
      stress: Math.max(0, Math.min(100, Math.round(((20 - stressRaw) / 20) * 100))),
      social: Math.max(0, Math.min(100, Math.round(((20 - socialRaw) / 20) * 100))),
      recovery: Math.max(0, Math.min(100, Math.round(((20 - recoveryRaw) / 20) * 100))),
    };

    const pRaws: PillarScores = {
      sleep: sleepRaw,
      nutrition: nutritionRaw,
      exercise: exerciseRaw,
      stress: stressRaw,
      social: socialRaw,
      recovery: recoveryRaw,
    };

    // 3-week rolling average for Sleep and Stress
    const prevSleeps = assessments.slice(-2).map((a) => a.pillar_scores.sleep).reverse();
    const prevStresses = assessments.slice(-2).map((a) => a.pillar_scores.stress).reverse();

    const rollingSleep = calculateRollingAverage(pScores.sleep, prevSleeps);
    const rollingStress = calculateRollingAverage(pScores.stress, prevStresses);

    const composite = calculateComposite(pScores, rollingSleep, rollingStress);

    // Compute baseline from weeks 1-4
    let baselineVal = user.baseline_score;
    if (week === 4) {
      const first4 = [...assessments.map((a) => a.composite_score), composite];
      baselineVal = Math.round(first4.reduce((s, v) => s + v, 0) / 4);
      user.baseline_score = baselineVal;
    }

    const drift = baselineVal !== null ? Math.round(baselineVal - composite) : 0;
    const tier = getDriftTier(drift);

    const assessmentObj: WeeklyAssessment = {
      id: `w-${week}`,
      user_id: user.id,
      week_number: week,
      date: dateStr,
      pillar_scores: pScores,
      pillar_raws: pRaws,
      composite_score: composite,
      drift,
      drift_tier: tier,
      rolling_sleep: rollingSleep,
      rolling_stress: rollingStress,
    };

    assessments.push(assessmentObj);

    // Add alert if entering Yellow, Orange, or Red
    if (week === 24 && tier === 'yellow') {
      alerts.push({
        id: `alert-${week}`,
        user_id: user.id,
        date: dateStr,
        type: 'tier_change',
        pillar: 'sleep',
        message: 'Drift escalated to Yellow (Early Warning). Sleep pillar dropped 14 points below L-60 baseline.',
        severity: 'yellow',
        acknowledged: true,
        actionRecommendation: 'Enforce 22:00 circadian blackout protocol and review NBL schedule.',
      });
    } else if (week === 74 && tier === 'orange') {
      alerts.push({
        id: `alert-${week}`,
        user_id: user.id,
        date: dateStr,
        type: 'tier_change',
        pillar: 'stress',
        message: 'Drift entered Orange (Action Needed). Cumulative training load exceeding baseline by 18 points.',
        severity: 'orange',
        acknowledged: false,
        actionRecommendation: 'Schedule mandatory 48-hour parasympathetic deload and ASCR physiological consultation.',
      });
    }
  }

  // Compute reports for Year 1 and Year 2
  const reports = computeAnnualReports(assessments, user.baseline_score);

  return { user, assessments, responses, reports, alerts };
}

// Clear stale 104-week demo data from localStorage if present so app starts clean
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem('space-ready-data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.assessments?.length >= 104) {
        localStorage.removeItem('space-ready-data');
      }
    }
  } catch {
    // ignore
  }
}

export const useSpaceReadyStore = create<SpaceReadyStore>()(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      assessments: [],
      responses: [],
      reports: [],
      alerts: [],
      activeTab: 'tool',
      toolSubTab: 'dashboard',
      currentTestAnswers: {},

      setActiveTab: (tab) => {
        if (tab === 'tool') {
          set({ activeTab: tab, toolSubTab: 'dashboard' });
        } else {
          set({ activeTab: tab });
        }
      },
      setToolSubTab: (subTab) => set({ toolSubTab: subTab }),

      setQuestionAnswer: (questionId, score) =>
        set((state) => ({
          currentTestAnswers: {
            ...state.currentTestAnswers,
            [questionId]: score,
          },
        })),

      clearCurrentTest: () => set({ currentTestAnswers: {} }),

      submitWeeklyAssessment: () => {
        const { currentTestAnswers, assessments, user, alerts } = get();

        // Validate all 30 questions are answered
        const unanswered = QUESTION_BANK.filter(
          (q) => currentTestAnswers[q.id] === undefined
        );

        if (unanswered.length > 0) {
          return {
            success: false,
            errors: [`Please complete all 30 questions. (${unanswered.length} remaining)`],
          };
        }

        const nextWeek = assessments.length + 1;
        const todayStr = new Date().toISOString().split('T')[0];
        const newResponses: QuestionResponse[] = [];

        // 1. Calculate scores for all 6 pillars
        const pillarRawMap: PillarScores = {
          sleep: 0,
          nutrition: 0,
          exercise: 0,
          stress: 0,
          social: 0,
          recovery: 0,
        };

        const pillarScoreMap: PillarScores = {
          sleep: 0,
          nutrition: 0,
          exercise: 0,
          stress: 0,
          social: 0,
          recovery: 0,
        };

        (Object.keys(PILLARS) as Pillar[]).forEach((p) => {
          const pQuestions = QUESTION_BANK.filter((q) => q.pillar === p);
          const pScores = pQuestions.map((q) => {
            const val = currentTestAnswers[q.id] ?? 0;
            newResponses.push({
              id: `resp-w${nextWeek}-q${q.id}`,
              assessment_id: `assessment-w${nextWeek}`,
              pillar: p,
              question_id: q.id,
              score: val,
            });
            return val;
          });

          const { raw, score } = calculatePillarScore(pScores);
          pillarRawMap[p] = raw;
          pillarScoreMap[p] = score;
        });

        // 2. Rolling averages for Sleep & Stress (3-week window)
        const prevSleeps = assessments.slice(-2).map((a) => a.pillar_scores.sleep).reverse();
        const prevStresses = assessments.slice(-2).map((a) => a.pillar_scores.stress).reverse();

        const rollingSleep = calculateRollingAverage(pillarScoreMap.sleep, prevSleeps);
        const rollingStress = calculateRollingAverage(pillarScoreMap.stress, prevStresses);

        // 3. Composite score
        const composite = calculateComposite(pillarScoreMap, rollingSleep, rollingStress);

        // 4. Baseline handling: Locked after week 4
        let updatedBaseline = user.baseline_score;
        let baselineMsg = '';

        if (nextWeek <= 4) {
          const pastScores = assessments.map((a) => a.composite_score);
          const all4 = [...pastScores, composite];
          if (nextWeek === 4) {
            updatedBaseline = Math.round(all4.reduce((s, v) => s + v, 0) / 4);
            baselineMsg = `🎯 Week 4 complete! Your baseline is now permanently locked at ${updatedBaseline}.`;
          }
        }

        // 5. Drift & Tier
        const drift = updatedBaseline !== null ? Math.round(updatedBaseline - composite) : 0;
        const driftTier = getDriftTier(drift);

        const newAssessment: WeeklyAssessment = {
          id: `assessment-w${nextWeek}`,
          user_id: user.id,
          week_number: nextWeek,
          date: todayStr,
          pillar_scores: pillarScoreMap,
          pillar_raws: pillarRawMap,
          composite_score: composite,
          drift,
          drift_tier: driftTier,
          rolling_sleep: rollingSleep,
          rolling_stress: rollingStress,
        };

        const updatedAssessments = [...assessments, newAssessment];
        const updatedReports = computeAnnualReports(updatedAssessments, updatedBaseline);

        // 6. Generate alerts if needed
        const newAlertsList: Alert[] = [];

        if (baselineMsg) {
          newAlertsList.push({
            id: `alert-baseline-${nextWeek}`,
            user_id: user.id,
            date: todayStr,
            type: 'tier_change',
            pillar: null,
            message: baselineMsg,
            severity: 'info',
            acknowledged: false,
            actionRecommendation: 'All future weekly checkups will evaluate drift relative to this baseline.',
          });
        }

        if (updatedBaseline !== null && driftTier !== 'green') {
          // Identify weakest pillar
          let minPillar: Pillar = 'sleep';
          let minScore = 999;
          (Object.keys(pillarScoreMap) as Pillar[]).forEach((p) => {
            if (pillarScoreMap[p] < minScore) {
              minScore = pillarScoreMap[p];
              minPillar = p;
            }
          });

          newAlertsList.push({
            id: `alert-w${nextWeek}-${Date.now()}`,
            user_id: user.id,
            date: todayStr,
            type: 'tier_change',
            pillar: minPillar,
            message: `Week ${nextWeek} readiness drifted into ${driftTier.toUpperCase()} tier (Drift: +${drift} pts). Lowest pillar: ${PILLARS[minPillar].name} (${minScore}/100).`,
            severity: driftTier === 'red' ? 'red' : driftTier === 'orange' ? 'orange' : 'yellow',
            acknowledged: false,
            actionRecommendation: PILLARS[minPillar].countermeasureTip,
          });
        }

        set((state) => ({
          user: {
            ...state.user,
            baseline_score: updatedBaseline,
          },
          assessments: updatedAssessments,
          responses: [...state.responses, ...newResponses],
          reports: updatedReports,
          alerts: [...newAlertsList, ...alerts],
          currentTestAnswers: {}, // Reset test form
        }));

        return {
          success: true,
          assessment: newAssessment,
          newAlerts: newAlertsList,
        };
      },

      loadDemoTrajectory: () => {
        const demo = generateRealisticDemoData();
        set({
          user: demo.user,
          assessments: demo.assessments,
          responses: demo.responses,
          reports: demo.reports,
          alerts: demo.alerts,
          currentTestAnswers: {},
        });
      },

      resetAllData: () => {
        set({
          user: DEFAULT_USER,
          assessments: [],
          responses: [],
          reports: [],
          alerts: [],
          currentTestAnswers: {},
        });
      },

      acknowledgeAlert: (alertId) => {
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === alertId ? { ...a, acknowledged: true } : a
          ),
        }));
      },
    }),
    {
      name: 'space-ready-data', // Exact localStorage key requested
    }
  )
);
