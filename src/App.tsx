import React, { useState, useEffect } from 'react';
import { User, LandDocument, DocumentType } from './types';
import { store } from './services/store';
import { Navbar } from './components/Navbar';
import { LandingView } from './views/LandingView';
import { LoginView } from './views/LoginView';
import { OfficerDashboardView } from './views/OfficerDashboardView';
import { OfficerUploadView } from './views/OfficerUploadView';
import { ProcessingPipelineView } from './views/ProcessingPipelineView';
import { OfficerReviewView } from './views/OfficerReviewView';
import { ParcelLineageView } from './views/ParcelLineageView';
import { ValidationReportView } from './views/ValidationReportView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { CitizenDashboardView } from './views/CitizenDashboardView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(store.getCurrentUser());
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activeDocId, setActiveDocId] = useState<string>('DOC-2026-CLEAR-4502');
  const [activeParcelId, setActiveParcelId] = useState<string>('parcel-45-2');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Initialize store and sync state
  useEffect(() => {
    store.init().then(() => {
      setCurrentUser(store.getCurrentUser());
      setRefreshKey(prev => prev + 1);
    });
  }, []);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const handleNavigate = (view: string, docId?: string) => {
    if (docId) {
      if (docId.startsWith('parcel-')) {
        setActiveParcelId(docId);
      } else {
        setActiveDocId(docId);
      }
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchUser = async (userEmail: string) => {
    const res = await store.loginByEmail(userEmail);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      if (res.user.role === 'ADMIN') {
        setCurrentView('admin-dashboard');
      } else if (res.user.role === 'CITIZEN') {
        setCurrentView('citizen-dashboard');
      } else {
        setCurrentView('officer-dashboard');
      }
      triggerRefresh();
    }
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  const handleStartJudgeDemo = async (scenarioKey?: 'CLEAR' | 'HOLD') => {
    // Switch to Officer if not already
    if (currentUser.role !== 'OFFICER') {
      await store.loginByEmail('demo.officer@bhoomisutra.demo');
      setCurrentUser(store.getCurrentUser());
    }

    if (scenarioKey === 'HOLD') {
      setActiveDocId('DOC-2026-HOLD-8831');
      setActiveParcelId('parcel-88-3b');
    } else {
      setActiveDocId('DOC-2026-CLEAR-4502');
      setActiveParcelId('parcel-45-2');
    }

    setCurrentView('officer-processing');
    triggerRefresh();
  };

  const handleCorrectField = async (fieldId: string, newValue: string, reason: string) => {
    await store.correctExtractedField({
      documentId: activeDocId,
      fieldId,
      newValue,
      reason,
    });
    triggerRefresh();
  };

  const handleSubmitDecision = async (
    decision: 'APPROVED' | 'CORRECTION_REQUESTED' | 'REJECTED',
    comments: string
  ) => {
    await store.submitOfficerDecision({
      documentId: activeDocId,
      decision,
      comments,
    });
    triggerRefresh();
  };

  // Active document resolution
  const activeDocument =
    store.getDocumentById(activeDocId) ||
    store.getDocuments()[0] || {
      id: 'DOC-FALLBACK',
      fileName: 'Document_Not_Found.pdf',
      extractedFields: [],
      validationRules: [],
      trustScore: { overallScore: 0, routing: 'HOLD' },
    } as unknown as LandDocument;

  const documents = store.getDocuments();
  const dashboardStats = store.getDashboardStats();
  const allOfficers = store.getOfficers();
  const allAuditLogs = store.getAuditLogs();
  const systemThresholds = store.getThresholds();
  const parcels = store.getParcels();
  const parcelLineage = store.getParcelLineage(activeParcelId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'landing' && (
          <LandingView
            onStartDemo={handleStartJudgeDemo}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'login' && (
          <LoginView
            onLoginSuccess={async (email) => {
              const res = await store.loginByEmail(email);
              if (res.success && res.user) {
                setCurrentUser(res.user);
                if (res.user.role === 'ADMIN') setCurrentView('admin-dashboard');
                else if (res.user.role === 'CITIZEN') setCurrentView('citizen-dashboard');
                else setCurrentView('officer-dashboard');
                triggerRefresh();
                return true;
              }
              return false;
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'officer-dashboard' && (
          <OfficerDashboardView
            currentUser={currentUser}
            documents={documents}
            stats={dashboardStats}
            onNavigate={handleNavigate}
            onOpenDemo={handleStartJudgeDemo}
          />
        )}

        {currentView === 'officer-upload' && (
          <OfficerUploadView
            onUploadSuccess={async (params) => {
              const newDoc = await store.uploadCustomDocument(params);
              setActiveDocId(newDoc.id);
              triggerRefresh();
              return newDoc;
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'officer-processing' && (
          <ProcessingPipelineView
            document={activeDocument}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'officer-review' && (
          <OfficerReviewView
            document={activeDocument}
            onCorrectField={handleCorrectField}
            onSubmitDecision={handleSubmitDecision}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'officer-parcel' && (
          <ParcelLineageView
            parcels={parcels}
            selectedParcelId={activeParcelId}
            lineage={parcelLineage}
            onSelectParcel={(id) => {
              setActiveParcelId(id);
              triggerRefresh();
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'officer-reports' && (
          <ValidationReportView
            document={activeDocument}
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboardView
            currentUser={currentUser}
            officers={allOfficers}
            documents={documents}
            auditLogs={allAuditLogs}
            thresholds={systemThresholds}
            stats={dashboardStats}
            onCreateOfficer={(officerData) => {
              const res = store.createOfficer(officerData);
              triggerRefresh();
              return res;
            }}
            onToggleOfficerStatus={(id) => {
              store.toggleOfficerStatus(id);
              triggerRefresh();
            }}
            onResetOfficerPassword={(id) => {
              store.resetOfficerPassword(id);
              triggerRefresh();
            }}
            onUpdateThresholds={(th) => {
              store.updateThresholds(th);
              triggerRefresh();
            }}
            onResetDatabase={async () => {
              await store.resetToDefaults();
              triggerRefresh();
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'citizen-dashboard' && (
          <CitizenDashboardView
            currentUser={currentUser}
            documents={documents}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">BHOOMISUTRA</span>
            <span>·</span>
            <span>SIH26018 Intelligent Land Record Digitization & Validation System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Deterministic Land Invariant Engine</span>
            <span>·</span>
            <span>SHA-256 Hash Chained Ledger</span>
            <span>·</span>
            <span>Maharashtra Land Revenue Code §85</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
