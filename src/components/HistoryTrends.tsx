import React, { useState, useMemo } from 'react';
import { useSpaceReadyStore } from '../store/useSpaceReadyStore';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Legend,
} from 'recharts';
import { PILLARS, Pillar } from '../data/config';
import { Layers, Activity } from 'lucide-react';
import { getTierDetails, getDriftTier } from '../data/scoring';
import { InfoTooltip } from './InfoTooltip';

export const HistoryTrends: React.FC = () => {
  const { assessments, user } = useSpaceReadyStore();

  const [timeframe, setTimeframe] = useState<'all' | 'year1' | 'year2'>('all');
  const [selectedPillars, setSelectedPillars] = useState<Record<Pillar, boolean>>({
    sleep: false,
    nutrition: false,
    exercise: false,
    stress: false,
    social: false,
    recovery: false,
  });

  const baseline = user.baseline_score;

  const filteredData = useMemo(() => {
    if (assessments.length === 0) return [];

    let subset = assessments;
    if (timeframe === 'year1') {
      subset = assessments.filter((a) => a.week_number <= 52);
    } else if (timeframe === 'year2') {
      subset = assessments.filter((a) => a.week_number > 52 && a.week_number <= 104);
    }

    return subset.map((a) => ({
      weekLabel: `Wk ${a.week_number}`,
      weekNum: a.week_number,
      date: a.date,
      composite: a.composite_score,
      drift: a.drift,
      tier: a.drift_tier,
      sleep: a.pillar_scores.sleep,
      nutrition: a.pillar_scores.nutrition,
      exercise: a.pillar_scores.exercise,
      stress: a.pillar_scores.stress,
      social: a.pillar_scores.social,
      recovery: a.pillar_scores.recovery,
    }));
  }, [assessments, timeframe]);

  // Compute clean, uncrowded X-axis ticks (at most 8 evenly spaced ticks)
  const xAxisTicks = useMemo(() => {
    if (filteredData.length === 0) return [];
    if (filteredData.length <= 10) return filteredData.map((d) => d.weekNum);

    const step = Math.ceil(filteredData.length / 8);
    const ticks: number[] = [];
    for (let i = 0; i < filteredData.length; i += step) {
      ticks.push(filteredData[i].weekNum);
    }
    const lastNum = filteredData[filteredData.length - 1].weekNum;
    if (!ticks.includes(lastNum)) {
      ticks.push(lastNum);
    }
    return ticks;
  }, [filteredData]);

  const togglePillar = (p: Pillar) => {
    setSelectedPillars((prev) => ({
      ...prev,
      [p]: !prev[p],
    }));
  };

  // Detailed custom aerospace telemetry tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    const tier = getDriftTier(data.drift);
    const tInfo = getTierDetails(tier);

    return (
      <div className="bg-zinc-950 border border-zinc-700/80 rounded-xl p-3.5 shadow-2xl text-xs font-mono min-w-[210px] max-w-[calc(100vw-32px)] space-y-2.5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div>
            <span className="font-bold text-white text-sm">Week {data.weekNum}</span>
            <div className="text-[10px] text-zinc-400">{data.date}</div>
          </div>
          <span
            className="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
            style={{ backgroundColor: tInfo.bg, color: tInfo.color }}
          >
            {tInfo.label}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Composite Score:</span>
            <span className="font-bold text-white text-sm">{data.composite} / 100</span>
          </div>
          {baseline !== null && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Drift from Baseline:</span>
              <span style={{ color: tInfo.color }} className="font-semibold">
                {data.drift > 0 ? `+${data.drift}` : data.drift} pts
              </span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
          <div className="flex items-center justify-between text-zinc-300">
            <span>🌙 Sleep:</span>
            <span className="font-bold text-white">{data.sleep}%</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
            <span>🥗 Nutri:</span>
            <span className="font-bold text-white">{data.nutrition}%</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
            <span>🏃 Exer:</span>
            <span className="font-bold text-white">{data.exercise}%</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
            <span>🧘 Stress:</span>
            <span className="font-bold text-white">{data.stress}%</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
            <span>🤝 Social:</span>
            <span className="font-bold text-white">{data.social}%</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
            <span>⚡ Recov:</span>
            <span className="font-bold text-white">{data.recovery}%</span>
          </div>
        </div>
      </div>
    );
  };

  if (assessments.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center max-w-md mx-auto">
        <Activity className="w-10 h-10 text-zinc-500 mx-auto mb-2" />
        <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase">
          No Historical Telemetry
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Complete weekly checkups to view longitudinal trend telemetry and audit multi-year drift.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trends Controls Header */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Longitudinal Signal · {assessments.length} Weeks Recorded
              </span>
              <InfoTooltip
                title="Longitudinal Signal"
                content="Tracks weekly composite score across your multi-year pre-mission window. Continuous tracking catches gradual musculoskeletal, circadian, and autonomic drift before formal medical exams."
              />
            </div>
            <h2 className="text-2xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wide">
              Readiness Drift Over Time
            </h2>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs">
            <button
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                timeframe === 'all'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Weeks
            </button>
            <button
              onClick={() => setTimeframe('year1')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                timeframe === 'year1'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Year 1
            </button>
            <button
              onClick={() => setTimeframe('year2')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                timeframe === 'year2'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Year 2
            </button>
          </div>
        </div>

        {/* Pillar Overlays Toggle */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-2 flex-wrap text-xs font-mono">
          <span className="text-zinc-400 flex items-center gap-1.5 mr-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Pillar Overlays:</span>
          </span>
          {(Object.keys(PILLARS) as Pillar[]).map((pKey) => {
            const isChecked = selectedPillars[pKey];
            return (
              <button
                key={pKey}
                onClick={() => togglePillar(pKey)}
                className={`px-2.5 py-1 rounded border text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  isChecked
                    ? 'bg-purple-950/80 border-purple-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <span>{PILLARS[pKey].icon}</span>
                <span>{PILLARS[pKey].name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart Card - Unclustered X-Axis & Detailed Telemetry */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <div className="h-80 sm:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 12, right: 24, left: -10, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              {/* Clean, uncrowded XAxis with explicit milestone ticks */}
              <XAxis
                dataKey="weekNum"
                ticks={xAxisTicks}
                tickFormatter={(num) => `Wk ${num}`}
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#27272a' }}
              />
              <YAxis
                stroke="#71717a"
                fontSize={11}
                domain={[30, 100]}
                tickLine={false}
                axisLine={{ stroke: '#27272a' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />

              {/* Locked Baseline Reference Line */}
              {baseline !== null && (
                <ReferenceLine
                  y={baseline}
                  stroke="#a855f7"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Baseline (${baseline})`,
                    fill: '#c084fc',
                    fontSize: 10,
                    position: 'insideTopRight',
                  }}
                />
              )}

              {/* NASA −20% Decrement Line */}
              {baseline !== null && (
                <ReferenceLine
                  y={baseline - 20}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{
                    value: 'NASA -20% Threshold',
                    fill: '#f87171',
                    fontSize: 10,
                    position: 'insideBottomRight',
                  }}
                />
              )}

              {/* Composite Line */}
              <Line
                type="monotone"
                dataKey="composite"
                name="Composite Score"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#c084fc' }}
              />

              {/* Pillar Overlays */}
              {selectedPillars.sleep && (
                <Line type="monotone" dataKey="sleep" name="Sleep" stroke="#60a5fa" strokeWidth={1.2} dot={false} />
              )}
              {selectedPillars.nutrition && (
                <Line type="monotone" dataKey="nutrition" name="Nutrition" stroke="#34d399" strokeWidth={1.2} dot={false} />
              )}
              {selectedPillars.exercise && (
                <Line type="monotone" dataKey="exercise" name="Exercise" stroke="#fbbf24" strokeWidth={1.2} dot={false} />
              )}
              {selectedPillars.stress && (
                <Line type="monotone" dataKey="stress" name="Stress" stroke="#f87171" strokeWidth={1.2} dot={false} />
              )}
              {selectedPillars.social && (
                <Line type="monotone" dataKey="social" name="Social" stroke="#e879f9" strokeWidth={1.2} dot={false} />
              )}
              {selectedPillars.recovery && (
                <Line type="monotone" dataKey="recovery" name="Recovery" stroke="#38bdf8" strokeWidth={1.2} dot={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-4 border-t border-zinc-800/80 mt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-2">
          <div className="flex items-center gap-1">
            <span>Drift = Locked Baseline − Current Composite</span>
            <InfoTooltip
              title="Drift Formula"
              content="Drift measures how far your current readiness has dropped below your personal baseline standard. Green tier is 0–5 pts, Yellow is 5–15 pts, Orange is 15–20 pts, Red is 20+ pts."
            />
          </div>
          <span>Purple Dashed = Baseline · Red Dashed = NASA −20% Line</span>
        </div>
      </div>
    </div>
  );
};
