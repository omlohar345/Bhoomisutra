import React from 'react';
import { User } from '../types';
import { ShieldCheck, LogOut, UserCircle, Layers, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onNavigate: (view: string, docId?: string) => void;
  onSwitchUser: (userEmail: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onNavigate,
  onSwitchUser,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand title, single line element */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-blue-800 transition-colors">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
                Bhoomisutra
              </span>
            </button>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              SIH 2026 DEMO
            </span>
          </div>

          {/* Zone 2: 4-6 text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('landing')}
              className="hover:text-blue-700 transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => {
                if (currentUser.role === 'ADMIN') onNavigate('admin-dashboard');
                else if (currentUser.role === 'CITIZEN') onNavigate('citizen-dashboard');
                else onNavigate('officer-dashboard');
              }}
              className="hover:text-blue-700 transition-colors font-semibold text-blue-900"
            >
              Dashboard
            </button>
            {currentUser.role === 'OFFICER' && (
              <>
                <button
                  onClick={() => onNavigate('officer-upload')}
                  className="hover:text-blue-700 transition-colors"
                >
                  Upload Record
                </button>
                <button
                  onClick={() => onNavigate('officer-parcel', 'parcel-45-2')}
                  className="hover:text-blue-700 transition-colors"
                >
                  Parcel Lineage
                </button>
              </>
            )}
            {currentUser.role === 'ADMIN' && (
              <>
                <button
                  onClick={() => onNavigate('admin-officers')}
                  className="hover:text-blue-700 transition-colors"
                >
                  Officer Directory
                </button>
                <button
                  onClick={() => onNavigate('admin-audit')}
                  className="hover:text-blue-700 transition-colors"
                >
                  Audit Ledger
                </button>
              </>
            )}
            <button
              onClick={() => onNavigate('login')}
              className="hover:text-blue-700 transition-colors text-slate-500"
            >
              Demo Switcher
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-xs">
              <div className="text-right hidden sm:block">
                <div className="font-semibold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-slate-500 text-[11px] font-mono capitalize">
                  {currentUser.role.toLowerCase()}
                </div>
              </div>

              {/* Quick Role Switcher Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
                  <UserCircle className="w-5 h-5 text-slate-600" />
                  <span className="sr-only">Switch Role</span>
                </button>

                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 hidden group-hover:block hover:block z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Role Switch
                  </div>
                  <button
                    onClick={() => onSwitchUser('demo.officer@bhoomisutra.demo')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentUser.role === 'OFFICER' ? 'font-bold text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    <span>Revenue Officer (Tehsildar)</span>
                    {currentUser.role === 'OFFICER' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => onSwitchUser('demo.admin@bhoomisutra.demo')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentUser.role === 'ADMIN' ? 'font-bold text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    <span>System Admin (Commissionerate)</span>
                    {currentUser.role === 'ADMIN' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => onSwitchUser('demo.citizen@bhoomisutra.demo')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentUser.role === 'CITIZEN' ? 'font-bold text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    <span>Citizen Landholder (Suresh Patil)</span>
                    {currentUser.role === 'CITIZEN' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
