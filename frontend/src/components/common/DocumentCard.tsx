import React, { useState } from 'react';
import { DocumentDto } from '../../types';
import { FileText, Image as ImageIcon, Trash2, Eye, CheckCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  document: DocumentDto;
  onDelete?: (id: number) => void;
  allowDelete?: boolean;
}

export const DocumentCard: React.FC<Props> = ({ document, onDelete, allowDelete = true }) => {
  const [showOcr, setShowOcr] = useState(false);

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  const isPdf = document.fileType?.includes('pdf') || document.fileName?.endsWith('.pdf');

  let parsedOcrFields: Record<string, any> = {};
  try {
    if (document.extractedDataJson) {
      parsedOcrFields = JSON.parse(document.extractedDataJson);
    }
  } catch (e) {
    parsedOcrFields = {};
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-soft hover:shadow-premium transition-all overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${isPdf ? 'bg-rose-50 text-rose-600' : 'bg-sky-50 text-sky-600'}`}>
              {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F3040] max-w-[200px] truncate" title={document.fileName}>
                {document.fileName}
              </h4>
              <p className="text-[11px] text-slate-500">{formatSize(document.fileSize)} • {document.documentType}</p>
            </div>
          </div>

          {allowDelete && onDelete && (
            <button
              onClick={() => onDelete(document.documentId || document.id || 0)}
              className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
              title="Delete Document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* AI Classification Pill */}
        <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5 text-[#0F3040]">
            <Sparkles className="w-3.5 h-3.5 text-[#A56F63]" />
            <span className="text-[11px] font-medium">AI Classification:</span>
            <span className="font-bold text-[11px]">{document.detectedType || document.documentType}</span>
          </div>
          {document.classificationConfidence && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {document.classificationConfidence}% Confidence
            </span>
          )}
        </div>

        {/* OCR Drawer Toggle */}
        {(document.rawOcrText || Object.keys(parsedOcrFields).length > 0) && (
          <div>
            <button
              onClick={() => setShowOcr(!showOcr)}
              className="w-full flex items-center justify-between text-[11px] font-semibold text-[#0F3040] hover:text-[#A56F63] pt-1"
            >
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{showOcr ? 'Hide OCR Extraction' : 'View OCR Extracted Data'}</span>
              </span>
              {showOcr ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showOcr && (
              <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg text-[11px] space-y-2 font-mono">
                <div className="text-[#D99B7F] font-bold text-xs">Structured Fields:</div>
                <div className="space-y-1 text-slate-300">
                  {Object.entries(parsedOcrFields).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-slate-800 pb-0.5">
                      <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-white font-semibold">{String(value)}</span>
                    </div>
                  ))}
                </div>
                {document.rawOcrText && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Raw OCR Snippet:</div>
                    <pre className="text-[10px] whitespace-pre-wrap leading-tight text-slate-300 font-sans max-h-24 overflow-y-auto">
                      {document.rawOcrText}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
