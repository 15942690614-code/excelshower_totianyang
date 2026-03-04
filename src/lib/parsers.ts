import * as XLSX from 'xlsx';
import Tesseract from 'tesseract.js';
// Remove direct import of pdfjs-dist to avoid SSR/build issues with canvas/DOMMatrix
// import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { ParsedData } from '@/types';

// PDF.js worker configuration moved inside the function to avoid global scope issues

export const parseExcel = async (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          resolve({ fileName: file.name, fileType: 'excel', headers: [], rows: [] });
          return;
        }

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1).map((row: any) => {
          const rowObj: any = {};
          headers.forEach((header, index) => {
            rowObj[header] = row[index];
          });
          return rowObj;
        });

        resolve({
          fileName: file.name,
          fileType: 'excel',
          headers,
          rows
        });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const parseImage = async (file: File): Promise<ParsedData> => {
  const result = await Tesseract.recognize(file, 'eng+chi_sim', {
    logger: m => console.log(m)
  });
  
  // Simple heuristic to convert OCR text lines to rows
  // This is a basic demonstration of "Table Extraction"
  const lines = result.data.text.split('\n').filter(line => line.trim() !== '');
  const headers = ['Column 1', 'Column 2', 'Column 3']; // Mock headers for unstructured data
  const rows = lines.map(line => {
      const parts = line.split(/\s+/);
      return {
          'Column 1': parts[0] || '',
          'Column 2': parts[1] || '',
          'Column 3': parts.slice(2).join(' ') || ''
      };
  });

  return {
    fileName: file.name,
    fileType: 'image',
    headers,
    rows
  };
};

export const parseWord = async (file: File): Promise<ParsedData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                const result = await mammoth.extractRawText({ arrayBuffer });
                const text = result.value;
                // Mock table parsing from text
                const rows = text.split('\n').map(line => ({ 'Content': line }));
                resolve({
                    fileName: file.name,
                    fileType: 'word',
                    headers: ['Content'],
                    rows
                });
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

export const parsePDF = async (file: File): Promise<ParsedData> => {
  if (typeof window === 'undefined') {
    throw new Error('PDF parsing is only supported in the browser');
  }

  // Dynamic import to avoid SSR issues with canvas/DOMMatrix
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const strings = textContent.items.map((item: any) => item.str);
    fullText += strings.join(' ') + '\n';
  }

  const rows = fullText.split('\n').map(line => ({ 'Content': line }));

  return {
    fileName: file.name,
    fileType: 'pdf',
    headers: ['Content'],
    rows,
    fullText // Export raw text for AI processing
  };
};

export const parseFile = async (file: File): Promise<ParsedData> => {
  const type = file.name.split('.').pop()?.toLowerCase();
  
  if (['xlsx', 'xls'].includes(type || '')) {
    return parseExcel(file);
  } else if (['jpg', 'jpeg', 'png'].includes(type || '')) {
    // For images, we return raw OCR text in a special way if needed, 
    // but current implementation returns structured data.
    // To use AI, we might want to pass the raw text.
    return parseImage(file);
  } else if (['docx', 'doc'].includes(type || '')) {
    return parseWord(file);
  } else if (['pdf'].includes(type || '')) {
    return parsePDF(file);
  }
  
  throw new Error('Unsupported file type');
};
