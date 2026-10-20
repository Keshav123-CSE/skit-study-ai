'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  FileEdit, 
  Loader2, 
  FileCheck2,
  Calendar,
  Award,
  Image as ImageIcon,
  Printer,
  X
} from 'lucide-react';
import { CollegeSubject, AcademicDocument, AIConfig } from '../types';
import { askGemini, buildGroundingPrompt, ImagePart } from '../lib/gemini';
import { MarkdownView } from './MarkdownView';

interface AssignmentSolverProps {
  subject: CollegeSubject;
  documents: AcademicDocument[];
  aiConfig: AIConfig;
}

export const AssignmentSolver: React.FC<AssignmentSolverProps> = ({
  subject,
  documents,
  aiConfig
}) => {
  const subjectDocs = documents.filter(d => d.subjectId === subject.id);
  const assignments = subjectDocs.filter(d => d.category === 'assignment');
  const notes = subjectDocs.filter(d => d.category === 'notes');
  const syllabus = subjectDocs.find(d => d.category === 'syllabus');

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    assignments[0]?.id || 'custom'
  );
  const [customQuestion, setCustomQuestion] = useState('');
  const [attachedImage, setAttachedImage] = useState<ImagePart | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [solutionOutput, setSolutionOutput] = useState<string>('');
  const [isSolving, setIsSolving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [includeTraceTable, setIncludeTraceTable] = useState(true);
  const [rtuMarkingFormat, setRtuMarkingFormat] = useState(true);

  const activeAssignment = assignments.find(a => a.id === selectedAssignmentId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setAttachedImage({
        mimeType: file.type || 'image/jpeg',
        dataBase64: base64
      });
      setImagePreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setAttachedImage(null);
    setImagePreviewUrl(null);
  };

  const handleSolve = async (promptToSolve?: string) => {
    let targetQuestion = promptToSolve || customQuestion;

    if (!targetQuestion && activeAssignment && !attachedImage) {
      targetQuestion = activeAssignment.content;
    }

    if (!targetQuestion.trim() && !attachedImage) return;

    setIsSolving(true);
    setSolutionOutput('');

    try {
      const groundText = buildGroundingPrompt({
        subject,
        syllabusDoc: syllabus,
        notesDocs: notes,
        assignmentDocs: assignments,
        pyqDocs: subjectDocs.filter(d => d.category === 'pyq')
      });

      const systemPrompt = `You are the Official Assignment Evaluation and Solution Expert for Swami Keshvanand Institute of Technology (SKIT), Jaipur.
Your objective is to provide a comprehensive, 100% full-scoring, classroom-grade solution to the student's assignment question.
If an image is attached, carefully read the problem statements, figures, or handwritten equations from the image.

CRITICAL INSTRUCTION: The solution must strictly follow the professor's classroom notes, notation, trace formats, and RTU presentation standards:
1. **Given Data / Question Restatement**
2. **Formulas & Theoretical Basis (cite the specific Unit and concept from the teacher's notes)**
3. **Step-by-Step Solution / Algorithm / Trace Table**:
   ${includeTraceTable ? '- If solving expression conversion or numericals, provide a full markdown table with columns: Step, Scanned Token, Stack State, Output, Reason.' : ''}
4. **Code / Diagram (if requested)**: Provide clean, well-commented C/C++ or Python code with boundary checks.
5. **Complexity Analysis**: Time and Space complexity.
6. **Teacher Alignment Note**: Explicitly confirm that the solution adheres to the teacher's preferred notation and RTU exam step-marking scheme.

${groundText}`;

      const solution = await askGemini(
        systemPrompt,
        `Please solve this assignment according to the teacher's notes with full steps:\n\n${targetQuestion || 'Solve the question shown in the attached image.'}`,
        aiConfig,
        aiConfig.model,
        attachedImage || undefined
      );

      setSolutionOutput(solution);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSolutionOutput(`> [!WARNING]\n> Failed to generate assignment solution: ${msg}`);
    } finally {
      setIsSolving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(solutionOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                SKIT Assignment Solver <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">Teacher-Aligned</span>
              </h2>
              <p className="text-xs text-slate-400">
                Generate complete, high-scoring solutions aligned with your professors` classroom notes & RTU step marking.
              </p>
            </div>
          </div>

          {/* Solution Format Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={includeTraceTable}
                onChange={(e) => setIncludeTraceTable(e.target.checked)}
                className="rounded text-indigo-500 focus:ring-0"
              />
              <span>Include Trace Tables</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={rtuMarkingFormat}
                onChange={(e) => setRtuMarkingFormat(e.target.checked)}
                className="rounded text-indigo-500 focus:ring-0"
              />
              <span>RTU Step-Marking Scheme</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Select / Paste Assignment */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Assignments Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-400" />
              <span>Present Year Assignments ({assignments.length})</span>
            </h3>

            {assignments.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                No assignments found for {subject.shortName}. You can paste any question below or upload one in SKIT Vault!
              </p>
            ) : (
              <div className="space-y-2 mb-4">
                {assignments.map((assign) => (
                  <div
                    key={assign.id}
                    onClick={() => {
                      setSelectedAssignmentId(assign.id);
                      setCustomQuestion('');
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedAssignmentId === assign.id
                        ? 'bg-indigo-950/30 border-indigo-500/60 shadow-sm'
                        : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span className="truncate">{assign.title}</span>
                      <span className="text-[10px] bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded">
                        Unit {assign.unit || 'All'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      {assign.assignmentDetails?.deadline && (
                        <span className="flex items-center gap-1 text-amber-400/90">
                          <Calendar className="w-3 h-3" /> Due: {assign.assignmentDetails.deadline}
                        </span>
                      )}
                      {assign.assignmentDetails?.totalMarks && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Award className="w-3 h-3" /> {assign.assignmentDetails.totalMarks} Marks
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Custom Question Option */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileEdit className="w-3.5 h-3.5 text-indigo-400" /> Enter / Paste Problem:
                </span>
                <label className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Attach Question Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </label>

              {/* Image Preview Thumbnail if selected */}
              {imagePreviewUrl && (
                <div className="relative inline-block border border-indigo-500/40 rounded-lg p-1 bg-slate-950">
                  <img
                    src={imagePreviewUrl}
                    alt="Assignment Photo"
                    className="h-20 w-auto rounded object-contain"
                  />
                  <button
                    onClick={handleClearImage}
                    className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5 shadow hover:bg-rose-500"
                    title="Remove Photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="block text-[9px] text-indigo-300 text-center mt-0.5">Photo Attached</span>
                </div>
              )}

              <textarea
                rows={4}
                value={customQuestion}
                onChange={(e) => {
                  setCustomQuestion(e.target.value);
                  setSelectedAssignmentId('custom');
                }}
                placeholder="Paste your assignment question here (e.g. 'Convert (A+B*C)/(D-E^F)*G to postfix' or 'Find safe sequence using Banker Algorithm with given allocation matrices')..."
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-lg p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Solve Button */}
            <button
              onClick={() => handleSolve()}
              disabled={isSolving || (!customQuestion.trim() && !activeAssignment && !attachedImage)}
              className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-indigo-600/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              {isSolving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Teacher Notes Solution...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Solve Assignment (Teacher Style)</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Problem Shortcuts */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> One-Click Assignment Solvers:
            </h4>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  const q = 'Convert (A + B * C) / (D - E ^ F) * G into Postfix showing 4-column trace table with Symbol Scanned, Stack Content, Output, and Reason.';
                  setCustomQuestion(q);
                  handleSolve(q);
                }}
                className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 text-slate-300 hover:text-white text-xs transition-colors flex items-center justify-between"
              >
                <span>Assignment 1 Q1: Infix to Postfix Stack Trace</span>
                <span className="text-[10px] text-indigo-400 font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded">5 M</span>
              </button>
              <button
                onClick={() => {
                  const q = 'Solve Banker Algorithm safe sequence for 5 processes P0-P4 with Allocation and Max matrices. Calculate Need Matrix and verify if system is safe.';
                  setCustomQuestion(q);
                  handleSolve(q);
                }}
                className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 text-slate-300 hover:text-white text-xs transition-colors flex items-center justify-between"
              >
                <span>Assignment 2 Q1: Banker Deadlock Safe Sequence</span>
                <span className="text-[10px] text-indigo-400 font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded">10 M</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Solution Display */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Teacher-Style Official Solution
                </h3>
              </div>

              {solutionOutput && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    title="Print or Save as PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Print / PDF</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {isSolving ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-sm font-semibold text-slate-200">
                  Formulating Solution from SKIT Classroom Notes...
                </p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Cross-referencing teacher notations, step-marking rubrics, and trace tables to ensure full marks.
                </p>
              </div>
            ) : solutionOutput ? (
              <div className="flex-1">
                {/* Official College Print Header (Appears in Print or Screen Header) */}
                <div className="mb-4 p-4 rounded-xl border border-indigo-500/20 bg-slate-950/60 print:border-black print:bg-white text-xs">
                  <div className="text-center pb-2 border-b border-slate-800 print:border-black">
                    <h3 className="font-bold text-sm text-white print:text-black uppercase tracking-wider">
                      Swami Keshvanand Institute of Technology, Management & Gramothan, Jaipur
                    </h3>
                    <p className="text-slate-400 print:text-black text-[11px]">
                      Affiliated to Rajasthan Technical University (RTU Kota) • Department of Computer Science & Engineering
                    </p>
                    <p className="text-amber-400 print:text-black font-semibold mt-1">
                      Subject: {subject.name} ({subject.code}) • Semester {subject.semester}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2.5 text-[11px] text-slate-400 print:text-black">
                    <div><span className="font-semibold text-slate-300 print:text-black">Student Name:</span> __________________</div>
                    <div><span className="font-semibold text-slate-300 print:text-black">Roll No:</span> __________________</div>
                    <div><span className="font-semibold text-slate-300 print:text-black">Date:</span> {new Date().toLocaleDateString()}</div>
                  </div>
                </div>

                <MarkdownView content={solutionOutput} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-slate-500">
                <div className="w-14 h-14 rounded-full bg-slate-800/80 flex items-center justify-center mb-3">
                  <GraduationCap className="w-7 h-7 text-indigo-400/60" />
                </div>
                <h4 className="text-sm font-semibold text-slate-300">Ready to Solve Your Assignment</h4>
                <p className="text-xs text-slate-500 max-w-md mt-1">
                  Select an assignment from the left or paste your professor`s questions. The AI will output a complete solution in the exact presentation format required for top marks.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
