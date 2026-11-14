import React, { useState } from 'react';
import { useSpaceReadyStore } from '../store/useSpaceReadyStore';
import { QUESTION_BANK, PILLARS, Pillar, getPillarQuestions } from '../data/config';
import { getTierDetails, WeeklyAssessment, Alert } from '../data/scoring';
import { CheckCircle2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { MissionReadinessBadge } from './MissionReadinessBadge';

const PILLAR_ORDER: Pillar[] = ['sleep', 'nutrition', 'exercise', 'stress', 'social', 'recovery'];

export const WeeklyTest: React.FC = () => {
  const {
    currentTestAnswers,
    setQuestionAnswer,
    submitWeeklyAssessment,
    assessments,
    setToolSubTab,
  } = useSpaceReadyStore();

  const [currentPillarIndex, setCurrentPillarIndex] = useState(0);
  const [submissionModal, setSubmissionModal] = useState<{
    assessment: WeeklyAssessment;
    newAlerts: Alert[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activePillarKey = PILLAR_ORDER[currentPillarIndex];
  const activePillarMeta = PILLARS[activePillarKey];
  const pillarQuestions = getPillarQuestions(activePillarKey);

  const nextWeekNumber = assessments.length + 1;
  const answeredTotal = Object.keys(currentTestAnswers).length;
  const totalQuestions = QUESTION_BANK.length;
  const isLastPillar = currentPillarIndex === PILLAR_ORDER.length - 1;

  const handleNext = () => {
    setErrorMsg(null);
    if (currentPillarIndex < PILLAR_ORDER.length - 1) {
      setCurrentPillarIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    if (currentPillarIndex > 0) {
      setCurrentPillarIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    setErrorMsg(null);
    const result = submitWeeklyAssessment();
    if (!result.success) {
      setErrorMsg(result.errors?.[0] || 'Please complete all questions before submitting.');
      return;
    }

    if (result.assessment) {
      setSubmissionModal({
        assessment: result.assessment,
        newAlerts: result.newAlerts || [],
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Clean Stepper Header */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono uppercase text-zinc-400 tracking-widest block">
              Week {nextWeekNumber} Checkup · Pillar {currentPillarIndex + 1} of 6
            </span>
            <h2 className="text-2xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wide flex items-center gap-2 mt-0.5">
              <span>{activePillarMeta.icon}</span>
              <span>{activePillarMeta.name}</span>
            </h2>
          </div>

          <div className="text-right font-mono text-xs text-zinc-400">
            <span>{answeredTotal} / {totalQuestions} answered</span>
          </div>
        </div>

        {/* Stepper Dots */}
        <div className="grid grid-cols-6 gap-2 pt-2">
          {PILLAR_ORDER.map((pKey, idx) => {
            const pQuestions = getPillarQuestions(pKey);
            const pDone = pQuestions.every((q) => currentTestAnswers[q.id] !== undefined);
            const isCurrent = idx === currentPillarIndex;

            return (
              <button
                key={pKey}
                onClick={() => {
                  setErrorMsg(null);
                  setCurrentPillarIndex(idx);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-purple-500 shadow-sm shadow-purple-500/50'
                    : pDone
                    ? 'bg-emerald-500/80'
                    : 'bg-zinc-800'
                }`}
                title={`Pillar ${idx + 1}: ${PILLARS[pKey].name}`}
              />
            );
          })}
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/50 border border-red-800/50 text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* 5 Questions for the Current Pillar (Spacious, Clean) */}
      <div className="space-y-4">
        {pillarQuestions.map((q, qIndex) => {
          const selectedValue = currentTestAnswers[q.id];

          return (
            <div
              key={q.id}
              className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700 transition"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2.5">
                  <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">
                    {qIndex + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                    {q.text}
                  </h3>
                </div>

                {selectedValue !== undefined && (
                  <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/30 shrink-0">
                    {selectedValue} pts
                  </span>
                )}
              </div>

              {/* 5 Clean Horizontal Option Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-3">
                {q.options.map((opt) => {
                  const isSelected = selectedValue === opt.points;

                  return (
                    <button
                      key={opt.points}
                      type="button"
                      onClick={() => setQuestionAnswer(q.id, opt.points)}
                      className={`p-3 rounded-lg border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? opt.points === 0
                            ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-sm'
                            : opt.points === 4
                            ? 'bg-red-950/70 border-red-500 text-white shadow-sm'
                            : 'bg-purple-950/70 border-purple-500 text-white shadow-sm'
                          : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-semibold font-mono">
                          {opt.label}
                        </span>
                        <span
                          className={`w-3.5 h-3.5 rounded-full text-[10px] flex items-center justify-center font-mono font-bold ${
                            isSelected ? 'bg-white text-black' : 'text-zinc-500'
                          }`}
                        >
                          {opt.points}
                        </span>
                      </div>
                      {opt.description && (
                        <span className="text-[10px] text-zinc-400 line-clamp-1">
                          {opt.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPillarIndex === 0}
          className={`px-5 py-2.5 rounded-lg font-mono text-xs flex items-center gap-2 transition cursor-pointer ${
            currentPillarIndex === 0
              ? 'opacity-0 pointer-events-none'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Pillar</span>
        </button>

        {!isLastPillar ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-['Chakra_Petch'] font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <span>Next Pillar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={answeredTotal < totalQuestions}
            className={`px-6 py-2.5 rounded-lg font-['Chakra_Petch'] font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition cursor-pointer shadow-sm ${
              answeredTotal === totalQuestions
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <span>Submit Assessment</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Post-Assessment Results Modal */}
      {submissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              {/* Photorealistic 3D Astronaut Mission Readiness Badge (Preloaded & Instant Render) */}
              <MissionReadinessBadge className="mb-4" size="md" />
              <h3 className="text-xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
                Week {submissionModal.assessment.week_number} Ready Report
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">Telemetry successfully logged</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-zinc-400 uppercase">Composite Score</span>
                <div className="text-3xl font-bold font-['Chakra_Petch'] text-white">
                  {submissionModal.assessment.composite_score}
                  <span className="text-xs font-mono text-zinc-500"> / 100</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-zinc-400 uppercase">Drift Status</span>
                <div
                  className="text-sm font-bold font-mono"
                  style={{
                    color: getTierDetails(submissionModal.assessment.drift_tier).color,
                  }}
                >
                  {getTierDetails(submissionModal.assessment.drift_tier).label}
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  Drift: +{submissionModal.assessment.drift} pts
                </div>
              </div>
            </div>

            {/* Pillar Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              {(Object.keys(PILLARS) as Pillar[]).map((pKey) => {
                const sc = submissionModal.assessment.pillar_scores[pKey];
                return (
                  <div key={pKey} className="p-2 rounded bg-black border border-zinc-800">
                    <div className="text-base">{PILLARS[pKey].icon}</div>
                    <div className="text-[10px] text-zinc-400 uppercase">{PILLARS[pKey].name}</div>
                    <div className="font-bold text-white mt-0.5">{sc}%</div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setSubmissionModal(null);
                setToolSubTab('dashboard');
              }}
              className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-['Chakra_Petch'] font-bold text-xs tracking-wider uppercase transition cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
