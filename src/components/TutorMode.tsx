'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Lightbulb, 
  Loader2,
  Bookmark,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { CollegeSubject, AcademicDocument, ChatMessage, AIConfig } from '../types';
import { askGemini, buildGroundingPrompt, ImagePart } from '../lib/gemini';
import { MarkdownView } from './MarkdownView';

interface TutorModeProps {
  subject: CollegeSubject;
  documents: AcademicDocument[];
  aiConfig: AIConfig;
}

export const TutorMode: React.FC<TutorModeProps> = ({ subject, documents, aiConfig }) => {
  const [selectedUnit, setSelectedUnit] = useState<number>(0); // 0 = all units
  const [teachingStyle, setTeachingStyle] = useState<'detailed' | 'cram' | 'derivation'>('detailed');
  const [inputQuery, setInputQuery] = useState('');
  const [attachedImage, setAttachedImage] = useState<ImagePart | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### 👨‍🏫 Welcome to your SKIT AI Professor!
I am your personal AI tutor grounded strictly in your **SKIT College Syllabus**, **Teacher Notes**, and **RTU Past Year Papers** for **${subject.name} (${subject.code})**.

#### What I can do for you:
- **Teach from the Notes**: Explain complex topics using your professors' exact definitions, diagrams, and terminology.
- **Provide RTU Exam Tips**: Highlight where students lose marks and which steps are mandatory for full marks in RTU Part A, B, and C.
- **Clarify Doubts**: Step-by-step breakdown of algorithms, mathematical proofs, and trace tables.

Select a Unit above or click any recommended question below to start learning!`,
      timestamp: 'Just now',
      mode: 'tutor'
    }
  ]);

  // Relevant docs for current subject
  const subjectDocs = documents.filter(d => d.subjectId === subject.id);
  const notesDocs = subjectDocs.filter(d => d.category === 'notes');
  const syllabusDoc = subjectDocs.find(d => d.category === 'syllabus');

  // Suggested prompts based on subject
  const quickPrompts = [
    { label: 'Teach AVL Tree Rotations (LL, RR, LR, RL)', unit: 3 },
    { label: 'Infix to Postfix conversion step trace table', unit: 1 },
    { label: 'Circular Queue vs Linear Queue with C code', unit: 1 },
    { label: 'Dijkstra Single Source Shortest Path Algorithm', unit: 4 },
    { label: 'Explain B-Trees order m properties for RTU Part C', unit: 3 },
  ];

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

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if ((!q.trim() && !attachedImage) || isLoading) return;

    const promptText = q.trim() || 'Please explain the concept or solve what is shown in the attached image.';

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: promptText + (attachedImage ? '\n\n*(Image attached)*' : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'tutor'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    const currentImage = attachedImage;
    handleClearImage();
    setIsLoading(true);

    try {
      // Filter notes matching unit if specified
      const relevantNotes = selectedUnit > 0 
        ? notesDocs.filter(n => !n.unit || n.unit === selectedUnit)
        : notesDocs;

      const groundText = buildGroundingPrompt({
        subject,
        syllabusDoc,
        notesDocs: relevantNotes,
        assignmentDocs: subjectDocs.filter(d => d.category === 'assignment'),
        pyqDocs: subjectDocs.filter(d => d.category === 'pyq'),
        unitNumber: selectedUnit > 0 ? selectedUnit : undefined
      });

      const styleInstruction = teachingStyle === 'detailed'
        ? 'Provide a deep, classroom-level explanation with clear headings, bullet points, intuitive real-world analogies, and ASCII/markdown block diagrams.'
        : teachingStyle === 'cram'
        ? 'Provide a high-yield RTU exam cram summary: definitions, must-write formulas, and a checklist of key points to get full marks.'
        : 'Focus on mathematical rigor, step-by-step algorithmic trace, time/space complexity analysis, and proof details.';

      const systemPrompt = `You are a distinguished Engineering Professor at Swami Keshvanand Institute of Technology (SKIT), Jaipur.
Your teaching must be strictly grounded in the uploaded teacher notes, syllabus, and RTU exam pattern.
If an image is attached, carefully inspect the handwritten note, diagram, or formula in the image and explain it clearly.
${styleInstruction}

Guidelines:
1. Always state which Unit and note topic you are referencing.
2. Emphasize Rajasthan Technical University (RTU) exam answer writing standards.
3. If an algorithm is asked, give clean pseudo-code and a clear trace table.
4. Keep the tone encouraging, pedagogical, and academically rigorous.

${groundText}`;

      const aiResponse = await askGemini(
        systemPrompt,
        promptText,
        aiConfig,
        aiConfig.model,
        currentImage || undefined
      );

      const assistantMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'tutor',
        sourceReferences: relevantNotes.map(n => ({
          docTitle: n.title,
          category: n.category,
          unit: n.unit
        })),
        modelUsed: aiConfig.apiKey ? aiConfig.model : 'SKIT Offline Academic Vault'
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: `> [!WARNING]\n> Failed to generate tutor response: ${errMsg}`,
          timestamp: 'Now',
          mode: 'tutor'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 mb-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Teach from Notes: <span className="text-amber-400">{subject.name}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Concept teaching strictly grounded in {notesDocs.length} uploaded teacher notes & RTU Unit syllabus.
                </p>
              </div>
            </div>
          </div>

          {/* Unit Selector & Mode Options */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Unit:</span>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(Number(e.target.value))}
                className="bg-transparent text-amber-400 font-semibold focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-slate-900 text-slate-200">All Units (1 - 5)</option>
                {subject.units.map(u => (
                  <option key={u.unitNumber} value={u.unitNumber} className="bg-slate-900 text-slate-200">
                    Unit {u.unitNumber}: {u.title.slice(0, 24)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setTeachingStyle('detailed')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  teachingStyle === 'detailed'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Lecture
              </button>
              <button
                onClick={() => setTeachingStyle('cram')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  teachingStyle === 'cram'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                RTU Cram
              </button>
              <button
                onClick={() => setTeachingStyle('derivation')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  teachingStyle === 'derivation'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Derivation
              </button>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-amber-400" /> Quick Teach:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.label)}
              className="text-xs shrink-0 bg-slate-800/80 hover:bg-slate-700/80 hover:border-amber-500/40 border border-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full transition-all flex items-center gap-1"
            >
              <span>{p.label}</span>
              <span className="text-[10px] text-amber-400/80 bg-amber-400/10 px-1 rounded">U{p.unit}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="space-y-4 mb-24">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-xl p-4 sm:p-5 border transition-all ${
              msg.role === 'user'
                ? 'bg-slate-800/60 border-slate-700/80 ml-6 sm:ml-16 shadow-sm'
                : 'bg-slate-900 border-slate-800 mr-2 sm:mr-10 shadow-md'
            }`}
          >
            {/* Header info of message */}
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${msg.role === 'user' ? 'bg-sky-400' : 'bg-amber-400'}`} />
                <span className="font-semibold text-slate-200">
                  {msg.role === 'user' ? 'You (SKIT Student)' : 'SKIT AI Professor'}
                </span>
                {msg.modelUsed && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.2 rounded">
                    {msg.modelUsed}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500">{msg.timestamp}</span>
            </div>

            {/* Content view */}
            <MarkdownView content={msg.content} />

            {/* Note citations if assistant */}
            {msg.sourceReferences && msg.sourceReferences.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" /> Grounded In:
                </span>
                {msg.sourceReferences.map((ref, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 text-[11px]"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{ref.docTitle.slice(0, 40)}...</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mr-10 flex items-center gap-3 text-sm text-amber-400 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Consulting SKIT Teacher Notes & RTU Exam Scheme to construct the lesson...</span>
          </div>
        )}
      </div>

      {/* Floating Query Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 p-3 sm:p-4 z-30">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          {imagePreviewUrl && (
            <div className="relative self-start border border-amber-500/40 rounded-lg p-1 bg-slate-900 flex items-center gap-2">
              <img
                src={imagePreviewUrl}
                alt="Uploaded Notes"
                className="h-14 w-auto rounded object-contain"
              />
              <span className="text-[11px] text-amber-300 font-medium">Notes / Diagram attached</span>
              <button
                onClick={handleClearImage}
                className="p-1 text-slate-400 hover:text-white rounded-full bg-slate-800"
                title="Remove Image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 text-slate-400 hover:text-amber-400 rounded-xl cursor-pointer transition-colors" title="Attach Photo of Notes or Whiteboard">
              <ImageIcon className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={`Ask anything from ${subject.name} notes (e.g. "Explain AVL LR rotation with diagram", "Teach Deadlock 4 conditions")...`}
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <button
              onClick={() => handleSend()}
              disabled={(!inputQuery.trim() && !attachedImage) || isLoading}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold px-4 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
