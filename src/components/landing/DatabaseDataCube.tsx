import React, { useState } from 'react';
import { Database, Sparkles, Layers, Activity, Cpu, ArrowUpRight } from 'lucide-react';

interface DatabaseDataCubeProps {
  onExploreSchema?: () => void;
  interactive?: boolean;
}

export const DatabaseDataCube: React.FC<DatabaseDataCubeProps> = ({
  onExploreSchema,
  interactive = true,
}) => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'query' | 'relational' | 'storage'>('all');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div 
      className="relative w-full max-w-[520px] mx-auto select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        @keyframes floatCube {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(0.5deg); }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.08); opacity: 0.85; filter: drop-shadow(0 0 10px #38BDF8); }
        }
        @keyframes dataPulseFlow {
          0% { stroke-dashoffset: 160; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes sparkGlow {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.3); filter: drop-shadow(0 0 8px #A855F7); }
        }
        .anim-float-cube {
          animation: floatCube 6s ease-in-out infinite;
        }
        .anim-pulse-ring {
          animation: pulseRing 3.5s ease-in-out infinite;
          transform-origin: center;
        }
        .anim-data-flow {
          stroke-dasharray: 8 6;
          animation: dataPulseFlow 3s linear infinite;
        }
        .anim-spark-glow {
          animation: sparkGlow 2s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>

      {/* Ambient Multi-layer Glow Backdrop */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#0284C7]/20 via-[#8B5CF6]/15 to-[#38BDF8]/25 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      {/* Glassmorphic Container */}
      <div className="relative rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(2,132,199,0.12)] p-4 sm:p-6 overflow-hidden">
        
        {/* Top Header of the Data Hub */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] flex items-center justify-center text-white shadow-md shadow-[#0284C7]/30">
              <Database className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight">Cơ Sở Dữ Liệu Quan Hệ (DB CTY)</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0284C7] border border-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
                  Live 120 FPS
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Mô hình kiến trúc 3 lớp: Query Engine • Relational Graph • Storage</p>
            </div>
          </div>

          {/* Layer Selector Chips */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/60 text-[11px] font-semibold">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2.5 py-1 rounded-lg transition ${activeLayer === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Toàn cảnh
            </button>
            <button
              onClick={() => setActiveLayer('relational')}
              className={`px-2.5 py-1 rounded-lg transition ${activeLayer === 'relational' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-500 hover:text-purple-700'}`}
            >
              4 Bảng PK/FK
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MAIN 3D ISOMETRIC DATA CUBE / CYLINDER SVG (Retina Sharp) */}
        {/* ======================================================== */}
        <div className="relative w-full aspect-[16/11] flex items-center justify-center anim-float-cube">
          <svg
            viewBox="0 0 600 420"
            className="w-full h-full max-w-full drop-shadow-lg select-none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Radial Glow Filters */}
              <filter id="neonBlueGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38BDF8" floodOpacity="0.8" />
              </filter>
              <filter id="neonPurpleGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#A855F7" floodOpacity="0.8" />
              </filter>
              <filter id="cubeSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.12" />
              </filter>

              {/* Data Cylinder Disk Gradients */}
              <linearGradient id="diskTopGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#E0F2FE" />
                <stop offset="100%" stopColor="#BAE6FD" />
              </linearGradient>
              <linearGradient id="diskSideGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0369A1" />
              </linearGradient>

              <linearGradient id="diskTopGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F3E8FF" />
                <stop offset="100%" stopColor="#DDD6FE" />
              </linearGradient>
              <linearGradient id="diskSideGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#5B21B6" />
              </linearGradient>

              <linearGradient id="diskTopGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
              <linearGradient id="diskSideGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>

            {/* Base Pedestal Ground Shadow */}
            <ellipse cx="300" cy="360" rx="190" ry="46" fill="#0F172A" opacity="0.1" filter="url(#cubeSoftShadow)" />

            {/* Concentric Magnetic Ring */}
            <ellipse cx="300" cy="360" rx="220" ry="52" fill="none" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="6 8" />
            <ellipse cx="300" cy="360" rx="220" ry="52" fill="none" stroke="#38BDF8" strokeWidth="2" className="anim-data-flow" opacity="0.6" />

            {/* ======================================================== */}
            {/* LAYER 3: STORAGE & PERSISTENCE (BOTTOM DISK)            */}
            {/* ======================================================== */}
            <g id="layer-storage" transform="translate(0, 40)">
              {/* Cylinder Body */}
              <path
                d="M 170 260 L 170 290 Q 300 345 430 290 L 430 260 Q 300 315 170 260 Z"
                fill="url(#diskSideGrad3)"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              {/* Top Cap */}
              <ellipse cx="300" cy="260" rx="130" ry="32" fill="url(#diskTopGrad3)" stroke="#CBD5E1" strokeWidth="1.5" />
              
              {/* Storage Micro-LEDs */}
              <circle cx="210" cy="278" r="3.5" fill="#10B981" />
              <circle cx="230" cy="282" r="3.5" fill="#38BDF8" />
              <circle cx="250" cy="285" r="3.5" fill="#A855F7" />
              <text x="300" y="265" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold" letterSpacing="0.05em">
                LAYER 01: IN-MEMORY BUFFER & STORAGE
              </text>
            </g>

            {/* Connective Neon Pulse Pillars (Connecting Layer 3 to Layer 2) */}
            <line x1="200" y1="270" x2="200" y2="215" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="4 3" className="anim-data-flow" />
            <line x1="400" y1="270" x2="400" y2="215" stroke="#A855F7" strokeWidth="2.5" strokeDasharray="4 3" className="anim-data-flow" />

            {/* ======================================================== */}
            {/* LAYER 2: RELATIONAL GRAPH & FK MATRIX (MIDDLE DISK)     */}
            {/* ======================================================== */}
            <g id="layer-relational" transform="translate(0, -15)">
              {/* Cylinder Body */}
              <path
                d="M 160 200 L 160 230 Q 300 290 440 230 L 440 200 Q 300 260 160 200 Z"
                fill="url(#diskSideGrad2)"
                stroke="#5B21B6"
                strokeWidth="1.5"
                filter="url(#neonPurpleGlow)"
                opacity="0.95"
              />
              {/* Top Cap */}
              <ellipse cx="300" cy="200" rx="140" ry="34" fill="url(#diskTopGrad2)" stroke="#C4B5FD" strokeWidth="1.5" />

              {/* Data Circuits on Middle Disk */}
              <ellipse cx="300" cy="200" rx="110" ry="24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="8 6" className="anim-data-flow" />
              <text x="300" y="204" textAnchor="middle" fill="#6D28D9" fontSize="11" fontWeight="bold" letterSpacing="0.05em">
                LAYER 02: RELATIONAL GRAPH (DB CTY 4 TABLES)
              </text>

              {/* Center Core Spark */}
              <circle cx="300" cy="200" r="10" fill="#A855F7" opacity="0.3" className="anim-pulse-ring" />
              <circle cx="300" cy="200" r="4.5" fill="#7C3AED" />
              <circle cx="300" cy="200" r="2" fill="#FFFFFF" />
            </g>

            {/* Connective Neon Pulse Pillars (Connecting Layer 2 to Layer 1) */}
            <line x1="210" y1="160" x2="210" y2="105" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="4 3" className="anim-data-flow" />
            <line x1="390" y1="160" x2="390" y2="105" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="4 3" className="anim-data-flow" />

            {/* ======================================================== */}
            {/* LAYER 1: QUERY PARSER & OPTIMIZER (TOP GLASS DISK)       */}
            {/* ======================================================== */}
            <g id="layer-query" transform="translate(0, -70)">
              {/* Cylinder Body */}
              <path
                d="M 150 140 L 150 165 Q 300 230 450 165 L 450 140 Q 300 205 150 140 Z"
                fill="url(#diskSideGrad1)"
                stroke="#0284C7"
                strokeWidth="1.5"
                filter="url(#neonBlueGlow)"
              />
              {/* Top Cap (Glassy Light) */}
              <ellipse cx="300" cy="140" rx="150" ry="36" fill="url(#diskTopGrad1)" stroke="#38BDF8" strokeWidth="2" />

              {/* Glass Radar Sweep */}
              <ellipse cx="300" cy="140" rx="120" ry="26" fill="none" stroke="#0284C7" strokeWidth="1.5" opacity="0.5" />
              <text x="300" y="144" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="extrabold" letterSpacing="0.05em">
                LAYER 03: QUERY EXECUTION & 120 FPS ENGINE
              </text>

              {/* Top Interactive Query Chip */}
              <g transform="translate(240, 95)" filter="url(#cubeSoftShadow)">
                <rect x="0" y="0" width="120" height="30" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
                <circle cx="14" cy="15" r="4" fill="#10B981" />
                <text x="26" y="19" fill="#0F172A" fontSize="10" fontWeight="bold" fontFamily="monospace">SELECT * FROM...</text>
              </g>
            </g>

            {/* ======================================================== */}
            {/* FLOATING SATELLITE RELATIONAL CARDS (ORBITING CUBE)     */}
            {/* ======================================================== */}
            
            {/* 1. Left Satellite: Table 'NHANVIEN' (FK) */}
            <g transform="translate(20, 110)" filter="url(#cubeSoftShadow)">
              <rect x="0" y="0" width="138" height="74" rx="14" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
              <path d="M 0 12 Q 0 0 12 0 L 126 0 Q 138 0 138 12 L 138 24 L 0 24 Z" fill="#0284C7" />
              <text x="12" y="16" fill="#FFFFFF" fontSize="10" fontWeight="bold">NHANVIEN (8 bản ghi)</text>
              <text x="10" y="38" fill="#334155" fontSize="9" fontWeight="600">🔑 MANV: PK</text>
              <text x="10" y="52" fill="#7C3AED" fontSize="9" fontWeight="bold">🔗 MAPB: FK → PHONGBAN</text>
              <text x="10" y="66" fill="#64748B" fontSize="8.5">HOTEN, LUONG, CHUCVU</text>
              {/* Connector line to cube */}
              <line x1="138" y1="37" x2="200" y2="100" stroke="#0284C7" strokeWidth="1.8" strokeDasharray="3 3" className="anim-data-flow" />
              <circle cx="200" cy="100" r="3" fill="#0284C7" />
            </g>

            {/* 2. Right Satellite: Table 'PHONGBAN' (PK) */}
            <g transform="translate(440, 80)" filter="url(#cubeSoftShadow)">
              <rect x="0" y="0" width="136" height="70" rx="14" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1.5" />
              <path d="M 0 12 Q 0 0 12 0 L 124 0 Q 136 0 136 12 L 136 24 L 0 24 Z" fill="#7C3AED" />
              <text x="12" y="16" fill="#FFFFFF" fontSize="10" fontWeight="bold">PHONGBAN (4 phòng)</text>
              <text x="10" y="38" fill="#334155" fontSize="9" fontWeight="600">🔑 MAPB: PK</text>
              <text x="10" y="52" fill="#64748B" fontSize="9">TENPB, DIADIEM</text>
              <text x="10" y="64" fill="#64748B" fontSize="8.5">NGANSACH: INT</text>
              {/* Connector line to cube */}
              <line x1="0" y1="35" x2="-60" y2="90" stroke="#7C3AED" strokeWidth="1.8" strokeDasharray="3 3" className="anim-data-flow" />
              <circle cx="-60" cy="90" r="3" fill="#7C3AED" />
            </g>

            {/* 3. Bottom Right Satellite: Table 'DUAN' & 'PHANCONG' */}
            <g transform="translate(420, 240)" filter="url(#cubeSoftShadow)">
              <rect x="0" y="0" width="144" height="66" rx="14" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.5" />
              <path d="M 0 12 Q 0 0 12 0 L 132 0 Q 144 0 144 12 L 144 22 L 0 22 Z" fill="#0D9488" />
              <text x="12" y="15" fill="#FFFFFF" fontSize="9.5" fontWeight="bold">DUAN & PHANCONG</text>
              <text x="10" y="36" fill="#334155" fontSize="8.5" fontWeight="600">🔑 MADA, MAPC</text>
              <text x="10" y="50" fill="#0D9488" fontSize="8.5" fontWeight="bold">🔗 4 Bảng Đã Nạp Dữ Liệu</text>
              {/* Connector line to cube */}
              <line x1="0" y1="33" x2="-50" y2="20" stroke="#0D9488" strokeWidth="1.8" strokeDasharray="3 3" className="anim-data-flow" />
            </g>

            {/* 4. Bottom Left Satellite: Engine Speed Badge */}
            <g transform="translate(30, 260)" filter="url(#cubeSoftShadow)">
              <rect x="0" y="0" width="130" height="52" rx="12" fill="#0F172A" />
              <circle cx="16" cy="18" r="4" fill="#10B981" className="anim-spark-glow" />
              <text x="26" y="21" fill="#FFFFFF" fontSize="10" fontWeight="bold">0-Latency Engine</text>
              <text x="12" y="38" fill="#94A3B8" fontSize="8.5">Truy vấn chạy tại RAM</text>
            </g>

          </svg>
        </div>

        {/* Bottom Interactive Summary Strip */}
        <div className="mt-2 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>4 Bảng Tiếng Việt: <strong>PHONGBAN</strong>, <strong>NHANVIEN</strong>, <strong>DUAN</strong>, <strong>PHANCONG</strong></span>
          </div>
          
          {onExploreSchema && (
            <button
              onClick={onExploreSchema}
              className="text-[#0284C7] hover:text-[#0369A1] font-bold inline-flex items-center space-x-1 cursor-pointer transition"
            >
              <span>Xem cấu trúc Schema chi tiết</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
