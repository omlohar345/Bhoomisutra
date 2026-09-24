import React, { useState } from 'react';
import { LandDocument, DocumentType } from '../types';
import { Upload, FileUp, Sparkles, AlertCircle, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface OfficerUploadViewProps {
  onUploadSuccess: (params: {
    fileName: string;
    fileSize: string;
    fileType: string;
    documentType: DocumentType;
    previewUrl?: string;
    scenarioKey?: 'CLEAR' | 'HOLD' | 'REVIEW';
  }) => Promise<LandDocument>;
  onNavigate: (view: string, docId?: string) => void;
}

export const OfficerUploadView: React.FC<OfficerUploadViewProps> = ({
  onUploadSuccess,
  onNavigate,
}) => {
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('RECORD_OF_RIGHTS');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (file: File) => {
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const previewUrl = reader.result as string;
        const newDoc = await onUploadSuccess({
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          fileType: file.type || 'application/pdf',
          documentType: selectedDocType,
          previewUrl,
        });
        onNavigate('officer-processing', newDoc.id);
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
    }
  };

  const handleLoadDemoScenario = async (scenario: 'CLEAR' | 'HOLD' | 'REVIEW') => {
    setIsUploading(true);
    try {
      const meta = {
        CLEAR: {
          fileName: 'RoR_Extract_Gat_45_2_Anandpur.pdf',
          docType: 'RECORD_OF_RIGHTS' as DocumentType,
        },
        HOLD: {
          fileName: 'Partition_Deed_Subdivision_Gat_88_3B.pdf',
          docType: 'MUTATION_REGISTER' as DocumentType,
        },
        REVIEW: {
          fileName: 'Sale_Deed_Registry_Gat_112_1.pdf',
          docType: 'SALE_DEED' as DocumentType,
        },
      }[scenario];

      const newDoc = await onUploadSuccess({
        fileName: meta.fileName,
        fileSize: '2.1 MB',
        fileType: 'application/pdf',
        documentType: meta.docType,
        scenarioKey: scenario,
      });

      onNavigate('officer-processing', newDoc.id);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Upload Land Record
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ingest scanned land deeds, 7/12 extracts or mutation ledgers into the 9-stage intelligent validation pipeline.
        </p>
      </div>

      {/* Instant SIH Demo Scenarios Panel for Judges */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Instant SIH Demo Scenarios (No Local File Needed)
            </span>
          </div>
          <span className="text-[11px] text-amber-800 font-mono">1-Click Walkthrough</span>
        </div>

        <p className="text-xs text-amber-900/80 leading-relaxed">
          For live judge presentations, you can instantly load realistic pre-formatted land documents to demonstrate either invariant clearance or invariant violation:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => handleLoadDemoScenario('HOLD')}
            disabled={isUploading}
            className="p-3 bg-white rounded-lg border-2 border-rose-400 hover:border-rose-600 text-left transition-colors cursor-pointer group shadow-xs disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-xs font-bold text-rose-700 mb-1">
              <span>Area Mismatch (HOLD)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-600">
              Parent parcel 2.40 Acre subdivided into 1.35 + 1.30 = 2.65 Acre (+0.25 Acre violation).
            </p>
          </button>

          <button
            onClick={() => handleLoadDemoScenario('CLEAR')}
            disabled={isUploading}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-500 text-left transition-colors cursor-pointer group shadow-xs disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-xs font-bold text-blue-700 mb-1">
              <span>Consistent Record (CLEAR)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-600">
              RoR 7/12 extract matching 4.00 Acre parent partition into 2.50 + 1.50 Acre.
            </p>
          </button>

          <button
            onClick={() => handleLoadDemoScenario('REVIEW')}
            disabled={isUploading}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-amber-500 text-left transition-colors cursor-pointer group shadow-xs disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-700 mb-1">
              <span>Chronology Order (REVIEW)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-600">
              Mutation entry recorded prior to Sub-Registrar deed timestamp.
            </p>
          </button>
        </div>
      </div>

      {/* Manual Drag & Drop Upload Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Upload className="w-4 h-4 text-blue-700" />
          <span>Upload Custom Land Document</span>
        </h3>

        {/* Document Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Statutory Document Classification
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'RECORD_OF_RIGHTS', label: 'Record of Rights (7/12)' },
              { id: 'MUTATION_REGISTER', label: 'Mutation Register (फेरफार)' },
              { id: 'SALE_DEED', label: 'Registered Sale Deed' },
              { id: 'SURVEY_PARCEL_MAP', label: 'Cadastral Parcel Map' },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedDocType(type.id as DocumentType)}
                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-colors cursor-pointer ${
                  selectedDocType === type.id
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold ring-1 ring-blue-500'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? 'border-blue-600 bg-blue-50/40'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/30'
          }`}
        >
          <div className="max-w-sm mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 mx-auto flex items-center justify-center">
              <FileUp className="w-6 h-6" />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                Drag and drop your document here, or{' '}
                <label className="text-blue-700 hover:underline cursor-pointer font-bold">
                  browse file
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supported formats: PDF, JPG, JPEG, PNG (Up to 25 MB)
              </p>
            </div>
          </div>
        </div>

        {/* Processing Guarantee Info */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-600">
          <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-900">Pipeline Ingestion Protocol:</span> All uploaded files undergo automated deskewing, OpenCV adaptive contrast enhancement, dual consensus OCR (PaddleOCR + Tesseract), and cross-parcel lineage validation before officer handoff.
          </div>
        </div>
      </div>
    </div>
  );
};
