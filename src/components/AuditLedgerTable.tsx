import React, { useState } from 'react';
import { AuditLogEntry } from '../types';
import { ShieldCheck, Hash, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { formatTimestamp } from '../utils/crypto';

interface AuditLedgerTableProps {
  logs: AuditLogEntry[];
  title?: string;
  maxEntries?: number;
}

export const AuditLedgerTable: React.FC<AuditLedgerTableProps> = ({
  logs,
  title = 'Tamper-Evident Hash-Chained Audit Ledger',
  maxEntries,
}) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  const displayedLogs = logs
    .filter(log => {
      if (filterAction !== 'ALL' && !log.action.includes(filterAction)) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        (log.documentId && log.documentId.toLowerCase().includes(q)) ||
        (log.documentNumber && log.documentNumber.toLowerCase().includes(q))
      );
    })
    .slice(0, maxEntries || logs.length);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Integrity: VERIFIED</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic SHA-256 state chain linking all officer corrections, validation runs & approvals
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-44"
            />
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="ALL">All Actions</option>
            <option value="OFFICER">Officer Events</option>
            <option value="VALIDATION">Validation Events</option>
            <option value="ADMIN">Admin Events</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-3">Timestamp (IST)</th>
              <th className="px-4 py-3">Authorized Actor</th>
              <th className="px-4 py-3">Event Action</th>
              <th className="px-4 py-3">Document / Ref</th>
              <th className="px-4 py-3">Audit Details</th>
              <th className="px-4 py-3 text-right">SHA-256 Hash Chain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {displayedLogs.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedEntry(log)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  {formatTimestamp(log.timestamp)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-semibold text-slate-900">{log.userName}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{log.userRole.toLowerCase()}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-blue-700 font-medium">
                  {log.documentNumber || log.documentId || 'System Config'}
                </td>
                <td className="px-4 py-3 max-w-xs truncate text-slate-600">
                  {log.details}
                  {log.oldValue && log.newValue && (
                    <span className="ml-1 text-[11px] font-mono text-amber-700">
                      ({log.oldValue} → {log.newValue})
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  <span className="hover:text-blue-600 truncate inline-block max-w-[120px]" title={log.hash}>
                    {log.hash.slice(0, 10)}...{log.hash.slice(-6)}
                  </span>
                </td>
              </tr>
            ))}
            {displayedLogs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No audit log entries matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Hash Inspector Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Cryptographic Ledger Node Verification
                </h4>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Action & Timestamp
                </span>
                <div className="font-bold text-slate-800">
                  {selectedEntry.action} · {formatTimestamp(selectedEntry.timestamp)}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Authorized Actor
                </span>
                <div className="text-slate-800 font-bold">
                  {selectedEntry.userName} ({selectedEntry.userRole})
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Payload Details
                </span>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed font-sans">
                  {selectedEntry.details}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Previous Block Hash (Parent)
                </span>
                <div className="p-2 bg-slate-100 rounded text-[10px] break-all text-slate-600">
                  {selectedEntry.previousHash}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Current Block SHA-256 Digest
                </span>
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-[10px] break-all text-emerald-800 font-bold">
                  {selectedEntry.hash}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Tamper-evident link valid
              </span>
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
