import React, { useState } from 'react';
import { LandDocument, ExtractedField } from '../types';
import { DocumentCropViewer } from '../components/DocumentCropViewer';
import { TrustScoreBadge } from '../components/TrustScoreBadge';
import { ValidationRulesList } from '../components/ValidationRulesList';
import { OfficerCorrectionModal } from '../components/OfficerCorrectionModal';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Edit3,
  GitBranch,
  FileText,
  FileCheck2,
  XCircle,
  MessageSquare,
  ArrowRight,
  Info,
} from 'lucide-react';

interface OfficerReviewViewProps {
  document: LandDocument;
  onCorrectField: (fieldId: string, newValue: string, reason: string) => Promise<void>;
  onSubmitDecision: (decision: 'APPROVED' | 'CORRECTION_REQUESTED' | 'REJECTED', comments: string) => Promise<void>;
  onNavigate: (view: string, docId?: string) => void;
}

export const OfficerReviewView: React.FC<OfficerReviewViewProps> = ({
  document,
  onCorrectField,
  onSubmitDecision,
  onNavigate,
}) => {
  const [activeFieldId, setActiveFieldId] = useState<string>(document.extractedFields[0]?.id || '');
  const [editingField, setEditingField] = useState<ExtractedField | null>(null);
  const [decisionModalOpen, setDecisionModalOpen] = useState<boolean>(false);
  const [decisionType, setDecisionType] = useState<'APPROVED' | 'CORRECTION_REQUESTED' | 'REJECTED'>('APPROVED');
  const [officerComments, setOfficerComments] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeField = document.extractedFields.find(f => f.id === activeFieldId);

  const handleOpenDecision = (type: 'APPROVED' | 'CORRECTION_REQUESTED' | 'REJECTED') => {
    setDecisionType(type);
    if (type === 'APPROVED') {
      setOfficerComments('Verified against official Field Measurement Book and registered mutation entries. Approved for digital revenue ledger.');
    } else if (type === 'CORRECTION_REQUESTED') {
      setOfficerComments('Discrepancy detected in subdivision parcel area. Please present original mutation order or partition decree.');
    } else {
      setOfficerComments('Rejected: Unresolvable discrepancy between child parcel areas and documented parent holding.');
    }
    setDecisionModalOpen(true);
  };

  const handleConfirmDecision = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitDecision(decisionType, officerComments);
      setDecisionModalOpen(false);
      onNavigate('officer-reports', document.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Document Meta & Quick Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={() => onNavigate('officer-dashboard')}
              className="hover:text-blue-700 transition-colors"
            >
              Dashboard
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate('officer-processing', document.id)}
              className="hover:text-blue-700 transition-colors"
            >
              Pipeline
            </button>
            <span>/</span>
            <span className="font-mono text-slate-800">{document.id}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Officer Review & Field Grounding
            </h1>
            {document.isDemo && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                SIH DEMO RECORD
              </span>
            )}
            {document.status === 'VERIFIED' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                VERIFIED & SEALED
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('officer-parcel', 'parcel-45-2')}
            className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <GitBranch className="w-3.5 h-3.5 text-blue-700" />
            <span>Parcel History</span>
          </button>
          <button
            onClick={() => onNavigate('officer-reports', document.id)}
            className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Validation Report</span>
          </button>

          {/* Action Modals */}
          <button
            onClick={() => handleOpenDecision('APPROVED')}
            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve Verification</span>
          </button>
          <button
            onClick={() => handleOpenDecision('CORRECTION_REQUESTED')}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Request Correction</span>
          </button>
          <button
            onClick={() => handleOpenDecision('REJECTED')}
            className="px-3.5 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>
        </div>
      </div>

      {/* 3-Column Split-Screen Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Document Scan with Bounding Boxes (5 cols) */}
        <div className="lg:col-span-5 h-[680px]">
          <DocumentCropViewer
            scanUrl={document.originalScanUrl}
            fields={document.extractedFields}
            activeFieldId={activeFieldId}
            onSelectField={(id) => setActiveFieldId(id)}
            documentTitle={document.fileName}
          />
        </div>

        {/* Center / Right Side: Structured Extracted Fields Table & Editor (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Extracted Canonical Fields ({document.extractedFields.length})
              </h3>
              <p className="text-[11px] text-slate-400">Click a row to inspect its exact image crop</p>
            </div>
            <span className="font-mono text-xs text-blue-700 font-semibold">
              OCR Grounded
            </span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {document.extractedFields.map((field) => {
              const isSelected = activeFieldId === field.id;
              const isCorrected = field.reviewStatus === 'CORRECTED';
              const isFlagged = field.reviewStatus === 'FLAGGED';

              return (
                <div
                  key={field.id}
                  onClick={() => setActiveFieldId(field.id)}
                  className={`p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500'
                      : isFlagged
                      ? 'border-rose-200 bg-rose-50/20'
                      : isCorrected
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-slate-500">
                      {field.fieldLabel}
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="text-slate-400">{field.confidence}% Conf</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingField(field);
                        }}
                        className="p-1 rounded text-blue-700 hover:bg-blue-100 transition-colors"
                        title="Correct this extracted value"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      {field.fieldValue} {field.unit || ''}
                    </div>
                    {isCorrected && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                        OFFICER CORRECTED
                      </span>
                    )}
                    {isFlagged && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                        REQUIRES CHECK
                      </span>
                    )}
                  </div>

                  {field.officerCorrection && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5">
                      <div>
                        Original: <span className="font-mono line-through">{field.officerCorrection.oldValue}</span>
                      </div>
                      <div className="italic text-slate-600">
                        &ldquo;{field.officerCorrection.reason}&rdquo;
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Trust Score + Validation Rules (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          <TrustScoreBadge trustScore={document.trustScore} showBreakdown={true} />

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <ValidationRulesList
              rules={document.validationRules}
              onSelectEvidence={(docRef, rule) => {
                // Focus on relevant crop or notify
              }}
            />
          </div>
        </div>
      </div>

      {/* Value Correction Modal */}
      {editingField && (
        <OfficerCorrectionModal
          field={editingField}
          isOpen={!!editingField}
          onClose={() => setEditingField(null)}
          onSubmit={async (fieldId, newValue, reason) => {
            await onCorrectField(fieldId, newValue, reason);
          }}
        />
      )}

      {/* Decision Confirmation Modal */}
      {decisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Sign Officer Verification Decision
              </h3>
              <button
                onClick={() => setDecisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-500 block mb-1">Decision Action:</span>
                <span
                  className={`font-bold uppercase text-sm px-2.5 py-1 rounded inline-block ${
                    decisionType === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : decisionType === 'CORRECTION_REQUESTED'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {decisionType.replace('_', ' ')}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Officer Statutory Comments / Justification *
                </label>
                <textarea
                  rows={3}
                  value={officerComments}
                  onChange={(e) => setOfficerComments(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-xs text-slate-900"
                  placeholder="Official comments regarding title check..."
                />
              </div>

              <div className="p-2.5 rounded bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
                <span className="font-bold">Cryptographic Audit Seal:</span> Signing will record your action into the tamper-evident SHA-256 ledger chain and generate an official validation report.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDecisionModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                disabled={isSubmitting || !officerComments.trim()}
                className="px-4 py-1.5 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 disabled:opacity-50"
              >
                {isSubmitting ? 'Signing Ledger...' : 'Confirm & Generate Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
