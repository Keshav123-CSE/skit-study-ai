'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { TutorMode } from '../components/TutorMode';
import { AssignmentSolver } from '../components/AssignmentSolver';
import { QuestionPredictor } from '../components/QuestionPredictor';
import { DocumentManager } from '../components/DocumentManager';
import { ApiKeyModal } from '../components/ApiKeyModal';
import { CollegeSubject, AcademicDocument, PredictedQuestion, AIConfig } from '../types';
import { 
  getStoredSubjects, 
  getStoredDocuments, 
  getStoredPredictions, 
  getStoredAIConfig, 
  getActiveSubjectId, 
  setActiveSubjectId,
  savePredictions
} from '../lib/storage';
import { SEED_SUBJECTS, SEED_DOCUMENTS, SEED_PREDICTIONS } from '../data/seedData';
import { 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  FolderArchive, 
  ExternalLink, 
  CheckCircle2, 
  HardDrive,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [subjects, setSubjects] = useState<CollegeSubject[]>(SEED_SUBJECTS);
  const [activeSubject, setActiveSubject] = useState<CollegeSubject>(SEED_SUBJECTS[0]);
  const [documents, setDocuments] = useState<AcademicDocument[]>(SEED_DOCUMENTS);
  const [predictions, setPredictions] = useState<PredictedQuestion[]>(SEED_PREDICTIONS);
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    provider: 'webgpu',
    apiKey: '',
    model: 'gemini-2.0-flash',
    temperature: 0.3,
    selectedLocalModel: 'SmolLM2-360M-Instruct-q4f16_1-MLC'
  });

  const [activeTab, setActiveTab] = useState<'tutor' | 'assignment' | 'predictor' | 'vault'>('tutor');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const driveLink = 'https://drive.google.com/drive/folders/1gtLeObjTHq5P-GsyA6SBEAOAkus8mPWP';

  // Load state from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    const loadedSubs = getStoredSubjects();
    const loadedDocs = getStoredDocuments();
    const loadedPreds = getStoredPredictions();
    const loadedConfig = getStoredAIConfig();
    const activeSubId = getActiveSubjectId();

    setSubjects(loadedSubs);
    setDocuments(loadedDocs);
    setPredictions(loadedPreds);
    setAiConfig(loadedConfig);

    const foundSub = loadedSubs.find(s => s.id === activeSubId) || loadedSubs[0];
    if (foundSub) {
      setActiveSubject(foundSub);
    }
  }, []);

  const handleSelectSubject = (sub: CollegeSubject) => {
    setActiveSubject(sub);
    setActiveSubjectId(sub.id);
  };

  const handleRefreshDocs = () => {
    const updatedDocs = getStoredDocuments();
    setDocuments(updatedDocs);
  };

  const handleUpdatePredictions = (newPreds: PredictedQuestion[]) => {
    setPredictions(newPreds);
    savePredictions(newPreds);
  };

  const subjectDocs = documents.filter(d => d.subjectId === activeSubject.id);
  const stats = {
    totalDocs: subjectDocs.length,
    pyqs: subjectDocs.filter(d => d.category === 'pyq').length,
    notes: subjectDocs.filter(d => d.category === 'notes').length,
    assignments: subjectDocs.filter(d => d.category === 'assignment').length,
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 animate-pulse text-lg">
            S
          </div>
          <span className="font-semibold text-sm text-slate-200">Loading SKIT StudyAI Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 bg-mesh">
      {/* Top Navigation Header */}
      <Header
        subjects={subjects}
        activeSubject={activeSubject}
        onSelectSubject={handleSelectSubject}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        stats={stats}
        aiConfig={aiConfig}
      />

      {/* Hero / Quick Context Bar */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Subject Details & Unit Jump */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                {activeSubject.code}
              </span>
              <span className="text-sm font-bold text-white shrink-0">
                {activeSubject.name}
              </span>
              <span className="text-slate-600 shrink-0">•</span>
              <div className="flex items-center gap-1.5 shrink-0">
                {activeSubject.units.map((u) => (
                  <button
                    key={u.unitNumber}
                    onClick={() => setActiveTab('tutor')}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors"
                    title={`Unit ${u.unitNumber}: ${u.title}`}
                  >
                    U{u.unitNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick stats & action triggers */}
            <div className="flex items-center gap-2 text-xs shrink-0">
              <button
                onClick={() => setActiveTab('predictor')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:bg-purple-900/40 transition-colors font-medium"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Exam Predictor</span>
              </button>

              <button
                onClick={() => setActiveTab('assignment')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/40 transition-colors font-medium"
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Solve Assignment</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Workspace */}
      <main className="flex-1 pb-16">
        {activeTab === 'tutor' && (
          <TutorMode
            subject={activeSubject}
            documents={documents}
            aiConfig={aiConfig}
          />
        )}

        {activeTab === 'assignment' && (
          <AssignmentSolver
            subject={activeSubject}
            documents={documents}
            aiConfig={aiConfig}
          />
        )}

        {activeTab === 'predictor' && (
          <QuestionPredictor
            subject={activeSubject}
            documents={documents}
            predictions={predictions}
            onUpdatePredictions={handleUpdatePredictions}
            aiConfig={aiConfig}
          />
        )}

        {activeTab === 'vault' && (
          <DocumentManager
            subjects={subjects}
            activeSubject={activeSubject}
            documents={documents}
            onRefreshDocs={handleRefreshDocs}
          />
        )}
      </main>

      {/* Academic Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-black text-slate-950 text-sm">
                S
              </div>
              <div>
                <p className="font-bold text-slate-200">
                  Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT), Jaipur
                </p>
                <p className="text-[11px] text-slate-500">
                  Affiliated to Rajasthan Technical University (RTU Kota) • Approved by AICTE, New Delhi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <a
                href={driveLink}
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
              >
                <span>Google Drive PYQ Bank</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://www.skit.ac.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
              >
                <span>SKIT Official</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://rtu.ac.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
              >
                <span>RTU Kota</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>
              © {new Date().getFullYear()} SKIT StudyAI • Grounded Academic Model with In-Browser WebGPU & Offline RAG.
            </p>
            <p className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Production Build Verified • Ready for Deployment</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Model & AI Settings Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={aiConfig}
        onUpdateConfig={setAiConfig}
      />
    </div>
  );
}
