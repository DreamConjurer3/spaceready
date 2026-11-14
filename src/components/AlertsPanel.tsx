import React from 'react';
import { useSpaceReadyStore } from '../store/useSpaceReadyStore';
import { PILLARS } from '../data/config';
import { AlertOctagon, Check, ShieldAlert, AlertTriangle, BellRing } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const AlertsPanel: React.FC = () => {
  const { alerts, acknowledgeAlert } = useSpaceReadyStore();

  const unacknowledged = alerts.filter((a) => !a.acknowledged);
  const acknowledged = alerts.filter((a) => a.acknowledged);

  return (
    <div className="space-y-8">
      {/* Header: Centered Bell Icon Without Container, Info Icon Near Edge of Panel */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center max-w-xl mx-auto relative">
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
          <InfoTooltip
            title="Readiness Drift Alerts"
            content="Alerts fire automatically whenever weekly drift crosses a tier boundary (Yellow 5-15, Orange 15-20, Red 20+), or when multi-year trend analysis flags persistent deconditioning."
          />
        </div>

        <BellRing className="w-10 h-10 text-amber-400 mx-auto mb-2.5 stroke-[1.75]" />

        <h2 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wide whitespace-nowrap">
          Readiness Drift Alerts
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-md mx-auto leading-relaxed">
          Automated notifications generated when weekly composite drift exceeds threshold or multi-year trends indicate silent deconditioning.
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center max-w-md mx-auto">
          <ShieldAlert className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase">
            All Systems Nominal
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            No active drift warnings or tier alerts. Continue with scheduled weekly checkups.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active unacknowledged alerts */}
          {unacknowledged.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Active Alerts ({unacknowledged.length})</span>
              </h3>

              {unacknowledged.map((alert) => (
                <div
                  key={alert.id}
                  className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <AlertOctagon
                      className="w-5 h-5 shrink-0 mt-0.5"
                      style={{
                        color:
                          alert.severity === 'red'
                            ? '#f87171'
                            : alert.severity === 'orange'
                            ? '#fb923c'
                            : '#facc15',
                      }}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                        <span className="font-bold text-white uppercase">
                          {alert.severity} Priority
                        </span>
                        <span className="text-zinc-500">·</span>
                        <span className="text-zinc-400">{alert.date}</span>
                        {alert.pillar && (
                          <>
                            <span className="text-zinc-500">·</span>
                            <span className="text-purple-300">{PILLARS[alert.pillar].name}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-zinc-200">{alert.message}</p>
                      <div className="text-xs text-zinc-400 pt-1">
                        <strong className="text-zinc-300">Recommended Countermeasure: </strong>
                        {alert.actionRecommendation}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="text-xs font-mono px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white shrink-0 self-end sm:self-center transition flex items-center gap-1.5 cursor-pointer border border-zinc-700"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Acknowledge</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Historical Acknowledged Alerts */}
          {acknowledged.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                Acknowledged Logs ({acknowledged.length})
              </h3>

              {acknowledged.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 text-xs font-mono text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-[11px] text-zinc-500">
                      <span>{alert.date}</span>
                      <span>·</span>
                      <span className="uppercase">{alert.type}</span>
                    </div>
                    <p className="text-zinc-300">{alert.message}</p>
                  </div>
                  <span className="text-[11px] text-zinc-500 shrink-0">
                    Acknowledged
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
