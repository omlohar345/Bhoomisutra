import React from 'react';
import { Parcel, ParcelLineageEvent } from '../types';
import { GitBranch, AlertOctagon, CheckCircle2, ArrowRight, MapPin, Calendar, User, FileText } from 'lucide-react';

interface ParcelTimelineProps {
  parcel: Parcel;
  lineage: ParcelLineageEvent[];
}

export const ParcelTimeline: React.FC<ParcelTimelineProps> = ({
  parcel,
  lineage,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
      {/* Header with Synthetic Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Parcel Historical Lineage Graph · Gat/Survey No. {parcel.surveyNumber}
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              DEMO DATA — Synthetic Example for SIH Presentation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Village: {parcel.village} · Tehsil: {parcel.tehsil} · District: {parcel.district} · ULPIN: {parcel.ulpin}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="text-slate-500">Current Area:</span>
          <span className="font-bold text-slate-900">{parcel.currentArea} {parcel.unit}</span>
        </div>
      </div>

      {/* Cadastral Map Visual Context */}
      <div className="bg-slate-900 rounded-lg p-3 text-white flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-48 h-28 rounded overflow-hidden shrink-0 border border-slate-700">
          <img
            src="/src/assets/images/cadastral_parcel_map_1790261917801.jpg"
            alt="Cadastral GIS Map"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-blue-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>Cadastral Spatial Ledger Link (GIS Vector Map)</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Cadastral coordinates cross-referenced with Bhu-Aadhaar ULPIN {parcel.ulpin}. Spatial topological polygon matches verified boundaries.
          </p>
          <div className="text-[10px] text-slate-400 font-mono pt-1">
            Lat/Long Centroid: 18.5204° N, 73.8567° E · Maharashtra Land Revenue Code §85
          </div>
        </div>
      </div>

      {/* Timeline Nodes */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {lineage.map((event, idx) => {
          const isCurrent = event.eventType === 'CURRENT_RECORD';
          const isViolation = event.isViolation;

          return (
            <div key={event.id} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${
                  isViolation
                    ? 'border-rose-600 text-rose-600'
                    : isCurrent
                    ? 'border-blue-600 text-blue-600'
                    : 'border-slate-400 text-slate-400'
                }`}
              >
                {isViolation ? (
                  <AlertOctagon className="w-3 h-3 fill-rose-100" />
                ) : isCurrent ? (
                  <CheckCircle2 className="w-3 h-3 fill-blue-100" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                )}
              </div>

              {/* Event Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isViolation
                    ? 'bg-rose-50/40 border-rose-300 shadow-xs'
                    : isCurrent
                    ? 'bg-blue-50/30 border-blue-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {event.year}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      {event.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{event.date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 my-2">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">{event.primaryParty}</span>
                    {event.secondaryParty && (
                      <span className="text-slate-500">→ {event.secondaryParty}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 sm:justify-end font-mono">
                    <span className="text-slate-400">Area Transition:</span>
                    <span className="font-bold text-slate-900">
                      {event.areaBefore} {event.unit}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span
                      className={`font-bold ${
                        isViolation ? 'text-rose-600' : 'text-slate-900'
                      }`}
                    >
                      {event.areaAfter} {event.unit}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {event.notes}
                </p>

                {/* Sub-parcels table if partition */}
                {event.subParcels && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80">
                    <div className="text-[11px] font-bold text-slate-500 mb-1.5">
                      Subdivided Child Parcels Breakdown:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {event.subParcels.map((sp) => (
                        <div
                          key={sp.surveyNumber}
                          className="p-2 rounded bg-white border border-slate-200 text-xs flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-slate-900">Gat {sp.surveyNumber}</span>
                            <span className="text-slate-500 ml-2 font-mono text-[11px]">({sp.owner})</span>
                          </div>
                          <span className="font-mono font-bold text-blue-700">
                            {sp.area} {event.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Reference: {event.documentRef}</span>
                  </span>
                  {isViolation && (
                    <span className="font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      Area Conservation Invariant Violated
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
