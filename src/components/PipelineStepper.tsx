import React from 'react';
import {
  FileCheck2,
  Wand2,
  ScanText,
  Binary,
  GitBranch,
  ShieldAlert,
  Gauge,
  UserCheck,
  CheckCircle,
} from 'lucide-react';

export interface PipelineStageInfo {
  step: number;
  id: string;
  name: string;
  subtitle: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING' | 'FLAGGED';
  latencyMs?: number;
  outputSummary?: string;
}

interface PipelineStepperProps {
  currentStage: number; // 1 to 9
  onSelectStage?: (stageNumber: number) => void;
  selectedStage?: number;
  isHold?: boolean;
}

export const STAGES_CONFIG = [
  { step: 1, name: 'Secure Ingest', subtitle: 'SHA-256 integrity & PII check', icon: FileCheck2 },
  { step: 2, name: 'Restore & Preprocess', subtitle: 'Deskew, denoise & contrast', icon: Wand2 },
  { step: 3, name: 'Consensus OCR', subtitle: 'PaddleOCR + Tesseract fusion', icon: ScanText },
  { step: 4, name: 'Canonicalize & Extract', subtitle: 'Multilingual field grounding', icon: Binary },
  { step: 5, name: 'Parcel Lineage Graph', subtitle: 'Survey & ULPIN history link', icon: GitBranch },
  { step: 6, name: 'Land-Law Consistency', subtitle: '8 statutory invariant checks', icon: ShieldAlert },
  { step: 7, name: 'Calibrated Trust Score', subtitle: 'Explainable risk calibration', icon: Gauge },
  { step: 8, name: 'Officer Review', subtitle: 'Human-in-the-loop verification', icon: UserCheck },
  { step: 9, name: 'Verified + Audit', subtitle: 'Hash-chained ledger seal', icon: CheckCircle },
];

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  currentStage,
  onSelectStage,
  selectedStage,
  isHold = false,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Intelligent Land Record Validation Pipeline (9 Stages)
          </h3>
          <p className="text-[11px] text-slate-400">
            Deterministic rule engine with consensus OCR and explainable trust scoring
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs font-bold text-blue-700 tabular-nums">
            Stage {Math.min(currentStage, 9)} of 9
          </span>
        </div>
      </div>

      {/* Responsive Grid/Flex Stepper */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
        {STAGES_CONFIG.map((stage) => {
          const Icon = stage.icon;
          const isDone = stage.step < currentStage;
          const isCurrent = stage.step === currentStage;
          const isSelected = selectedStage === stage.step;
          const isFlaggedStage = isHold && (stage.step === 6 || stage.step === 7);

          let borderClass = 'border-slate-200 bg-slate-50/60 text-slate-400';
          let iconBg = 'bg-slate-200 text-slate-500';

          if (isDone) {
            borderClass = 'border-blue-200 bg-blue-50/30 text-blue-900';
            iconBg = 'bg-blue-600 text-white';
          } else if (isCurrent) {
            if (isFlaggedStage) {
              borderClass = 'border-rose-400 bg-rose-50/60 text-rose-900 ring-2 ring-rose-200';
              iconBg = 'bg-rose-600 text-white';
            } else {
              borderClass = 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-200';
              iconBg = 'bg-blue-700 text-white animate-pulse';
            }
          }

          if (isSelected) {
            borderClass += ' ring-2 ring-blue-600 shadow-xs';
          }

          return (
            <button
              key={stage.step}
              onClick={() => onSelectStage && onSelectStage(stage.step)}
              className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all hover:border-blue-400 cursor-pointer ${borderClass}`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-mono text-[10px] font-bold opacity-75">
                  0{stage.step}
                </span>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center ${iconBg}`}>
                  <Icon className="w-3 h-3" />
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold leading-tight line-clamp-1">
                  {stage.name}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">
                  {stage.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
