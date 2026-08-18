import { useCallback, useState, useRef, useEffect } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle, FileText, Sheet, Table2 } from 'lucide-react';
import { isFileSupported, getAcceptString, getFileFormatLabel } from '../fileSupport';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

export function UploadModal({ isOpen, onClose, onFileSelect }: UploadModalProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setError(null);
      setIsDragOver(false);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);

  const validateAndSetFile = useCallback((file: File) => {
    setError(null);
    if (!isFileSupported(file)) {
      setError('Unsupported format. Please use CSV, XLSX, XLS, or TSV files.');
      setSelectedFile(null);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  }, [validateAndSetFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  }, [validateAndSetFile]);

  const handleSubmit = useCallback(() => {
    if (selectedFile) {
      onFileSelect(selectedFile);
      onClose();
    }
  }, [selectedFile, onFileSelect, onClose]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFormatIcon = (filename: string) => {
    const label = getFileFormatLabel(filename);
    switch (label) {
      case 'XLSX': return <Sheet className="w-5 h-5 text-primary-600" />;
      case 'XLS': return <Table2 className="w-5 h-5 text-amber-600" />;
      case 'TSV': return <FileText className="w-5 h-5 text-slate-600" />;
      default: return <FileText className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getFormatColor = (filename: string) => {
    const label = getFileFormatLabel(filename);
    switch (label) {
      case 'XLSX': return 'bg-primary-100 text-primary-700';
      case 'XLS': return 'bg-amber-100 text-amber-700';
      case 'TSV': return 'bg-slate-100 text-slate-700';
      default: return 'bg-emerald-100 text-emerald-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-[modalSlideUp_0.3s_ease-out] overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-200">
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Upload New Report</h2>
                <p className="text-xs text-slate-400">Replace current data with a new file</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drop Zone */}
        <div className="px-6 pb-2">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`
              relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer
              transition-all duration-300 ease-out group
              ${isDragOver
                ? 'border-primary-400 bg-primary-50 scale-[1.02]'
                : selectedFile
                  ? 'border-emerald-300 bg-emerald-50/50'
                  : 'border-slate-200 bg-slate-50/50 hover:border-primary-300 hover:bg-primary-50/30'
              }
            `}
          >
            {selectedFile ? (
              <>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-1 truncate max-w-xs mx-auto">{selectedFile.name}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${getFormatColor(selectedFile.name)}`}>
                    {getFormatIcon(selectedFile.name)}
                    {getFileFormatLabel(selectedFile.name)}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-400">{formatFileSize(selectedFile.size)}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Click to change file</p>
              </>
            ) : (
              <>
                <div className={`
                  w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
                  ${isDragOver ? 'bg-primary-100 scale-110' : 'bg-slate-100 group-hover:bg-primary-100 group-hover:scale-105'}
                `}>
                  <Upload className={`w-7 h-7 transition-colors duration-300 ${isDragOver ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-500'}`} />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  Drop your file here
                </p>
                <p className="text-xs text-slate-400">or click to browse • Max 50MB</p>
              </>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={getAcceptString()}
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-3 flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile}
            className={`
              flex-1 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200
              flex items-center justify-center gap-2
              ${selectedFile
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-300 hover:-translate-y-0.5'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            <Upload className="w-4 h-4" />
            Analyze Data
          </button>
        </div>

        {/* Supported format hints */}
        <div className="px-6 pb-5">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { ext: 'CSV', color: 'bg-emerald-400' },
              { ext: 'XLSX', color: 'bg-primary-400' },
              { ext: 'XLS', color: 'bg-amber-400' },
              { ext: 'TSV', color: 'bg-slate-400' },
            ].map((f) => (
              <span key={f.ext} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full ${f.color}`} />
                {f.ext}
              </span>
            ))}
            <span className="text-[11px] text-slate-300">|</span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              Standard headers
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              Up to 50MB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
