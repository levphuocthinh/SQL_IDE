import React, { useState } from 'react';
import { TableSchema, Relationship } from '../../types/sql';
import { Visualizer } from '../Visualizer';
import { Database, X } from 'lucide-react';
import { ModalPortal } from './ModalPortal';

interface SchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: TableSchema[];
  relationships: Relationship[];
}

export const SchemaModal: React.FC<SchemaModalProps> = ({
  isOpen,
  onClose,
  tables,
  relationships,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'erd' | 'tables'>('erd');
  const [selectedTable, setSelectedTable] = useState<string>(tables[0]?.name || '');

  const curTable = tables.find(t => t.name.toLowerCase() === selectedTable.toLowerCase()) || tables[0];

  return (
    <ModalPortal>
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-in fade-in duration-200"
      >
      <div className="bg-[#121316] rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-[0_24px_70px_rgba(0,0,0,0.4)] border border-white/[0.08] overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-200">
        {/* macOS Window Chrome Header */}
        <div className="px-5 py-3.5 bg-[#1A1C20] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            {/* macOS Traffic Lights */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition" 
                title="Đóng"
              />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            </div>

            <div className="h-4 w-px bg-white/10" />

            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#0071E3]/20 text-[#64D2FF] border border-[#0071E3]/30 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm tracking-tight">Lược đồ Cơ sở Dữ liệu (Schema & ERD)</h3>
                <p className="text-[11px] text-white/50">
                  {tables.length} bảng dữ liệu · {relationships.length} quan hệ khóa ngoại (Foreign Keys)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Apple Segmented Control */}
            <div className="apple-segmented p-1 rounded-full flex text-xs font-semibold bg-white/10">
              <button
                onClick={() => setActiveTab('erd')}
                className={`px-4 py-1 rounded-full transition text-xs ${
                  activeTab === 'erd' ? 'bg-[#0071E3] text-white font-semibold shadow-sm' : 'text-white/60 hover:text-white'
                }`}
              >
                Sơ đồ ERD
              </button>
              <button
                onClick={() => setActiveTab('tables')}
                className={`px-4 py-1 rounded-full transition text-xs ${
                  activeTab === 'tables' ? 'bg-[#0071E3] text-white font-semibold shadow-sm' : 'text-white/60 hover:text-white'
                }`}
              >
                Danh sách Bảng
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'erd' ? (
            /* Interactive ERD Visualizer */
            <div className="w-full h-full">
              <Visualizer
                tables={tables}
                relationships={relationships}
                allSteps={[]}
                stepIndex={0}
                onStepChange={() => {}}
                isPlaying={false}
                onTogglePlay={() => {}}
                isFullscreen={true}
                onToggleFullscreen={onClose}
                showAllTables={true}
              />
            </div>
          ) : (
            /* Schema Tables View */
            <div className="h-full flex divide-x divide-slate-800 overflow-hidden text-xs">
              {/* Left: Table List */}
              <div className="w-64 bg-[#161b22] p-4 overflow-y-auto space-y-1.5 flex-shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2 mb-2">
                  Tất cả các bảng ({tables.length})
                </span>
                {tables.length === 0 ? (
                  <div className="px-2 py-4 text-slate-500 text-xs text-center italic">
                    Chưa có bảng nào
                  </div>
                ) : (
                  tables.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setSelectedTable(t.name)}
                      className={`w-full p-2.5 rounded-xl font-mono text-left transition flex items-center justify-between ${
                        curTable?.name.toLowerCase() === t.name.toLowerCase()
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{t.name}</span>
                      <span className="text-[10px] opacity-75">{t.columns.length} cols</span>
                    </button>
                  ))
                )}
              </div>

              {/* Right: Table Structure & Sample Rows */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {tables.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-3">
                      <Database className="w-7 h-7 text-slate-500" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">Cơ sở dữ liệu đang trống</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Chưa có bảng nào được tạo trong cơ sở dữ liệu. Bạn có thể sử dụng câu lệnh CREATE TABLE để tạo bảng mới.
                    </p>
                  </div>
                ) : curTable && (
                  <>
                    <div>
                      <h4 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                        <span>{curTable.name}</span>
                        <span className="text-xs font-normal text-slate-400">({curTable.rows.length} dòng dữ liệu mẫu)</span>
                      </h4>
                    </div>

                    {/* Columns Table */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cấu trúc các cột</span>
                      <div className="border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left font-mono text-xs">
                          <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
                            <tr>
                              <th className="p-2.5">Cột</th>
                              <th className="p-2.5">Kiểu dữ liệu</th>
                              <th className="p-2.5">Khóa</th>
                              <th className="p-2.5">Tham chiếu (FK Target)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {curTable.columns.map((c) => (
                              <tr key={c.name} className="hover:bg-slate-800/40">
                                <td className="p-2.5 font-bold text-indigo-400">{c.name}</td>
                                <td className="p-2.5 text-slate-400">{c.type}</td>
                                <td className="p-2.5">
                                  {c.isPrimary ? (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                      PK
                                    </span>
                                  ) : c.isForeign ? (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                      FK
                                    </span>
                                  ) : (
                                    '-'
                                  )}
                                </td>
                                <td className="p-2.5 text-slate-400">
                                  {c.foreignKeyTarget ? `${c.foreignKeyTarget.table}.${c.foreignKeyTarget.column}` : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Sample Data Rows */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dữ liệu mẫu (Sample Rows)</span>
                      <div className="border border-slate-800 rounded-xl overflow-x-auto">
                        <table className="w-full text-left font-mono text-xs">
                          <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
                            <tr>
                              {curTable.columns.map((c) => (
                                <th key={c.name} className="p-2.5 whitespace-nowrap">{c.name}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 text-slate-300">
                            {curTable.rows.map((r, i) => (
                              <tr key={i} className="hover:bg-slate-800/40">
                                {curTable.columns.map((c) => (
                                  <td key={c.name} className="p-2.5 whitespace-nowrap">
                                    {r[c.name] === null ? <span className="text-slate-500 italic">NULL</span> : String(r[c.name])}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </ModalPortal>
  );
};
