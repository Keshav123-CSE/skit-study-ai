'use client';

import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  FileText, 
  Settings, 
  FolderArchive,
  ChevronDown,
  Zap,
  HardDrive,
  ShieldCheck,
  Cloud,
  ExternalLink,
  Layers
} from 'lucide-react';
import { CollegeSubject, AIConfig } from '../types';

interface HeaderProps {
  subjects: CollegeSubject[];
  activeSubject: CollegeSubject;
  onSelectSubject: (sub: CollegeSubject) => void;
  activeTab: 'tutor' | 'assignment' | 'predictor' | 'vault';
  onSelectTab: (tab: 'tutor' | 'assignment' | 'predictor' | 'vault') => void;
  onOpenSettings: () => void;
  stats: {
    totalDocs: number;
    pyqs: number;
    notes: number;
    assignments: number;
  };
  aiConfig: AIConfig;
}

export const Header: React.FC<HeaderProps> = ({
  subjects,
  activeSubject,
  onSelectSubject,
  activeTab,
  onSelectTab,
  onOpenSettings,
  stats,
  aiConfig
}) => {
  const provider = aiConfig.provider || 'webgpu';
  const driveLink = 'https://drive.google.com/drive/folders/1gtLeObjTHq5P-GsyA6SBEAOAkus8mPWP';

  return (
    <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl transition-all">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* SKIT College Brand Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer" onClick={() => onSelectTab('tutor')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-2xl tracking-tighter ring-2 ring-amber-400/30 group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center gap-1.5">
                SKIT <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">StudyAI</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-gradient-to-r from-amber-500/10 to-indigo-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full shadow-inner">
                Swami Keshvanand Institute • RTU Kota
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Classroom Notes</span>
              <span className="text-slate-600">•</span>
              <span>PYQ Exam Forecast</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium">100% Offline Capable</span>
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Subject Selector Dropdown */}
          <div className="relative">
            <div className="relative">
              <select
                value={activeSubject.id}
                onChange={(e) => {
                  const found = subjects.find(s => s.id === e.target.value);
                  if (found) onSelectSubject(found);
                }}
                className="appearance-none bg-slate-950/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-100 text-xs sm:text-sm font-semibold rounded-xl pl-3.5 pr-9 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer shadow-sm transition-all"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id} className="bg-slate-900 text-slate-200 py-1">
                    {sub.shortName} ({sub.code}) • Sem {sub.semester}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Connected Drive Folder Link Pill */}
          <a
            href={driveLink}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-850 hover:border-sky-500/50 text-sky-300 border border-slate-700/80 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
            title="Open College PYQ Google Drive Folder"
          >
            <FolderArchive className="w-3.5 h-3.5 text-sky-400" />
            <span>PYQ Drive</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* AI Engine & Model Selector Button */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all shadow-sm cursor-pointer ${
              provider === 'webgpu'
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
                : provider === 'ollama'
                ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/50'
                : provider === 'offline_rag'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                : 'bg-sky-950/40 border-sky-500/40 text-sky-300 hover:bg-sky-900/50'
            }`}
            title="Configure Local LLM, WebGPU, Ollama, or Cloud API"
          >
            {provider === 'webgpu' && <Zap className="w-4 h-4 text-amber-400" />}
            {provider === 'ollama' && <HardDrive className="w-4 h-4 text-indigo-400" />}
            {provider === 'offline_rag' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            {provider === 'gemini' && <Cloud className="w-4 h-4 text-sky-400" />}

            <span className="hidden md:inline">
              {provider === 'webgpu'
                ? 'Local WebGPU (Offline)'
                : provider === 'ollama'
                ? 'Local Ollama'
                : provider === 'offline_rag'
                ? 'SKIT Vault RAG'
                : 'Gemini Cloud'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                provider === 'webgpu'
                  ? 'bg-amber-400 animate-pulse'
                  : provider === 'ollama'
                  ? 'bg-indigo-400 animate-pulse'
                  : provider === 'offline_rag'
                  ? 'bg-emerald-400'
                  : 'bg-sky-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar with Glassmorphic Active Pill */}
      <div className="bg-slate-950/90 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar gap-1 py-1">
          <button
            onClick={() => onSelectTab('tutor')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'tutor'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Teach from Notes</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
              AI Tutor
            </span>
          </button>

          <button
            onClick={() => onSelectTab('assignment')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'assignment'
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Assignment Solver</span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-bold">
              Teacher Format
            </span>
          </button>

          <button
            onClick={() => onSelectTab('predictor')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'predictor'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Exam Question Predictor</span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-bold">
              PYQ Forecast
            </span>
          </button>

          <button
            onClick={() => onSelectTab('vault')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'vault'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FolderArchive className="w-4 h-4 text-sky-400" />
            <span>SKIT Vault</span>
            <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded font-bold">
              {stats.totalDocs} Files
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
