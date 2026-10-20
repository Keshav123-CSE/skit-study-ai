import { AcademicDocument, CollegeSubject, PredictedQuestion, AIConfig } from '../types';
import { SEED_DOCUMENTS, SEED_SUBJECTS, SEED_PREDICTIONS } from '../data/seedData';

const STORAGE_KEYS = {
  DOCUMENTS: 'skit_ai_documents',
  SUBJECTS: 'skit_ai_subjects',
  PREDICTIONS: 'skit_ai_predictions',
  AI_CONFIG: 'skit_ai_config',
  ACTIVE_SUBJECT: 'skit_ai_active_subject',
};

export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'webgpu',
  apiKey: '',
  model: 'gemini-2.0-flash',
  temperature: 0.3,
  ollamaEndpoint: 'http://localhost:11434',
  selectedLocalModel: 'SmolLM2-360M-Instruct-q4f16_1-MLC',
};

// Check if running in browser
const isBrowser = typeof window !== 'undefined';

export function getStoredSubjects(): CollegeSubject[] {
  if (!isBrowser) return SEED_SUBJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(SEED_SUBJECTS));
      return SEED_SUBJECTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_SUBJECTS;
  }
}

export function saveSubjects(subjects: CollegeSubject[]): void {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
}

export function getStoredDocuments(): AcademicDocument[] {
  if (!isBrowser) return SEED_DOCUMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(SEED_DOCUMENTS));
      return SEED_DOCUMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_DOCUMENTS;
  }
}

export function saveDocuments(docs: AcademicDocument[]): void {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
}

export function addDocument(doc: Omit<AcademicDocument, 'id' | 'createdAt'>): AcademicDocument {
  const docs = getStoredDocuments();
  const newDoc: AcademicDocument = {
    ...doc,
    id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString().split('T')[0],
  };
  const updated = [newDoc, ...docs];
  saveDocuments(updated);
  return newDoc;
}

export function deleteDocument(id: string): void {
  const docs = getStoredDocuments().filter(d => d.id !== id);
  saveDocuments(docs);
}

export function getStoredPredictions(): PredictedQuestion[] {
  if (!isBrowser) return SEED_PREDICTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREDICTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(SEED_PREDICTIONS));
      return SEED_PREDICTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_PREDICTIONS;
  }
}

export function savePredictions(preds: PredictedQuestion[]): void {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(preds));
}

export function addPrediction(pred: Omit<PredictedQuestion, 'id'>): PredictedQuestion {
  const list = getStoredPredictions();
  const newPred: PredictedQuestion = {
    ...pred,
    id: `pred_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
  };
  const updated = [newPred, ...list];
  savePredictions(updated);
  return newPred;
}

export function getStoredAIConfig(): AIConfig {
  if (!isBrowser) return DEFAULT_AI_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AI_CONFIG);
    if (!raw) return DEFAULT_AI_CONFIG;
    return { ...DEFAULT_AI_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_AI_CONFIG;
  }
}

export function saveAIConfig(config: AIConfig): void {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.AI_CONFIG, JSON.stringify(config));
}

export function getActiveSubjectId(): string {
  if (!isBrowser) return 'dsa_3cs';
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_SUBJECT) || 'dsa_3cs';
}

export function setActiveSubjectId(id: string): void {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_SUBJECT, id);
}

export function resetAllDataToDefault(): void {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(SEED_DOCUMENTS));
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(SEED_SUBJECTS));
  localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(SEED_PREDICTIONS));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_SUBJECT, 'dsa_3cs');
}

export function exportAllDataAsJSON(): string {
  const data = {
    exportedAt: new Date().toISOString(),
    institution: 'Swami Keshvanand Institute of Technology (SKIT), Jaipur',
    subjects: getStoredSubjects(),
    documents: getStoredDocuments(),
    predictions: getStoredPredictions(),
  };
  return JSON.stringify(data, null, 2);
}

export function importDataFromJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.documents && Array.isArray(parsed.documents)) {
      saveDocuments(parsed.documents);
    }
    if (parsed.subjects && Array.isArray(parsed.subjects)) {
      saveSubjects(parsed.subjects);
    }
    if (parsed.predictions && Array.isArray(parsed.predictions)) {
      savePredictions(parsed.predictions);
    }
    return true;
  } catch (e) {
    console.error('Failed to import data', e);
    return false;
  }
}
