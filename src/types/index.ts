export type Department = 
  | 'CSE' 
  | 'AI_DS' 
  | 'IT' 
  | 'ECE' 
  | 'EE' 
  | 'ME' 
  | 'CIVIL' 
  | 'FIRST_YEAR';

export type ResourceCategory = 'syllabus' | 'pyq' | 'notes' | 'assignment';

export type ExamType = 'RTU_MAIN' | 'SKIT_MT1' | 'SKIT_MT2' | 'RTU_BACK' | 'OTHER';

export interface UnitInfo {
  unitNumber: number;
  title: string;
  topics: string[];
  approxWeightageMarks?: number;
}

export interface CollegeSubject {
  id: string;
  code: string;
  name: string;
  shortName: string;
  department: Department;
  semester: number;
  units: UnitInfo[];
}

export interface AcademicDocument {
  id: string;
  title: string;
  subjectId: string;
  category: ResourceCategory;
  semester: number;
  department: Department;
  unit?: number; // 0 or undefined for entire subject
  year?: string; // e.g. "2024", "2023"
  examType?: ExamType;
  teacherName?: string;
  content: string;
  summary?: string;
  tags: string[];
  createdAt: string;
  assignmentDetails?: {
    deadline?: string;
    totalMarks?: number;
    submissionFormat?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode: 'tutor' | 'assignment' | 'predictor';
  sourceReferences?: {
    docTitle: string;
    category: ResourceCategory;
    unit?: number;
  }[];
  modelUsed?: string;
}

export interface PredictedQuestion {
  id: string;
  subjectId: string;
  unit: number;
  questionText: string;
  part: 'PART_A' | 'PART_B' | 'PART_C'; // RTU exam pattern
  expectedMarks: number;
  probability: number; // percentage, e.g. 92
  trendReason: string;
  modelAnswerPoints: string[];
  sourcePYQYears: string[];
  teacherEmphasisNote?: string;
}

export type LLMProvider = 'webgpu' | 'ollama' | 'offline_rag' | 'gemini';

export interface AIConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  temperature: number;
  ollamaEndpoint?: string;
  selectedLocalModel?: string;
}
