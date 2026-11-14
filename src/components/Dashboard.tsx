import React from 'react';
import { useSpaceReadyStore } from '../store/useSpaceReadyStore';
import { PILLARS, Pillar } from '../data/config';
import { getTierDetails } from '../data/scoring';
import {
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Download,
  RotateCcw,
} from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const Dashboard: React.FC = () => {
  const {
    assessments,
    user,
    alerts,
    setToolSubTab,
    resetAllData,
  } = useSpaceReadyStore();

  const totalWeeks = assessments.length;
  const latest = totalWeeks > 0 ? assessments[totalWeeks - 1] : null;

  const compositeScore = latest ? latest.composite_score : 0;
  const baseline = user.baseline_score;
  const drift = latest ? latest.drift : 0;
  const tier = latest ? latest.drift_tier : 'green';
  const tierInfo = getTierDetails(tier);

  const activeAlert = alerts.find((a) => !a.acknowledged);

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ user, assessments }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `space-ready-${user.name.toLowerCase().replace(/\s+/g, '-')}-data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    if (assessments.length === 0) return;
    const headers = [
      'Week',
      'Date',
      'Composite Score',
      'Drift',
      'Tier',
      'Sleep',
      'Nutrition',
      'Exercise',
      'Stress',
      'Social',
      'Recovery',
    ];
    const rows = assessments.map((a) => [
      a.week_number,
      a.date,
      a.composite_score,
      a.drift,
      a.drift_tier,
      a.pillar_scores.sleep,
      a.pillar_scores.nutrition,
      a.pillar_scores.exercise,
      a.pillar_scores.stress,
      a.pillar_scores.social,
      a.pillar_scores.recovery,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `space-ready-flight-data.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="w-full">
      {/* 1. Space-Ready Monitor Hero Screen with Background Image - ALWAYS starts here (Full screen, no edges) */}
      <div className="relative w-full min-h-[calc(100vh-100px)] flex items-center justify-center overflow-hidden bg-black">
        {/* Spaceflight Monitor Background Image: Full display on phone and laptop without being cut by top navbar */}
        <div
          className="absolute inset-0 bg-cover sm:bg-contain bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage:
              "url('https://mystico-3.sirv.com/Gemini_Generated_Image_s1vw66s1vw66s1vw.jpeg')",
          }}
        />
        {/* Contrast Overlay Gradients for High Legibility & Artwork Clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/80 pointer-events-none" />

        {/* Content Panel */}
        <div className="relative z-10 py-16 px-4 sm:px-8 max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* Transparent panel with subtle tech animated borderline */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-white/20 bg-transparent text-zinc-300 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase mb-6 tech-border-animate">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="tech-dot-pulse absolute inline-flex h-full w-full rounded-full bg-cyan-400/50"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400/90"></span>
            </span>
            <span className="drop-shadow-sm font-medium tracking-widest text-zinc-300">NASA OCHMO PROTOCOL · PRE-MISSION GROUND MONITORING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider mb-4 drop-shadow-lg">
            Space-Ready Monitor
          </h1>

          <p className="text-zinc-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto mb-8 drop-shadow">
            Continuous ground-based monitoring across the 6 spaceflight pillars. Weeks 1–4 establish your locked baseline, catching lifestyle drift before it becomes a mission qualification risk.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <button
              onClick={() => setToolSubTab('test')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-['Chakra_Petch'] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{totalWeeks === 0 ? 'Begin Week 1 Assessment' : `Take Week ${totalWeeks + 1} Assessment`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {totalWeeks > 0 && (
              <a
                href="#telemetry-overview"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-white font-['Chakra_Petch'] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 backdrop-blur-md transition cursor-pointer"
              >
                <span>View Telemetry (Week {totalWeeks})</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* If weeks completed, show the telemetry cards and charts cleanly centered */}
      {totalWeeks > 0 && (
        <div id="telemetry-overview" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Alert Banner (Only if active alert exists) */}
      {activeAlert && (
        <div
          className="p-4 rounded-xl border flex items-center justify-between gap-4 text-xs font-mono"
          style={{
            backgroundColor: tierInfo.bg,
            borderColor: tierInfo.border,
            color: tierInfo.color,
          }}
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              <strong>Readiness Drift Alert:</strong> {activeAlert.message}
            </span>
          </div>
          <button
            onClick={() => setToolSubTab('alerts')}
            className="underline shrink-0 text-white hover:text-purple-300 cursor-pointer"
          >
            View Recommendations
          </button>
        </div>
      )}

      {/* Main Readiness Hero Banner: Clean, Spacious, and Minimal */}
      <div className="relative overflow-hidden bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 sm:p-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://mystico-3.sirv.com/Gemini_Generated_Image_s1vw66s1vw66s1vw.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/95 to-zinc-950/85 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left: Composite Score & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-mono uppercase text-zinc-400 tracking-widest block">
                  Week {totalWeeks} Readiness
                </span>
                <InfoTooltip
                  title="Composite Readiness Score"
                  content="Weighted composite score out of 100 calculated across all 6 spaceflight pillars. Sleep & Stress utilize 3-week rolling averages to absorb temporary spikes, and Recovery is weighted at 0.8×."
                />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-['Chakra_Petch'] text-5xl sm:text-6xl font-bold text-white tracking-tight">
                  {compositeScore}
                </span>
                <span className="text-zinc-500 font-mono text-sm">/ 100</span>
              </div>
            </div>

            <div className="h-12 w-px bg-zinc-800 hidden sm:block" />

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: tierInfo.color }}
                />
                <span className="font-['Chakra_Petch'] text-base font-bold text-white uppercase tracking-wider">
                  {tierInfo.label}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  (Drift: {drift > 0 ? `+${drift}` : drift} pts)
                </span>
                <InfoTooltip
                  title="Drift Tiers"
                  content="Drift = Baseline − Composite. Green (0–5 pts, on track), Yellow (5–15 pts, early warning), Orange (15–20 pts, action needed), Red (20+ pts, matches NASA −20% critical threshold)."
                />
              </div>

              <div className="text-xs font-mono text-zinc-400 flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <span>
                    Baseline: <strong className="text-zinc-200">{baseline ?? 'Calibrating'} pts</strong>
                  </span>
                  <InfoTooltip
                    title="Locked L-60 Baseline"
                    content="Your personalized baseline is calculated from the average of your Weeks 1–4 composite scores. Once locked at Week 4, it remains permanent to detect drift across your entire 2–4 year training window."
                  />
                </div>
                <span>·</span>
                <span>{tierInfo.description}</span>
              </div>
            </div>
          </div>

          {/* Right: Primary Action Button */}
          <div className="shrink-0">
            <button
              onClick={() => setToolSubTab('test')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-['Chakra_Petch'] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
            >
              <span>Take Week {totalWeeks + 1} Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Six Spaceflight Pillars Grid - Clean & Roomy Cards */}
      <div>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider whitespace-nowrap">
              Six Spaceflight Pillars
            </h3>
            <InfoTooltip
              title="Six Spaceflight Pillars"
              content="These six lifestyle pillars correlate directly with NASA Human Research Program (HRP) spaceflight risks: bone deconditioning, muscle atrophy, circadian desynchronosis, cognitive fatigue, and isolation depression."
            />
          </div>
          <div className="text-xs font-mono text-zinc-500 mt-1 space-y-0.5">
            <div>Sleep &amp; Stress: 3-wk rolling avg</div>
            <div>Recovery: 0.8× weight</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(Object.keys(PILLARS) as Pillar[]).map((pKey) => {
            const pMeta = PILLARS[pKey];
            const score = latest ? latest.pillar_scores[pKey] : 0;
            const raw = latest ? latest.pillar_raws[pKey] : 0;

            const pillarColor =
              score >= 80 ? '#34d399' : score >= 65 ? '#facc15' : score >= 50 ? '#fb923c' : '#f87171';

            return (
              <div
                key={pKey}
                className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{pMeta.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
                          {pMeta.name}
                        </h4>
                        <span className="text-[11px] font-mono text-zinc-500">
                          Weight: {pMeta.weight}×
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono" style={{ color: pillarColor }}>
                        {score}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        Raw: {raw}/20
                      </div>
                    </div>
                  </div>

                  {/* Clean, minimalist progress bar */}
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${score}%`,
                        backgroundColor: pillarColor,
                      }}
                    />
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {pMeta.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-900 text-xs font-mono text-zinc-400">
                  <span className="text-zinc-300 font-semibold">Tip: </span>
                  {pMeta.countermeasureTip}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle Data Export Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-900 text-xs font-mono text-zinc-500">
        <span>Astronaut Flight Data Storage: LocalStorage</span>
        <div className="flex items-center gap-3">
          <button
            onClick={exportJSON}
            className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <span>·</span>
          <button
            onClick={exportCSV}
            className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <span>·</span>
          <button
            onClick={() => resetAllData()}
            className="text-zinc-500 hover:text-red-400 flex items-center gap-1 transition cursor-pointer"
            title="Reset telemetry and restart baseline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Mission</span>
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
};
