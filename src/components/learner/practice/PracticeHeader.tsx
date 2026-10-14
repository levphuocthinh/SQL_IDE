import React from 'react';
import { Lesson } from '../../../types/lesson';
import { 
  Database, 
  ChevronDown, 
  Columns2, 
  Rows2, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

interface PracticeHeaderProps {
  isStandalone: boolean;
  currentLesson: Lesson;
  selectedLessonIndex: number;
  allCurriculumLessons: Lesson[];
  onSelectLesson: (idx: number) => void;
  layoutMode: 'split' | 'stack' | 'fullscreen';
  onChangeLayoutMode: (mode: 'split' | 'stack' | 'fullscreen') => void;
  onOpenSchemaModal: () => void;
  onQuickQuerySelect?: (sql: string) => void;
}

/**
 * Thanh tiêu đề Apple Glass của trang Thực hành / SQL Playground
 * Hiển thị thông tin bài tập hoặc chế độ DB CTY, thanh công cụ chuyển đổi bố cục chia đôi/xếp chồng/toàn màn hình và nút mở lược đồ ERD.
 */
export const PracticeHeader: React.FC<PracticeHeaderProps> = ({
  isStandalone,
  currentLesson,
  selectedLessonIndex,
  allCurriculumLessons,
  onSelectLesson,
  layoutMode,
  onChangeLayoutMode,
  onOpenSchemaModal,
  onQuickQuerySelect,
}) => {
  const isFullScreen = layoutMode === 'fullscreen';

  return (
    <div className="apple-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
      {/* 1. Bên trái: Tiêu đề & Chọn bài hoặc Pills DB CTY */}
      {isStandalone ? (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Cơ Sở Dữ Liệu Công Ty (DB CTY)</span>
            </span>

            <span className="text-xs text-slate-500 font-medium">
              4 bảng quan hệ PK & FK sẵn sàng thực hành
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-[#1D1D1F] tracking-tight flex items-center space-x-2">
            <span>SQL Playground</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">Tự do truy vấn</span>
          </h1>

          {/* Quick table pills with click to preview */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-medium">Bảng CSDL:</span>
            <button
              onClick={() => onQuickQuerySelect?.('SELECT * FROM PHONGBAN;')}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-[#0071E3] font-mono text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95 cursor-pointer shadow-2xs"
              title="Bấm để tải câu lệnh xem bảng PHONGBAN"
            >
              <span className="font-bold">PHONGBAN</span>
              <span className="text-[10px] bg-blue-200/70 text-blue-900 px-1.5 rounded-full font-sans font-semibold">4 phòng • PK</span>
            </button>

            <button
              onClick={() => onQuickQuerySelect?.('SELECT * FROM NHANVIEN;')}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-[#0071E3] font-mono text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95 cursor-pointer shadow-2xs"
              title="Bấm để tải câu lệnh xem bảng NHANVIEN"
            >
              <span className="font-bold">NHANVIEN</span>
              <span className="text-[10px] bg-blue-200/70 text-blue-900 px-1.5 rounded-full font-sans font-semibold">8 nhân sự • FK</span>
            </button>

            <button
              onClick={() => onQuickQuerySelect?.('SELECT * FROM DUAN;')}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-[#0071E3] font-mono text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95 cursor-pointer shadow-2xs"
              title="Bấm để tải câu lệnh xem bảng DUAN"
            >
              <span className="font-bold">DUAN</span>
              <span className="text-[10px] bg-blue-200/70 text-blue-900 px-1.5 rounded-full font-sans font-semibold">4 dự án • FK</span>
            </button>

            <button
              onClick={() => onQuickQuerySelect?.('SELECT * FROM PHANCONG;')}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-[#0071E3] font-mono text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95 cursor-pointer shadow-2xs"
              title="Bấm để tải câu lệnh xem bảng PHANCONG"
            >
              <span className="font-bold">PHANCONG</span>
              <span className="text-[10px] bg-blue-200/70 text-blue-900 px-1.5 rounded-full font-sans font-semibold">8 phân công • FK</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#0071E3] bg-blue-500/10 px-3 py-0.5 rounded-full border border-blue-500/20">
              {currentLesson.chapterTitle?.split(':')[0] || 'Bài tập SQL'}
            </span>

            {/* Lesson Selector */}
            <div className="relative">
              <select
                value={selectedLessonIndex}
                onChange={(e) => onSelectLesson(Number(e.target.value))}
                className="text-xs text-[#1D1D1F] bg-slate-100/80 hover:bg-slate-100 border border-black/[0.08] rounded-full pl-3 pr-7 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer appearance-none shadow-sm transition"
              >
                {allCurriculumLessons.map((l, i) => (
                  <option key={l.id} value={i}>
                    {l.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#86868B] absolute right-2.5 top-2 pointer-events-none" />
            </div>

            <span className="text-xs text-[#86868B] font-medium ml-1">
              Độ khó: <span className="text-[#FF9500] font-semibold">Trung bình</span>
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-[#1D1D1F] tracking-tight">
            {currentLesson.title}
          </h1>
          <p className="text-xs md:text-sm text-[#86868B]">
            {currentLesson.summary || currentLesson.exercise?.prompt || 'Viết truy vấn SQL hoàn thành yêu cầu đề bài bên dưới.'}
          </p>
        </div>
      )}

      {/* 2. Bên phải: Chuyển đổi Layout Mode & Nút Schema ERD */}
      <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
        {/* Apple Segmented Control */}
        <div className="apple-segmented text-xs">
          <button
            onClick={() => onChangeLayoutMode('split')}
            title="Chia 2 cột (Editor trái - Kết quả phải)"
            className={`px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
              layoutMode === 'split' ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5 text-[#0071E3]" />
            <span className="hidden sm:inline text-[11px]">Chia đôi</span>
          </button>

          <button
            onClick={() => onChangeLayoutMode('stack')}
            title="Xếp chồng (Editor rộng 100% bên trên, Kết quả bên dưới)"
            className={`px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
              layoutMode === 'stack' ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            <Rows2 className="w-3.5 h-3.5 text-[#AF52DE]" />
            <span className="hidden sm:inline text-[11px]">Xếp chồng</span>
          </button>

          <button
            onClick={() => onChangeLayoutMode(layoutMode === 'fullscreen' ? 'split' : 'fullscreen')}
            title={isFullScreen ? 'Thu nhỏ giao diện' : 'Toàn màn hình IDE'}
            className={`px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
              layoutMode === 'fullscreen' ? 'bg-[#0071E3] text-white shadow-sm' : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">{isFullScreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
          </button>
        </div>

        {/* Nút xem lược đồ ERD */}
        <button
          onClick={onOpenSchemaModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-black/[0.08] text-[#1D1D1F] font-semibold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Database className="w-4 h-4 text-[#0071E3]" />
          <span>Xem Schema (ERD)</span>
        </button>
      </div>
    </div>
  );
};
