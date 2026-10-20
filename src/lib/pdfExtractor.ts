import { ExamType, Department } from '../types';

/**
 * Extract full text from a PDF file using pdfjs-dist
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const pdfjs = await import('pdfjs-dist');
    // Set static worker
    if (typeof window !== 'undefined') {
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;

    let fullText = '';
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        // @ts-expect-error item has str property
        .map((item) => item.str || '')
        .join(' ');
      
      fullText += `\n--- Page ${pageNum} ---\n` + pageText + '\n';
    }

    return fullText.trim();
  } catch (err) {
    console.warn('PDF.js extraction failed, attempting fallback text decoder:', err);
    // Basic fallback for simple text-embedded streams
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const raw = decoder.decode(buffer);
    const cleanMatches = raw.match(/\(([^()]+)\)\s*Tj/g);
    if (cleanMatches && cleanMatches.length > 5) {
      return cleanMatches.map(m => m.slice(1, -4)).join(' ');
    }
    throw new Error('Could not extract readable text from PDF. The PDF may be a scanned image or protected.');
  }
}

/**
 * Smart metadata detector from PYQ file name and text content
 */
export function detectPYQMetadata(fileName: string, content: string): {
  year: string;
  examType: ExamType;
  department: Department;
  titleSuggestion: string;
} {
  const combined = (fileName + ' ' + content).toLowerCase();

  // 1. Detect Year
  const yearMatch = combined.match(/\b(201[89]|202[0-6])\b/);
  const year = yearMatch ? yearMatch[1] : '2023';

  // 2. Detect Exam Type
  let examType: ExamType = 'RTU_MAIN';
  if (combined.includes('mid term 1') || combined.includes('mid-term 1') || combined.includes('mt 1') || combined.includes('mt-1') || combined.includes('first mid term') || combined.includes('first mid-term')) {
    examType = 'SKIT_MT1';
  } else if (combined.includes('mid term 2') || combined.includes('mid-term 2') || combined.includes('mt 2') || combined.includes('mt-2') || combined.includes('second mid term') || combined.includes('second mid-term')) {
    examType = 'SKIT_MT2';
  } else if (combined.includes('back') || combined.includes('mercy') || combined.includes('re-appear')) {
    examType = 'RTU_BACK';
  }

  // 3. Detect Department
  let department: Department = 'CSE';
  if (combined.includes('information technology') || combined.includes('b.tech it')) {
    department = 'IT';
  } else if (combined.includes('electronics') || combined.includes('ece')) {
    department = 'ECE';
  } else if (combined.includes('artificial intelligence') || combined.includes('ai & ds') || combined.includes('aids')) {
    department = 'AI_DS';
  } else if (combined.includes('mechanical')) {
    department = 'ME';
  } else if (combined.includes('civil')) {
    department = 'CIVIL';
  } else if (combined.includes('electrical')) {
    department = 'EE';
  }

  // Title Suggestion
  const cleanBaseName = fileName.replace(/\.[^/.]+$/, '');
  const examLabel = examType === 'SKIT_MT1' 
    ? 'SKIT Mid-Term 1' 
    : examType === 'SKIT_MT2' 
    ? 'SKIT Mid-Term 2' 
    : 'RTU Kota End-Term';

  const titleSuggestion = `${examLabel} (${year}) - ${cleanBaseName}`;

  return {
    year,
    examType,
    department,
    titleSuggestion
  };
}
