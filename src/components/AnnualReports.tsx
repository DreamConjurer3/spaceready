import React from 'react';
import { useSpaceReadyStore } from '../store/useSpaceReadyStore';
import { PILLARS, Pillar } from '../data/config';
import { Award, AlertTriangle, TrendingDown, Calendar } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const AnnualReports: React.FC = () => {
  const { reports } = useSpaceReadyStore();

  const isReadyForL60 = reports.length > 0 && reports.every((r) => r.annual_drift <= 5);

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block">
                Pre-Mission Horizon (2–4 Years) · {reports.length} Training {reports.length === 1 ? 'Year' : 'Years'}
              </span>
              <InfoTooltip
                title="Annual Rollup Engine"
                content="Aggregates all 52 weekly assessments per training year into an annual composite score and measures total annual drift against your locked baseline."
              />
            </div>
            <h2 className="text-2xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wide">
              Annual Readiness Rollups
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Annual scores average all weekly composites. Multi-year algorithms audit cumulative decrement to prevent preflight baseline failure.
            </p>
          </div>

          {/* L-60 Readiness Badge */}
          {reports.length > 0 && (
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 shrink-0 ${
                isReadyForL60
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${
                  isReadyForL60 ? 'bg-emerald-900/60 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    NASA Preflight Status
                  </span>
                  <InfoTooltip
                    title="Ready for L-60 Standard"
                    content="Awarded when all training years maintain an average drift within 5 points of your baseline standard, qualifying the astronaut for flight baseline certification without medical postponement."
                  />
                </div>
                <div className="text-xs font-bold font-['Chakra_Petch'] uppercase">
                  {isReadyForL60 ? 'Ready for L-60 Baseline' : 'Drift Detected in Training Cycle'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reports Cards */}
      {reports.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center max-w-md mx-auto">
          <Calendar className="w-10 h-10 text-zinc-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase">
            No Annual Rollup Yet
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Annual reports compile automatically upon accumulating training weeks across each 52-week training cycle.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => {
            const hasRedYear = report.alerts_triggered.includes('red_year');
            const hasTrendAlert = report.alerts_triggered.includes('trend_alert');
            const hasDeclineAlert = report.alerts_triggered.includes('decline_alert');

            return (
              <div
                key={report.id}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
                    <div>
                      <h3 className="font-['Chakra_Petch'] text-lg font-bold text-white uppercase tracking-wider">
                        Training Year {report.year}
                      </h3>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {report.total_weeks} Weeks Evaluated
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold font-['Chakra_Petch'] text-white">
                        {report.annual_score}
                        <span className="text-xs font-mono text-zinc-500"> / 100</span>
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400">
                        Drift: {report.annual_drift > 0 ? `+${report.annual_drift}` : report.annual_drift} pts
                      </div>
                    </div>
                  </div>

                  {/* Multi-Year Alerts */}
                  {report.alerts_triggered.length > 0 && (
                    <div className="mb-4 space-y-1.5 text-xs font-mono">
                      {hasRedYear && (
                        <div className="p-2.5 rounded bg-red-950/40 border border-red-800/40 text-red-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Red Year Flag: Drift exceeds NASA −20% tolerance</span>
                        </div>
                      )}
                      {hasTrendAlert && (
                        <div className="p-2.5 rounded bg-amber-950/40 border border-amber-800/40 text-amber-300 flex items-center gap-1.5">
                          <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                          <span>Trend Alert: Rising drift across consecutive years</span>
                        </div>
                      )}
                      {hasDeclineAlert && (
                        <div className="p-2.5 rounded bg-orange-950/40 border border-orange-800/40 text-orange-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Decline Alert: Score dropped &gt;10 pts YoY</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pillar Breakdown */}
                  <div className="space-y-2 mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                      Pillar Averages
                    </span>
                    {(Object.keys(PILLARS) as Pillar[]).map((pKey) => {
                      const score = report.pillar_breakdown[pKey];
                      return (
                        <div key={pKey} className="flex items-center gap-2 text-xs font-mono">
                          <span className="w-4">{PILLARS[pKey].icon}</span>
                          <span className="w-24 text-[11px] text-zinc-300 truncate">
                            {PILLARS[pKey].name}
                          </span>
                          <div className="flex-1 bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${score}%`,
                                backgroundColor:
                                  score >= 80 ? '#34d399' : score >= 65 ? '#facc15' : '#fb923c',
                              }}
                            />
                          </div>
                          <span className="w-8 text-right font-bold text-white text-[11px]">
                            {score}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>Year-Over-Year Change:</span>
                  <span className="font-bold">
                    {report.yoy_change !== null ? (
                      <span className={report.yoy_change >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                        {report.yoy_change > 0 ? `+${report.yoy_change}` : report.yoy_change} pts
                      </span>
                    ) : (
                      'Baseline Year'
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
