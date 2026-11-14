import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Info, X } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  title?: string;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, title, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    placement: 'top' | 'bottom';
    width: number;
  } | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const padding = 12;

    const width = Math.min(280, viewportWidth - padding * 2);

    // Initial horizontal center relative to trigger
    let left = rect.left + rect.width / 2 - width / 2;

    // Clamp horizontally within the visible screen area
    if (left < padding) {
      left = padding;
    } else if (left + width > viewportWidth - padding) {
      left = viewportWidth - width - padding;
    }

    // Determine vertical placement
    const placement = rect.top < 180 ? 'bottom' : 'top';
    const top = placement === 'top' ? rect.top - 8 : rect.bottom + 8;

    setPosition({ top, left, placement, width });
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleScrollOrResize = () => {
        updatePosition();
      };
      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node) &&
          panelRef.current &&
          !panelRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);

      return () => {
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isOpen, updatePosition]);

  return (
    <span className={`inline-flex items-center align-middle ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        className="text-zinc-500 hover:text-purple-400 p-0.5 rounded transition cursor-pointer inline-flex items-center justify-center focus:outline-none"
        aria-label="More information"
        aria-expanded={isOpen}
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isOpen &&
        position &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              transform: position.placement === 'top' ? 'translateY(-100%)' : 'none',
            }}
            className="fixed z-[9999] p-3.5 rounded-xl bg-zinc-950/95 border border-purple-500/50 shadow-2xl backdrop-blur-md text-left transition-all animate-in fade-in zoom-in-95 duration-150"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              {title ? (
                <div className="text-[11px] font-bold font-['Chakra_Petch'] uppercase tracking-wider text-purple-300">
                  {title}
                </div>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white p-0.5 rounded sm:hidden cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] font-mono text-zinc-300 leading-relaxed">{content}</p>
          </div>,
          document.body
        )}
    </span>
  );
};
