import { Clock, MapPin, Tag, AlertCircle } from 'lucide-react';

const priorityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

const statusColors = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-600',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function TicketCard({ ticket, onClick }) {
  const date = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div
      onClick={() => onClick(ticket)}
      className="bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-[#222222] text-base leading-snug line-clamp-2">
          {ticket.title}
        </h3>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${priorityColors[ticket.priority]}`}>
          {ticket.priority}
        </span>
      </div>

      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{ticket.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[ticket.status]}`}>
          {ticket.status.replace('_', ' ')}
        </span>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
          {ticket.category}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {ticket.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {date}
        </span>
        <span className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {ticket.comments?.length || 0} comments
        </span>
      </div>
    </div>
  );
}