import React, { useState } from 'react';
import { BoundingBox, ExtractedField } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, Eye, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DocumentCropViewerProps {
  scanUrl: string;
  fields: ExtractedField[];
  activeFieldId?: string;
  onSelectField?: (fieldId: string) => void;
  documentTitle?: string;
}

export const DocumentCropViewer: React.FC<DocumentCropViewerProps> = ({
  scanUrl,
  fields,
  activeFieldId,
  onSelectField,
  documentTitle = 'Record of Rights 7/12 Scan',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showOverlays, setShowOverlays] = useState<boolean>(true);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-md flex flex-col h-full">
      {/* Viewer Header / Toolbar */}
      <div className="bg-slate-800 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2 font-medium">
          <FileText className="w-4 h-4 text-blue-400" />
          <span className="truncate max-w-[200px]">{documentTitle}</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-mono text-[11px]">300 DPI · Deskewed (0.4°)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 text-[11px] transition-colors ${
              showOverlays
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showOverlays ? 'Bounding Boxes: ON' : 'Bounding Boxes: OFF'}</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-700 mx-1" />

          <button
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px] text-slate-400 w-10 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white ml-1"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 overflow-auto bg-slate-950 p-4 flex items-center justify-center min-h-[460px]">
        <div
          className="relative transition-transform duration-150 origin-top shadow-2xl rounded-sm"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Base Document Image */}
          <img
            src={scanUrl}
            alt="Scanned Land Document"
            className="max-w-[560px] w-full h-auto block select-none pointer-events-none rounded"
            onError={(e) => {
              // Graceful fallback if asset path differs
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/600x800/f8fafc/0f172a?text=Official+Land+Record+Scan+7/12';
            }}
          />

          {/* Interactive Bounding Boxes SVG Overlay */}
          {showOverlays && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-auto"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {fields.map(field => {
                const box = field.cropBox;
                if (!box) return null;
                const isActive = activeFieldId === field.id;
                const isCorrected = field.reviewStatus === 'CORRECTED';
                const isFlagged = field.reviewStatus === 'FLAGGED';

                let strokeColor = '#3b82f6'; // blue
                let fillColor = 'rgba(59, 130, 246, 0.12)';

                if (isActive) {
                  strokeColor = '#f59e0b'; // amber
                  fillColor = 'rgba(245, 158, 11, 0.32)';
                } else if (isFlagged) {
                  strokeColor = '#ef4444'; // red
                  fillColor = 'rgba(239, 68, 68, 0.2)';
                } else if (isCorrected) {
                  strokeColor = '#10b981'; // green
                  fillColor = 'rgba(16, 185, 129, 0.2)';
                }

                return (
                  <g
                    key={field.id}
                    onClick={() => onSelectField && onSelectField(field.id)}
                    className="cursor-pointer group"
                  >
                    <rect
                      x={box.x}
                      y={box.y}
                      width={box.width}
                      height={box.height}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isActive ? '0.6' : '0.35'}
                      strokeDasharray={isActive ? 'none' : '1, 0.5'}
                      rx="0.5"
                      className="transition-all duration-150"
                    />

                    {/* Crop Label Tag */}
                    {(isActive || isFlagged) && (
                      <g transform={`translate(${box.x}, ${Math.max(box.y - 3, 2)})`}>
                        <rect
                          x="0"
                          y="0"
                          width={Math.min(box.width + 4, 34)}
                          height="2.8"
                          fill={isActive ? '#f59e0b' : '#ef4444'}
                          rx="0.3"
                        />
                        <text
                          x="1"
                          y="2"
                          fontSize="1.8"
                          fontWeight="bold"
                          fill="#ffffff"
                          fontFamily="sans-serif"
                        >
                          {box.label || field.fieldLabel.split(' ')[0]}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* Footer helper */}
      <div className="bg-slate-800/80 px-4 py-2 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Click any highlighted field to view OCR crop grounding</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Grounded
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Selected
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Flagged
          </span>
        </div>
      </div>
    </div>
  );
};
