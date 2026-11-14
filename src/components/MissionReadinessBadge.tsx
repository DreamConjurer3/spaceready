import React from 'react';
import readyBadge3dWebp from '../assets/images/space_ready_badge_3d_opt.webp';
import readyBadge3dJpg from '../assets/images/space_ready_badge_3d.jpg';

// Instant module-level preload: fires at startup before any component renders
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // 1. Inject link preload tags for highest browser download priority
  const preloadWebp = document.createElement('link');
  preloadWebp.rel = 'preload';
  preloadWebp.as = 'image';
  preloadWebp.href = readyBadge3dWebp;
  preloadWebp.type = 'image/webp';
  preloadWebp.fetchPriority = 'high';
  document.head.appendChild(preloadWebp);

  // 2. Immediate in-memory image pre-decoder to warm the GPU texture cache
  const imgWebp = new Image();
  imgWebp.src = readyBadge3dWebp;
  if ('decode' in imgWebp) {
    imgWebp.decode().catch(() => {});
  }

  const imgJpg = new Image();
  imgJpg.src = readyBadge3dJpg;
  if ('decode' in imgJpg) {
    imgJpg.decode().catch(() => {});
  }
}

export const preloadMissionReadinessBadge = () => {
  if (typeof window === 'undefined') return;
  const img = new Image();
  img.src = readyBadge3dWebp;
  if ('decode' in img) {
    img.decode().catch(() => {});
  }
};

interface MissionReadinessBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MissionReadinessBadge: React.FC<MissionReadinessBadgeProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }[size];

  return (
    <div className={`relative mx-auto flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
      {/* Ambient 3D Rim Lighting & Depth Glow */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 via-purple-600/35 to-amber-300/25 blur-lg scale-110 pointer-events-none transform-gpu"
        aria-hidden="true"
      />

      {/* 3D Physical Medal Chassis with metallic beveled border */}
      <div className={`relative ${sizeClasses} rounded-full p-1 bg-gradient-to-b from-amber-300 via-amber-600/70 to-purple-950 shadow-[0_14px_30px_rgba(0,0,0,0.9),0_0_25px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50 flex items-center justify-center overflow-hidden transform-gpu hover:scale-105 transition-transform duration-300`}>
        {/* Instant fallback backdrop so there is zero empty flash */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-900/40 via-black to-purple-950/80" />

        {/* Preloaded High-Performance 3D Astronaut Badge */}
        <picture className="w-full h-full relative z-10 flex items-center justify-center">
          <source srcSet={readyBadge3dWebp} type="image/webp" />
          <img
            src={readyBadge3dJpg}
            alt="Space-Ready Mission Readiness 3D Badge"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className="w-full h-full object-cover rounded-full filter contrast-110 drop-shadow-[0_6px_12px_rgba(0,0,0,0.7)]"
          />
        </picture>

        {/* Specular Highlight Sweep across the glass dome */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none z-20"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
