import { useState } from 'react';
import { Send, Pencil, Trash2, X, Check } from 'lucide-react';
import { ticketApi } from '../../hooks/useTickets';

export default function CommentSection({ ticket, currentUser, onUpdate }) {
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      const updated = await ticketApi.addComment(ticket.id, comment.trim());
      onUpdate(updated);
      setComment('');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (commentId) => {
    if (!editContent.trim()) return;
    setLoading(true);
    try {
      const updated = await ticketApi.editComment(ticket.id, commentId, editContent.trim());
      onUpdate(updated);
      setEditingId(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    setLoading(true);
    try {
      const updated = await ticketApi.deleteComment(ticket.id, commentId);
      onUpdate(updated);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="font-semibold text-[#222222] mb-3">
        Comments ({ticket.comments?.length || 0})
      </h4>

      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {ticket.comments?.length === 0 && (
          <p className="text-gray-400 text-sm">No comments yet.</p>
        )}
        {ticket.comments?.map((c) => (
          <div key={c.id} className="bg-gray-50 rounded-xl p-3">
            {editingId === c.id ? (
              <div className="flex gap-2">
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-yellow-400"
                />
                <button
                  onClick={() => handleEdit(c.id)}
                  className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-[#222222]">{c.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {c.authorName} · {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
                {c.authorEmail === currentUser?.email && (
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => { setEditingId(c.id); setEditContent(c.content); }}
                      className="p-1 text-gray-400 hover:text-yellow-600 rounded"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a comment..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
        />
        <button
          onClick={handleAdd}
          disabled={loading || !comment.trim()}
          className="p-2.5 bg-[#222222] text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}