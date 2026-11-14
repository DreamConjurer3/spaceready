export type Pillar = 'sleep' | 'nutrition' | 'exercise' | 'stress' | 'social' | 'recovery';
export type DriftTier = 'green' | 'yellow' | 'orange' | 'red';

export interface PillarMeta {
  id: Pillar;
  name: string;
  weight: number;
  icon: string;
  description: string;
  countermeasureTip: string;
}

export const PILLARS: Record<Pillar, PillarMeta> = {
  sleep: {
    id: 'sleep',
    name: 'Sleep',
    weight: 1.0,
    icon: '🌙',
    description: 'Circadian stability, restorative deep sleep, and neuro-cognitive recovery.',
    countermeasureTip: 'Anchor bedtime within 30 min, reduce evening screens, and enforce dark sleep environment.',
  },
  nutrition: {
    id: 'nutrition',
    name: 'Nutrition',
    weight: 1.0,
    icon: '🥗',
    description: 'Cellular fueling, lean mass preservation, and micronutrient defense.',
    countermeasureTip: 'Increase daily protein intake (1.6g/kg target) and consume at least 4 servings of colorful plants.',
  },
  exercise: {
    id: 'exercise',
    name: 'Exercise',
    weight: 1.0,
    icon: '🏃',
    description: 'Musculoskeletal bone loading, VO2peak preservation, and strength maintenance.',
    countermeasureTip: 'Schedule dedicated resistance training sessions and add axial impact/loading movement daily.',
  },
  stress: {
    id: 'stress',
    name: 'Stress',
    weight: 1.0,
    icon: '🧘',
    description: 'Neuro-endocrine balance, cognitive workload buffering, and autonomic recovery.',
    countermeasureTip: 'Incorporate 15 minutes of structured parasympathetic down-regulation (breathwork or mindfulness).',
  },
  social: {
    id: 'social',
    name: 'Social Connection',
    weight: 1.0,
    icon: '🤝',
    description: 'Crew cohesion, interpersonal support networks, and psychological resilience.',
    countermeasureTip: 'Schedule dedicated synchronous check-ins with trusted peers or family support networks.',
  },
  recovery: {
    id: 'recovery',
    name: 'Recovery',
    weight: 0.8,
    icon: '⚡',
    description: 'Systemic muscle repair, resting heart rate stabilization, and cumulative fatigue dissipation.',
    countermeasureTip: 'Prioritize low-intensity active recovery (light swimming, mobility) and monitor resting pulse.',
  },
};

export interface QuestionOption {
  label: string;
  points: number; // 0 = optimal/baseline, 4 = severe/red-flag
  description?: string;
}

export interface Question {
  id: number;
  pillar: Pillar;
  questionNumber: number; // 1-5
  text: string;
  options: QuestionOption[];
}

