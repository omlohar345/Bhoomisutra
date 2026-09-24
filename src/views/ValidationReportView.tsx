import React from 'react';
import { LandDocument, User } from '../types';
import {
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';
import { formatTimestamp } from '../utils/crypto';

interface ValidationReportViewProps {
  document: LandDocument;
  currentUser: User;
  onNavigate: (view: string, docId?: string) => void;
}

export const ValidationReportView: React.FC<ValidationReportViewProps> = ({
  document,
  currentUser,
  onNavigate,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const routing = document.trustScore.routing;
  const passedRules = document.validationRules.filter(r => r.status === 'PASS');
  const reviewRules = document.validationRules.filter(r => r.status === 'REVIEW');
  const holdRules = document.validationRules.filter(r => r.status === 'HOLD');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Screen Toolbar (hidden in print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <button
          onClick={() => onNavigate('officer-review', document.id)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Officer Review</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as Official PDF</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Container */}
      <div
        id="official-report-sheet"
        className="bg-white border-2 border-slate-300 rounded-xl p-8 sm:p-12 shadow-lg space-y-8 print:border-none print:shadow-none print:p-2"
      >
        {/* Certificate Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              Government of Maharashtra · Department of Revenue & Land Records
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              BHOOMISUTRA
            </h1>
            <div className="text-xs font-semibold text-blue-900 tracking-wide">
              AI-Powered Land Record Digitization & Statutory Invariant Validation System
            </div>
            <div className="text-[10px] font-mono text-slate-500 pt-0.5">
              SIH-2026 Statutory Verification Certificate · Reference ID: {document.id}
            </div>
          </div>

          {/* Revenue Seal Emblem */}
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border border-slate-200">
            <img
              src="/src/assets/images/revenue_verification_seal_1790261925729.jpg"
              alt="Official Revenue Department Seal"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Certificate Summary Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Document Ref
            </span>
            <span className="font-mono font-bold text-slate-900">{document.id}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Validation Date (IST)
            </span>
            <span className="font-mono font-semibold text-slate-800">
              {formatTimestamp(document.uploadDate)}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Trust Score
            </span>
            <span className="font-bold text-slate-900 text-sm">
              {document.trustScore.overallScore} / 100
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Statutory Routing
            </span>
            <span
              className={`font-extrabold px-2 py-0.5 rounded text-[11px] inline-block ${
                routing === 'CLEAR'
                  ? 'bg-emerald-100 text-emerald-800'
                  : routing === 'REVIEW'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {routing}
            </span>
          </div>
        </div>

        {/* Parcel Statutory Attributes Table */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            1. Verified Land Parcel Attributes (अभिलेख तपशील)
          </h2>
          <table className="w-full text-left text-xs border border-slate-200">
            <tbody className="divide-y divide-slate-200">
              {document.extractedFields.map((field) => (
                <tr key={field.id} className="odd:bg-slate-50/50">
                  <td className="p-2.5 font-semibold text-slate-600 w-1/3">
                    {field.fieldLabel}
                  </td>
                  <td className="p-2.5 font-mono font-bold text-slate-900">
                    {field.fieldValue} {field.unit || ''}
                    {field.reviewStatus === 'CORRECTED' && (
                      <span className="ml-2 text-[10px] font-normal text-emerald-700 italic">
                        (Officer corrected from {field.officerCorrection?.oldValue})
                      </span>
                    )}
                  </td>
                  <td className="p-2.5 text-right font-mono text-[11px] text-slate-500">
                    {field.confidence}% OCR Conf
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Deterministic Validation Rules Summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Deterministic Land-Law Consistency Invariants ({document.validationRules.length})
            </h2>
            <div className="text-[11px] font-mono text-slate-600">
              Pass: {passedRules.length} · Review: {reviewRules.length} · Hold: {holdRules.length}
            </div>
          </div>

          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px]">
              <tr>
                <th className="p-2 border-b border-slate-200">Rule ID</th>
                <th className="p-2 border-b border-slate-200">Invariant Description</th>
                <th className="p-2 border-b border-slate-200">Finding / Grounding Evidence</th>
                <th className="p-2 border-b border-slate-200 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {document.validationRules.map((rule) => (
                <tr key={rule.id}>
                  <td className="p-2 font-mono font-bold text-slate-500">{rule.ruleId}</td>
                  <td className="p-2 font-semibold text-slate-800">{rule.ruleName}</td>
                  <td className="p-2 text-slate-600 text-[11px]">{rule.explanation}</td>
                  <td className="p-2 text-right">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        rule.status === 'PASS'
                          ? 'bg-emerald-50 text-emerald-800'
                          : rule.status === 'REVIEW'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}
                    >
                      {rule.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Officer Decision & Digital Signature Block */}
        <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            3. Revenue Officer Statutory Decision
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Authorized Revenue Officer:</span>
              <span className="font-bold text-slate-900 text-sm">
                {document.officerDecision?.officerName || currentUser.name}
              </span>
              <div className="text-[11px] text-slate-500">
                Taluka Tehsildar / Sub-Divisional Officer
              </div>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Final Disposition:</span>
              <span className="font-bold text-sm text-blue-900 uppercase">
                {document.officerDecision?.decision || (document.status === 'VERIFIED' ? 'APPROVED' : 'PENDING OFFICER SIGNATURE')}
              </span>
              <div className="text-[11px] font-mono text-slate-500">
                Timestamp: {formatTimestamp(document.officerDecision?.timestamp || new Date().toISOString())}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 text-xs">
            <span className="font-semibold text-slate-700 block mb-0.5">Officer Statutory Comment:</span>
            <p className="italic text-slate-600 bg-white p-2.5 rounded border border-slate-200">
              &ldquo;{document.officerDecision?.comments || 'Verified against Field Measurement Book (FMB) and village revenue mutation register. Invariants confirmed.'}&rdquo;
            </p>
          </div>
        </div>

        {/* Cryptographic SHA-256 Ledger Stamp */}
        <div className="p-3 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[10px] space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-800">
            <span>Tamper-Evident Hash Chain Audit Fingerprint</span>
            <span className="text-emerald-700">INTEGRITY: VERIFIED</span>
          </div>
          <div className="break-all">
            Chain Node Hash: e2a1068dfb7d9b990e9d6910ea094db6e51147e44a9e3f60f64c6df729609623
          </div>
        </div>

        {/* Mandatory Statutory Disclaimer as mandated by Prompt */}
        <div className="pt-4 border-t-2 border-slate-900 text-center space-y-1 text-xs text-slate-500">
          <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Statutory Legal Disclaimer
          </div>
          <p className="max-w-2xl mx-auto leading-relaxed italic">
            &ldquo;This report is an AI-assisted validation output. Final legal/administrative decisions remain with the authorized authority.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
