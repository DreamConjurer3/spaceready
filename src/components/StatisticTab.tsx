import React, { useState } from 'react';
import {
  TrendingDown,
  Users,
  ShieldAlert,
  HeartPulse,
  Clock,
  Calculator,
  Scale,
  Activity,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  Info,
} from 'lucide-react';

export const StatisticTab: React.FC = () => {
  // Interactive Calculation Example Walkthrough State
  const [sampleSleepRaw, setSampleSleepRaw] = useState<number>(3);
  const [sampleStressRaw, setSampleStressRaw] = useState<number>(4);
  const [sampleNutritionRaw, setSampleNutritionRaw] = useState<number>(2);
  const [sampleExerciseRaw, setSampleExerciseRaw] = useState<number>(1);
  const [sampleSocialRaw, setSampleSocialRaw] = useState<number>(3);
  const [sampleRecoveryRaw, setSampleRecoveryRaw] = useState<number>(2);

  // Dynamic calculations based on formula
  const calcPillar = (raw: number) => Math.max(0, Math.min(100, Math.round(((20 - raw) / 20) * 100)));
  const scoreSleep = calcPillar(sampleSleepRaw);
  const scoreStress = calcPillar(sampleStressRaw);
  const scoreNutr = calcPillar(sampleNutritionRaw);
  const scoreEx = calcPillar(sampleExerciseRaw);
  const scoreSoc = calcPillar(sampleSocialRaw);
  const scoreRec = calcPillar(sampleRecoveryRaw);

  const baselineLocked = 88;
  const weightedSum =
    scoreSleep * 1.0 +
    scoreStress * 1.0 +
    scoreNutr * 1.0 +
    scoreEx * 1.0 +
    scoreSoc * 1.0 +
    scoreRec * 0.8;
  const sampleComposite = Math.round(weightedSum / 5.8);
  const sampleDrift = baselineLocked - sampleComposite;

  const getSampleTier = (d: number) => {
    if (d <= 5) return { label: 'Green · On Track', color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/20' };
    if (d <= 15) return { label: 'Yellow · Early Warning', color: 'text-yellow-400', border: 'border-yellow-500/40', bg: 'bg-yellow-950/20' };
    if (d <= 20) return { label: 'Orange · Action Needed', color: 'text-orange-400', border: 'border-orange-500/40', bg: 'bg-orange-950/20' };
    return { label: 'Red · Significant Decrement', color: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-950/20' };
  };

  const sampleTier = getSampleTier(sampleDrift);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-xs font-mono text-purple-400 uppercase tracking-widest">
          <span>Operational Risk Analysis</span>
          <span>·</span>
          <span>NASA Astronaut Office Data</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wide leading-snug">
          The Statistic: A Shrinking Margin of Safety
        </h1>
        <p className="text-zinc-400 mt-2 text-base leading-relaxed">
          Quantitative telemetry on NASA's active astronaut corps, historical staffing decline, and the escalating risk profile of infrequent medical checkpoints.
        </p>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Active Corps</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-4xl font-bold font-['Chakra_Petch'] text-white">44</div>
          <div className="text-xs font-mono text-red-400 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Down from ~150 in 2000 (-70%)</span>
          </div>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Smallest astronaut cadre in over 20 years (NASA OIG IG-22-007).
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Safety Margin</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-4xl font-bold font-['Chakra_Petch'] text-amber-400">15%</div>
          <div className="text-xs font-mono text-red-400 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Down from 50% buffer</span>
          </div>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Zero redundancy for unplanned medical or flight reassignment.
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Flight Checkpoints</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-4xl font-bold font-['Chakra_Petch'] text-white">3–4</div>
          <div className="text-xs font-mono text-zinc-400 mt-1">
            Across 2–4 Year Window
          </div>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Over 99.7% of training days have zero standardized fitness data signal.
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">ISS Emergency Evacuation</span>
            <HeartPulse className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-4xl font-bold font-['Chakra_Petch'] text-red-400">Jan '26</div>
          <div className="text-xs font-mono text-zinc-400 mt-1">
            First in 25 Years
          </div>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Mike Fincke neurological episode pulled full expedition home early.
          </p>
        </div>
      </div>

      {/* Narrative Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wide">
          The Vulnerability of Discrete Checkpoints
        </h2>

        <div className="space-y-3">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800">
            <h4 className="text-sm font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider mb-1">
              1. The "Clean Snapshot" Fallacy
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              When an astronaut undergoes an annual physical exam (OCHMO-STD-100.1A), they prepare weeks in advance. The test captures an idealized peak moment. However, deep-space deconditioning—cortisol spikes, micro-sleep fragmentation, and localized bone mineral resorption—accumulates silently during ordinary training cycles.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800">
            <h4 className="text-sm font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider mb-1">
              2. Single Point of Failure (SPOF)
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              With only 44 active astronauts assigned across Artemis Moon missions, Commercial Crew to the ISS, and Starliner flight tests, NASA has virtually zero buffer. A single astronaut failing their L-60 preflight baseline causes months of mission slippage and millions in logistics rework.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800">
            <h4 className="text-sm font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider mb-1">
              3. Continuous Ground Lifestyle Signal
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Space-Ready replaces 3–4 isolated data points with 104 to 208 high-cadence weekly assessments. Drift is detected early at 5 points (Green → Yellow), giving trainers and ASCR flight surgeons months of runway to intervene before it reaches the −20 point Red flag threshold.
            </p>
          </div>
        </div>
      </div>

      {/* DETAILED METHODOLOGY: How the Tool Calculates User's Information */}
      <div className="pt-6 border-t border-zinc-800/80 space-y-6">
        {/* Streamlined, Less Vertically Stacked Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-800/70 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
              <Calculator className="w-3.5 h-3.5" />
              <span>Computational Telemetry Architecture</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wide">
              How Space-Ready Calculates User Information
            </h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-lg sm:text-right leading-relaxed">
            NASA OCHMO-aligned multi-axial scoring pipeline: from raw weekly Likert inputs to locked baseline and certified drift risk tiers.
          </p>
        </div>

        {/* 6 Step Computational Pipeline - Clean, Unclustered 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Step 1: Question Calibration & Raw Scoring */}
          <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-zinc-700/80 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                    01
                  </span>
                  <h3 className="font-['Chakra_Petch'] font-bold text-white text-sm sm:text-base uppercase tracking-wide">
                    Pillar Raw Score Accumulation
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  5 Qs / Pillar
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Weekly checkups evaluate 6 clinical pillars with 5 standardized questions. Responses are scored on a risk gradient from <span className="text-emerald-400 font-medium">0 (optimal)</span> to <span className="text-red-400 font-medium">4 (severe deficit)</span>.
              </p>
            </div>

            <div className="p-3 bg-black/60 rounded-lg border border-zinc-800/80 font-mono text-xs space-y-1">
              <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Formula:</span>
                <span className="text-cyan-300 font-bold">Raw = ∑ (Question_Score_i) for i = 1..5</span>
              </div>
              <div className="text-[10px] text-zinc-500">
                Range: 0 (flawless baseline) to 20 (maximum acute operational risk).
              </div>
            </div>
          </div>

          {/* Step 2: Inverse Normalization to 0-100 Scale */}
          <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-zinc-700/80 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                    02
                  </span>
                  <h3 className="font-['Chakra_Petch'] font-bold text-white text-sm sm:text-base uppercase tracking-wide">
                    Inverse Normalization (0–100%)
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  Clamp [0, 100]
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Accumulated penalty points are inverted from max points (20) to compute an intuitive astronaut readiness percentage:
              </p>
            </div>

            <div className="p-3 bg-black/60 rounded-lg border border-zinc-800/80 font-mono text-xs space-y-2">
              <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Formula:</span>
                <span className="text-cyan-300 font-bold">Score = Math.round(((20 - Raw) / 20) * 100)</span>
              </div>
              <div className="grid grid-cols-4 gap-1 pt-1 text-[10px] text-center">
                <div className="p-1 rounded bg-zinc-900/90 border border-zinc-800">
                  <span className="text-zinc-500 block">Raw 0</span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
                <div className="p-1 rounded bg-zinc-900/90 border border-zinc-800">
                  <span className="text-zinc-500 block">Raw 4</span>
                  <span className="text-yellow-400 font-bold">80%</span>
                </div>
                <div className="p-1 rounded bg-zinc-900/90 border border-zinc-800">
                  <span className="text-zinc-500 block">Raw 8</span>
                  <span className="text-orange-400 font-bold">60%</span>
                </div>
                <div className="p-1 rounded bg-zinc-900/90 border border-zinc-800">
                  <span className="text-zinc-500 block">Raw 16</span>
                  <span className="text-red-400 font-bold">20%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: 3-Week Rolling Smoothing */}
          <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-zinc-700/80 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                    03
                  </span>
                  <h3 className="font-['Chakra_Petch'] font-bold text-white text-sm sm:text-base uppercase tracking-wide">
                    Temporal Rolling Smoothing
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  3-Wk Window
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sleep debt and stress have biological hysteresis. To prevent single-day false alarms while detecting cumulative drift, Space-Ready applies a 3-week trailing average to Sleep and Stress:
              </p>
            </div>

            <div className="p-3 bg-black/60 rounded-lg border border-zinc-800/80 font-mono text-xs space-y-1">
              <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Equation:</span>
                <span className="text-cyan-300 font-bold">Rolling = Math.round((Score_w + Score_w-1 + Score_w-2) / N)</span>
              </div>
              <div className="text-[10px] text-zinc-500">
                Where N is available window size (1 to 3 weeks during initial calibration).
              </div>
            </div>
          </div>

          {/* Step 4: Multi-Axial Composite Score */}
          <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-zinc-700/80 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                    04
                  </span>
                  <h3 className="font-['Chakra_Petch'] font-bold text-white text-sm sm:text-base uppercase tracking-wide">
                    Weighted Composite Score
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  Divisor = 5.8
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Primary flight pillars carry 1.0× weight, while Recovery carries 0.8× weight to reflect physiological rest-cycle damping:
              </p>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                <div className="p-1.5 rounded bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="text-zinc-400 block text-[10px]">Sleep (Roll)</span>
                  <span className="text-purple-300 font-bold">1.0×</span>
                </div>
                <div className="p-1.5 rounded bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="text-zinc-400 block text-[10px]">Stress (Roll)</span>
                  <span className="text-purple-300 font-bold">1.0×</span>
                </div>
                <div className="p-1.5 rounded bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="text-zinc-400 block text-[10px]">Nutrition</span>
                  <span className="text-purple-300 font-bold">1.0×</span>
                </div>
                <div className="p-1.5 rounded bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="text-zinc-400 block text-[10px]">Exercise</span>
                  <span className="text-purple-300 font-bold">1.0×</span>
                </div>
                <div className="p-1.5 rounded bg-zinc-900/80 border border-zinc-800 text-center">
                  <span className="text-zinc-400 block text-[10px]">Social</span>
                  <span className="text-purple-300 font-bold">1.0×</span>
                </div>
                <div className="p-1.5 rounded bg-cyan-950/30 border border-cyan-800/40 text-center">
                  <span className="text-cyan-400 block text-[10px]">Recovery</span>
                  <span className="text-cyan-300 font-bold">0.8×</span>
                </div>
              </div>

              <div className="p-2.5 bg-black/60 rounded-lg border border-zinc-800/80 font-mono text-xs">
                <span className="text-cyan-300 font-bold text-[11px] block">
                  Composite = Math.round((∑ 1.0·Pillar_5 + 0.8·Recovery) / 5.8)
                </span>
              </div>
            </div>
          </div>

          {/* Step 5: Locked Baseline & Drift Computation */}
          <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-zinc-700/80 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                    05
                  </span>
                  <h3 className="font-['Chakra_Petch'] font-bold text-white text-sm sm:text-base uppercase tracking-wide">
                    Locked Baseline &amp; Drift Metric
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  Locked Wk 4
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                During Weeks 1–4, the astronaut establishes their personal reference standard. After Week 4, the baseline locks permanently:
              </p>
            </div>

            <div className="p-3 bg-black/60 rounded-lg border border-zinc-800/80 font-mono text-xs space-y-1.5">
              <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Baseline:</span>
                <span className="text-cyan-300 font-bold">Baseline = Math.round((∑ W1..W4) / 4)</span>
              </div>
              <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-1 border-t border-zinc-800/60">
                <span>Weekly Drift:</span>
                <span className="text-amber-300 font-bold">Drift = Baseline - Composite_w</span>
              </div>
            </div>
          </div>

          {/* Step 6: NASA Drift Risk Tiers & L-60 Certification Criteria */}
          <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-zinc-700/80 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                    06
                  </span>
                  <h3 className="font-['Chakra_Petch'] font-bold text-white text-sm sm:text-base uppercase tracking-wide">
                    Drift Risk Tiers &amp; L-60 Flight Sign-Off
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  OCHMO STD
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Four automated risk tiers enforce early intervention months prior to the critical -20 pt mission pause boundary:
              </p>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="p-2 rounded bg-emerald-950/25 border border-emerald-500/30">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-emerald-400 text-[10px]">Green</span>
                    <span className="text-emerald-300 text-[10px]">≤ 5 pts</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">Nominal flight track</span>
                </div>
                <div className="p-2 rounded bg-yellow-950/25 border border-yellow-500/30">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-yellow-400 text-[10px]">Yellow</span>
                    <span className="text-yellow-300 text-[10px]">6–15 pts</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">Early tips triggered</span>
                </div>
                <div className="p-2 rounded bg-orange-950/25 border border-orange-500/30">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-orange-400 text-[10px]">Orange</span>
                    <span className="text-orange-300 text-[10px]">16–20 pts</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">Coach review needed</span>
                </div>
                <div className="p-2 rounded bg-red-950/25 border border-red-500/30">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-red-400 text-[10px]">Red</span>
                    <span className="text-red-300 text-[10px]">&gt; 20 pts</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">Surgeon flight pause</span>
                </div>
              </div>

              <div className="p-2 rounded bg-zinc-900/70 border border-zinc-800 text-[10px] font-mono text-zinc-300 flex items-center justify-between">
                <span className="text-purple-300 font-bold">L-60 Flight Sign-off Rule:</span>
                <span className="text-white">Annual Drift ≤ 5 pts across all pre-flight years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Calculation Walkthrough Sandbox - Sleek & Compact */}
        <div className="bg-zinc-950/90 border border-purple-900/40 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <h3 className="font-['Chakra_Petch'] font-bold text-white text-sm sm:text-base uppercase tracking-wider">
                Interactive Formula Sandbox (Live Demonstration)
              </h3>
            </div>
            <div className="text-xs font-mono text-zinc-400">
              Locked Baseline: <span className="text-white font-bold">{baselineLocked} pts</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Adjust the raw penalty inputs (0–10 risk points) to observe live normalized scoring, composite calculation, and drift classification:
          </p>

          {/* Sliders Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Sleep</span>
                <span className="text-cyan-400 font-bold">{sampleSleepRaw}/20</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={sampleSleepRaw}
                onChange={(e) => setSampleSleepRaw(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1 bg-zinc-800 rounded"
              />
              <div className="text-[10px] font-mono text-zinc-400">{scoreSleep}% (1.0×)</div>
            </div>

            <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Stress</span>
                <span className="text-cyan-400 font-bold">{sampleStressRaw}/20</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={sampleStressRaw}
                onChange={(e) => setSampleStressRaw(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1 bg-zinc-800 rounded"
              />
              <div className="text-[10px] font-mono text-zinc-400">{scoreStress}% (1.0×)</div>
            </div>

            <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Nutrition</span>
                <span className="text-cyan-400 font-bold">{sampleNutritionRaw}/20</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={sampleNutritionRaw}
                onChange={(e) => setSampleNutritionRaw(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1 bg-zinc-800 rounded"
              />
              <div className="text-[10px] font-mono text-zinc-400">{scoreNutr}% (1.0×)</div>
            </div>

            <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Exercise</span>
                <span className="text-cyan-400 font-bold">{sampleExerciseRaw}/20</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={sampleExerciseRaw}
                onChange={(e) => setSampleExerciseRaw(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1 bg-zinc-800 rounded"
              />
              <div className="text-[10px] font-mono text-zinc-400">{scoreEx}% (1.0×)</div>
            </div>

            <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Social</span>
                <span className="text-cyan-400 font-bold">{sampleSocialRaw}/20</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={sampleSocialRaw}
                onChange={(e) => setSampleSocialRaw(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1 bg-zinc-800 rounded"
              />
              <div className="text-[10px] font-mono text-zinc-400">{scoreSoc}% (1.0×)</div>
            </div>

            <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Recovery</span>
                <span className="text-cyan-400 font-bold">{sampleRecoveryRaw}/20</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={sampleRecoveryRaw}
                onChange={(e) => setSampleRecoveryRaw(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1 bg-zinc-800 rounded"
              />
              <div className="text-[10px] font-mono text-zinc-400">{scoreRec}% (0.8×)</div>
            </div>
          </div>

          {/* Calculation Output Card */}
          <div className="p-3.5 rounded-xl bg-black border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-mono text-zinc-400">Computed Composite Score</div>
              <div className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch'] text-white">
                {sampleComposite} <span className="text-sm font-normal text-zinc-400">/ 100</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500">
                Formula: ({scoreSleep} + {scoreStress} + {scoreNutr} + {scoreEx} + {scoreSoc} + ({scoreRec}×0.8)) / 5.8
              </div>
            </div>

            <div className="space-y-1 text-center sm:text-right">
              <div className="text-xs font-mono text-zinc-400">Calculated Drift vs Baseline ({baselineLocked})</div>
              <div className={`text-xl sm:text-2xl font-bold font-['Chakra_Petch'] ${sampleDrift > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {sampleDrift > 0 ? `-${sampleDrift} pts` : `+${Math.abs(sampleDrift)} pts`}
              </div>
              <div className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${sampleTier.border} ${sampleTier.bg} ${sampleTier.color}`}>
                {sampleTier.label}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
