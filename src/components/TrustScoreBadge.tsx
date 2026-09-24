import React from 'react';
import { TrustScore } from '../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

interface TrustScoreBadgeProps {
  trustScore: TrustScore;
  showBreakdown?: boolean;
}

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({
  trustScore,
  showBreakdown = true,
}) => {
  const { overallScore, routing, readerAgreementScore, documentQualityScore, ruleConsistencyScore, historicalLineageScore, rationale } = trustScore;

  const getRoutingConfig = () => {
    switch (routing) {
      case 'CLEAR':
        return {
          label: 'CLEAR',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          indicatorColor: 'bg-emerald-600',
          icon: ShieldCheck,
          textColor: 'text-emerald-700',
        };
      case 'REVIEW':
        return {
          label: 'REVIEW REQUIRED',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
          indicatorColor: 'bg-amber-500',
          icon: AlertTriangle,
          textColor: 'text-amber-700',
        };
      case 'HOLD':
        return {
          label: 'HOLD (INCONSISTENCY)',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-300',
          indicatorColor: 'bg-rose-600',
          icon: AlertOctagon,
          textColor: 'text-rose-700',
        };
    }
  };

  const config = getRoutingConfig();
  const IconComponent = config.icon;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Calibrated Trust Score
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-extrabold text-slate-900 tabular-nums">
              {overallScore}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${config.badgeClass}`}>
          <IconComponent className="w-4 h-4 shrink-0" />
          <span>{config.label}</span>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-600">
        {rationale}
      </p>

      {showBreakdown && (
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Score Component Weights</span>
            <span>Contribution</span>
          </div>

          {/* OCR / Reader Agreement */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600">Consensus OCR Agreement (25%)</span>
              <span className="font-semibold text-slate-900 tabular-nums">{readerAgreementScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${readerAgreementScore}%` }}
              />
            </div>
          </div>

          {/* Document Quality Score */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600">Document Scan Quality (15%)</span>
              <span className="font-semibold text-slate-900 tabular-nums">{documentQualityScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${documentQualityScore}%` }}
              />
            </div>
          </div>

          {/* Validation Rules Consistency */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600">Land-Law Invariants & Rules (40%)</span>
              <span className={`font-semibold tabular-nums ${ruleConsistencyScore < 60 ? 'text-rose-600' : 'text-slate-900'}`}>
                {ruleConsistencyScore}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  ruleConsistencyScore < 50
                    ? 'bg-rose-600'
                    : ruleConsistencyScore < 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${ruleConsistencyScore}%` }}
              />
            </div>
          </div>

          {/* Historical Consistency */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600">Historical Lineage Alignment (20%)</span>
              <span className="font-semibold text-slate-900 tabular-nums">{historicalLineageScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-600 rounded-full"
                style={{ width: `${historicalLineageScore}%` }}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Prototype routing thresholds: 80+ Clear · 50–79 Review · &lt;50 Hold</span>
          </div>
        </div>
      )}
    </div>
  );
};
