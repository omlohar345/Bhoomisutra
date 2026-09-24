import React from 'react';
import {
  ShieldCheck,
  FileCheck2,
  ScanText,
  GitBranch,
  Gauge,
  ArrowRight,
  Database,
  Lock,
  Layers,
  Sparkles,
  AlertTriangle,
  FileText,
  Award,
} from 'lucide-react';
import { STAGES_CONFIG } from '../components/PipelineStepper';

interface LandingViewProps {
  onStartDemo: (scenarioKey?: 'CLEAR' | 'HOLD') => void;
  onNavigate: (view: string, docId?: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartDemo,
  onNavigate,
}) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">
          {/* SIH 2026 Problem Statement Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Smart India Hackathon 2026 · Problem Statement SIH26018</span>
            <span className="text-blue-400">|</span>
            <span className="text-blue-700">Theme: Smart Automation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Digitize. Compare. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900">
              Validate. Verify.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Bhoomisutra is an AI-assisted validation layer that checks land records against available parcel history, enforces statutory land invariants, and highlights potential inconsistencies for authorized revenue officers.
          </p>

          {/* Central Product Idea Quote Card */}
          <div className="mt-8 p-4 rounded-xl bg-slate-900 text-slate-200 max-w-2xl mx-auto text-xs sm:text-sm border border-slate-800 shadow-md">
            <span className="font-semibold text-blue-400 block mb-1">
              Core Architectural Principle
            </span>
            &ldquo;Bhoomisutra is not replacing existing land-record systems. It acts as an intelligent validation layer over digitized records.&rdquo;
          </div>

          {/* Judge Quick Demo Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onStartDemo('HOLD')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-700 text-white font-bold text-sm hover:bg-rose-800 transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Judge Demo: Area Mismatch (HOLD)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onStartDemo('CLEAR')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-700 text-white font-bold text-sm hover:bg-blue-800 transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Scenario A: Consistent Record (CLEAR)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-slate-700 font-semibold text-sm border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Access Demo Credentials
            </button>
          </div>

          <div className="mt-4 text-[11px] text-slate-400">
            Pre-loaded synthetic data for instant 3-minute SIH judge walkthrough · No external setup required
          </div>
        </div>
      </section>

      {/* The 9-Stage Validation Pipeline Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
            End-To-End Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            The 9-Step Verification Pipeline
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            From raw degraded archival scans to a sealed tamper-evident audit ledger with officer verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STAGES_CONFIG.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      STAGE 0{stage.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {stage.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Primary Value Proposition & Innovation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SIH26018 Core Innovation</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Validating Against Parcel History, Not Just In Isolation
              </h3>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Traditional OCR systems only transcribe words on a single page. Bhoomisutra links the record to its ancestral cadastral parcel lineage, enforcing mathematical conservation laws across decades of subdivisions, mutations, and sale transfers.
              </p>
              <div className="mt-6 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Area Conservation: Catches land inflation where child plots exceed parent plot.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Consensus OCR: Blends PaddleOCR & Tesseract to minimize transcription hallucinations.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Human-in-the-Loop: Revenue officer maintains full statutory authority and digital sign-off.</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-xs font-mono space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                <span>Deterministic Invariant In Action</span>
                <span className="text-rose-400">VIOLATION DETECTED</span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded border border-slate-800 space-y-1.5">
                <div className="text-slate-400">// Invariant: SUM(child parcels) == parent parcel</div>
                <div className="text-slate-300">Parent Plot (1998): <span className="text-white font-bold">2.40 Acre</span></div>
                <div className="text-slate-300">Child A (2018): 1.30 Acre</div>
                <div className="text-slate-300">Child B (2018): 1.35 Acre</div>
                <div className="text-rose-400 font-bold pt-1 border-t border-slate-800">
                  Total Child Area: 2.65 Acre (+0.25 Acre Mismatch!)
                </div>
              </div>
              <div className="p-2.5 rounded bg-rose-950/40 border border-rose-900 text-rose-300 text-[11px] leading-relaxed">
                Result: <span className="font-bold">ROUTING HOLD</span> · Reason: &ldquo;Child parcel area exceeds documented parent parcel area.&rdquo; · Recommended Officer Action: &ldquo;Officer verification required.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Enterprise Governance Features
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Engineered specifically for State Revenue Departments & Land Governance Agencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC)</h3>
            <p className="leading-relaxed">
              Three distinct user tiers: Admin, Officer, and Citizen. Citizens can only see their own submissions without exposure to internal officer memos. Only Admin can create officer accounts.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Tamper-Evident Hash Chain</h3>
            <p className="leading-relaxed">
              Every officer correction, value override, rule evaluation, and approval decision is cryptographically chained via SHA-256 for verifiable integrity.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Downloadable Validation Reports</h3>
            <p className="leading-relaxed">
              Generate standardized, print-ready official verification certificates containing field confidence scores, validation audit trails, and statutory legal disclaimers.
            </p>
          </div>
        </div>
      </section>

      {/* Statutory Disclaimer Footer Section */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-800">Regulatory & Administrative Notice</div>
          <p>
            &ldquo;This application is an AI-assisted validation prototype built for the Smart India Hackathon 2026. Final legal and administrative authority over land titles remains strictly with authorized revenue officers.&rdquo;
          </p>
        </div>
      </section>
    </div>
  );
};
