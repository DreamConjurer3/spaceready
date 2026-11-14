import React, { useState } from 'react';
import { ExternalLink, AlertTriangle, FileText, Download, Check } from 'lucide-react';

const SUBMISSION_PDF_URL = '/Space-Ready-NASA-Space-Apps-2026-Submission.pdf';
const SUBMISSION_PDF_FILENAME = 'Space-Ready-NASA-Space-Apps-2026-Submission.pdf';

export const ResearchTab: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadPdf = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await fetch(SUBMISSION_PDF_URL);
      if (!res.ok) throw new Error('Failed to fetch PDF');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = SUBMISSION_PDF_FILENAME;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2500);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch {
      const link = document.createElement('a');
      link.href = SUBMISSION_PDF_URL;
      link.download = SUBMISSION_PDF_FILENAME;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-4">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-xs font-mono text-purple-400 uppercase tracking-widest">
          <span>NASA Space Apps Challenge 2026</span>
          <span>·</span>
          <span>Scientific Grounding</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wide leading-snug">
          Space-Ready: The Scientific Research
        </h1>
        <p className="text-zinc-400 mt-2 text-sm sm:text-base leading-relaxed">
          Ground-based health readiness monitoring for astronauts during the pre-mission training window (2–4 years). Tracking 6 spaceflight pillars against L-60 baseline to detect drift before checkpoint failure. In-mission health monitoring analysis will be flawed without proper ground-based health metrics — hence, the importance of this preflight health monitoring tool for aboard long missions.
        </p>
      </div>

      {/* Downloadable Project Submission PDF Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold">
            <FileText className="w-3.5 h-3.5" />
            <span>Official Project Documentation · PDF</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold font-['Chakra_Petch'] text-white uppercase tracking-wide">
            NASA Space Apps Challenge 2026 Submission Brief
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Complete 4-page dossier covering Project Summary, Technical Architecture, NASA OCHMO/OIG Data Integration, AI Disclosure, and Citations Box.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-['Chakra_Petch'] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition cursor-pointer shrink-0 shadow-sm"
        >
          {downloaded ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Downloaded</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Preparing PDF...' : 'Download PDF'}</span>
            </>
          )}
        </button>
      </div>

      {/* The Problem in One Sentence */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold block">
          The Problem in One Sentence
        </span>
        <blockquote className="text-lg sm:text-xl font-['Chakra_Petch'] font-semibold text-white leading-snug">
          "NASA checks astronaut health 3–4 times over 2–4 years. Between those checks, fitness quietly erodes — and NASA has no tool to catch it."
        </blockquote>
      </div>

      {/* Why It Matters */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wide flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Why It Matters</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="text-3xl font-bold font-['Chakra_Petch'] text-white">44 Astronauts</div>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              NASA's corps is at 44 active astronauts — the smallest in 20 years. (<a href="https://oig.nasa.gov/docs/IG-22-007.pdf" target="_blank" rel="noreferrer" className="text-purple-400 underline inline-flex items-center gap-0.5">NASA OIG IG-22-007, 2022 <ExternalLink className="w-3 h-3" /></a>).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="text-3xl font-bold font-['Chakra_Petch'] text-red-400">50% → 15%</div>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Corps safety margin dropped from 50% to 15%. One medical event now leads directly to mission disruption. (Same NASA OIG report).
            </p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-950 border border-red-900/40 text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-2">
          <p>
            <strong className="text-white">January 2026 Flight Incident:</strong> Astronaut Mike Fincke experienced a neurological episode aboard the International Space Station (ISS). NASA had to pull the entire crew home early — marking the first emergency medical crew evacuation in 25 years.
          </p>
          <p className="text-zinc-400">
            NASA's own Human Research Program (HRP) states: <em>"HRP enables space exploration by reducing risks to astronaut health using ground research, the ISS, and training."</em> — yet there is currently no continuous ground-based lifestyle tool between annual physicals.
          </p>
        </div>
      </div>

      {/* How NASA Monitors Health Today Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wide">
          How NASA Monitors Health Today
        </h2>
        <p className="text-xs text-zinc-400">
          The timeline of health checkpoints across the 2–4 year pre-mission astronaut window:
        </p>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 bg-zinc-900/50">
                <th className="py-3 px-4">When</th>
                <th className="py-3 px-4">What</th>
                <th className="py-3 px-4">Source Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              <tr>
                <td className="py-3 px-4 font-bold text-white">Every 12 months</td>
                <td className="py-3 px-4">Full physical examination</td>
                <td className="py-3 px-4 text-purple-400">OCHMO-STD-100.1A</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">~2 years pre-launch</td>
                <td className="py-3 px-4">ASCR assigned, PT training begins</td>
                <td className="py-3 px-4 text-purple-400">NASA ASCR program</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">L-90 / L-30</td>
                <td className="py-3 px-4">Fitness test #1 (aerobic & strength screening)</td>
                <td className="py-3 px-4 text-purple-400">OCHMO-STD-100.1A</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">L-9 / L-6</td>
                <td className="py-3 px-4">Fitness test #2 (preflight physical certification)</td>
                <td className="py-3 px-4 text-purple-400">OCHMO-STD-100.1A</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">L-60</td>
                <td className="py-3 px-4">Preflight baseline (VO₂max, strength, agility)</td>
                <td className="py-3 px-4 text-purple-400">OCHMO-TB-031</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm font-mono text-zinc-300 font-semibold">
          That's it. 3–4 data points across 2–4 years.
        </p>
      </div>

      {/* The Crucial Frontiers Quote */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-purple-500/40">
        <blockquote className="text-base sm:text-lg font-serif italic text-zinc-200 leading-relaxed">
          "Continuous monitoring systems that provide insight into health, performance, sleep, cognitive, nutritional, and recovery status should enable data-driven decision-making on physical readiness across all mission phases."
        </blockquote>
        <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-zinc-400 gap-2">
          <span>— Spaceflight Human Optimization and Performance</span>
          <a
            href="https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2026.1950155/full"
            target="_blank"
            rel="noreferrer"
            className="text-purple-400 hover:text-white underline font-bold flex items-center gap-1"
          >
            <span>Frontiers in Physiology (Oct 2026) [Article Link]</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Why Ground-Based Metrics are Vital for In-Mission Analysis */}
      <div className="p-6 sm:p-7 rounded-2xl bg-zinc-950 border border-purple-500/40 space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold block">
          Operational In-Mission Analysis
        </span>
        <h3 className="text-base sm:text-lg font-bold font-['Chakra_Petch'] text-white uppercase tracking-wide">
          In-Mission Monitoring Is Flawed Without Ground-Based Metrics
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          In-mission health monitoring analysis will be fundamentally flawed without proper ground-based health metrics. When biosensors aboard long missions detect physiological anomalies, flight medical officers cannot differentiate between true microgravity deconditioning and pre-existing, undetected lifestyle decay that occurred during the 2–4 year training pipeline.
        </p>
        <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-semibold">
          Hence, the importance of this preflight health monitoring tool for aboard long missions: establishing unbroken, standardized baselines across all 6 spaceflight pillars before departure.
        </p>
      </div>

      {/* The Gap & What Space-Ready Does */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-3">
          <h3 className="text-base font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
            The Gap
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            NASA has checkpoints. It doesn't have a continuous signal between them.
          </p>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Sleep drifts. Nutrition slips. Stress accumulates. Body composition shifts. None of it shows up until the next annual physical — by which point the astronaut may already be below the L-60 standard.
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-3">
          <h3 className="text-base font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
            What Space-Ready Does
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Extends NASA's L-60 preflight baseline into a real-time readiness score during the full 2–4 year training window.
          </p>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Tracks 6 pillars: <strong className="text-zinc-200">sleep · nutrition · exercise · stress · social connection · recovery</strong>. Benchmarks against NASA's actual OCHMO standards. Flags drift before it becomes a failed checkpoint.
          </p>
        </div>
      </div>

      {/* Sources & Citations */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-bold font-['Chakra_Petch'] text-white uppercase tracking-wide flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Verified Sources &amp; Citations</span>
        </h2>

        <div className="space-y-2 text-xs font-mono text-zinc-400">
          <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <span>[1] NASA OIG IG-22-007 (Jan 2022) — NASA's Management of Its Astronaut Corps</span>
            <a href="https://oig.nasa.gov/docs/IG-22-007.pdf" target="_blank" rel="noreferrer" className="text-purple-400 underline flex items-center gap-1">
              PDF <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <span>[2] OCHMO-STD-100.1A (Sept 2024) — NASA Spaceflight Human-System Standard</span>
            <a href="https://www.nasa.gov/ochmo-standards/" target="_blank" rel="noreferrer" className="text-purple-400 underline flex items-center gap-1">
              nasa.gov <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <span>[3] OCHMO-TB-031 — Exercise Overview &amp; L-60 Baseline Standards</span>
            <a href="https://www.nasa.gov/ochmo-standards/" target="_blank" rel="noreferrer" className="text-purple-400 underline flex items-center gap-1">
              nasa.gov <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <span>[4] NASA Astronaut Healthcare FAQ &amp; Clinical Monitoring Cadence</span>
            <a href="https://www.nasa.gov/hhp/human-system-risks/" target="_blank" rel="noreferrer" className="text-purple-400 underline flex items-center gap-1">
              nasa.gov <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <span>[5] NASA Human Research Program (HRP) Risk Architecture</span>
            <a href="https://www.nasa.gov/hrp/" target="_blank" rel="noreferrer" className="text-purple-400 underline flex items-center gap-1">
              nasa.gov <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <span>[6] Frontiers in Physiology (Oct 2026) — Spaceflight Human Optimization</span>
            <a href="https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2026.1950155/full" target="_blank" rel="noreferrer" className="text-purple-400 underline flex items-center gap-1">
              Article Link <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
