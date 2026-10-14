import React, { useRef, useState, useEffect, useCallback } from 'react';
import { animate, svg, stagger } from 'animejs';
import { TableSchema, Relationship, ExecutionStep } from '../types/sql';
import { animateCardDrop } from '../utils/animations';
import { 
  Database,
  Key,
  Link2,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  GripHorizontal,
  Split,
  MoveHorizontal,
  Zap 
} from 'lucide-react';

interface VisualizerProps {
  tables: TableSchema[];
  relationships: Relationship[];
  currentStep?: ExecutionStep;
  allSteps: ExecutionStep[];
  stepIndex: number;
  onStepChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  showAllTables?: boolean;
  onToggleShowAllTables?: () => void;
}


interface TablePosition {
  x: number;
  y: number;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  tables,
  relationships,
  currentStep,
  allSteps,
  stepIndex,
  onStepChange,
  isPlaying,
  onTogglePlay,
  isFullscreen,
  onToggleFullscreen,
  showAllTables,
  onToggleShowAllTables,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'flow' | 'erd'>('flow');
  const [lineStyle, setLineStyle] = useState<'orthogonal' | 'straight'>('orthogonal');
  const [zoom, setZoom] = useState<number>(1);
  const [isBursting, setIsBursting] = useState<boolean>(false);

  const TABLE_WIDTH = isFullscreen ? 260 : 230;
  const instanceId = isFullscreen ? 'fs' : 'inline';

  // Initial table positions optimized for each mode (fits side-by-side in inline view)
  const defaultPositions = useCallback(() => {
    const pos: { [name: string]: TablePosition } = {};
    if (!isFullscreen) {
      // Inline mode: exactly 2 columns side-by-side inside ~540px
      tables.forEach((t, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        pos[t.name.toLowerCase()] = {
          x: 16 + col * 265,
          y: 20 + row * 240,
        };
      });
    } else {
      // Fullscreen mode: spacious layout across wide screen
      tables.forEach((t, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        pos[t.name.toLowerCase()] = {
          x: 60 + col * 380,
          y: 60 + row * 280,
        };
      });
    }
    return pos;
  }, [tables, isFullscreen]);

  const [positions, setPositions] = useState<{ [name: string]: TablePosition }>(defaultPositions);
  const positionsRef = useRef<{ [name: string]: TablePosition }>(positions);
  positionsRef.current = positions;

  useEffect(() => {
    setPositions((prev) => {
      const next = { ...prev };
      tables.forEach((t, i) => {
        const key = t.name.toLowerCase();
        if (!next[key]) {
          if (!isFullscreen) {
            const col = i % 2;
            const row = Math.floor(i / 2);
            next[key] = { x: 16 + col * 265, y: 20 + row * 240 };
          } else {
            const col = i % 3;
            const row = Math.floor(i / 3);
            next[key] = { x: 60 + col * 380, y: 60 + row * 280 };
          }
        }
      });
      return next;
    });
  }, [tables, isFullscreen]);

  // Dragging state with RAF throttle for 120 FPS buttery smooth motion
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const handlePointerDown = (tableName: string, e: React.PointerEvent) => {
    e.preventDefault();
    const key = tableName.toLowerCase();
    const currentPos = positionsRef.current[key] || { x: 20, y: 20 };

    dragOffsetRef.current = {
      x: e.clientX / zoom - currentPos.x,
      y: e.clientY / zoom - currentPos.y,
    };
    setDraggingTable(key);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingTable) return;

    const newX = Math.max(10, Math.round(e.clientX / zoom - dragOffsetRef.current.x));
    const newY = Math.max(10, Math.round(e.clientY / zoom - dragOffsetRef.current.y));

    // Direct DOM transform for 0-latency drag scoped to container
    const tableEl = containerRef.current?.querySelector(`#table-node-${instanceId}-${draggingTable}`) as HTMLElement | null;
    if (tableEl) {
      tableEl.style.left = `${newX}px`;
      tableEl.style.top = `${newY}px`;
    }

