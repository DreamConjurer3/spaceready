import React, { useState, useRef, useEffect } from 'react';
import { useSpaceReadyStore } from '../store/useSpaceReadyStore';
import { getTierDetails } from '../data/scoring';
import { ChevronDown, Check } from 'lucide-react';

const TOOL_VIEWS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'test', label: 'Weekly Assessment' },
  { id: 'history', label: 'Trends & History' },
  { id: 'annual', label: 'Annual Rollups' },
  { id: 'alerts', label: 'Alerts Log' },
] as const;

type ToolSubTab = (typeof TOOL_VIEWS)[number]['id'];

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    toolSubTab,
    setToolSubTab,
    assessments,
    alerts,
  } = useSpaceReadyStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentWeek = assessments.length;
  const latestAssessment = currentWeek > 0 ? assessments[currentWeek - 1] : null;
  const tierInfo = latestAssessment ? getTierDetails(latestAssessment.drift_tier) : null;
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).length;

  const currentToolView = TOOL_VIEWS.find((v) => v.id === toolSubTab) || TOOL_VIEWS[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md sticky top-0 z-50 max-w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* 1. Main Top Nav Bar: Logo + Brand + Dropdown on Left (only when on THE TOOL), Status on Right (no circle double arrow) */}
        <div className="flex items-center justify-between h-14 border-b border-zinc-900">
          {/* Logo, App Title & Dropdown (Dropdown ONLY shown when on THE TOOL) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative shrink-0" title="AI-Generated Logo">
              <div className="w-7 h-7 rounded-full border border-purple-500/30 overflow-hidden bg-purple-950/30">
                <img
                  src="https://mystico-3.sirv.com/Gemini_Generated_Image_qa6je6qa6je6qa6j.jpeg?w=360&q=95"
                  alt="Space-Ready (AI-Generated Logo)"
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className="absolute -bottom-1 -right-1.5 px-1 py-[1px] rounded-[3px] bg-black/90 border border-white/35 text-[7px] font-mono font-bold text-white/95 leading-none tracking-tighter pointer-events-none select-none shadow-sm"
                aria-label="AI-generated image watermark"
              >
                AI
              </span>
            </div>

            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-['Chakra_Petch'] text-sm sm:text-base font-bold tracking-wider text-white uppercase whitespace-nowrap">
                Space-Ready
              </span>
            </div>

            {/* Dropdown: ONLY available when on THE TOOL */}
            {activeTab === 'tool' && (
              <div className="relative ml-1 sm:ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[11px] font-mono text-zinc-200 transition cursor-pointer whitespace-nowrap"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                  title="Select tool section"
                >
                  <span className="font-semibold text-white whitespace-nowrap">{currentToolView.label}</span>
                  {unacknowledgedAlerts > 0 && currentToolView.id !== 'alerts' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  )}
                  <ChevronDown
                    className={`w-3 h-3 text-zinc-400 transition-transform duration-200 shrink-0 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Popover Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-48 rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {TOOL_VIEWS.map((view) => {
                      const isSelected = toolSubTab === view.id;
                      return (
                        <button
                          key={view.id}
                          onClick={() => {
                            setToolSubTab(view.id as ToolSubTab);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-mono transition text-left cursor-pointer ${
                            isSelected
                              ? 'bg-purple-950/50 text-white font-semibold'
                              : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{view.label}</span>
                            {view.id === 'alerts' && unacknowledgedAlerts > 0 && (
                              <span className="px-1 py-0.2 rounded-full text-[9px] bg-red-500/20 text-red-400">
                                {unacknowledgedAlerts}
                              </span>
                            )}
                          </div>
                          {isSelected && <Check className="w-3 h-3 text-purple-400" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Status Capsule (No circle double arrow icon) */}
          <div className="flex items-center gap-3 whitespace-nowrap">
            {currentWeek > 0 && tierInfo && (
              <div
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border whitespace-nowrap"
                style={{
                  backgroundColor: tierInfo.bg,
                  borderColor: tierInfo.border,
                  color: tierInfo.color,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tierInfo.color }} />
                <span>Week {currentWeek} · {tierInfo.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Strip Under the Nav Bar: The Statistic (Left), The Tool (Middle), The Research (Right) */}
        <div className="flex items-center justify-center h-11">
          <nav className="flex space-x-8 sm:space-x-16 h-full" aria-label="Main Navigation">
            <button
              onClick={() => setActiveTab('statistic')}
              className={`h-full flex items-center text-xs sm:text-sm font-['Chakra_Petch'] font-semibold tracking-wider uppercase transition-colors relative cursor-pointer whitespace-nowrap ${
                activeTab === 'statistic'
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>The Statistic</span>
              {activeTab === 'statistic' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('tool');
                setToolSubTab('dashboard');
              }}
              className={`h-full flex items-center text-xs sm:text-sm font-['Chakra_Petch'] font-semibold tracking-wider uppercase transition-colors relative cursor-pointer whitespace-nowrap ${
                activeTab === 'tool'
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>The Tool</span>
              {activeTab === 'tool' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('research')}
              className={`h-full flex items-center text-xs sm:text-sm font-['Chakra_Petch'] font-semibold tracking-wider uppercase transition-colors relative cursor-pointer whitespace-nowrap ${
                activeTab === 'research'
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>The Research</span>
              {activeTab === 'research' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
