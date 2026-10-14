import React, { useEffect, useRef } from 'react';
import { EditorTheme } from '../types/theme';

export interface SuggestionItem {
  label: string;
  type: 'keyword' | 'table' | 'column' | 'function' | 'snippet';
  detail?: string;
  insertText: string;
}

interface IntelliJAutocompleteProps {
  suggestions: SuggestionItem[];
  selectedIndex: number;
  onSelect: (item: SuggestionItem) => void;
  position: { top: number; left: number };
  theme: EditorTheme;
}

export const IntelliJAutocomplete: React.FC<IntelliJAutocompleteProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  position,
  theme,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected item into view smoothly
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (suggestions.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        backgroundColor: theme.id === 'darcula' ? '#2b2d30' : theme.id === 'classic-light' ? '#ffffff' : '#1e222b',
        borderColor: theme.id === 'classic-light' ? '#cbd5e1' : 'rgba(255, 255, 255, 0.18)',
        color: theme.id === 'classic-light' ? '#0f172a' : '#f1f5f9',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55), 0 2px 6px rgba(0, 0, 0, 0.3)',
        zIndex: 50,
      }}
      className="w-80 rounded-xl border text-xs font-mono select-none overflow-hidden backdrop-blur-md transition-all animate-in fade-in-50 zoom-in-95 duration-100"
    >
      {/* Header Bar */}
      <div 
        style={{ 
          backgroundColor: theme.id === 'classic-light' ? '#f8fafc' : 'rgba(0, 0, 0, 0.35)',
          borderColor: theme.id === 'classic-light' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)',
        }}
        className="px-3 py-1.5 border-b flex items-center justify-between text-[10px] text-slate-400 font-sans"
      >
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          Gợi ý IntelliJ / DataGrip
        </span>
        <span className="flex items-center space-x-1.5 font-mono">
          <span className="text-[10px] text-slate-400">Điều hướng:</span>
          <kbd className="px-1 py-0.5 rounded bg-black/40 border border-white/10 text-slate-300 text-[9px]">↓</kbd>
          <kbd className="px-1 py-0.5 rounded bg-black/40 border border-white/10 text-slate-300 text-[9px]">↑</kbd>
          <span className="text-slate-500">•</span>
          <kbd className="px-1 py-0.5 rounded bg-indigo-600/80 text-white border border-indigo-400/40 text-[9px] font-bold">Tab</kbd>
        </span>
      </div>

      {/* Suggestions List */}
      <div ref={listRef} className="max-h-52 overflow-y-auto scrollbar-thin py-1">
        {suggestions.map((item, idx) => {
          const isSelected = idx === selectedIndex;

          let badgeBg = 'bg-purple-900/60 text-purple-300 border-purple-700/60';
          let badgeText = 'K';

          if (item.type === 'table') {
            badgeBg = 'bg-blue-900/60 text-blue-300 border-blue-700/60';
            badgeText = 'T';
          } else if (item.type === 'column') {
            badgeBg = 'bg-amber-900/60 text-amber-300 border-amber-700/60';
            badgeText = 'C';
          } else if (item.type === 'function') {
            badgeBg = 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60';
            badgeText = 'fn';
          } else if (item.type === 'snippet') {
            badgeBg = 'bg-rose-900/60 text-rose-300 border-rose-700/60';
            badgeText = 'S';
          }

          return (
            <div
              key={item.label + idx}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(item);
              }}
              style={{
                backgroundColor: isSelected
                  ? '#388BFD' // High contrast vibrant active blue
                  : 'transparent',
              }}
              className={`px-3 py-1.5 flex items-center justify-between cursor-pointer transition-colors ${
                isSelected 
                  ? 'text-white font-bold shadow-inner' 
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <span className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center border flex-shrink-0 ${
                  isSelected ? 'bg-white/20 text-white border-white/40' : badgeBg
                }`}>
                  {badgeText}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.detail && (
                <span className={`text-[10px] font-sans ml-2 flex-shrink-0 truncate ${
                  isSelected ? 'text-indigo-100 font-normal' : 'text-slate-400'
                }`}>
                  {item.detail}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
