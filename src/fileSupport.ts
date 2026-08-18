export type SupportedExtension = '.csv' | '.xlsx' | '.xls' | '.tsv';

const SUPPORTED_EXTENSIONS: SupportedExtension[] = ['.csv', '.xlsx', '.xls', '.tsv'];
const ACCEPT_STRING = '.csv,.xlsx,.xls,.tsv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,text/tab-separated-values';

export function getAcceptString(): string { return ACCEPT_STRING; }
export function getSupportedExtensions(): SupportedExtension[] { return [...SUPPORTED_EXTENSIONS]; }
export function getFileExtension(filename: string): string {
  const index = filename.lastIndexOf('.');
  return index === -1 ? '' : filename.substring(index).toLowerCase();
}
export function isFileSupported(file: File): boolean {
  return (SUPPORTED_EXTENSIONS as string[]).includes(getFileExtension(file.name));
}
export function getFileFormatLabel(filename: string): string {
  return getFileExtension(filename).toUpperCase().replace('.', '') || 'Unknown';
}
