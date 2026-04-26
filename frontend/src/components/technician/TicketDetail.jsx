import { useState } from 'react';
import { X, MapPin, Tag, Clock, User, Wrench, MessageSquare, Paperclip, ChevronDown, ChevronUp } from 'lucide-react';
import CommentSection from './CommentSection';
import AttachmentUpload from './AttachmentUpload';
import TechnicianUpdateModal from './TechnicianUpdateModal';

const statusColors = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-600',
  REJECTED: 'bg-red-100 text-red-800',
};

const priorityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

export default function TicketDetail({ ticket, currentUser, onClose, onUpdate }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [localTicket, setLocalTicket] = useState(ticket);

  const handleUpdate = (updated) => {
    setLocalTicket(updated);
    onUpdate(updated);
  };

  const isAssigned = localTicket.assignedTo?.id === currentUser?.id;
  const canUpdate = isAssigned || currentUser?.role === 'ADMIN';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-40 p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 shrink-0">
          <div className="flex-1 pr-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[localTicket.status]}`}>
                {localTicket.status.replace('_', ' ')}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityColors[localTicket.priority]}`}>
                {localTicket.priority}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
                {localTicket.category}
              </span>
            </div>
            <h2 className="font-bold text-[#222222] text-lg leading-snug">{localTicket.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors shrink-0">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">

          {/* Description */}
          <div>
            <p className="text-gray-600 text-sm leading-relaxed">{localTicket.description}</p>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </p>
              <p className="text-sm font-medium text-[#222222]">{localTicket.location}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <User className="w-3 h-3" /> Reported by
              </p>
              <p className="text-sm font-medium text-[#222222]">{localTicket.createdBy?.name}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Wrench className="w-3 h-3" /> Assigned to
              </p>
              <p className="text-sm font-medium text-[#222222]">
                {localTicket.assignedTo?.name || 'Not assigned'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Created
              </p>
              <p className="text-sm font-medium text-[#222222]">
                {new Date(localTicket.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Contact info */}
          {localTicket.preferredContactName && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-700 mb-2">Preferred Contact</p>
              <p className="text-sm text-blue-900 font-medium">{localTicket.preferredContactName}</p>
              {localTicket.preferredContactPhone && (
                <p className="text-sm text-blue-700">{localTicket.preferredContactPhone}</p>
              )}
              {localTicket.preferredContactEmail && (
                <p className="text-sm text-blue-700">{localTicket.preferredContactEmail}</p>
              )}
            </div>
          )}

          {/* Resolution notes */}
          {localTicket.resolutionNotes && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-green-700 mb-2">Resolution Notes</p>
              <p className="text-sm text-green-900">{localTicket.resolutionNotes}</p>
            </div>
          )}

          {/* Technician update history */}
          {localTicket.technicianUpdates?.length > 0 && (
            <div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-sm font-semibold text-[#222222] mb-3 w-full"
              >
                <Wrench className="w-4 h-4" />
                Update History ({localTicket.technicianUpdates.length})
                {showHistory ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
              </button>
              {showHistory && (
                <div className="space-y-2">
                  {localTicket.technicianUpdates.map((u) => (
                    <div key={u.id} className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-yellow-800">{u.technicianName}</span>
                        <span className="text-xs text-yellow-600">
                          {new Date(u.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-yellow-900">{u.updateNote}</p>
                      <span className="text-xs font-medium text-yellow-700 mt-1 block">
                        Status → {u.statusChanged?.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attachments */}
          <div className="border-t border-gray-100 pt-4">
            <AttachmentUpload
              ticket={localTicket}
              currentUser={currentUser}
              onUpdate={handleUpdate}
            />
          </div>

          {/* Comments */}
          <div className="border-t border-gray-100 pt-4">
            <CommentSection
              ticket={localTicket}
              currentUser={currentUser}
              onUpdate={handleUpdate}
            />
          </div>
        </div>

        {/* Footer actions */}
        {canUpdate && localTicket.status !== 'CLOSED' && localTicket.status !== 'REJECTED' && (
          <div className="p-6 border-t border-gray-100 shrink-0">
            <button
              onClick={() => setShowUpdateModal(true)}
              className="w-full py-3.5 bg-sliit-gold hover:bg-yellow-500 text-[#222222] rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              Update Ticket Status
            </button>
          </div>
        )}
      </div>

      {showUpdateModal && (
        <TechnicianUpdateModal
          ticket={localTicket}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}