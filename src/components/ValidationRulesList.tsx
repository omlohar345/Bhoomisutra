import React, { useState } from 'react';
import { ValidationRuleResult } from '../types';
import { CheckCircle2, AlertTriangle, AlertOctagon, ChevronDown, ChevronUp, FileSearch, ArrowRight } from 'lucide-react';

interface ValidationRulesListProps {
  rules: ValidationRuleResult[];
  onSelectEvidence?: (sourceDoc: string, ruleName: string) => void;
}

export const ValidationRulesList: React.FC<ValidationRulesListProps> = ({
  rules,
  onSelectEvidence,
}) => {
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(
    rules.find(r => r.status === 'HOLD' || r.status === 'REVIEW')?.id || rules[0]?.id || null
  );

  const getStatusBadge = (status: ValidationRuleResult['status']) => {
    switch (status) {
      case 'PASS':
        return {
          icon: CheckCircle2,
          label: 'CLEAR',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'REVIEW':
        return {
          icon: AlertTriangle,
          label: 'REVIEW REQUIRED',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'HOLD':
        return {
          icon: AlertOctagon,
          label: 'HOLD (MISMATCH)',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-300 font-bold',
        };
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedRuleId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Deterministic Land-Record Consistency Rules ({rules.length})
        </h3>
        <span className="text-[11px] text-slate-400">
          {rules.filter(r => r.status === 'PASS').length} Passed ·{' '}
          {rules.filter(r => r.status === 'REVIEW').length} Review ·{' '}
          {rules.filter(r => r.status === 'HOLD').length} Hold
        </span>
      </div>

      {rules.map((rule) => {
        const config = getStatusBadge(rule.status);
        const IconComponent = config.icon;
        const isExpanded = expandedRuleId === rule.id;

        return (
          <div
            key={rule.id}
            className={`border rounded-lg transition-all ${
              rule.status === 'HOLD'
                ? 'border-rose-300 bg-rose-50/20'
                : rule.status === 'REVIEW'
                ? 'border-amber-200 bg-amber-50/15'
                : 'border-slate-200 bg-white'
            }`}
          >
            {/* Rule Header Bar */}
            <button
              onClick={() => toggleExpand(rule.id)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50/60 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-[11px] font-bold text-slate-400 shrink-0">
                  {rule.ruleId}
                </span>
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {rule.ruleName}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${config.badgeClass}`}
                >
                  <IconComponent className="w-3 h-3" />
                  <span>{config.label}</span>
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>

            {/* Rule Expanded Detail Body */}
            {isExpanded && (
              <div className="px-3.5 pb-3.5 pt-1 text-xs border-t border-slate-100 space-y-2.5 text-slate-700">
                <div>
                  <div className="font-medium text-slate-900 leading-snug">
                    {rule.explanation}
                  </div>
                </div>

                {/* Evidence Box */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <FileSearch className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cross-Document Evidence Grounding</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-800 bg-white p-2 rounded border border-slate-200/60 leading-relaxed">
                    {rule.evidence}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>Source: {rule.sourceDocument}</span>
                    {onSelectEvidence && (
                      <button
                        onClick={() => onSelectEvidence(rule.sourceDocument, rule.ruleName)}
                        className="text-blue-700 font-semibold hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>View Source Crop</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Metric breakdown for Area Conservation */}
                {rule.metricDetails && rule.metricDetails.difference !== undefined && rule.metricDetails.difference !== 0 && (
                  <div className="bg-rose-50 border border-rose-200 p-2.5 rounded text-rose-900 text-xs">
                    <div className="font-bold mb-1">Area Conservation Breakdown:</div>
                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      <div className="bg-white/80 p-1 rounded border border-rose-200">
                        <div className="text-[10px] text-rose-500">Parent Area</div>
                        <div className="font-bold">{rule.metricDetails.parentArea} Acre</div>
                      </div>
                      <div className="bg-white/80 p-1 rounded border border-rose-200">
                        <div className="text-[10px] text-rose-500">Child Total</div>
                        <div className="font-bold">{rule.metricDetails.childrenAreaSum} Acre</div>
                      </div>
                      <div className="bg-white/80 p-1 rounded border border-rose-200 text-rose-700">
                        <div className="text-[10px]">Difference</div>
                        <div className="font-bold">+{rule.metricDetails.difference} Acre</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommended Officer Action */}
                <div className="flex items-start gap-1.5 text-[11px] text-slate-600 bg-blue-50/50 p-2 rounded border border-blue-100">
                  <span className="font-bold text-blue-900 shrink-0">Action:</span>
                  <span>{rule.recommendedAction}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