export const QUESTION_BANK: Question[] = [
  // --- 1. SLEEP ---
  {
    id: 1,
    pillar: 'sleep',
    questionNumber: 1,
    text: 'How many hours did you sleep last night?',
    options: [
      { label: '7–9 hours', points: 0, description: 'Optimal baseline window' },
      { label: '6–7 hours', points: 1, description: 'Slight deviation' },
      { label: '5–6 hours', points: 2, description: 'Moderate restriction' },
      { label: '4–5 hours', points: 3, description: 'Significant deficit' },
      { label: '< 4 hours', points: 4, description: 'Severe acute sleep deprivation' },
    ],
  },
  {
    id: 2,
    pillar: 'sleep',
    questionNumber: 2,
    text: 'How many times did you wake up during the night?',
    options: [
      { label: '0 awakenings', points: 0, description: 'Unbroken sleep architecture' },
      { label: '1 awakening', points: 1, description: 'Normal brief arousal' },
      { label: '2 awakenings', points: 2, description: 'Moderate fragmentation' },
      { label: '3 awakenings', points: 3, description: 'Significant fragmentation' },
      { label: '4+ awakenings', points: 4, description: 'Severe sleep disruption' },
    ],
  },
  {
    id: 3,
    pillar: 'sleep',
    questionNumber: 3,
    text: 'How would you rate your sleep quality?',
    options: [
      { label: 'Excellent', points: 0, description: 'Fully refreshed, high REM/Deep sleep' },
      { label: 'Good', points: 1, description: 'Restorative with minor grogginess' },
      { label: 'Fair', points: 2, description: 'Tired upon waking' },
      { label: 'Poor', points: 3, description: 'Restless, unrestorative' },
      { label: 'Very Poor', points: 4, description: 'Severe exhaustion, unrefreshed' },
    ],
  },
  {
    id: 4,
    pillar: 'sleep',
    questionNumber: 4,
    text: 'Did you use screens within 1 hour of bedtime?',
    options: [
      { label: 'No', points: 0, description: 'Complete blue-light avoidance' },
      { label: 'Occasionally', points: 1, description: 'Dimmed/filtered briefly' },
      { label: 'Sometimes', points: 2, description: 'Moderate phone/tablet use' },
      { label: 'Often', points: 3, description: 'Frequent screen engagement' },
      { label: 'Always', points: 4, description: 'Screen use right until sleep' },
    ],
  },
  {
    id: 5,
    pillar: 'sleep',
    questionNumber: 5,
    text: 'How long did it take to fall asleep last night?',
    options: [
      { label: '< 15 min', points: 0, description: 'Optimal sleep latency' },
      { label: '15–30 min', points: 1, description: 'Normal latency' },
      { label: '30–45 min', points: 2, description: 'Mild onset delay' },
      { label: '45–60 min', points: 3, description: 'Significant delay' },
      { label: '> 60 min', points: 4, description: 'Severe sleep onset insomnia' },
    ],
  },

  // --- 2. NUTRITION ---
  {
    id: 6,
    pillar: 'nutrition',
    questionNumber: 1,
    text: 'How many servings of protein did you consume today?',
    options: [
      { label: '3+ servings', points: 0, description: 'Sufficient muscle protein synthesis' },
      { label: '2 servings', points: 1, description: 'Slightly below target' },
      { label: '1 serving', points: 2, description: 'Suboptimal protein intake' },
      { label: '< 1 serving', points: 3, description: 'Severe protein deficit' },
      { label: '0 servings', points: 4, description: 'No protein consumed' },
    ],
  },
  {
    id: 7,
    pillar: 'nutrition',
    questionNumber: 2,
    text: 'How many servings of fruits/vegetables did you eat today?',
    options: [
      { label: '5+ servings', points: 0, description: 'High antioxidant & micronutrient support' },
      { label: '4 servings', points: 1, description: 'Good micronutrient baseline' },
      { label: '3 servings', points: 2, description: 'Moderate plant intake' },
      { label: '1–2 servings', points: 3, description: 'Low micronutrient variety' },
      { label: '0 servings', points: 4, description: 'Complete lack of fresh produce' },
    ],
  },
  {
    id: 8,
    pillar: 'nutrition',
    questionNumber: 3,
    text: 'How much water did you drink today?',
    options: [
      { label: '2.0L +', points: 0, description: 'Optimal hydration for microgravity prep' },
      { label: '1.5–2.0L', points: 1, description: 'Acceptable fluid baseline' },
      { label: '1.0–1.5L', points: 2, description: 'Mild hypohydration risk' },
      { label: '0.5–1.0L', points: 3, description: 'Significant fluid deficiency' },
      { label: '< 0.5L', points: 4, description: 'Severe dehydration / kidney risk' },
    ],
  },
  {
    id: 9,
    pillar: 'nutrition',
    questionNumber: 4,
    text: 'How many processed/junk food items did you consume?',
    options: [
      { label: '0 items', points: 0, description: 'Clean whole-food protocol' },
      { label: '1 item', points: 1, description: 'Minor non-baseline snack' },
      { label: '2 items', points: 2, description: 'Moderate ultra-processed intake' },
      { label: '3 items', points: 3, description: 'Elevated sodium & refined sugars' },
      { label: '4+ items', points: 4, description: 'Heavy ultra-processed reliance' },
    ],
  },
  {
    id: 10,
    pillar: 'nutrition',
    questionNumber: 5,
    text: 'Did you skip any meals today?',
    options: [
      { label: 'No', points: 0, description: 'Consistent energetic fueling' },
      { label: 'Lunch', points: 1, description: 'Missed midday refuel' },
      { label: 'Dinner', points: 2, description: 'Missed evening recovery meal' },
      { label: 'Breakfast + Lunch', points: 3, description: 'Prolonged daytime caloric deficit' },
      { label: '2+ meals', points: 4, description: 'Severe energetic disruption' },
    ],
  },

  // --- 3. EXERCISE ---
  {
    id: 11,
    pillar: 'exercise',
    questionNumber: 1,
    text: 'How many minutes of moderate+ activity did you do today?',
    options: [
      { label: '60+ min', points: 0, description: 'Meets NASA astronaut aerobic benchmark' },
      { label: '45–60 min', points: 1, description: 'Good cardiovascular stimulus' },
      { label: '30–45 min', points: 2, description: 'Moderate aerobic maintenance' },
      { label: '15–30 min', points: 3, description: 'Minimal stimulus' },
      { label: '< 15 min', points: 4, description: 'Inadequate conditioning' },
    ],
  },
  {
    id: 12,
    pillar: 'exercise',
    questionNumber: 2,
    text: 'Did you do any resistance/strength training this week?',
    options: [
      { label: 'Daily', points: 0, description: 'Maximum bone/muscle countermeasure' },
      { label: '4–5x this week', points: 1, description: 'Strong strength maintenance' },
      { label: '3x this week', points: 2, description: 'Adequate baseline loading' },
      { label: '1–2x this week', points: 3, description: 'Below minimum protective threshold' },
      { label: '0 times', points: 4, description: 'No strength loading (atrophy risk)' },
    ],
  },
  {
    id: 13,
    pillar: 'exercise',
    questionNumber: 3,
    text: 'How many days this week were you sedentary (>8h sitting)?',
    options: [
      { label: '0 days', points: 0, description: 'Continuous daily movement' },
      { label: '1 day', points: 1, description: 'Minor sedentary exposure' },
      { label: '2 days', points: 2, description: 'Moderate sitting time' },
      { label: '3 days', points: 3, description: 'Substantial prolonged sitting' },
      { label: '4+ days', points: 4, description: 'Chronic sedentary deconditioning' },
    ],
  },
  {
    id: 14,
    pillar: 'exercise',
    questionNumber: 4,
    text: 'How would you rate your energy level during activity today?',
    options: [
      { label: 'High', points: 0, description: 'Optimal power output & stamina' },
      { label: 'Good', points: 1, description: 'Strong work capacity' },
      { label: 'Fair', points: 2, description: 'Mild sluggishness' },
      { label: 'Low', points: 3, description: 'Struggling through sets' },
      { label: 'Exhausted', points: 4, description: 'Severe fatigue, unable to hit targets' },
    ],
  },
  {
    id: 15,
    pillar: 'exercise',
    questionNumber: 5,
    text: 'Did you complete your planned workout today?',
    options: [
      { label: 'Yes + bonus', points: 0, description: 'Exceeded countermeasure plan' },
      { label: 'Yes', points: 1, description: '100% adherence to plan' },
      { label: 'Modified', points: 2, description: 'Adjusted volume or intensity' },
      { label: 'Partial', points: 3, description: 'Cut workout short' },
      { label: 'Skipped', points: 4, description: 'Missed planned training session' },
    ],
  },

  // --- 4. STRESS ---
  {
    id: 16,
    pillar: 'stress',
    questionNumber: 1,
    text: 'On a scale of 1–10, how stressed do you feel right now?',
    options: [
      { label: '1–2 (Low)', points: 0, description: 'Calm, regulated state' },
      { label: '3–4 (Mild)', points: 1, description: 'Manageable operational tension' },
      { label: '5–6 (Moderate)', points: 2, description: 'Elevated cognitive load' },
      { label: '7–8 (High)', points: 3, description: 'Significant sympathetic arousal' },
      { label: '9–10 (Extreme)', points: 4, description: 'Overwhelming acute distress' },
    ],
  },
  {
    id: 17,
    pillar: 'stress',
    questionNumber: 2,
    text: 'How many hours did you spend in focused work today?',
    options: [
      { label: '6–8 hours', points: 0, description: 'Balanced high-focus block' },
      { label: '8–10 hours', points: 1, description: 'Slightly extended cognitive output' },
      { label: '10–12 hours', points: 2, description: 'Fatigue accumulation threshold' },
      { label: '12–14 hours', points: 3, description: 'Cognitive burnout range' },
      { label: '14+ hours', points: 4, description: 'Critical over-exertion risk' },
    ],
  },
  {
    id: 18,
    pillar: 'stress',
    questionNumber: 3,
    text: 'Did you have a dedicated relaxation/break period today?',
    options: [
      { label: '2+ hours', points: 0, description: 'Thorough parasympathetic recovery' },
      { label: '1–2 hours', points: 1, description: 'Sufficient downtime' },
      { label: '30–60 min', points: 2, description: 'Brief respite' },
      { label: '15–30 min', points: 3, description: 'Marginal break' },
      { label: '0 minutes', points: 4, description: 'Non-stop sympathetic stimulation' },
    ],
  },
  {
    id: 19,
    pillar: 'stress',
    questionNumber: 4,
    text: 'How often did you feel overwhelmed this week?',
    options: [
      { label: 'Never', points: 0, description: 'High operational coping capacity' },
      { label: 'Once', points: 1, description: 'Isolated transient pressure' },
      { label: '2–3 times', points: 2, description: 'Recurrent stress spikes' },
      { label: '4–5 times', points: 3, description: 'Frequent task overload' },
      { label: 'Daily', points: 4, description: 'Chronic psychological overload' },
    ],
  },
  {
    id: 20,
    pillar: 'stress',
    questionNumber: 5,
    text: 'How well did you sleep due to stress/racing thoughts?',
    options: [
      { label: 'No impact', points: 0, description: 'Quiet mind, peaceful sleep onset' },
      { label: 'Mild impact', points: 1, description: 'Brief rumination before sleep' },
      { label: 'Moderate impact', points: 2, description: 'Delayed sleep by 30+ minutes' },
      { label: 'Significant impact', points: 3, description: 'Repeated awakenings from worry' },
      { label: 'Severe impact', points: 4, description: 'Complete inability to rest due to stress' },
    ],
  },

  // --- 5. SOCIAL CONNECTION ---
  {
    id: 21,
    pillar: 'social',
    questionNumber: 1,
    text: 'How many meaningful conversations did you have today?',
    options: [
      { label: '3+ conversations', points: 0, description: 'Rich interpersonal bond' },
      { label: '2 conversations', points: 1, description: 'Healthy social connection' },
      { label: '1 conversation', points: 2, description: 'Basic relational contact' },
      { label: '0 (superficial only)', points: 3, description: 'Isolated operational exchanges' },
      { label: '0 conversations', points: 4, description: 'Complete lack of connection' },
    ],
  },
  {
    id: 22,
    pillar: 'social',
    questionNumber: 2,
    text: 'When did you last see or speak with family/friends?',
    options: [
      { label: 'Today', points: 0, description: 'Immediate social anchoring' },
      { label: 'Yesterday', points: 1, description: 'Regular support cadence' },
      { label: 'Within 3 days', points: 2, description: 'Mild social gap' },
      { label: 'Within 7 days', points: 3, description: 'Extended social silence' },
      { label: '> 7 days', points: 4, description: 'Isolation drift from primary network' },
    ],
  },
  {
    id: 23,
    pillar: 'social',
    questionNumber: 3,
    text: 'Do you feel socially isolated right now?',
    options: [
      { label: 'Not at all', points: 0, description: 'Strong sense of belonging & crew solidarity' },
      { label: 'Rarely', points: 1, description: 'Occasional fleeting solitude' },
      { label: 'Sometimes', points: 2, description: 'Moderate feelings of detachment' },
      { label: 'Often', points: 3, description: 'Frequent feeling of disconnectedness' },
      { label: 'Always', points: 4, description: 'Severe psychological isolation' },
    ],
  },
  {
    id: 24,
    pillar: 'social',
    questionNumber: 4,
    text: 'Did you participate in a group activity today?',
    options: [
      { label: 'Yes + initiated', points: 0, description: 'Proactive community leadership' },
      { label: 'Yes', points: 1, description: 'Active group involvement' },
      { label: 'Planned one', points: 2, description: 'Scheduled future participation' },
      { label: 'Considered it', points: 3, description: 'Passively contemplated' },
      { label: 'No', points: 4, description: 'Zero collective engagement' },
    ],
  },
  {
    id: 25,
    pillar: 'social',
    questionNumber: 5,
    text: 'How supported do you feel by your current environment?',
    options: [
      { label: 'Very supported', points: 0, description: 'Complete psychological safety' },
      { label: 'Moderately', points: 1, description: 'Good support system' },
      { label: 'Somewhat', points: 2, description: 'Inconsistent support' },
      { label: 'Not very', points: 3, description: 'Friction in team or personal setting' },
      { label: 'Not at all', points: 4, description: 'Hostile or totally unsupportive' },
    ],
  },

  // --- 6. RECOVERY ---
  {
    id: 26,
    pillar: 'recovery',
    questionNumber: 1,
    text: 'How is your muscle soreness today?',
    options: [
      { label: 'None', points: 0, description: 'Full tissue readiness' },
      { label: 'Mild', points: 1, description: 'Normal training adaptation' },
      { label: 'Moderate', points: 2, description: 'Noticeable DOMS' },
      { label: 'Significant', points: 3, description: 'Movement noticeably restricted' },
      { label: 'Severe', points: 4, description: 'Extreme pain / functional limitation' },
    ],
  },
  {
    id: 27,
    pillar: 'recovery',
    questionNumber: 2,
    text: 'How would you rate your overall energy today?',
    options: [
      { label: 'Excellent', points: 0, description: 'Vibrant physiological capacity' },
      { label: 'Good', points: 1, description: 'Sustained daytime stamina' },
      { label: 'Fair', points: 2, description: 'Mid-afternoon energy dips' },
      { label: 'Low', points: 3, description: 'Persistent systemic lethargy' },
      { label: 'Very Low', points: 4, description: 'Severe exhaustion, bed-bound' },
    ],
  },
  {
    id: 28,
    pillar: 'recovery',
    questionNumber: 3,
    text: 'Did you get any active recovery (walking, stretching, light swim)?',
    options: [
      { label: 'Yes (30+ min)', points: 0, description: 'Enhanced lactic clearance & blood flow' },
      { label: 'Yes (15–30 min)', points: 1, description: 'Effective light mobility' },
      { label: 'Planned it', points: 2, description: 'Recovery protocol intended' },
      { label: 'Considered it', points: 3, description: 'No execution' },
      { label: 'No', points: 4, description: 'Zero regenerative movement' },
    ],
  },
  {
    id: 29,
    pillar: 'recovery',
    questionNumber: 4,
    text: 'How is your resting heart rate compared to normal?',
    options: [
      { label: 'Normal / Below', points: 0, description: 'Full autonomic parasympathetic tone' },
      { label: '+1–5 bpm', points: 1, description: 'Minor physiological strain' },
      { label: '+5–10 bpm', points: 2, description: 'Moderate sympathetic overdrive / fatigue' },
      { label: '+10–15 bpm', points: 3, description: 'Significant systemic stress / illness' },
      { label: '> 15 bpm', points: 4, description: 'Severe overtraining or acute illness' },
    ],
  },
  {
    id: 30,
    pillar: 'recovery',
    questionNumber: 5,
    text: "Do you feel physically recovered from last week's training?",
    options: [
      { label: 'Fully', points: 0, description: 'Ready for full operational loading' },
      { label: 'Mostly', points: 1, description: 'Minor lingering fatigue' },
      { label: 'Partially', points: 2, description: 'Substantial cumulative debt' },
      { label: 'Barely', points: 3, description: 'Deep systemic exhaustion' },
      { label: 'Not at all', points: 4, description: 'Complete non-functional overreaching' },
    ],
  },
];

// Helper to get questions for a pillar
export const getPillarQuestions = (pillar: Pillar): Question[] => {
  return QUESTION_BANK.filter((q) => q.pillar === pillar);
};
