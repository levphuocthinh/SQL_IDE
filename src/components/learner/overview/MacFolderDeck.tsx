import React, { useState } from 'react';
import { 
  FolderGit2, 
  ChevronLeft, 
  ChevronRight, 
  FileCode2, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

export interface ProjectDeckItem {
  id: string;
  title: string;
  shortName: string;
  fileName: string;
  engine: string;
  badge: string;
  queriesCount: number;
  linesCount: number;
  folderColor: string;
  tabColor: string;
  previewCode: string[];
}

interface MacFolderDeckProps {
  projectDeck: ProjectDeckItem[];
  onOpenIde: () => void;
}

/**
 * Hiệu ứng xếp chồng thư mục macOS 3D (Interactive Mac Folder Deck)
 * Cho phép chuyển đổi linh hoạt giữa các dự án thực tế và xem nhanh mã nguồn bên trong
 */
export const MacFolderDeck: React.FC<MacFolderDeckProps> = ({
  projectDeck,
  onOpenIde,
}) => {
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);
  const [isFolderHovered, setIsFolderHovered] = useState<boolean>(false);

  const activeProject = projectDeck[activeProjectIdx] || projectDeck[0];

  return (
    <div className="rounded-[32px] bg-[#F8FAFD] border border-slate-200/80 p-5 sm:p-7 shadow-sm flex flex-col justify-between font-sans">
      {/* 1. Header with Finder Folder Tabs & Arrows */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200/80 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#0071E3] flex items-center justify-center">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              Thư mục Dự án Cá nhân
            </h3>
            <p className="text-[10px] text-slate-500">Finder macOS 3D Stack</p>
          </div>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center space-x-1 bg-slate-200/70 p-0.5 rounded-xl text-[11px] font-semibold">
          {projectDeck.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveProjectIdx(idx)}
              className={`px-2.5 py-1 rounded-lg transition-all text-[10px] sm:text-[11px] cursor-pointer ${
                activeProjectIdx === idx 
                  ? 'bg-white text-slate-900 shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{idx + 1}.</span>
              <span className="truncate ml-1">{p.shortName}</span>
            </button>
          ))}

          {/* Arrow Buttons for quick cycling */}
          <div className="flex items-center pl-1 border-l border-slate-300/80 space-x-0.5 shrink-0">
            <button
              onClick={() => setActiveProjectIdx((prev) => (prev - 1 + projectDeck.length) % projectDeck.length)}
              className="p-1 rounded-md hover:bg-white/60 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              title="Dự án trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveProjectIdx((prev) => (prev + 1) % projectDeck.length)}
              className="p-1 rounded-md hover:bg-white/60 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              title="Dự án kế tiếp"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive macOS Folder Container */}
      <div 
        onMouseEnter={() => setIsFolderHovered(true)}
        onMouseLeave={() => setIsFolderHovered(false)}
        className="relative py-1 flex flex-col items-center justify-center min-h-[260px] cursor-pointer group/folder"
      >
        {/* Background depth stacks */}
        <div className="absolute top-1 inset-x-8 h-44 rounded-2xl bg-slate-300/40 border border-slate-300/60 shadow-md transform -translate-y-3 scale-[0.88] opacity-50 pointer-events-none transition-all duration-300" />
        <div className="absolute top-3.5 inset-x-4 h-44 rounded-2xl bg-slate-300/60 border border-slate-300/80 shadow-md transform -translate-y-1.5 scale-[0.94] opacity-75 pointer-events-none transition-all duration-300" />

        {/* Main active folder sleeve */}
        <div className="relative w-full h-[240px] transition-transform duration-300">
          
          {/* Back folder layer & top tab */}
          <div className={`absolute top-0 left-0 w-40 h-7 rounded-t-xl bg-gradient-to-r ${activeProject.tabColor || 'from-[#38BDF8] to-[#0284C7]'} shadow-sm border-t border-l border-white/40 flex items-center px-3 z-0 transition-colors duration-300`}>
            <span className="text-[9.5px] font-mono text-white font-bold truncate">
              📁 {activeProject.fileName}
            </span>
          </div>

          <div className={`absolute inset-x-0 bottom-0 top-3 rounded-2xl bg-gradient-to-b ${activeProject.folderColor} shadow-md border border-white/20 z-0 overflow-hidden transition-colors duration-300`} />

          {/* Inner sliding SQL Document Sheet */}
          <div 
            className={`absolute inset-x-1 bottom-3 top-2 rounded-2xl bg-[#0D0F18] border border-cyan-400/50 p-4 transition-all duration-300 flex flex-col justify-between ${
              isFolderHovered
                ? 'opacity-100 shadow-[0_24px_50px_rgba(0,0,0,0.4),0_0_30px_rgba(56,189,248,0.3)] z-30 transform -translate-y-8 scale-[1.03] pointer-events-auto'
                : 'opacity-85 z-10 transform translate-y-0 scale-[0.98] pointer-events-none'
            }`}
          >
            {/* macOS Window Header Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                <span className="text-[11px] font-mono font-bold text-white pl-1.5 truncate max-w-[140px]">
                  {activeProject.fileName}
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/30">
                {activeProject.engine} · ACID
              </span>
            </div>

            {/* Syntax-highlighted SQL Query snippet */}
            <div className="font-mono text-[9.5px] leading-relaxed text-slate-300 space-y-1 py-1.5 overflow-hidden flex-1">
              {activeProject.previewCode.map((line, lIdx) => (
                <div key={lIdx} className="flex items-start space-x-2 truncate">
                  <span className="text-slate-500 text-[8.5px] w-3.5 text-right shrink-0">{lIdx + 1}</span>
                  <span className={`truncate ${
                    line.startsWith('--') 
                      ? 'text-slate-400 italic' 
                      : line.includes('BEGIN') || line.includes('COMMIT') || line.includes('SELECT') || line.includes('UPDATE') || line.includes('WITH')
                        ? 'text-cyan-300 font-semibold'
                        : line.includes('SET') || line.includes('FROM') || line.includes('WHERE') || line.includes('GROUP BY')
                          ? 'text-blue-300 font-medium'
                          : 'text-slate-200'
                  }`}>
                    {line}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Launch Bar */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] shrink-0">
              <div className="flex items-center space-x-2 text-slate-400 text-[9px] font-mono">
                <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  12ms
                </span>
                <span>·</span>
                <span>{activeProject.queriesCount} queries</span>
                <span>·</span>
                <span>{activeProject.linesCount} dòng</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenIde();
                }}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#0071E3] to-[#0EA5E9] hover:from-[#0077ED] hover:to-[#38BDF8] text-white font-bold flex items-center gap-1 shadow-md shadow-blue-500/30 transition-transform active:scale-95 cursor-pointer text-[10px]"
              >
                <span>Mở trên IDE</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Front folder cover */}
          <div 
            className={`absolute inset-x-0 bottom-0 h-44 rounded-2xl bg-gradient-to-b ${activeProject.folderColor} shadow-[0_14px_36px_rgba(2,132,199,0.35)] p-4 flex flex-col justify-between border-t border-white/40 transition-all duration-300 ${
              isFolderHovered 
                ? 'translate-y-16 scale-95 opacity-20 pointer-events-none z-10' 
                : 'translate-y-0 scale-100 opacity-100 z-20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
                  {activeProject.badge}
                </span>
                <span className="text-[10px] font-bold text-white/90">
                  {activeProject.queriesCount} queries
                </span>
              </div>

              <h3 className="text-base font-extrabold text-white tracking-tight drop-shadow-sm line-clamp-1">
                {activeProject.title}
              </h3>
              <p className="text-white/80 text-[11px] font-medium flex items-center gap-1 mt-0.5">
                <FileCode2 className="w-3 h-3 text-cyan-200" />
                <span className="font-mono">{activeProject.fileName}</span>
              </p>
            </div>

            <div>
              <div className="w-full h-1.5 rounded-full bg-black/25 overflow-hidden mb-2">
                <div className="h-full rounded-full bg-white w-4/5" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-white/90 font-mono">
                <span>Rê chuột để mở code</span>
                <span className="font-bold underline decoration-white/40">Xem SQL ↗</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
