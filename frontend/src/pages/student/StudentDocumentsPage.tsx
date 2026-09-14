import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Clock, 
  RefreshCw,
  Search,
  Check,
  X,
  ShieldCheck,
  Info
} from 'lucide-react';
import { api } from '../../services/api';
import { DocumentDto } from '../../types';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

export const StudentDocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedDocType, setSelectedDocType] = useState<string>('INCOME_CERTIFICATE');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentDto | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const docTypes = [
    { value: 'INCOME_CERTIFICATE', label: 'Income Certificate', desc: 'Issued by Tehsildar/Revenue Officer' },
    { value: 'MARKSHEET', label: 'Academic Marksheet', desc: 'Latest semester or standard 12th marksheet' },
    { value: 'CASTE_CERTIFICATE', label: 'Caste / Category Certificate', desc: 'Valid government certificate' },
    { value: 'IDENTITY_PROOF', label: 'Identity Proof (Aadhaar/PAN)', desc: 'Valid government ID' },
    { value: 'OTHER', label: 'Other Supporting Document', desc: 'Bonafide or admission receipt' }
  ];

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await api.getStudentDocuments();
      setDocuments(data || []);
    } catch (err: any) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
      setFeedbackMsg(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload) {
      setFeedbackMsg({ type: 'error', text: 'Please select a file to upload.' });
      return;
    }

    try {
      setUploading(true);
      setFeedbackMsg(null);
      await api.uploadDocument(fileToUpload, selectedDocType);
      setFeedbackMsg({ type: 'success', text: 'Document uploaded and processed successfully with OCR!' });
      setFileToUpload(null);
      const fileInput = document.getElementById('doc-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      await fetchDocuments();
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to upload document.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await api.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
      setFeedbackMsg({ type: 'success', text: 'Document removed successfully.' });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to delete document.' });
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F3040]">My Document Repository</h1>
          <p className="text-[#464858] text-sm mt-1">
            Securely store and manage your scholarship verification documents with automatic AI-OCR extraction.
          </p>
        </div>
        <button
          onClick={fetchDocuments}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#0F3040] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm self-start"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {feedbackMsg && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {feedbackMsg.type === 'success' ? <Check className="w-5 h-5 flex-shrink-0" /> : <X className="w-5 h-5 flex-shrink-0" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-[#0F3040] mb-4 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-[#A56F63]" /> Upload New Supporting Document
        </h2>

        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-[#464858] mb-1">Document Category</label>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040] bg-white"
            >
              {docTypes.map(dt => (
                <option key={dt.value} value={dt.value}>{dt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#464858] mb-1">Select File (PDF, PNG, JPG)</label>
            <input
              id="doc-file-input"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-[#0F3040] hover:file:bg-gray-200 cursor-pointer border border-gray-200 rounded-lg p-1 bg-white"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={uploading || !fileToUpload}
              className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-[#0F3040] text-white text-sm font-semibold rounded-lg hover:bg-[#1a4b63] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Processing OCR...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" /> Upload & Extract OCR
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <Info className="w-4 h-4 text-[#A56F63] flex-shrink-0" />
          <span>Uploaded documents undergo simulated OCR parsing. Verified fields (income, marks, names) will be extracted to expedite your scholarship verification.</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-[#0F3040]">Your Uploaded Files</h2>
            <p className="text-xs text-gray-500 mt-0.5">{documents.length} documents stored</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
            />
          </div>
        </div>

        {loading ? (
          <LoadingState message="Loading your documents..." />
        ) : filteredDocs.length === 0 ? (
          <EmptyState
            title="No documents found"
            description={searchQuery ? "No documents match your search query." : "Upload your income certificate, marksheet, or ID proof above to get started."}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => {
              const isVerified = doc.verificationStatus === 'VERIFIED';
              const isMismatch = doc.verificationStatus === 'MISMATCH';
              const isPending = !isVerified && !isMismatch;

              return (
                <div 
                  key={doc.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-[#0F3040]/30 hover:shadow-md transition-all flex flex-col justify-between bg-white relative group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0F3040]/5 flex items-center justify-center text-[#0F3040]">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-semibold text-[#0F3040] truncate max-w-[160px]" title={doc.fileName}>
                            {doc.fileName}
                          </p>
                          <span className="text-[11px] font-medium text-[#A56F63]">
                            {doc.documentType.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        isVerified 
                          ? 'bg-emerald-50 text-emerald-700'
                          : isMismatch
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {isVerified && <CheckCircle className="w-3 h-3" />}
                        {isMismatch && <AlertTriangle className="w-3 h-3" />}
                        {isPending && <Clock className="w-3 h-3" />}
                        {doc.verificationStatus || 'UPLOADED'}
                      </span>
                    </div>

                    <div className="mt-3 text-xs text-gray-500 space-y-1 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-medium text-gray-700">{(doc.fileSize / 1024).toFixed(1)} KB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uploaded:</span>
                        <span className="font-medium text-gray-700">{new Date(doc.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      {doc.extractedData && (
                        <div className="pt-1 border-t border-gray-200 mt-1">
                          <span className="text-[10px] uppercase font-semibold text-[#0F3040] block mb-0.5">OCR Extracted:</span>
                          <p className="text-[11px] text-gray-700 truncate font-mono bg-white p-1 rounded border border-gray-200">
                            {doc.extractedData}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F3040] hover:text-[#1a4b63]"
                    >
                      <Eye className="w-3.5 h-3.5" /> View OCR Data
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={`Document Details: ${previewDoc.fileName}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div>
                <span className="text-gray-400 block">Type</span>
                <span className="font-semibold text-gray-800">{previewDoc.documentType.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Status</span>
                <span className="font-semibold text-gray-800">{previewDoc.verificationStatus || 'PENDING'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">File Size</span>
                <span className="font-semibold text-gray-800">{(previewDoc.fileSize / 1024).toFixed(1)} KB</span>
              </div>
              <div>
                <span className="text-gray-400 block">Upload Timestamp</span>
                <span className="font-semibold text-gray-800">{new Date(previewDoc.createdAt || Date.now()).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-[#0F3040] mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> OCR Engine Extraction Output
              </h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                {previewDoc.extractedData ? (
                  <pre className="whitespace-pre-wrap">{previewDoc.extractedData}</pre>
                ) : (
                  <span className="text-gray-400 italic">No structured data parsed from this file yet.</span>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentDocumentsPage;
