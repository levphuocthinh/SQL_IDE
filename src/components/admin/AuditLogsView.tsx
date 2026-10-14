import React, { useState } from 'react';
import { 
  Search,
  Filter 
} from 'lucide-react';
import { AuditLogItem } from '../../types/platform';

interface AuditLogsViewProps {
  logs: AuditLogItem[];
}

export const AuditLogsViewComponent: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'warning' | 'danger'>('all');

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.actorName.toLowerCase().includes(search.toLowerCase()) ||
                          l.action.toLowerCase().includes(search.toLowerCase()) ||
                          l.target.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Nhật ký Hệ thống (Audit Logs)
          </h1>
          <p className="text-sm text-[#86868B] font-normal">
            Ghi nhận toàn bộ thao tác bảo mật, phân quyền và can thiệp tài khoản phục vụ thanh tra.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ghi log trực tiếp (Real-time)</span>
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar - Apple Card */}
      <div className="apple-card bg-white p-4 rounded-3xl border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo người thực hiện, hành động..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="py-2.5 px-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white font-medium text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 transition cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="success">Thành công (Success)</option>
            <option value="warning">Cảnh báo (Warning)</option>
            <option value="danger">Lỗi / Chặn (Danger)</option>
          </select>
        </div>
      </div>

      {/* Logs Table - Apple Numbers Data Grid */}
      <div className="apple-card bg-white rounded-3xl border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F7]/80 border-b border-black/[0.06] text-[#86868B] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Thời gian</th>
                <th className="py-3.5 px-4">Người thực hiện</th>
                <th className="py-3.5 px-4">Vai trò</th>
                <th className="py-3.5 px-4">Hành động</th>
                <th className="py-3.5 px-4">Đối tượng tác động</th>
                <th className="py-3.5 px-3">Địa chỉ IP</th>
                <th className="py-3.5 px-5 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] font-medium text-[#1D1D1F]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#86868B] italic">
                    Không có nhật ký nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-black/[0.015] transition">
                    <td className="py-3.5 px-5 font-mono text-[11px] text-[#86868B] whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#1D1D1F] whitespace-nowrap">
                      {log.actorName}
                    </td>

                    <td className="py-3.5 px-4 text-[#86868B]">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/[0.04] text-[#1D1D1F] text-[10px] font-semibold border border-black/[0.04]">
                        {log.actorRole}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#0071E3]">
                      {log.action}
                    </td>

                    <td className="py-3.5 px-4 text-[#1D1D1F] truncate max-w-xs font-mono text-[11px]">
                      {log.target}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-[#86868B] text-[11px]">
                      {log.ip}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        log.status === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                        log.status === 'warning' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      }`}>
                        {log.status === 'success' ? 'Thành công' : log.status === 'warning' ? 'Cảnh báo' : 'Thất bại'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AuditLogsView = React.memo(AuditLogsViewComponent);
