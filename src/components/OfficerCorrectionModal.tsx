import React, { useState } from 'react';
import { ExtractedField } from '../types';
import { Edit3, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface OfficerCorrectionModalProps {
  field: ExtractedField;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fieldId: string, newValue: string, reason: string) => Promise<void>;
}

export const OfficerCorrectionModal: React.FC<OfficerCorrectionModalProps> = ({
  field,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [newValue, setNewValue] = useState<string>(field.fieldValue);
  const [reason, setReason] = useState<string>('Corrected after visual inspection of document crop.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim() || !reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(field.id, newValue.trim(), reason.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Officer Value Correction</h3>
              <p className="text-[11px] text-slate-500">Logged to tamper-evident audit trail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Field Label
            </label>
            <div className="p-2 bg-slate-100 rounded text-slate-800 font-medium">
              {field.fieldLabel}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Extracted OCR Value (Original)
            </label>
            <div className="p-2 bg-slate-100 rounded font-mono text-slate-700">
              {field.fieldValue} {field.unit || ''}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Corrected Officer Value *
            </label>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-xs font-mono text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Official Justification / Audit Reason *
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-xs text-slate-900"
              placeholder="e.g. Verified with Sub-Registrar stamp on line 4..."
            />
          </div>

          <div className="p-2.5 rounded bg-blue-50 border border-blue-100 flex items-start gap-2 text-[11px] text-blue-900">
            <AlertCircle className="w-4 h-4 shrink-0 text-blue-700 mt-0.5" />
            <span>
              This correction will update the validation rules and recalculate the trust score. A cryptographic audit ledger entry will record your officer identity.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Apply & Re-validate</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
