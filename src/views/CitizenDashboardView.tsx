import React from 'react';
import { User, LandDocument } from '../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  UserCircle,
  FileCheck2,
} from 'lucide-react';
import { formatTimestamp } from '../utils/crypto';

interface CitizenDashboardViewProps {
  currentUser: User;
  documents: LandDocument[]; // Already filtered by RBAC to only show citizen's own records!
  onNavigate: (view: string, docId?: string) => void;
}

export const CitizenDashboardView: React.FC<CitizenDashboardViewProps> = ({
  currentUser,
  documents,
  onNavigate,
}) => {
  const verifiedCount = documents.filter(d => d.status === 'VERIFIED').length;
  const inProgressCount = documents.filter(d => d.status === 'PROCESSING' || d.status === 'QUEUED').length;
  const reviewRequiredCount = documents.filter(d => d.status === 'NEEDS_REVIEW' || d.status === 'CORRECTION_REQUESTED').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Citizen Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-700 text-emerald-100 mb-1">
              <UserCircle className="w-3.5 h-3.5" />
              <span>Public Landholder Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100">
              Track the digitization, boundary verification, and official certification status of your land holdings.
            </p>
          </div>

          <div className="font-mono text-xs bg-emerald-950/60 px-3.5 py-2 rounded-xl border border-emerald-700/60">
            <div>Jurisdiction: Haveli, Pune</div>
            <div className="text-emerald-300 text-[11px]">Bhu-Aadhaar Linked</div>
          </div>
        </div>
      </div>

      {/* Citizen Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            My Registered Holdings
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {documents.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Submitted 7/12 Records</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Verified & Certified
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums">
            {verifiedCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Official Seal Issued</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Under Verification
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums">
            {reviewRequiredCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Officer Cross-Checking</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            In Pipeline
          </span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1 tabular-nums">
            {inProgressCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">OCR & Field Extraction</div>
        </div>
      </div>

      {/* Citizen's Record List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">My Land Records</h3>
            <p className="text-xs text-slate-500">
              Only your authenticated documents are displayed. Internal revenue officer notes remain confidential.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {documents.map((doc) => {
            const survey = doc.extractedFields.find(f => f.fieldKey === 'survey_number')?.fieldValue || '45/2';
            const area = doc.extractedFields.find(f => f.fieldKey === 'area')?.fieldValue || '2.50';
            const village = doc.extractedFields.find(f => f.fieldKey === 'village')?.fieldValue || 'Anandpur';

            const isVerified = doc.status === 'VERIFIED';
            const isReview = doc.trustScore.routing === 'REVIEW' || doc.trustScore.routing === 'HOLD';

            return (
              <div key={doc.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        Gat / Survey No. {survey}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-xs text-slate-600">
                        Village {village}, Haveli, Pune
                      </span>
                      {doc.isDemo && (
                        <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">
                          DEMO
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Area: <strong className="text-slate-800">{area} Acre</strong></span>
                      <span>Document: <strong>{doc.fileName}</strong></span>
                      <span>Uploaded: {formatTimestamp(doc.uploadDate)}</span>
                    </div>

                    {/* Citizen-Friendly Status Reason */}
                    <div className="pt-1">
                      {isVerified ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Officially verified and certified by Taluka Tehsildar.</span>
                        </div>
                      ) : isReview ? (
                        <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Status: Verification Required. Revenue officer is cross-checking partition boundaries with the Cadastral Survey ledger.</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-blue-700">
                          <Clock className="w-4 h-4" />
                          <span>Document is undergoing automated OCR reading and validation checks.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('officer-reports', doc.id)}
                      className="px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Official Report</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {documents.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No land records registered under your citizen profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
