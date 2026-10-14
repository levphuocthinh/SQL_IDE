import React, { useState } from 'react';
import { Play, ArrowRight } from 'lucide-react';

interface DemoQuery {
  title: string;
  tag: string;
  sql: string;
  headers: string[];
  rows: string[][];
  time: string;
}

interface LiveQueryShowcaseProps {
  onOpenSql: () => void;
}

const DEMO_QUERIES: DemoQuery[] = [
  {
    title: 'Nhân Viên & Lương Theo Phòng Ban',
    tag: 'JOIN 2 BẢNG',
    sql: `SELECT nv.HOTEN, pb.TENPB, nv.CHUCVU, nv.LUONG\nFROM NHANVIEN nv\nJOIN PHONGBAN pb ON nv.MAPB = pb.MAPB\nWHERE nv.LUONG >= 18000000\nORDER BY nv.LUONG DESC;`,
    headers: ['HOTEN', 'TENPB', 'CHUCVU', 'LUONG'],
    rows: [
      ['Nguyễn Văn An', 'Phòng Kỹ Thuật (IT)', 'Trưởng phòng IT', '28.000.000 đ'],
      ['Phạm Quốc Bảo', 'Phòng Kinh Doanh', 'Trưởng phòng Kinh Doanh', '25.000.000 đ'],
      ['Đỗ Minh Trí', 'Phòng Kế Toán', 'Trưởng phòng Kế Toán', '22.000.000 đ'],
      ['Trần Thị Mai', 'Phòng Kỹ Thuật (IT)', 'Lập trình viên Backend', '18.000.000 đ'],
    ],
    time: '0.4ms',
  },
  {
    title: 'Thống Kê Dự Án & Số Giờ Phân Công',
    tag: 'JOIN 3 BẢNG',
    sql: `SELECT da.TENDA, nv.HOTEN, pc.VAITRO, pc.SOGIO\nFROM PHANCONG pc\nJOIN NHANVIEN nv ON pc.MANV = nv.MANV\nJOIN DUAN da ON pc.MADA = da.MADA\nORDER BY pc.SOGIO DESC\nLIMIT 4;`,
    headers: ['TENDA', 'HOTEN', 'VAITRO', 'SOGIO'],
    rows: [
      ['Xây dựng Website E-Commerce', 'Trần Thị Mai', 'Lập trình viên Backend', '160 giờ'],
      ['Ứng dụng Di động SQLFlow Mobile', 'Trần Thị Mai', 'Lập trình viên API', '150 giờ'],
      ['Xây dựng Website E-Commerce', 'Lê Hoàng Nam', 'Lập trình viên Frontend', '140 giờ'],
      ['Xây dựng Website E-Commerce', 'Nguyễn Văn An', 'Quản lý dự án', '120 giờ'],
    ],
    time: '0.7ms',
  },
  {
    title: 'Tổng Quỹ Lương & Nhân Lực Từng Phòng',
    tag: 'GROUP BY & SUM',
    sql: `SELECT pb.TENPB, COUNT(nv.MANV) AS SO_NV, SUM(nv.LUONG) AS TONG_LUONG\nFROM PHONGBAN pb\nJOIN NHANVIEN nv ON pb.MAPB = nv.MAPB\nGROUP BY pb.TENPB\nORDER BY TONG_LUONG DESC;`,
    headers: ['TENPB', 'SO_NV', 'TONG_LUONG'],
    rows: [
      ['Phòng Kỹ Thuật (IT)', '4 nhân sự', '74.000.000 đ'],
      ['Phòng Kinh Doanh', '2 nhân sự', '38.000.000 đ'],
      ['Phòng Kế Toán', '1 nhân sự', '22.000.000 đ'],
      ['Phòng Nhân Sự', '1 nhân sự', '14.000.000 đ'],
    ],
    time: '0.5ms',
  },
];

/**
 * Khung thực hành SQL tương tác trực tiếp ngay trên trang chủ (Live Query Showcase)
 * Cho phép người dùng chuyển đổi các câu lệnh mẫu, chạy thử và xem trước kết quả
 */
export const LiveQueryShowcase: React.FC<LiveQueryShowcaseProps> = ({ onOpenSql }) => {
  const [activeQueryIndex, setActiveQueryIndex] = useState<number>(0);
  const [isRunningQuery, setIsRunningQuery] = useState<boolean>(false);

  const currentDemo = DEMO_QUERIES[activeQueryIndex];

  const handleRunDemo = () => {
    setIsRunningQuery(true);
    setTimeout(() => {
      setIsRunningQuery(false);
    }, 280);
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(2,132,199,0.08)] overflow-hidden font-sans">
      {/* macOS Window Chrome Header */}
      <div className="h-12 px-4 bg-slate-900 text-white flex items-center justify-between border-b border-white/10 select-none">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="text-xs font-mono text-slate-400 pl-2">sqlflow-sandbox.sql</span>
        </div>

        {/* Preset Query Tabs */}
        <div className="flex items-center space-x-1 bg-white/10 p-1 rounded-xl">
          {DEMO_QUERIES.map((q, idx) => (
            <button
              key={q.title}
              onClick={() => setActiveQueryIndex(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeQueryIndex === idx ? 'bg-[#0284C7] text-white shadow-xs font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              {q.tag}
            </button>
          ))}
        </div>

        {/* Run Button */}
        <button
          onClick={handleRunDemo}
          disabled={isRunningQuery}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95 shadow-xs cursor-pointer"
        >
          <Play className={`w-3.5 h-3.5 fill-white ${isRunningQuery ? 'animate-spin' : ''}`} />
          <span>{isRunningQuery ? 'Đang chạy...' : 'Chạy thử'}</span>
        </button>
      </div>

      {/* Code Editor Preview Box */}
      <div className="bg-[#1E1E24] p-4 text-[#E2E8F0] font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[140px] flex items-center">
        <pre className="text-slate-200">{currentDemo.sql}</pre>
      </div>

      {/* Results Console Section */}
      <div className="border-t border-slate-200 bg-slate-50/80 p-4">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800">Kết quả truy vấn ({currentDemo.time})</span>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            {currentDemo.rows.length} dòng dữ liệu được trả về
          </div>
        </div>

        {/* Result Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
          {currentDemo.rows.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono space-y-1">
              <p className="font-semibold text-slate-700">0 dòng dữ liệu • Bảng hiện đang trống trơn</p>
              <p className="text-[11px] text-slate-400">Sẵn sàng để bạn viết câu lệnh INSERT hoặc import dữ liệu thực hành tự do</p>
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/90 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  {currentDemo.headers.map((h) => (
                    <th key={h} className="px-4 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentDemo.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-blue-50/50 transition-colors">
                    {row.map((val, cIdx) => (
                      <td key={cIdx} className="px-4 py-2 font-mono text-slate-800 font-medium">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Card Footer Action */}
        <div className="mt-3.5 flex items-center justify-between text-xs text-slate-600 pt-1">
          <span>💡 Viết câu lệnh riêng & truy vấn không giới hạn?</span>
          <button
            onClick={onOpenSql}
            className="text-[#0284C7] font-bold hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Mở SQL Playground</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
