import { useState, useRef } from 'react';
import { Upload, Trash2, Image, Eye } from 'lucide-react';
import { ticketApi } from '../../hooks/useTickets';

export default function AttachmentUpload({ ticket, currentUser, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();
  const canUpload = currentUser?.role === 'USER' && ticket.createdBy?.id === currentUser?.id;

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }
    if (ticket.attachments?.length >= 3) {
      alert('Maximum 3 attachments allowed');
      return;
    }
    setUploading(true);
    try {
      const updated = await ticketApi.uploadAttachment(ticket.id, file);
      onUpdate(updated);
    } catch (e) {
      alert(e.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (attachmentId) => {
    if (!confirm('Delete this attachment?')) return;
    try {
      const updated = await ticketApi.deleteAttachment(ticket.id, attachmentId);
      onUpdate(updated);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleView = async (attachmentId) => {
    try {
      const blob = await ticketApi.viewAttachment(ticket.id, attachmentId);
      const url = URL.createObjectURL(blob);
      setPreview({ url, name: ticket.attachments?.find((a) => a.id === attachmentId)?.fileName || 'Image preview' });
    } catch (e) {
      alert(e.message);
    }
  };

  const closePreview = () => {
    if (preview?.url) {
      URL.revokeObjectURL(preview.url);
    }
    setPreview(null);
  };

  return (
    <div>
      <h4 className="font-semibold text-[#222222] mb-3">
        Attachments ({ticket.attachments?.length || 0}/3)
      </h4>

      <div className="space-y-2 mb-3">
        {ticket.attachments?.length === 0 && (
          <p className="text-gray-400 text-sm">No attachments yet.</p>
        )}
        {ticket.attachments?.map((a) => (
          <div key={a.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <Image className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-sm text-[#222222] flex-1 truncate">{a.fileName}</span>
            <span className="text-xs text-gray-400">
              {(a.fileSize / 1024).toFixed(1)} KB
            </span>
            <button
              onClick={() => handleView(a.id)}
              className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
              title="View image"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            {a.uploadedById === currentUser?.id && (
              <button
                onClick={() => handleDelete(a.id)}
                className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                title="Delete image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {canUpload && ticket.attachments?.length < 3 && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileRef.current.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-yellow-400 hover:text-yellow-600 transition-all w-full justify-center disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload image'}
          </button>
        </>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <p className="text-sm font-bold text-[#222222]">{preview.name}</p>
                <p className="text-xs text-gray-400">Attachment preview</p>
              </div>
              <button
                onClick={closePreview}
                className="px-3 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
            <div className="p-4 bg-gray-50 overflow-auto flex items-center justify-center">
              <img
                src={preview.url}
                alt={preview.name}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}