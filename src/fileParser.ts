import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { RawRow } from './types';

export type SupportedExtension = '.csv' | '.xlsx' | '.xls' | '.tsv';

const SUPPORTED_EXTENSIONS: SupportedExtension[] = ['.csv', '.xlsx', '.xls', '.tsv'];

const ACCEPT_STRING = '.csv,.xlsx,.xls,.tsv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,text/tab-separated-values';

export function getAcceptString(): string {
  return ACCEPT_STRING;
}

export function getSupportedExtensions(): SupportedExtension[] {
  return [...SUPPORTED_EXTENSIONS];
}

function getFileExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  if (idx === -1) return '';
  return filename.substring(idx).toLowerCase();
}

export function isFileSupported(file: File): boolean {
  const ext = getFileExtension(file.name);
  return (SUPPORTED_EXTENSIONS as string[]).includes(ext);
}

export function getFileFormatLabel(filename: string): string {
  const ext = getFileExtension(filename).toUpperCase().replace('.', '');
  return ext || 'Unknown';
}

function parseCSVOrTSV(file: File): Promise<RawRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('PapaParse warnings:', results.errors);
        }
        resolve(results.data);
      },
      error: (err: Error) => {
        reject(new Error(`Failed to parse CSV/TSV: ${err.message}`));
      },
    });
  });
}

function parseExcel(file: File): Promise<RawRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file content.'));
          return;
        }
        const workbook = XLSX.read(data, { type: 'array' });
        // Use the first sheet
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          reject(new Error('No sheets found in the workbook.'));
          return;
        }
        const worksheet = workbook.Sheets[firstSheetName];
        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json<RawRow>(worksheet, {
          defval: '',
          raw: false, // Return strings to match CSV behavior
        });
        resolve(jsonData);
      } catch (err) {
        reject(new Error(`Failed to parse Excel file: ${err instanceof Error ? err.message : String(err)}`));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read the file.'));
    };
    reader.readAsArrayBuffer(file);
  });
}

export async function parseFile(file: File): Promise<RawRow[]> {
  const ext = getFileExtension(file.name);

  if (!isFileSupported(file)) {
    throw new Error(`Unsupported file format "${ext}". Please upload a CSV, XLSX, XLS, or TSV file.`);
  }

  switch (ext) {
    case '.xlsx':
    case '.xls':
      return parseExcel(file);
    case '.csv':
    case '.tsv':
    default:
      return parseCSVOrTSV(file);
  }
}

/**
 * Auto-detect whether uploaded data is a Sales report or Return report
 * based on column headers.
 *
 * Sales reports contain: GMV, Gross Units, Final Sale Units, Final Sale Amount, SKU ID, Category
 * Return reports contain: Return Reason, Return Type, Return Status, Return Requested Date
 */
export type DetectedFileType = 'sales' | 'returns';

export function detectFileType(rows: RawRow[]): DetectedFileType {
  if (!rows || rows.length === 0) return 'sales'; // default fallback

  const headers = Object.keys(rows[0]).map(h => h.toLowerCase().trim());

  // Return-specific column signatures (unique to return reports)
  const returnSignatures = [
    'return reason',
    'return type',
    'return status',
    'return requested date',
    'return sub-reason',
    'return sub reason',
    'return id',
    'return approval date',
    'completion status',
  ];

  // Sales-specific column signatures (unique to sales reports)
  const salesSignatures = [
    'gmv',
    'gross units',
    'final sale units',
    'final sale amount',
    'cancellation units',
    'cancellation amount',
    'order date',
    'category',
  ];

  let returnScore = 0;
  let salesScore = 0;

  for (const header of headers) {
    for (const sig of returnSignatures) {
      if (header.includes(sig)) returnScore++;
    }
    for (const sig of salesSignatures) {
      if (header.includes(sig)) salesScore++;
    }
  }

  // Return report if it has more return-specific columns
  if (returnScore > salesScore) return 'returns';
  if (salesScore > returnScore) return 'sales';

  // Tie-breaker: check for definitive columns
  const hasGMV = headers.some(h => h === 'gmv');
  const hasReturnReason = headers.some(h => h.includes('return reason'));

  if (hasReturnReason && !hasGMV) return 'returns';
  if (hasGMV && !hasReturnReason) return 'sales';

  // Default to sales
  return 'sales';
}
