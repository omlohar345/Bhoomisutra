import React, { useState } from 'react';
import { LandDocument } from '../types';
import { PipelineStepper, STAGES_CONFIG } from '../components/PipelineStepper';
import { TrustScoreBadge } from '../components/TrustScoreBadge';
import { ValidationRulesList } from '../components/ValidationRulesList';
import {
  FileText,
  ScanText,
  Wand2,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Gauge,
  Layers,
  Sparkles,
  AlertOctagon,
  Clock,
} from 'lucide-react';

interface ProcessingPipelineViewProps {
  document: LandDocument;
  onNavigate: (view: string, docId?: string) => void;
}

export const ProcessingPipelineView: React.FC<ProcessingPipelineViewProps> = ({
  document,
  onNavigate,
}) => {
  const [selectedStage, setSelectedStage] = useState<number>(document.processingStage || 7);

  const isHold = document.trustScore.routing === 'HOLD';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={() => onNavigate('officer-dashboard')}
              className="hover:text-blue-700 transition-colors"
            >
              Dashboard
            </button>
            <span>/</span>
            <span>Document Pipeline</span>
            <span>/</span>
            <span className="font-mono text-slate-800">{document.id}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Processing Pipeline · {document.fileName}</span>
            {document.isDemo && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                SIH DEMO RECORD
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('officer-review', document.id)}
            className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Open Officer Review & Evidence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 9-Stage Visual Stepper */}
      <PipelineStepper
        currentStage={document.processingStage}
        selectedStage={selectedStage}
        onSelectStage={(stage) => setSelectedStage(stage)}
        isHold={isHold}
      />

      {/* Stage Detail Inspector Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-extrabold bg-blue-100 text-blue-800 px-2.5 py-1 rounded">
              STAGE 0{selectedStage}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {STAGES_CONFIG[selectedStage - 1]?.name}
              </h2>
              <p className="text-xs text-slate-500">
                {STAGES_CONFIG[selectedStage - 1]?.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Execution Status:</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>COMPLETED</span>
            </span>
          </div>
        </div>

        {/* Dynamic Content based on Selected Stage */}
        {selectedStage === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Stage 1: Secure Ingest & File Validation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[11px] block">File Size & Format</span>
                <span className="font-mono font-bold text-slate-800">{document.fileSize} · {document.fileType}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[11px] block">SHA-256 File Hash</span>
                <span className="font-mono text-[10px] text-slate-700 break-all">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[11px] block">Statutory Classification</span>
                <span className="font-bold text-blue-700">{document.documentType}</span>
              </div>
            </div>
            <p className="text-slate-600 text-[11px]">
              Ingestion verified clean MIME headers, basic PII isolation, and stored raw scan under private signed URL storage.
            </p>
          </div>
        )}

        {selectedStage === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Stage 2: Restore & Image Preprocessing (OpenCV)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[11px] block">Deskew Angle</span>
                <span className="font-mono font-bold text-slate-800">{document.detectedFeatures.deskewAngle}° Corrected</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[11px] block">Adaptive Contrast</span>
                <span className="font-mono font-bold text-slate-800">{document.detectedFeatures.contrastBoost}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[11px] block">Scan Quality Score</span>
                <span className="font-mono font-bold text-emerald-700">{document.qualityScore} / 100 ({document.qualityAssessment})</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[11px] block">Denoise Filter</span>
                <span className="font-mono font-bold text-slate-800">Non-Local Means (h=10)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <span className="font-semibold text-slate-800 block">Detected Layout Segments & Document Zones:</span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2 py-1 rounded bg-white border border-slate-200 font-medium text-slate-700">
                  ✓ Tabular Grid Zones Detected
                </span>
                <span className="px-2 py-1 rounded bg-white border border-slate-200 font-medium text-slate-700">
                  ✓ Printed Hindi/Marathi Bilingual Text
                </span>
                <span className="px-2 py-1 rounded bg-white border border-slate-200 font-medium text-slate-700">
                  ✓ Official Talathi Rubber Stamp & Seal
                </span>
                {document.detectedFeatures.handwriting && (
                  <span className="px-2 py-1 rounded bg-amber-50 border border-amber-200 font-medium text-amber-800">
                    ! Marginal Handwriting Notations
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedStage === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Stage 3: Multi-Reader Consensus OCR</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {document.ocrResult.readersExecuted.map((reader) => (
                <div key={reader.readerName} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{reader.readerName}</span>
                    <span className="font-mono font-bold text-blue-700">{reader.confidence}% Conf</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">Engine: {reader.engine}</div>
                  <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-700 italic">
                    &ldquo;{reader.sampleSnippet}&rdquo;
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-blue-900">Reader Agreement Rate:</span>
                <span className="text-blue-800 ml-1.5">{document.ocrResult.disagreementNotes}</span>
              </div>
              <span className="font-mono text-base font-extrabold text-blue-900">
                {document.ocrResult.readerAgreement}%
              </span>
            </div>
          </div>
        )}

        {selectedStage === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Stage 4: Canonical Field Extraction & Unit Normalization</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-2">Field</th>
                    <th className="p-2">Extracted Value</th>
                    <th className="p-2">Normalized Canonical</th>
                    <th className="p-2">OCR Confidence</th>
                    <th className="p-2">Source Page</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {document.extractedFields.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="p-2 font-medium">{f.fieldLabel}</td>
                      <td className="p-2 font-mono font-semibold text-slate-900">
                        {f.fieldValue} {f.unit || ''}
                      </td>
                      <td className="p-2 font-mono text-blue-700">{f.normalizedValue}</td>
                      <td className="p-2 font-mono">{f.confidence}%</td>
                      <td className="p-2 text-slate-400">Page {f.sourcePage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedStage === 5 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Stage 5: Parcel Lineage Linkage</h3>
            <p className="text-slate-600">
              Extracted Gat/Survey plot was cross-linked against the State Cadastral GIS ledger.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">
                  Survey Lineage Graph: Gat 45/2 (Anandpur, Pune)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Connected nodes: 1998 Original Settlement → 2008 Sale Deed → 2018 Cadastral Subdivision → 2026 Active
                </div>
              </div>
              <button
                onClick={() => onNavigate('officer-parcel', 'parcel-45-2')}
                className="px-3 py-1.5 rounded-lg bg-blue-700 text-white font-medium text-xs hover:bg-blue-800 transition-colors cursor-pointer"
              >
                Inspect Visual Lineage Graph
              </button>
            </div>
          </div>
        )}

        {selectedStage === 6 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Stage 6: Land-Law Consistency Checks (8 Statutory Invariants)</h3>
            <ValidationRulesList rules={document.validationRules} />
          </div>
        )}

        {selectedStage === 7 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Stage 7: Calibrated Trust Score Calculation</h3>
            <TrustScoreBadge trustScore={document.trustScore} />
          </div>
        )}

        {selectedStage >= 8 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Stage 8 & 9: Officer Review & Cryptographic Audit Ledger</h3>
            <p className="text-slate-600 leading-relaxed">
              All extracted fields, confidence scores, and rule invariants have been compiled for officer sign-off. Click below to enter the split-screen evidence review interface.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('officer-review', document.id)}
                className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Proceed to Side-by-Side Officer Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
