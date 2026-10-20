'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Award, 
  HelpCircle, 
  RefreshCw, 
  CheckCircle2, 
  FileText, 
  ChevronRight, 
  ChevronDown,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { CollegeSubject, AcademicDocument, PredictedQuestion, AIConfig } from '../types';
import { generateQuestionPredictions, askGemini, buildGroundingPrompt } from '../lib/gemini';
import { MarkdownView } from './MarkdownView';

interface QuestionPredictorProps {
  subject: CollegeSubject;
  documents: AcademicDocument[];
  predictions: PredictedQuestion[];
  onUpdatePredictions: (newPreds: PredictedQuestion[]) => void;
  aiConfig: AIConfig;
}

export const QuestionPredictor: React.FC<QuestionPredictorProps> = ({
  subject,
  documents,
  predictions,
  onUpdatePredictions,
  aiConfig
}) => {
  const [selectedExamType, setSelectedExamType] = useState<'ALL' | 'RTU_MAIN' | 'SKIT_MT1' | 'SKIT_MT2'>('ALL');
  const [activePartTab, setActivePartTab] = useState<'ALL' | 'PART_A' | 'PART_B' | 'PART_C'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [modelSolutionModal, setModelSolutionModal] = useState<{
    question: PredictedQuestion;
    solution: string;
    loading: boolean;
  } | null>(null);

  // Filter predictions for current subject
  const subjectPredictions = predictions.filter(p => p.subjectId === subject.id);

  const handlePrintPredictions = () => {
    window.print();
  };

  // Filter by Part
  const filteredPredictions = subjectPredictions.filter(p => {
    if (activePartTab !== 'ALL' && p.part !== activePartTab) return false;
    if (selectedExamType === 'SKIT_MT1' && (p.unit !== 1 && p.unit !== 2)) return false;
    if (selectedExamType === 'SKIT_MT2' && (p.unit !== 3 && p.unit !== 4)) return false;
    return true;
  });

  const pyqDocs = documents.filter(d => d.subjectId === subject.id && d.category === 'pyq');
  const notesDocs = documents.filter(d => d.subjectId === subject.id && d.category === 'notes');
  const assignmentDocs = documents.filter(d => d.subjectId === subject.id && d.category === 'assignment');

  const handleRunPrediction = async () => {
    setIsPredicting(true);
    try {
      const newPreds = await generateQuestionPredictions(
        subject,
        documents,
        aiConfig,
        aiConfig.model
      );

      // Merge with existing
      const otherPreds = predictions.filter(p => p.subjectId !== subject.id);
      onUpdatePredictions([...newPreds, ...otherPreds]);
    } catch (err) {
      console.error('Failed to run question prediction', err);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleGenerateSolution = async (q: PredictedQuestion) => {
    setModelSolutionModal({
      question: q,
      solution: '',
      loading: true
    });

    try {
      const groundText = buildGroundingPrompt({
        subject,
        notesDocs,
        assignmentDocs,
        pyqDocs,
        unitNumber: q.unit
      });

      const systemPrompt = `You are the Rajasthan Technical University (RTU) Chief Examiner for ${subject.name}.
Write an official, flawless model answer for this predicted ${q.part} (${q.expectedMarks} Marks) question.
Provide full step-by-step working, diagrams, formulas, and teacher's preferred notation so that the student scores 100% of the allocated marks.
${groundText}`;

      const ans = await askGemini(
        systemPrompt,
        `Provide complete model answer for RTU examination:\nQuestion: ${q.questionText}\nMarks: ${q.expectedMarks}`,
        aiConfig,
        aiConfig.model
      );

      setModelSolutionModal({
        question: q,
        solution: ans,
        loading: false
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setModelSolutionModal({
        question: q,
        solution: `> [!WARNING]\n> Failed to generate model solution: ${msg}`,
        loading: false
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                RTU & SKIT Question Prediction Engine
              </h2>
              <p className="text-xs text-slate-400">
                Statistical frequency modeling + AI reasoning across {pyqDocs.length} PYQs, {notesDocs.length} Teacher Notes, and {assignmentDocs.length} Current Assignments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPredictions}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Print Question Prediction Sheet"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Print Sheet</span>
            </button>

            <button
              onClick={handleRunPrediction}
              disabled={isPredicting}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-xl shadow-md shadow-purple-600/20 text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isPredicting ? 'animate-spin' : ''}`} />
              <span>{isPredicting ? 'Forecasting Trends...' : 'Re-Run AI Predictor'}</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Target Exam Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Target Exam:</span>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedExamType('ALL')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedExamType === 'ALL'
                    ? 'bg-purple-500/20 text-purple-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Papers
              </button>
              <button
                onClick={() => setSelectedExamType('SKIT_MT1')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedExamType === 'SKIT_MT1'
                    ? 'bg-purple-500/20 text-purple-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SKIT MT-1 (U1, U2)
              </button>
              <button
                onClick={() => setSelectedExamType('SKIT_MT2')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedExamType === 'SKIT_MT2'
                    ? 'bg-purple-500/20 text-purple-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SKIT MT-2 (U3, U4)
              </button>
              <button
                onClick={() => setSelectedExamType('RTU_MAIN')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedExamType === 'RTU_MAIN'
                    ? 'bg-purple-500/20 text-purple-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                RTU End-Term (All)
              </button>
            </div>
          </div>

          {/* Part Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActivePartTab('ALL')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activePartTab === 'ALL' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              All Parts
            </button>
            <button
              onClick={() => setActivePartTab('PART_A')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activePartTab === 'PART_A' ? 'bg-emerald-950/60 text-emerald-300 font-semibold' : 'text-slate-400'
              }`}
            >
              Part A (2M)
            </button>
            <button
              onClick={() => setActivePartTab('PART_B')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activePartTab === 'PART_B' ? 'bg-sky-950/60 text-sky-300 font-semibold' : 'text-slate-400'
              }`}
            >
              Part B (4M)
            </button>
            <button
              onClick={() => setActivePartTab('PART_C')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activePartTab === 'PART_C' ? 'bg-amber-950/60 text-amber-300 font-semibold' : 'text-slate-400'
              }`}
            >
              Part C (10M)
            </button>
          </div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        {filteredPredictions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            <TrendingUp className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200">No Predicted Questions for Current Filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Click &quot;Re-Run AI Predictor&quot; above to generate question predictions from your uploaded papers.
            </p>
          </div>
        ) : (
          filteredPredictions.map((pred) => {
            const isExpanded = expandedId === pred.id;
            return (
              <div
                key={pred.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 shadow-sm transition-all"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                        pred.part === 'PART_C'
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                          : pred.part === 'PART_B'
                          ? 'bg-sky-950/40 border-sky-500/40 text-sky-300'
                          : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      }`}
                    >
                      {pred.part} • {pred.expectedMarks} Marks
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      Unit {pred.unit}
                    </span>
                  </div>

                  {/* Confidence Badge & Mini Progress Bar */}
                  <div className="flex items-center gap-2.5">
                    <div className="hidden sm:flex flex-col items-end gap-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Exam Recurrence</span>
                      <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-amber-400 h-full rounded-full"
                          style={{ width: `${pred.probability}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-inner">
                      <Sparkles className="w-3 h-3 text-purple-400" /> {pred.probability}% Likelihood
                    </span>
                  </div>
                </div>

                {/* Question Statement */}
                <h3 className="text-sm sm:text-base font-bold text-white mt-3 leading-relaxed">
                  {pred.questionText}
                </h3>

                {/* Trend Reasoning */}
                <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-purple-300">Trend & Recurrence Analysis: </span>
                    <span>{pred.trendReason}</span>
                  </div>
                </div>

                {/* PYQ Sources tags */}
                {pred.sourcePYQYears.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-slate-500 text-[11px] font-medium">Appeared in:</span>
                    {pred.sourcePYQYears.map((src, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] font-mono border border-slate-700/60">
                        {src}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions & Expand Details */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : pred.id)}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors font-medium"
                  >
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span>{isExpanded ? 'Hide Marking Outline' : 'View Model Answer Outline'}</span>
                  </button>

                  <button
                    onClick={() => handleGenerateSolution(pred)}
                    className="text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Generate Complete Model Solution</span>
                  </button>
                </div>

                {/* Expanded Model Outline */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-800 bg-slate-950/60 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Key Answer Points Required for Full {pred.expectedMarks} Marks:
                    </h4>
                    <ul className="space-y-1.5 mb-3">
                      {pred.modelAnswerPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    {pred.teacherEmphasisNote && (
                      <div className="p-2.5 bg-amber-950/30 border-l-2 border-amber-500 rounded text-xs text-amber-200">
                        <span className="font-semibold">SKIT Professor Note: </span>
                        {pred.teacherEmphasisNote}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Complete Model Solution Modal */}
      {modelSolutionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">
                  Predicted Model Solution ({modelSolutionModal.question.part} • {modelSolutionModal.question.expectedMarks} Marks)
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                  {modelSolutionModal.question.questionText}
                </h3>
              </div>
              <button
                onClick={() => setModelSolutionModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {modelSolutionModal.loading ? (
                <div className="py-16 text-center text-slate-400">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-200">
                    Drafting RTU Full-Marks Model Solution...
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Incorporating professor notations, trace tables, and marking guidelines.
                  </p>
                </div>
              ) : (
                <MarkdownView content={modelSolutionModal.solution} />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={() => setModelSolutionModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
