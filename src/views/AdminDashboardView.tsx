import React, { useState } from 'react';
import { User, LandDocument, AuditLogEntry, SystemThresholds } from '../types';
import { AuditLedgerTable } from '../components/AuditLedgerTable';
import {
  Users,
  ShieldCheck,
  FileText,
  Sliders,
  UserPlus,
  Lock,
  Power,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardViewProps {
  currentUser: User;
  officers: User[];
  documents: LandDocument[];
  auditLogs: AuditLogEntry[];
  thresholds: SystemThresholds;
  stats: {
    totalDocuments: number;
    verified: number;
    pendingReview: number;
    completed: number;
    clearCount: number;
    reviewCount: number;
    holdCount: number;
    activeOfficersCount: number;
    totalAuditEntries: number;
  };
  onCreateOfficer: (officerData: {
    name: string;
    email: string;
    designation: string;
    department: string;
    district: string;
    state: string;
  }) => { success: boolean; error?: string };
  onToggleOfficerStatus: (officerId: string) => void;
  onResetOfficerPassword: (officerId: string) => void;
  onUpdateThresholds: (thresholds: Partial<SystemThresholds>) => void;
  onResetDatabase: () => Promise<void>;
  onNavigate: (view: string, docId?: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  officers,
  documents,
  auditLogs,
  thresholds,
  stats,
  onCreateOfficer,
  onToggleOfficerStatus,
  onResetOfficerPassword,
  onUpdateThresholds,
  onResetDatabase,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'OFFICERS' | 'DOCUMENTS' | 'AUDIT' | 'RULES'>('OVERVIEW');
  const [newOfficerModalOpen, setNewOfficerModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [designation, setDesignation] = useState<string>('Sub-Divisional Revenue Officer');
  const [department, setDepartment] = useState<string>('Department of Revenue & Land Records');
  const [district, setDistrict] = useState<string>('Pune');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Threshold form state
  const [clearScoreMin, setClearScoreMin] = useState<number>(thresholds.clearScoreMin);
  const [reviewScoreMin, setReviewScoreMin] = useState<number>(thresholds.reviewScoreMin);
  const [thresholdSaved, setThresholdSaved] = useState<boolean>(false);

  const handleCreateOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = onCreateOfficer({
      name: name.trim(),
      email: email.trim(),
      designation: designation.trim(),
      department: department.trim(),
      district: district.trim(),
      state: 'Maharashtra',
    });
    if (res.success) {
      setNewOfficerModalOpen(false);
      setName('');
      setEmail('');
    } else {
      setErrorMsg(res.error || 'Failed to create officer profile.');
    }
  };

  const handleSaveThresholds = () => {
    onUpdateThresholds({
      clearScoreMin,
      reviewScoreMin,
      holdScoreMax: reviewScoreMin - 1,
    });
    setThresholdSaved(true);
    setTimeout(() => setThresholdSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-xl p-6 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>State Revenue Commissionerate Administration</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            System Administration & Governance
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Logged in as {currentUser.name} ({currentUser.designation})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNewOfficerModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Officer Account</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'System Overview' },
          { id: 'OFFICERS', label: `Officer Management (${officers.length})` },
          { id: 'DOCUMENTS', label: `All Documents (${documents.length})` },
          { id: 'AUDIT', label: `Tamper-Evident Ledger (${auditLogs.length})` },
          { id: 'RULES', label: 'Validation Rules Config' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Live Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Documents
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">
                {stats.totalDocuments}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Live Database Count</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Active Officers
              </span>
              <div className="text-3xl font-extrabold text-blue-700 mt-1 tabular-nums">
                {stats.activeOfficersCount}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Revenue Tehsildars</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Pending Verification
              </span>
              <div className="text-3xl font-extrabold text-amber-600 mt-1 tabular-nums">
                {stats.pendingReview}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">In Processing Queue</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Verified Records
              </span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1 tabular-nums">
                {stats.verified}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Cryptographically Sealed</div>
            </div>
          </div>

          {/* Routing Distribution */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Trust Score Routing Distribution (Live)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>CLEAR (80-100)</span>
                  <span className="text-xl tabular-nums">{stats.clearCount}</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Internally consistent land records with intact parcel conservation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>REVIEW REQUIRED (50-79)</span>
                  <span className="text-xl tabular-nums">{stats.reviewCount}</span>
                </div>
                <p className="text-[11px] text-amber-700 mt-1">
                  Minor discrepancies (OCR reader variation or chronology irregularities).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
                <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                  <span>HOLD (0-49)</span>
                  <span className="text-xl tabular-nums">{stats.holdCount}</span>
                </div>
                <p className="text-[11px] text-rose-700 mt-1">
                  Severe statutory invariant violation (e.g. area conservation mismatch).
                </p>
              </div>
            </div>
          </div>

          {/* Quick Ledger Preview */}
          <AuditLedgerTable logs={auditLogs} maxEntries={5} title="Recent Cryptographic Ledger Operations" />
        </div>
      )}

      {/* Tab: OFFICERS */}
      {activeTab === 'OFFICERS' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue Officer Directory</h3>
              <p className="text-xs text-slate-500">
                RBAC Enforcement: Only System Administrators can provision officer credentials.
              </p>
            </div>
            <button
              onClick={() => setNewOfficerModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-700 text-white font-semibold text-xs hover:bg-blue-800 transition-colors cursor-pointer"
            >
              + Add New Officer
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Officer Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Jurisdiction District</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {officers.map((officer) => (
                  <tr key={officer.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {officer.name}
                      {officer.isDemo && (
                        <span className="ml-2 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          DEMO
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                      {officer.email}
                    </td>
                    <td className="px-4 py-3">{officer.designation}</td>
                    <td className="px-4 py-3">{officer.district}</td>
                    <td className="px-4 py-3">
                      {officer.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          <Power className="w-3 h-3" />
                          <span>Disabled</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onResetOfficerPassword(officer.id)}
                          className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-600 text-[11px] font-medium"
                          title="Generate reset credential token"
                        >
                          Reset Creds
                        </button>
                        <button
                          onClick={() => onToggleOfficerStatus(officer.id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                            officer.isActive
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {officer.isActive ? 'Disable' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: DOCUMENTS */}
      {activeTab === 'DOCUMENTS' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">All System Land Documents</h3>
            <p className="text-xs text-slate-500">
              Direct access to all registered files, AI extraction stages & validation certificates.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Doc ID</th>
                  <th className="px-4 py-3">Survey No</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Trust Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {documents.map((doc) => {
                  const survey = doc.extractedFields.find(f => f.fieldKey === 'survey_number')?.fieldValue || 'N/A';
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">{doc.id}</td>
                      <td className="px-4 py-3 font-mono font-bold">Gat {survey}</td>
                      <td className="px-4 py-3 font-semibold">{doc.ownerName}</td>
                      <td className="px-4 py-3">{doc.documentType}</td>
                      <td className="px-4 py-3 font-bold">{doc.trustScore.overallScore} / 100 ({doc.trustScore.routing})</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onNavigate('officer-review', doc.id)}
                          className="px-2.5 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium text-[11px]"
                        >
                          View Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: AUDIT */}
      {activeTab === 'AUDIT' && (
        <AuditLedgerTable logs={auditLogs} />
      )}

      {/* Tab: RULES */}
      {activeTab === 'RULES' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-2xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Statutory Trust Score Routing Thresholds
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure cutoff boundaries for automated CLEAR routing and human officer escalation.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Minimum Score for Automatic CLEAR (Default: 80)
              </label>
              <input
                type="number"
                min="60"
                max="95"
                value={clearScoreMin}
                onChange={(e) => setClearScoreMin(parseInt(e.target.value) || 80)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Minimum Score for Standard REVIEW (Default: 50)
              </label>
              <input
                type="number"
                min="30"
                max="75"
                value={reviewScoreMin}
                onChange={(e) => setReviewScoreMin(parseInt(e.target.value) || 50)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Any score below {reviewScoreMin} will be automatically routed to HOLD.
              </span>
            </div>

            {thresholdSaved && (
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Thresholds updated and logged to cryptographic audit ledger!</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveThresholds}
                className="px-4 py-2 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 transition-colors text-xs cursor-pointer"
              >
                Save Threshold Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Officer Modal */}
      {newOfficerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Provision New Officer Account</h3>
              <button
                onClick={() => setNewOfficerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateOfficer} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Officer Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kadam"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Govt Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh.kadam@rev.gov.demo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Statutory Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jurisdiction District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewOfficerModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800"
                >
                  Create Officer Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
