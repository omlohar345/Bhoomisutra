import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, ArrowRight, UserCircle, AlertCircle, Layers } from 'lucide-react';
import { UserRole } from '../types';

interface LoginViewProps {
  onLoginSuccess: (email: string) => Promise<boolean>;
  onNavigate: (view: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigate,
}) => {
  const [email, setEmail] = useState<string>('demo.officer@bhoomisutra.demo');
  const [password, setPassword] = useState<string>('Bhoomi@Demo2026');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsLoading(true);
    setErrorMsg('');
    try {
      const ok = await onLoginSuccess(demoEmail);
      if (!ok) {
        setErrorMsg('Authentication failed: account may be disabled or invalid.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const ok = await onLoginSuccess(email.trim());
      if (!ok) {
        setErrorMsg('Invalid email or password. Please use one of the pre-configured demo accounts.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* SIH Demo Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>SIH 2026 DEMO ENVIRONMENT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Bhoomisutra Access Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Role-Based Access Control demo for SIH 2026 judges. Select a pre-configured role below to log in immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Officer Demo Card */}
        <div className="bg-white border-2 border-blue-500/40 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-600 transition-colors">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Recommended for Judges
              </div>
              <h2 className="text-base font-bold text-slate-900">Revenue Officer</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Taluka Tehsildar with full document review, OCR crop inspector & approval powers.
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs font-mono space-y-1">
              <div>
                <span className="text-slate-400 text-[10px] block">Email:</span>
                <span className="font-semibold text-slate-800">demo.officer@bhoomisutra.demo</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Password:</span>
                <span className="font-semibold text-slate-800">Bhoomi@Demo2026</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleQuickLogin('demo.officer@bhoomisutra.demo', 'Bhoomi@Demo2026')}
            disabled={isLoading}
            className="mt-4 w-full py-2.5 rounded-lg bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>Log In as Officer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Admin Demo Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                System Administrator
              </div>
              <h2 className="text-base font-bold text-slate-900">Commissionerate Admin</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Manages officer accounts, inspects tamper-evident audit ledger & sets rule thresholds.
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs font-mono space-y-1">
              <div>
                <span className="text-slate-400 text-[10px] block">Email:</span>
                <span className="font-semibold text-slate-800">demo.admin@bhoomisutra.demo</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Password:</span>
                <span className="font-semibold text-slate-800">Admin@Demo2026</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleQuickLogin('demo.admin@bhoomisutra.demo', 'Admin@Demo2026')}
            disabled={isLoading}
            className="mt-4 w-full py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>Log In as Admin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Citizen Demo Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <UserCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Public Landholder
              </div>
              <h2 className="text-base font-bold text-slate-900">Citizen Portal</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Restricted portal. View only own records; internal notes & admin logs strictly hidden.
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs font-mono space-y-1">
              <div>
                <span className="text-slate-400 text-[10px] block">Email:</span>
                <span className="font-semibold text-slate-800">demo.citizen@bhoomisutra.demo</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Password:</span>
                <span className="font-semibold text-slate-800">Citizen@Demo2026</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleQuickLogin('demo.citizen@bhoomisutra.demo', 'Citizen@Demo2026')}
            disabled={isLoading}
            className="mt-4 w-full py-2.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>Log In as Citizen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Manual Credentials Login Box */}
      <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600" />
          <span>Manual Sign-In</span>
        </h3>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Official Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Verifying Credentials...' : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-[11px] text-slate-400">
        Demo credentials only · Never submit actual Aadhaar, bank details or confidential personal records
      </div>
    </div>
  );
};
