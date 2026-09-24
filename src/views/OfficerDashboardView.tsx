import React, { useState } from 'react';
import { LandDocument, User } from '../types';
import {
  FileText,
  Upload,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  GitBranch,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { formatTimestamp } from '../utils/crypto';

interface OfficerDashboardViewProps {
  currentUser: User;
  documents: LandDocument[];
  stats: {
    totalDocuments: number;
    verified: number;
    pendingReview: number;
    completed: number;
    clearCount: number;
    reviewCount: number;
    holdCount: number;
  };
  onNavigate: (view: string, docId?: string) => void;
  onOpenDemo: (scenarioKey?: 'CLEAR' | 'HOLD') => void;
}

export const OfficerDashboardView: React.FC<OfficerDashboardViewProps> = ({
  currentUser,
  documents,
  stats,
  onNavigate,
  onOpenDemo,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [routingFilter, setRoutingFilter] = useState<string>('ALL');

  const filteredDocs = documents.filter((doc) => {
    if (routingFilter !== 'ALL' && doc.trustScore.routing !== routingFilter) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const survey = doc.extractedFields.find(f => f.fieldKey === 'survey_number')?.fieldValue || '';
    const village = doc.extractedFields.find(f => f.fieldKey === 'village')?.fieldValue || '';
    const owner = doc.extractedFields.find(f => f.fieldKey === 'owner_name')?.fieldValue || doc.ownerName;

    return (
      doc.id.toLowerCase().includes(q) ||
      doc.fileName.toLowerCase().includes(q) ||
      survey.toLowerCase().includes(q) ||
      village.toLowerCase().includes(q) ||
      owner.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* SIH Judge Journey Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-blue-800/60">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIH 2026 Judge Demo Flow</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Test AI-Assisted Land Record Invariant Validation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience the complete 9-stage pipeline. Witness the system flag an area conservation mismatch (2.40 Acre parent vs 2.65 Acre subdivided children) and route to HOLD for officer review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onOpenDemo('HOLD')}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>Launch HOLD Scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenDemo('CLEAR')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>Launch CLEAR Scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row (Strictly from live database, no hardcoded values!) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Records
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {stats.totalDocuments}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">In Revenue Database</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Pending Review
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums">
            {stats.pendingReview}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Awaiting Tehsildar Action</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Clear (80-100)
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums">
            {stats.clearCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Internally Consistent</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Review (50-79)
          </div>
          <div className="text-2xl font-extrabold text-amber-500 mt-1 tabular-nums">
            {stats.reviewCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Chronology / OCR check</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Hold (&lt;50)
          </div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1 tabular-nums">
            {stats.holdCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Statutory Mismatch</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Verified Sealed
          </div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1 tabular-nums">
            {stats.verified}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Hash-Chained & Certified</div>
        </div>
      </div>

      {/* Action Bar & Quick Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('officer-upload')}
            className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Land Record</span>
          </button>
          <button
            onClick={() => onNavigate('officer-parcel', 'parcel-45-2')}
            className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <GitBranch className="w-3.5 h-3.5 text-blue-600" />
            <span>Inspect Parcel Lineage</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search survey no, village, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-56"
            />
          </div>

          <select
            value={routingFilter}
            onChange={(e) => setRoutingFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="ALL">All Routing States</option>
            <option value="CLEAR">CLEAR Only</option>
            <option value="REVIEW">REVIEW Only</option>
            <option value="HOLD">HOLD Only</option>
          </select>
        </div>
      </div>

      {/* Main Document Queue Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Assigned Land Records & Processing Queue
            </h3>
            <p className="text-[11px] text-slate-400">
              {filteredDocs.length} record{filteredDocs.length === 1 ? '' : 's'} found
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Jurisdiction: Haveli & Kalwan Taluka
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Document ID & Type</th>
                <th className="px-4 py-3">Survey / Gat No</th>
                <th className="px-4 py-3">Landholder</th>
                <th className="px-4 py-3">Village & Dist</th>
                <th className="px-4 py-3">Area Claimed</th>
                <th className="px-4 py-3">Trust Score</th>
                <th className="px-4 py-3">Validation Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDocs.map((doc) => {
                const survey = doc.extractedFields.find(f => f.fieldKey === 'survey_number')?.fieldValue || 'N/A';
                const owner = doc.extractedFields.find(f => f.fieldKey === 'owner_name')?.fieldValue || doc.ownerName;
                const village = doc.extractedFields.find(f => f.fieldKey === 'village')?.fieldValue || 'Pune';
                const area = doc.extractedFields.find(f => f.fieldKey === 'area')?.fieldValue || '0';
                const unit = doc.extractedFields.find(f => f.fieldKey === 'area')?.unit || 'Acre';

                const routing = doc.trustScore.routing;
                let routingBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                if (routing === 'HOLD') routingBadgeClass = 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
                if (routing === 'REVIEW') routingBadgeClass = 'bg-amber-50 text-amber-800 border-amber-200';

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-mono text-[11px] font-bold text-blue-700">
                        {doc.id}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                        {doc.fileName}
                      </div>
                      {doc.isDemo && (
                        <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          SIH DEMO
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      Gat {survey}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{owner}</div>
                      <div className="text-[10px] text-slate-400">Class-1 Occupant</div>
                    </td>

                    <td className="px-4 py-3">
                      <div>{village}</div>
                      <div className="text-[10px] text-slate-400">Pune / Nashik</div>
                    </td>

                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                      {area} {unit}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900 tabular-nums">
                          {doc.trustScore.overallScore}
                        </span>
                        <span className="text-[10px] text-slate-400">/100</span>
                      </div>
                      <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] border ${routingBadgeClass}`}>
                        {routing}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {doc.status === 'VERIFIED' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          <span>VERIFIED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Stage 0{doc.processingStage}</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onNavigate('officer-processing', doc.id)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
                          title="View 9-Stage Pipeline"
                        >
                          Pipeline
                        </button>
                        <button
                          onClick={() => onNavigate('officer-review', doc.id)}
                          className="px-2.5 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium text-[11px] transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => onNavigate('officer-reports', doc.id)}
                          className="px-2 py-1 rounded border border-slate-300 hover:bg-slate-50 text-slate-600 font-medium text-[11px] transition-colors cursor-pointer"
                          title="Validation Report"
                        >
                          Report
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                    No land records match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
