import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface LessonHintCardProps {
  hint?: string;
  solutionSql?: string;
  onLoadSolution: (sql: string) => void;
}

/**
 * Thẻ hiển thị gợi ý bài tập và đáp án mẫu (Solutions)
 * Có thể gập/mở để xem đáp án tham khảo và nạp nhanh vào trình soạn thảo SQL
 */
export const LessonHintCard: React.FC<LessonHintCardProps> = ({
  hint,
  solutionSql,
  onLoadSolution,
}) => {
  const [showHintDetail, setShowHintDetail] = useState<boolean>(false);

  const defaultHint = 'Dùng GROUP BY để gom dữ liệu theo cột chỉ định. Các điều kiện lọc sau khi tổng hợp phải đặt trong mệnh đề HAVING.';
  const defaultSolution = `SELECT dept_id, COUNT(*) AS total, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY dept_id\nHAVING COUNT(*) > 3 AND AVG(salary) > 1500;`;

  const finalSolution = solutionSql || defaultSolution;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <h4 className="font-bold text-slate-900 text-xs">Gợi ý & Hướng dẫn giải</h4>
        </div>

        <button
          onClick={() => setShowHintDetail(!showHintDetail)}
          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
        >
          {showHintDetail ? 'Ẩn đáp án' : 'Xem đáp án mẫu'}
        </button>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        {hint || defaultHint}
      </p>

      {showHintDetail && (
        <div className="mt-3 p-4 rounded-xl bg-[#0E131F] text-slate-200 font-mono text-xs border border-slate-800 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>-- Đáp án mẫu tham khảo:</span>
            <button
              onClick={() => onLoadSolution(finalSolution)}
              className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
            >
              Nạp vào Editor
            </button>
          </div>
          <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap">
            {finalSolution}
          </pre>
        </div>
      )}
    </div>
  );
};
