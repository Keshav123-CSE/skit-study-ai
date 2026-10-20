'use client';

import React, { useState } from 'react';
import { 
  FolderArchive, 
  Plus, 
  Search, 
  Trash2, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  Download, 
  Upload, 
  Calendar,
  Eye,
  Tag,
  RotateCcw,
  ExternalLink,
  HardDrive,
  Loader2,
  CheckCircle2,
  FileUp,
  AlertTriangle
} from 'lucide-react';
import { CollegeSubject, AcademicDocument, ResourceCategory, ExamType, Department } from '../types';
import { addDocument, deleteDocument, resetAllDataToDefault, exportAllDataAsJSON, importDataFromJSON } from '../lib/storage';
import { extractTextFromPDF, detectPYQMetadata } from '../lib/pdfExtractor';
import { MarkdownView } from './MarkdownView';

interface DocumentManagerProps {
  subjects: CollegeSubject[];
  activeSubject: CollegeSubject;
  documents: AcademicDocument[];
  onRefreshDocs: () => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  subjects,
  activeSubject,
  documents,
  onRefreshDocs
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'ALL'>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<AcademicDocument | null>(null);

  // PDF Batch Uploader State
  const [isUploadingPDF, setIsUploadingPDF] = useState(false);
  const [pdfUploadStatus, setPdfUploadStatus] = useState<string>('');
  const [importedPdfCount, setImportedPdfCount] = useState<number>(0);

