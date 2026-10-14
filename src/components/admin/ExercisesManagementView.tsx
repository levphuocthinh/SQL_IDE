import React, { useState } from 'react';
import { 
  Plus,
  Search,
  X 
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';
import { chaptersData } from '../../roadmap/lessonsData';

export const ExercisesManagementViewComponent: React.FC = () => {
  const initialExercises = chaptersData.flatMap((c, cIdx) => 
    c.lessons.map((l, lIdx) => ({
      id: l.id,
      code: `Bài ${cIdx + 1}.${lIdx + 1}`,
      title: l.title,
      prompt: l.exercise.prompt,
      solutionQuery: l.solutionSql || l.initialSql,
      engine: 'PostgreSQL',
      difficulty: cIdx === 0 ? 'Dễ' : cIdx === 1 ? 'Trung bình' : 'Nâng cao',
      points: (cIdx + 1) * 50,
      hint: l.hint,
    }))
  );

  const [exercises, setExercises] = useState(initialExercises);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // New exercise form
  const [newTitle, setNewTitle] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newHint, setNewHint] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('Trung bình');
  const [newPoints, setNewPoints] = useState('100');

  const filtered = exercises.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setExercises([
      ...exercises,
      {
        id: `ex-${Date.now()}`,
        code: `Bài 3.${exercises.length + 1}`,
        title: newTitle.trim(),
        prompt: newPrompt.trim() || 'Thực hiện truy vấn theo yêu cầu.',
        solutionQuery: newSolution.trim() || 'SELECT * FROM employees;',
        engine: 'PostgreSQL',
        difficulty: newDifficulty,
        points: Number(newPoints) || 100,
        hint: newHint.trim() || 'Xem lại lý thuyết mệnh đề trong bài.',
      },
    ]);

    setNewTitle('');
    setNewPrompt('');
    setNewSolution('');
    setNewHint('');
    setShowAddModal(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Quản lý Bài tập SQL
          </h1>
          <p className="text-sm text-[#86868B] font-normal">
            Thiết lập đề bài, query đáp án mẫu, kiểm tra logic và điểm thưởng cho học viên.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#0071E3] text-white hover:bg-[#0077ED] transition text-xs font-semibold shadow-sm active:scale-[0.98] self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm bài tập mới</span>
        </button>
      </div>

      {/* Search Bar - Apple Card */}
      <div className="apple-card bg-white p-4 rounded-3xl border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên bài tập hoặc mã bài..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
          />
        </div>
        <span className="text-xs font-semibold text-[#86868B]">
          Tổng số: {filtered.length} bài tập
        </span>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="apple-card p-6 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:border-[#0071E3]/30 transition space-y-3.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-mono text-xs font-semibold border border-[#0071E3]/15">
                  {item.code}
                </span>
                <h3 className="font-bold text-[#1D1D1F] text-sm tracking-tight">{item.title}</h3>
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                  item.difficulty === 'Dễ' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                  item.difficulty === 'Trung bình' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                }`}>
                  {item.difficulty}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 font-mono">
                  +{item.points} Điểm
                </span>
              </div>
            </div>

            {/* Prompt */}
            <p className="text-xs text-[#86868B] leading-relaxed pl-0.5">{item.prompt}</p>

            {/* Solution Preview in macOS Dark Graphite Container */}
            <div className="p-3.5 rounded-2xl bg-[#121316] text-[#64D2FF] font-mono text-xs overflow-x-auto border border-white/5">
              <span className="text-white/40 text-[10px] block mb-1">-- Query Đáp án mẫu:</span>
              <code>{item.solutionQuery}</code>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Exercise (macOS Sheet) */}
      {showAddModal && (
        <ModalPortal>
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddModal(false);
            }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-xl w-full p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] border border-black/[0.08] animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.06]">
              <h3 className="font-bold text-[#1D1D1F] text-base tracking-tight">Tạo Bài tập SQL Mới</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="w-7 h-7 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-[#86868B] hover:text-[#1D1D1F] flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1D1D1F]">Tên bài tập *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lọc nhân viên theo mức lương và ngày tuyển..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1D1D1F]">Đề bài chi tiết *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Yêu cầu học viên viết truy vấn gì, trên bảng nào..."
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium resize-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1D1D1F]">Query Đáp án mẫu (SQL) *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="SELECT dept_name, COUNT(*) FROM departments..."
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#121316] text-[#64D2FF] font-mono focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 resize-none transition leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1D1D1F]">Gợi ý (Hint)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Sử dụng hàm AVG() kết hợp GROUP BY..."
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1D1D1F]">Độ khó</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition cursor-pointer"
                  >
                    <option value="Dễ">Dễ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Nâng cao">Nâng cao</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1D1D1F]">Điểm thưởng (Skill Points)</label>
                  <input
                    type="number"
                    value={newPoints}
                    onChange={(e) => setNewPoints(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#86868B] hover:bg-black/[0.05] transition active:scale-[0.98]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#0071E3] text-white hover:bg-[#0077ED] transition shadow-sm active:scale-[0.98]"
                >
                  Tạo bài tập
                </button>
              </div>
            </form>
          </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};

export const ExercisesManagementView = React.memo(ExercisesManagementViewComponent);