    // Update state via requestAnimationFrame to avoid re-render floods
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setPositions((prev) => ({
          ...prev,
          [draggingTable]: { x: newX, y: newY },
        }));
        rafRef.current = null;
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingTable) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      const tableEl = containerRef.current?.querySelector(`#table-node-${instanceId}-${draggingTable}`) as HTMLElement | null;
      if (tableEl) {
        animateCardDrop(tableEl);
      }

      setDraggingTable(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Keyboard shortcut: ESC to exit full screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        onToggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onToggleFullscreen]);

  // Anime.js: Continuous bidirectional packet loop scoped to containerRef
  useEffect(() => {
    if (relationships.length === 0) return;

    // Draw lines on load or change
    relationships.forEach((rel) => {
      const pathEl = containerRef.current?.querySelector(`#rel-path-${instanceId}-${rel.id}`) as SVGPathElement | null;
      if (pathEl) {
        try {
          const drawable = svg.createDrawable(pathEl);
          animate(drawable, {
            draw: [0, 1],
            duration: 500,
            ease: 'inOutSine',
          });
        } catch {}
      }
    });

    // Uninterrupted continuous Anime.js animation loop
    const packetObj = { progress: 0 };
    const anim = animate(packetObj, {
      progress: 1,
      duration: isBursting ? 800 : currentStep?.phase === 'JOIN_MATCH' ? 1400 : 2200,
      loop: true,
      ease: 'linear',
      onUpdate: () => {
        const prog = packetObj.progress;

        relationships.forEach((rel) => {
          const pathEl = containerRef.current?.querySelector(`#rel-path-${instanceId}-${rel.id}`) as SVGPathElement | null;
          if (!pathEl) return;

          let totalLen = 0;
          try {
            totalLen = pathEl.getTotalLength();
          } catch {
            return;
          }
          if (totalLen <= 0) return;

          // 1. Forward Packet (FK -> PK): Cyan glowing energy orb
          const fwdT = prog % 1;
          const ptFwd = pathEl.getPointAtLength(fwdT * totalLen);
          const fwdEl = containerRef.current?.querySelector(`#packet-fwd-${instanceId}-${rel.id}`) as SVGElement | null;
          if (fwdEl) {
            fwdEl.style.opacity = '1';
            fwdEl.setAttribute('transform', `translate(${ptFwd.x}, ${ptFwd.y})`);
          }

          // 2. Return Packet (PK -> FK): Emerald glowing energy orb
          const revT = (1 - prog + 1) % 1;
          const ptRev = pathEl.getPointAtLength(revT * totalLen);
          const revEl = containerRef.current?.querySelector(`#packet-rev-${instanceId}-${rel.id}`) as SVGElement | null;
          if (revEl) {
            revEl.style.opacity = '1';
            revEl.setAttribute('transform', `translate(${ptRev.x}, ${ptRev.y})`);
          }
        });
      },
    });

    return () => {
      anim.pause();
    };
  }, [relationships, lineStyle, isBursting, currentStep?.phase, instanceId]);

  // Anime.js: Step phase animations (Stagger rows, Shake filtered rows, Ripple waves)
  useEffect(() => {
    if (!currentStep) return;

    // Pop active tables with elastic spring
    if (currentStep.activeTables && currentStep.activeTables.length > 0) {
      const targets = currentStep.activeTables
        .map((t) => `#table-node-${t.toLowerCase()}`)
        .filter((sel) => document.querySelector(sel));

      if (targets.length > 0) {
        animate(targets, {
          scale: [0.97, 1],
          duration: 350,
          ease: 'outElastic(1.2, 0.8)',
        });
      }
    }

    // Animate table rows with stagger scan
    const tableRows = document.querySelectorAll('.table-row-item');
    if (tableRows.length > 0 && currentStep.phase === 'SCAN') {
      animate(tableRows, {
        opacity: [0.3, 1],
        translateX: [-4, 0],
        delay: stagger(25),
        duration: 250,
        ease: 'outQuad',
      });
    }

    // Animate filtered rows with shake & fade
    const filteredRows = document.querySelectorAll('.row-filtered-out');
    if (filteredRows.length > 0) {
      animate(filteredRows, {
        translateX: [-4, 4, -2, 2, 0],
        opacity: [1, 0.25],
        delay: stagger(30),
        duration: 350,
        ease: 'inOutQuad',
      });
    }

    // Animate matched rows with soft glow
    const matchedRows = document.querySelectorAll('.row-matched');
    if (matchedRows.length > 0) {
      animate(matchedRows, {
        scale: [0.98, 1.02, 1],
        delay: stagger(30),
        duration: 400,
        ease: 'outQuad',
      });
    }
  }, [currentStep, stepIndex]);

  // Trigger manual data burst animation
  const handleTriggerBurst = () => {
    setIsBursting(true);
    const tableNodes = containerRef.current?.querySelectorAll(`[id^="table-node-${instanceId}-"]`);
    if (tableNodes && tableNodes.length > 0) {
      animate(tableNodes, {
        scale: [1, 1.025, 1],
        duration: 450,
        ease: 'outElastic(1.3, 0.7)',
      });
    }
    setTimeout(() => setIsBursting(false), 1800);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(1.8, Math.round((z + 0.1) * 10) / 10));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10));
  const handleResetView = () => {
    setZoom(1);
    setPositions(defaultPositions());
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  };

  // ESC key listener to exit fullscreen mode
  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        onToggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onToggleFullscreen]);

  return (
    <div className="flex flex-col h-full w-full bg-gh-bg select-none relative overflow-hidden">
      {/* Top Toolbar - Fully Aligned, Zero Wrapping, Perfectly Centered */}
      <div className="h-10 px-3 bg-gh-surface border-b border-gh-border flex items-center justify-between z-20 overflow-x-auto scrollbar-none whitespace-nowrap">


        {/* Left: Title & Active Step Phase */}
        <div className="flex items-center space-x-2 text-xs flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-gh-purple animate-pulse flex-shrink-0" />
          <span className="font-semibold text-gh-text text-xs whitespace-nowrap">Sơ đồ Quan hệ</span>
          {currentStep && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-gh-purple/15 text-gh-purple border border-gh-purple/30 whitespace-nowrap">
              {currentStep.phase}
            </span>
          )}
          <span className="text-[11px] text-gh-muted hidden 2xl:inline font-mono">
            • Kéo thả ⇄ Truyền 2 chiều
          </span>
        </div>

        {/* Right: Step Controls, Burst Button, Line Style, Zoom & Fullscreen */}
        <div className="flex items-center space-x-1.5 flex-shrink-0 whitespace-nowrap">
          {/* Data Burst Button */}
          <button
            onClick={handleTriggerBurst}
            title="Kích hoạt luồng truyền dữ liệu tốc độ cao (Anime.js)"
            className={`h-7 px-2.5 rounded border text-[11px] font-semibold flex items-center space-x-1.5 transition whitespace-nowrap flex-shrink-0 ${
              isBursting
                ? 'bg-gh-purple text-white border-gh-purple'
                : 'bg-gh-purple/15 text-gh-purple border-gh-purple/30 hover:bg-gh-purple/25'
            }`}
          >
            <Zap className="w-3 h-3 fill-current flex-shrink-0" />
            <span className="whitespace-nowrap">{isBursting ? 'Đang bắn...' : 'Bắn xung'}</span>
          </button>

          {/* Step Stepper */}
          {allSteps.length > 1 && (
            <div className="h-7 flex items-center space-x-1 bg-gh-bg border border-gh-border rounded px-1.5 text-xs flex-shrink-0">
              <button
                onClick={() => onStepChange(Math.max(0, stepIndex - 1))}
                disabled={stepIndex === 0}
                className="px-1.5 py-0.5 rounded text-[10px] text-gh-muted hover:text-gh-text disabled:opacity-30 whitespace-nowrap"
              >
                Trước
              </button>
              <button
                onClick={onTogglePlay}
                className="px-2 py-0.5 rounded bg-gh-purple/20 text-gh-purple text-[10px] font-medium flex items-center space-x-1 hover:bg-gh-purple/30 whitespace-nowrap"
              >
                {isPlaying ? <Pause className="w-2.5 h-2.5 flex-shrink-0" /> : <Play className="w-2.5 h-2.5 flex-shrink-0" />}
                <span>{isPlaying ? 'Dừng' : 'Chạy'}</span>
              </button>
              <button
                onClick={() => onStepChange(Math.min(allSteps.length - 1, stepIndex + 1))}
                disabled={stepIndex >= allSteps.length - 1}
                className="px-1.5 py-0.5 rounded text-[10px] text-gh-muted hover:text-gh-text disabled:opacity-30 whitespace-nowrap"
              >
                Tiếp
              </button>
              <span className="text-[10px] font-mono text-gh-muted px-1 whitespace-nowrap">
                {stepIndex + 1}/{allSteps.length}
              </span>
            </div>
          )}

          {/* Line Style Toggle */}
          <div className="h-7 flex bg-gh-bg rounded p-0.5 border border-gh-border text-xs flex-shrink-0">
            <button
              onClick={() => setLineStyle('orthogonal')}
              title="Đường nối gập vuông góc 90° chuẩn ERD"
              className={`h-full px-2 rounded text-[11px] font-medium flex items-center space-x-1 transition whitespace-nowrap ${
                lineStyle === 'orthogonal'
                  ? 'bg-gh-subtle text-gh-text font-semibold shadow-sm'
                  : 'text-gh-muted hover:text-gh-text'
              }`}
            >
              <Split className="w-3 h-3 flex-shrink-0" />
              <span>Vuông góc</span>
            </button>
            <button
              onClick={() => setLineStyle('straight')}
              title="Đường nối thẳng trực tiếp"
              className={`h-full px-2 rounded text-[11px] font-medium flex items-center space-x-1 transition whitespace-nowrap ${
                lineStyle === 'straight'
                  ? 'bg-gh-subtle text-gh-text font-semibold shadow-sm'
                  : 'text-gh-muted hover:text-gh-text'
              }`}
            >
              <MoveHorizontal className="w-3 h-3 flex-shrink-0" />
              <span>Thẳng</span>
            </button>
          </div>

          {/* Mode switch (Flow / ERD) */}
          <div className="h-7 flex bg-gh-bg rounded p-0.5 border border-gh-border text-xs flex-shrink-0">
            <button
              onClick={() => setViewMode('flow')}
              className={`h-full px-2.5 rounded text-[11px] font-medium transition whitespace-nowrap ${
                viewMode === 'flow' ? 'bg-gh-subtle text-gh-text font-semibold shadow-sm' : 'text-gh-muted hover:text-gh-text'
              }`}
            >
              Luồng
            </button>
            <button
              onClick={() => setViewMode('erd')}
              className={`h-full px-2.5 rounded text-[11px] font-medium transition whitespace-nowrap ${
                viewMode === 'erd' ? 'bg-gh-subtle text-gh-text font-semibold shadow-sm' : 'text-gh-muted hover:text-gh-text'
              }`}
            >
              ERD
            </button>
          </div>

          <div className="h-4 w-px bg-gh-border mx-0.5 flex-shrink-0" />

          {/* Zoom Controls */}
          <div className="h-7 flex items-center space-x-1 bg-gh-bg border border-gh-border rounded px-1 flex-shrink-0">
            <button
              onClick={handleZoomOut}
              title="Thu nhỏ (-)"
              className="p-1 rounded text-gh-muted hover:text-gh-text hover:bg-gh-subtle transition flex-shrink-0"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span
              onClick={handleResetView}
              title="Click để đặt lại 100%"
              className="text-[10px] font-mono text-gh-muted hover:text-gh-text px-1 cursor-pointer whitespace-nowrap"
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title="Phóng to (+)"
              className="p-1 rounded text-gh-muted hover:text-gh-text hover:bg-gh-subtle transition flex-shrink-0"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Reset View Button */}
          <button
            onClick={handleResetView}
            title="Khôi phục vị trí các bảng"
            className="h-7 px-2 rounded bg-gh-bg border border-gh-border text-gh-muted hover:text-gh-text hover:bg-gh-subtle transition flex items-center justify-center flex-shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Toggle Lesson Tables vs All Tables */}
          {onToggleShowAllTables && (
            <button
              onClick={onToggleShowAllTables}
              title={showAllTables ? 'Chỉ hiện các bảng thuộc bài học này' : 'Hiện toàn bộ các bảng trong CSDL'}
              className={`h-7 px-2 rounded border text-xs font-medium transition flex items-center space-x-1.5 flex-shrink-0 whitespace-nowrap ${
                showAllTables
                  ? 'bg-gh-purple/20 text-gh-purple border-gh-purple/40 hover:bg-gh-purple/30'
                  : 'bg-gh-bg text-gh-muted hover:text-gh-text border-gh-border hover:bg-gh-subtle'
              }`}
            >
              <Database className="w-3 h-3" />
              <span className="text-[11px] whitespace-nowrap">{showAllTables ? 'Tất cả bảng' : 'Bảng bài học'}</span>
            </button>
          )}


          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Thu nhỏ lại (ESC)' : 'Toàn màn hình Diagram'}
            className={`h-7 px-2.5 rounded border transition flex items-center space-x-1.5 text-xs font-medium flex-shrink-0 whitespace-nowrap ${
              isFullscreen
                ? 'bg-gh-blue/20 text-gh-blue border-gh-blue/40 hover:bg-gh-blue/30'
                : 'bg-gh-bg text-gh-muted hover:text-gh-text border-gh-border hover:bg-gh-subtle'
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3 h-3 text-gh-blue flex-shrink-0" />
                <span className="text-[11px] font-semibold text-gh-blue whitespace-nowrap">Thu nhỏ</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3 flex-shrink-0" />
                <span className="text-[11px] whitespace-nowrap">Toàn màn hình</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step Banner */}
      {currentStep && (
        <div className="px-3.5 py-1.5 bg-gh-subtle/50 border-b border-gh-border text-xs flex items-center justify-between z-10 font-mono">
          <div className="flex items-center space-x-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-gh-purple animate-ping flex-shrink-0" />
            <span className="font-semibold text-gh-text truncate">{currentStep.title}</span>
            <span className="text-gh-muted text-[11px] truncate hidden md:inline">— {currentStep.description}</span>
          </div>
          {isFullscreen && (
            <span className="text-[10px] text-gh-muted bg-gh-bg px-2 py-0.5 rounded border border-gh-border flex-shrink-0">
              Nhấn ESC hoặc nút Thu nhỏ để thoát toàn màn hình
            </span>
          )}
        </div>
      )}

      {/* Diagram Canvas */}
      <div 
        ref={containerRef} 
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="flex-1 relative overflow-auto bg-dot-pattern scrollbar-thin cursor-default select-none"
      >
        <div 
          className={`relative origin-top-left transition-transform duration-75 ${
            isFullscreen ? 'min-w-[1400px] min-h-[900px]' : 'min-w-[550px] min-h-[380px]'
          }`}
          style={{ transform: `scale(${zoom})` }}
        >
          {/* SVG Straight / Orthogonal Lines & Bidirectional Anime.js Packets */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="diagramGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bc8cff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#58a6ff" stopOpacity="0.9" />
              </linearGradient>

              <filter id="diagramGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {relationships.map((rel) => {
              const fromPos = positions[rel.fromTable.toLowerCase()];
              const toPos = positions[rel.toTable.toLowerCase()];

              if (!fromPos || !toPos) return null;

              // Find exact columns
              const fromTableObj = tables.find(t => t.name.toLowerCase() === rel.fromTable.toLowerCase());
              const toTableObj = tables.find(t => t.name.toLowerCase() === rel.toTable.toLowerCase());

              const fromColIdx = fromTableObj?.columns.findIndex(c => c.name.toLowerCase() === rel.fromColumn.toLowerCase()) ?? -1;
              const toColIdx = toTableObj?.columns.findIndex(c => c.name.toLowerCase() === rel.toColumn.toLowerCase()) ?? -1;

              // Anchor Y at the exact row of the column (header ~33px + row*28px + 14px center)
              const startY = fromColIdx >= 0 ? fromPos.y + 33 + fromColIdx * 28 + 14 : fromPos.y + 50;
              const endY = toColIdx >= 0 ? toPos.y + 33 + toColIdx * 28 + 14 : toPos.y + 50;

              // Anchor X at the facing borders
              const fromIsLeft = (fromPos.x + TABLE_WIDTH / 2) < (toPos.x + TABLE_WIDTH / 2);
              const startX = fromIsLeft ? fromPos.x + TABLE_WIDTH : fromPos.x;
              const endX = fromIsLeft ? toPos.x : toPos.x + TABLE_WIDTH;

              // Orthogonal 90° or Straight line
              let pathData = '';
              const midX = Math.round((startX + endX) / 2);

              if (lineStyle === 'straight') {
                pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
              } else {
                if (Math.abs(startY - endY) < 4) {
                  pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
                } else if ((fromIsLeft && startX <= endX) || (!fromIsLeft && startX >= endX)) {
                  pathData = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
                } else {
                  const offset = fromIsLeft ? 24 : -24;
                  pathData = `M ${startX} ${startY} L ${startX + offset} ${startY} L ${startX + offset} ${endY} L ${endX} ${endY}`;
                }
              }

              const badgeX = lineStyle === 'straight' ? (startX + endX) / 2 : midX;
              const badgeY = (startY + endY) / 2;
              const isRelActive = currentStep?.phase === 'JOIN_MATCH' || currentStep?.activeTables?.includes(rel.fromTable);

              return (
                <g key={rel.id}>
                  {/* Background shadow line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#161b22"
                    strokeWidth="6"
                    strokeLinecap="square"
                  />

                  {/* Main Straight / Orthogonal Diagram Line */}
                  <path
                    id={`rel-path-${instanceId}-${rel.id}`}
                    d={pathData}
                    fill="none"
                    stroke="url(#diagramGrad)"
                    strokeWidth={isRelActive ? '3' : '2'}
                    filter={isRelActive ? 'url(#diagramGlow)' : undefined}
                  />

                  {/* Connection Anchor Endpoints */}
                  <circle cx={startX} cy={startY} r="4" fill="#bc8cff" stroke="#161b22" strokeWidth="1.5" />
                  <circle cx={endX} cy={endY} r="4" fill="#58a6ff" stroke="#161b22" strokeWidth="1.5" />

                  {/* 1. Forward Packet (FK -> PK): Glowing Cyan Pulse */}
                  <g id={`packet-fwd-${instanceId}-${rel.id}`} style={{ opacity: 0 }} className="pointer-events-none">
                    <circle r="9" fill="#58a6ff" opacity="0.3" filter="url(#diagramGlow)" />
                    <circle r="4.5" fill="#58a6ff" />
                    <circle r="2" fill="#ffffff" />
                  </g>

                  {/* 2. Return Packet (PK -> FK): Glowing Emerald Pulse */}
                  <g id={`packet-rev-${instanceId}-${rel.id}`} style={{ opacity: 0 }} className="pointer-events-none">
                    <circle r="9" fill="#3fb950" opacity="0.3" filter="url(#diagramGlow)" />
                    <circle r="4.5" fill="#3fb950" />
                    <circle r="2" fill="#ffffff" />
                  </g>

                  {/* Relationship Pill Badge */}
                  <g transform={`translate(${badgeX}, ${badgeY})`} className="cursor-default select-none pointer-events-none">
                    <rect
                      x="-48"
                      y="-10"
                      width="96"
                      height="20"
                      rx="10"
                      fill="#0d1117"
                      stroke="#30363d"
                      strokeWidth="1.2"
                    />
                    <text
                      x="0"
                      y="3.5"
                      fill="#a5d6ff"
                      fontSize="9"
                      fontWeight="600"
                      fontFamily="ui-monospace, monospace"
                      textAnchor="middle"
                    >
                      {rel.type} (FK ⟷ PK)
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Draggable Tables */}
          {tables.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 select-none">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-3 shadow-lg">
                <Database className="w-7 h-7 text-slate-400" />
              </div>
              <span className="text-sm font-bold text-slate-200">Lược đồ CSDL đang trống</span>
              <span className="text-xs text-slate-400 mt-1 max-w-sm text-center">
                Chưa có bảng nào được khởi tạo trong CSDL này.
              </span>
            </div>
          )}
          {tables.map((tbl) => {
            const key = tbl.name.toLowerCase();
            const pos = positions[key] || { x: 40, y: 40 };
            const isDragging = draggingTable === key;
            const isTableActive = currentStep?.activeTables?.some(
              (t) => t.toLowerCase() === key
            );

            return (
              <div
                id={`table-node-${instanceId}-${key}`}
                key={tbl.name}
                style={{
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  width: `${TABLE_WIDTH}px`,
                  zIndex: isDragging ? 30 : isTableActive ? 20 : 10,
                }}
                className={`rounded-lg border bg-gh-surface shadow-xl select-none transition-shadow ${
                  isDragging
                    ? 'ring-2 ring-gh-blue shadow-2xl cursor-grabbing'
                    : isTableActive
                    ? 'border-gh-purple shadow-gh-purple/20 ring-1 ring-gh-purple/40'
                    : 'border-gh-border hover:border-gh-muted'
                }`}
              >
                {/* Table Header (Drag Handle) */}
                <div
                  onPointerDown={(e) => handlePointerDown(tbl.name, e)}
                  title="Giữ chuột và kéo để di chuyển bảng"
                  className={`px-3 py-2 bg-gh-subtle/90 border-b border-gh-border rounded-t-lg flex items-center justify-between cursor-grab active:cursor-grabbing hover:bg-gh-subtle transition ${
                    isDragging ? 'bg-gh-subtle' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <GripHorizontal className="w-3.5 h-3.5 text-gh-muted/60" />
                    <Database className={`w-3.5 h-3.5 ${isTableActive ? 'text-gh-purple' : 'text-gh-muted'}`} />
                    <span className="font-mono font-semibold text-xs text-gh-text">{tbl.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gh-bg border border-gh-border text-gh-muted">
                    {tbl.rows.length}r
                  </span>
                </div>

                {/* Columns */}
                <div className="divide-y divide-gh-border/40 text-xs">
                  {tbl.columns.map((col) => (
                    <div
                      key={col.name}
                      className="px-3 py-1.5 flex items-center justify-between hover:bg-gh-subtle/40 transition"
                    >
                      <div className="flex items-center space-x-1.5">
                        {col.isPrimary ? (
                          <span title="Primary Key" className="flex items-center text-gh-yellow font-mono text-[9px] bg-gh-yellow/10 px-1 py-0.2 rounded border border-gh-yellow/30">
                            <Key className="w-2.5 h-2.5 mr-0.5" /> PK
                          </span>
                        ) : col.isForeign ? (
                          <span title={`Khóa ngoại trỏ đến ${col.foreignKeyTarget?.table}.${col.foreignKeyTarget?.column}`} className="flex items-center text-gh-purple font-mono text-[9px] bg-gh-purple/10 px-1 py-0.2 rounded border border-gh-purple/30">
                            <Link2 className="w-2.5 h-2.5 mr-0.5" /> FK
                          </span>
                        ) : (
                          <span className="w-2" />
                        )}
                        <span className="font-mono text-gh-text font-medium text-[11px]">{col.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gh-muted/80">{col.type}</span>
                    </div>
                  ))}
                </div>

                {/* Rows data preview (Data Flow mode) */}
                {viewMode === 'flow' && tbl.rows.length > 0 && (
                  <div className="border-t border-gh-border bg-gh-bg/50 rounded-b-lg overflow-x-auto max-h-36 scrollbar-thin">
                    <table className="w-full text-left border-collapse text-[10px] font-mono">
                      <thead>
                        <tr className="bg-gh-subtle/40 text-gh-muted border-b border-gh-border">
                          {tbl.columns.map((c) => (
                            <th key={c.name} className="px-2 py-1 font-medium">{c.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gh-border/20">
                        {tbl.rows.map((row, rIdx) => {
                          const rowStatus = currentStep?.activeRows?.find(
                            (ar) => ar.table.toLowerCase() === key && ar.rowIdx === rIdx
                          )?.status;

                          let rowClass = 'table-row-item transition-all duration-200 ';
                          if (rowStatus === 'matched') {
                            rowClass += 'row-matched bg-gh-green/20 text-gh-green font-semibold';
                          } else if (rowStatus === 'filtered_out') {
                            rowClass += 'row-filtered-out text-gh-muted/40 line-through bg-gh-red/5';
                          } else if (rowStatus === 'active') {
                            rowClass += 'bg-gh-blue/20 text-gh-blue font-medium';
                          }

                          return (
                            <tr key={rIdx} className={rowClass}>
                              {tbl.columns.map((c) => (
                                <td key={c.name} className="px-2 py-1 truncate max-w-[90px]">
                                  {String(row[c.name] ?? 'NULL')}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}

          {/* Interim Result Projection Card */}
          {currentStep?.interimData && (
            <div
              style={{
                position: 'absolute',
                left: '50px',
                top: `${Math.max(...Object.values(positions).map((p) => p.y)) + 300}px`,
                maxWidth: '650px',
              }}
              className="p-3.5 rounded-lg bg-gh-surface border border-gh-border shadow-lg z-10"
            >
              <div className="flex items-center space-x-2 text-xs font-semibold text-gh-text mb-2">
                <ArrowRight className="w-3.5 h-3.5 text-gh-blue" />
                <span>Dữ liệu bước xử lý ({currentStep.phase})</span>
              </div>
              <div className="overflow-x-auto border border-gh-border rounded bg-gh-bg max-h-36 scrollbar-thin">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead className="bg-gh-subtle text-gh-muted border-b border-gh-border">
                    <tr>
                      {currentStep.interimData.headers.map((h, i) => (
                        <th key={i} className="px-2.5 py-1">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gh-border/20">
                    {currentStep.interimData.rows.map((r, i) => (
                      <tr key={i} className="hover:bg-gh-subtle/30">
                        {r.map((cell, j) => (
                          <td key={j} className="px-2.5 py-1">{String(cell ?? 'NULL')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