  // Form State for new document
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ResourceCategory>('notes');
  const [newSubjectId, setNewSubjectId] = useState(activeSubject.id);
  const [newUnit, setNewUnit] = useState<number>(1);
  const [newYear, setNewYear] = useState('2024');
  const [newExamType, setNewExamType] = useState<ExamType>('RTU_MAIN');
  const [newTeacher, setNewTeacher] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newTotalMarks, setNewTotalMarks] = useState<number>(20);
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const driveLink = 'https://drive.google.com/drive/folders/1gtLeObjTHq5P-GsyA6SBEAOAkus8mPWP';

  // Filtered docs
  const filteredDocs = documents.filter((doc) => {
    if (doc.subjectId !== activeSubject.id) return false;
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
    if (selectedUnit !== 'ALL' && doc.unit !== selectedUnit) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchContent = doc.content.toLowerCase().includes(q);
      const matchTags = doc.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTags) return false;
    }
    return true;
  });

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const sub = subjects.find(s => s.id === newSubjectId) || activeSubject;

    addDocument({
      title: newTitle.trim(),
      category: newCategory,
      subjectId: newSubjectId,
      semester: sub.semester,
      department: sub.department,
      unit: newUnit,
      year: newCategory === 'pyq' ? newYear : undefined,
      examType: newCategory === 'pyq' ? newExamType : undefined,
      teacherName: newCategory === 'notes' ? newTeacher.trim() : undefined,
      content: newContent.trim(),
      tags: newTags ? newTags.split(',').map(t => t.trim()) : [newCategory, sub.shortName],
      assignmentDetails: newCategory === 'assignment' ? {
        deadline: newDeadline,
        totalMarks: newTotalMarks
      } : undefined
    });

    setNewTitle('');
    setNewContent('');
    setNewTeacher('');
    setNewTags('');
    setIsAddModalOpen(false);
    onRefreshDocs();
  };

  const handleBatchPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPDF(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setPdfUploadStatus(`Processing ${file.name} (${i + 1}/${files.length})...`);

      try {
        let extractedText = '';
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          extractedText = await extractTextFromPDF(file);
        } else {
          extractedText = await file.text();
        }

        if (extractedText && extractedText.trim().length > 20) {
          const meta = detectPYQMetadata(file.name, extractedText);

          addDocument({
            title: meta.titleSuggestion,
            category: 'pyq',
            subjectId: activeSubject.id,
            semester: activeSubject.semester,
            department: meta.department || activeSubject.department,
            year: meta.year,
            examType: meta.examType,
            content: extractedText,
            tags: ['Google Drive PYQ', meta.year, meta.examType, activeSubject.shortName]
          });

          successCount++;
        }
      } catch (err) {
        console.warn(`Could not parse ${file.name}:`, err);
      }
    }

    setIsUploadingPDF(false);
    setImportedPdfCount(successCount);
    setPdfUploadStatus(`Successfully parsed and indexed ${successCount} past year paper(s)!`);
    onRefreshDocs();

    setTimeout(() => {
      setPdfUploadStatus('');
    }, 5000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this academic resource?')) {
      deleteDocument(id);
      onRefreshDocs();
      if (viewingDoc?.id === id) setViewingDoc(null);
    }
  };

  const handleExport = () => {
    const json = exportAllDataAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SKIT_Academic_Vault_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataFromJSON(content);
        if (success) {
          alert('Academic Vault data imported successfully!');
          onRefreshDocs();
        } else {
          alert('Failed to parse JSON file.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner with Google Drive Integration & Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-xl">
              <FolderArchive className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                SKIT Academic Vault: <span className="text-sky-400">{activeSubject.shortName}</span>
              </h2>
              <p className="text-xs text-slate-400">
                Store and index College Past Papers (PYQs), RTU Syllabus, Teacher Notes, and Assignments.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-3.5 rounded-xl shadow-md shadow-sky-600/20 text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>

            <button
              onClick={handleExport}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Export Vault as JSON backup"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export</span>
            </button>

            <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>

            <button
              onClick={() => {
                if (confirm('Reset academic vault back to default SKIT sample papers and notes?')) {
                  resetAllDataToDefault();
                  onRefreshDocs();
                }
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 rounded-xl text-xs transition-colors"
              title="Reset to default SKIT seed data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Google Drive Link & Batch PDF Zone */}
        <div className="mt-5 p-4 bg-gradient-to-r from-sky-950/40 to-indigo-950/40 rounded-xl border border-sky-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-sky-500/20 border border-sky-500/40 rounded-lg text-sky-300 shrink-0 mt-0.5">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Connected SKIT PYQ Google Drive Folder
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-semibold">
                  Source Linked
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Folder: <code className="text-sky-300 font-mono text-[11px] break-all">{driveLink}</code>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Download the PYQ PDFs from this drive folder, then drop them into the PDF Importer below to automatically extract text and train the AI model!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={driveLink}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>Open Drive Folder</span>
            </a>

            {/* Direct Multi-PDF Upload Button */}
            <label className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-sky-600/20 cursor-pointer">
              {isUploadingPDF ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing PDFs...</span>
                </>
              ) : (
                <>
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Batch Import PYQ PDFs</span>
                </>
              )}
              <input
                type="file"
                multiple
                accept=".pdf,.txt,.md"
                onChange={handleBatchPdfUpload}
                disabled={isUploadingPDF}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Upload Status Alert if any */}
        {pdfUploadStatus && (
          <div className="mt-3 p-3 bg-slate-950 border border-sky-500/40 rounded-lg flex items-center gap-2 text-xs text-sky-300 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{pdfUploadStatus}</span>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                selectedCategory === 'ALL' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Types ({documents.filter(d => d.subjectId === activeSubject.id).length})
            </button>
            <button
              onClick={() => setSelectedCategory('pyq')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1 ${
                selectedCategory === 'pyq' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>PYQs</span>
            </button>
            <button
              onClick={() => setSelectedCategory('notes')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1 ${
                selectedCategory === 'notes' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Notes</span>
            </button>
            <button
              onClick={() => setSelectedCategory('assignment')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1 ${
                selectedCategory === 'assignment' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Assignments</span>
            </button>
            <button
              onClick={() => setSelectedCategory('syllabus')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1 ${
                selectedCategory === 'syllabus' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-purple-400" />
              <span>Syllabus</span>
            </button>
          </div>

          {/* Unit filter + Search input */}
          <div className="flex items-center gap-2">
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="ALL">All Units</option>
              {activeSubject.units.map(u => (
                <option key={u.unitNumber} value={u.unitNumber}>Unit {u.unitNumber}</option>
              ))}
            </select>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archive..."
                className="bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 w-44 sm:w-56"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            <FolderArchive className="w-10 h-10 text-sky-400/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200">No Resources Match Your Filter</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add new notes or click &quot;Batch Import PYQ PDFs&quot; above to import your Drive files.
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isPyq = doc.category === 'pyq';
            const isNotes = doc.category === 'notes';
            const isAssign = doc.category === 'assignment';

            return (
              <div
                key={doc.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 shadow-sm flex flex-col justify-between transition-all"
              >
                <div>
                  {/* Category Pill and Meta */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        isPyq
                          ? 'bg-sky-950/40 border-sky-500/40 text-sky-300'
                          : isNotes
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                          : isAssign
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-purple-950/40 border-purple-500/40 text-purple-300'
                      }`}
                    >
                      {doc.category.toUpperCase()}
                      {doc.unit ? ` • Unit ${doc.unit}` : ''}
                    </span>

                    <span className="text-[11px] text-slate-500">
                      {doc.year || doc.createdAt}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 leading-snug">
                    {doc.title}
                  </h3>

                  {/* Specific Details */}
                  {doc.teacherName && (
                    <p className="text-xs text-amber-300/80 font-medium mb-2">
                      👨‍🏫 {doc.teacherName}
                    </p>
                  )}

                  {doc.assignmentDetails && (
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                      {doc.assignmentDetails.deadline && (
                        <span className="flex items-center gap-1 text-amber-400">
                          <Calendar className="w-3 h-3" /> Due: {doc.assignmentDetails.deadline}
                        </span>
                      )}
                      {doc.assignmentDetails.totalMarks && (
                        <span className="text-emerald-400">
                          {doc.assignmentDetails.totalMarks} Marks
                        </span>
                      )}
                    </div>
                  )}

                  {/* Snippet */}
                  <p className="text-xs text-slate-400 line-clamp-3 font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    {doc.content.slice(0, 160)}...
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {doc.tags.slice(0, 3).map((t, i) => (
                      <span key={i} className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => setViewingDoc(doc)}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Document</span>
                  </button>

                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-sky-400" />
                  <span>Add New SKIT Academic Resource</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Index notes, past year question papers, or assignments into the AI model.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Category & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Resource Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ResourceCategory)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="notes">Teacher Class Notes</option>
                    <option value="assignment">Present Year Assignment</option>
                    <option value="pyq">Past Year Question Paper (PYQ)</option>
                    <option value="syllabus">Syllabus / Scheme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject *</label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Prof. Naveen Sharma Notes: Unit 2 Linked Lists"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Conditional Fields based on category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit Number</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value={1}>Unit 1</option>
                    <option value={2}>Unit 2</option>
                    <option value={3}>Unit 3</option>
                    <option value={4}>Unit 4</option>
                    <option value={5}>Unit 5</option>
                  </select>
                </div>

                {newCategory === 'notes' && (
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Teacher / Professor Name</label>
                    <input
                      type="text"
                      value={newTeacher}
                      onChange={(e) => setNewTeacher(e.target.value)}
                      placeholder="e.g. Dr. Meenakshi S. (SKIT CSE)"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                )}

                {newCategory === 'pyq' && (
                  <>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Exam Year</label>
                      <input
                        type="text"
                        value={newYear}
                        onChange={(e) => setNewYear(e.target.value)}
                        placeholder="2024"
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Exam Type</label>
                      <select
                        value={newExamType}
                        onChange={(e) => setNewExamType(e.target.value as ExamType)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="RTU_MAIN">RTU Main University Exam</option>
                        <option value="SKIT_MT1">SKIT Mid-Term 1 (MT-1)</option>
                        <option value="SKIT_MT2">SKIT Mid-Term 2 (MT-2)</option>
                        <option value="RTU_BACK">RTU Back Paper</option>
                      </select>
                    </div>
                  </>
                )}

                {newCategory === 'assignment' && (
                  <>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Deadline Date</label>
                      <input
                        type="date"
                        value={newDeadline}
                        onChange={(e) => setNewDeadline(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Total Marks</label>
                      <input
                        type="number"
                        value={newTotalMarks}
                        onChange={(e) => setNewTotalMarks(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Content and File Attachment */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Document Text / Notes Content / Questions *
                </label>
                <textarea
                  rows={8}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste complete notes, lecture text, or question paper here in markdown or plain text format..."
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-lg p-3 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. Unit 3, AVL Rotations, Important 10 Marks"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md shadow-sky-600/20"
                >
                  Save & Index to AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Document Preview Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-500/30">
                  {viewingDoc.category.toUpperCase()} • Unit {viewingDoc.unit || 'All'}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{viewingDoc.title}</h3>
                {viewingDoc.teacherName && (
                  <p className="text-xs text-amber-300/80">👨‍🏫 {viewingDoc.teacherName}</p>
                )}
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 font-sans">
              <MarkdownView content={viewingDoc.content} />
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Indexed on {viewingDoc.createdAt}</span>
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
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
