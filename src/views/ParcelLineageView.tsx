import React, { useState } from 'react';
import { Parcel, ParcelLineageEvent } from '../types';
import { ParcelTimeline } from '../components/ParcelTimeline';
import { GitBranch, Search, Filter, Layers, ArrowLeft } from 'lucide-react';

interface ParcelLineageViewProps {
  parcels: Record<string, Parcel>;
  selectedParcelId: string;
  lineage: ParcelLineageEvent[];
  onSelectParcel: (id: string) => void;
  onNavigate: (view: string, docId?: string) => void;
}

export const ParcelLineageView: React.FC<ParcelLineageViewProps> = ({
  parcels,
  selectedParcelId,
  lineage,
  onSelectParcel,
  onNavigate,
}) => {
  const currentParcel = parcels[selectedParcelId] || parcels['parcel-45-2'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            onClick={() => onNavigate('officer-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-700 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-blue-700" />
            <span>Cadastral Parcel Lineage & Historical Chain</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cross-generation title continuity, spatial subdivision accounting & conservation verification
          </p>
        </div>

        {/* Parcel Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Active Parcel:</label>
          <select
            value={selectedParcelId}
            onChange={(e) => onSelectParcel(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="parcel-45-2">Gat 45/2 (Pune) · Conserved 4.00 → 2.50+1.50</option>
            <option value="parcel-88-3b">Gat 88/3B (Nashik) · Area Mismatch 2.40 → 2.65</option>
          </select>
        </div>
      </div>

      {/* Main Parcel Timeline & Node Graph Component */}
      <ParcelTimeline parcel={currentParcel} lineage={lineage} />
    </div>
  );
};
