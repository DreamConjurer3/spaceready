import React from 'react';
import { useSpaceReadyStore } from './store/useSpaceReadyStore';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { WeeklyTest } from './components/WeeklyTest';
import { HistoryTrends } from './components/HistoryTrends';
import { AnnualReports } from './components/AnnualReports';
import { AlertsPanel } from './components/AlertsPanel';
import { ResearchTab } from './components/ResearchTab';
import { StatisticTab } from './components/StatisticTab';
import { MissionReadinessBadge } from './components/MissionReadinessBadge';

export default function App() {
  const { activeTab, toolSubTab } = useSpaceReadyStore();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-purple-600 selection:text-white font-['Inter',sans-serif] w-full max-w-full overflow-x-hidden">
      {/* Offscreen pre-render for 3D Mission Readiness Badge ensuring zero-lag GPU texture warming */}
      <div className="fixed -top-[9999px] -left-[9999px] pointer-events-none opacity-0 select-none overflow-hidden h-0 w-0" aria-hidden="true">
        <MissionReadinessBadge />
      </div>

      {/* Background Subtle Gradient & Cosmic Texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-black"
        aria-hidden="true"
      />

      {/* Main Persistent Header */}
      <Header />

      {/* Main Content Area */}
      <main className={`flex-1 relative z-10 w-full ${activeTab === 'tool' && toolSubTab === 'dashboard' ? 'p-0' : 'max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8'}`}>
        {activeTab === 'tool' && (
          <>
            {toolSubTab === 'dashboard' && <Dashboard />}
            {toolSubTab === 'test' && <WeeklyTest />}
            {toolSubTab === 'history' && <HistoryTrends />}
            {toolSubTab === 'annual' && <AnnualReports />}
            {toolSubTab === 'alerts' && <AlertsPanel />}
          </>
        )}

        {activeTab === 'research' && <ResearchTab />}

        {activeTab === 'statistic' && <StatisticTab />}
      </main>

      {/* Persistent Global Footer */}
      <footer className="border-t border-purple-950/60 bg-black/90 py-6 text-center text-xs font-mono text-purple-400/80 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <div>
            <strong className="text-white">Space-Ready</strong> — NASA Space Apps Challenge 2026
          </div>
          <div className="text-[11px] text-purple-300/60">
            Pre-Mission Astronaut Readiness Protocol · Ground-Based Countermeasure Monitoring
          </div>
          <div className="text-[10px] text-zinc-500 pt-1">
            Developed by Team DreamLabs · Educational &amp; Operational Prototyping
          </div>
        </div>
      </footer>
    </div>
  );
}
