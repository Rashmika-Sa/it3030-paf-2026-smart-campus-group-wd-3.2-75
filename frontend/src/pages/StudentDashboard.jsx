import { useState, useEffect, useRef } from 'react';
import {
  ClipboardList, Plus, Clock, CheckCircle,
  AlertCircle, X, Loader2, MapPin, MessageSquare,
  Paperclip, ChevronRight, Search, Calendar,
  Wrench,
  BookOpen, Bell
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';
import { ticketApi } from '../hooks/useTickets';
import TicketDetail from '../components/technician/TicketDetail';

const CATEGORIES = ['ELECTRICAL','PLUMBING','HVAC','EQUIPMENT','NETWORK','FURNITURE','SECURITY','CLEANING','OTHER'];
const PRIORITIES = ['LOW','MEDIUM','HIGH','CRITICAL'];

const statusColors = {
  OPEN: 'bg-blue-50 text-blue-700 border-blue-100',
  IN_PROGRESS: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  RESOLVED: 'bg-green-50 text-green-700 border-green-100',
  CLOSED: 'bg-gray-100 text-gray-600 border-gray-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-100',
};

const priorityColors = {
  LOW: 'bg-green-50 text-green-700',
  MEDIUM: 'bg-yellow-50 text-yellow-700',
  HIGH: 'bg-orange-50 text-orange-700',
  CRITICAL: 'bg-red-50 text-red-700',
};

const priorityBar = {
  LOW: 'bg-green-400',
  MEDIUM: 'bg-yellow-400',
  HIGH: 'bg-orange-400',
  CRITICAL: 'bg-red-500',
};

const VIEW_TABS = ['MY_INCIDENTS', 'COMPLETE'];
const FILTERS = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

export default function StudentDashboard() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('MY_INCIDENTS');
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createScreenshot, setCreateScreenshot] = useState(null);
  const screenshotInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '', description: '', location: '',
    category: 'EQUIPMENT', priority: 'MEDIUM',
    preferredContactName: '', preferredContactPhone: '', preferredContactEmail: ''
  });

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ticketApi.getAll();
      setTickets(data);
    } catch (e) {
      setError('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // Only refresh if user manually requests it via a button - removed auto-refresh
  }, []);

  // Keep tabs predictable by clearing previous tab filters/search.
  useEffect(() => {
    setFilter('ALL');
    setSearch('');
  }, [activeTab]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      setCreateError('Title, description and location are required.');
      return;
    }
    setCreating(true);
    setCreateError('');
    try {
      const newTicket = await ticketApi.create(form);
      const createdTicket = createScreenshot
        ? await ticketApi.uploadAttachment(newTicket.id, createScreenshot)
        : newTicket;

      setTickets((prev) => [createdTicket, ...prev]);
      setShowCreateModal(false);
      setForm({
        title: '', description: '', location: '',
        category: 'EQUIPMENT', priority: 'MEDIUM',
        preferredContactName: '', preferredContactPhone: '', preferredContactEmail: ''
      });
      setCreateScreenshot(null);
      if (screenshotInputRef.current) screenshotInputRef.current.value = '';
    } catch (e) {
      setCreateError(e.message || 'Failed to create ticket. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleTicketUpdate = (updated) => {
    setTickets((prev) => {
      const exists = prev.some((t) => t.id === updated.id);
      if (!exists) return [updated, ...prev];
      return prev.map((t) => (t.id === updated.id ? updated : t));
    });
    if (updated.status === 'CLOSED') {
      setFilter('CLOSED');
    }
    setSelectedTicket(updated);
  };

  const hasTechnicianReply = (ticket) => {
    const hasUpdate = (ticket.technicianUpdates || []).length > 0;
    const hasTechComment = (ticket.comments || []).some(
      (c) => c.authorEmail && c.authorEmail === ticket.assignedTo?.email
    );
    return hasUpdate || hasTechComment;
  };

  const tabTickets =
    activeTab === 'COMPLETE'
      ? tickets.filter(hasTechnicianReply)
      : tickets;

  const filtered = tabTickets
    .filter((t) => filter === 'ALL' || t.status === filter)
    .filter((t) =>
      search === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())
    );

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'OPEN').length,
    inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter((t) => t.status === 'RESOLVED').length,
  };

  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-poppins flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-6 max-w-7xl mx-auto w-full relative z-10">

        {/* Welcome Header with Gradient */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tighter bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Welcome back, <span className="text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text">{firstName}</span>
            </h1>
            <p className="text-gray-400 font-medium text-lg">
              Track your campus service requests and stay connected.
            </p>
          </div>
            <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-8 py-4 rounded-full font-bold hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-110 shadow-lg shrink-0"
          >
            <Plus className="w-5 h-5" />
            Create Ticket
          </button>
        </div>

        {/* Quick Stats Grid with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'My Tickets', value: stats.total, icon: ClipboardList, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Open', value: stats.open, icon: AlertCircle, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'In Progress', value: stats.inProgress, icon: Clock, gradient: 'from-orange-400 to-red-500' },
            { label: 'Resolved', value: stats.resolved, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
          ].map((item, i) => (
            <div key={i} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" style={{backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`}} />
              <div className={`relative p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-300 shadow-2xl hover:shadow-3xl cursor-pointer group-hover:-translate-y-2`}>
                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} className="text-white" />
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{item.label}</p>
                <p className="text-4xl font-black text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs with Modern Styling */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 shadow-lg shadow-orange-500/50 scale-105'
                  : 'bg-white/10 backdrop-blur-xl border border-white/20 text-gray-300 hover:bg-white/20 hover:border-white/40'
              }`}
            >
              {tab === 'MY_INCIDENTS' ? 'My Tickets' : 'Complete'}
            </button>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets by title or location..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 shadow-lg'
                    : 'bg-white/10 backdrop-blur-xl border border-white/20 text-gray-300 hover:bg-white/20'
                }`}
              >
                {f === 'ALL' ? 'All' : f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-xl border border-red-400/50 rounded-xl p-4 text-sm text-red-200 flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
            <button onClick={fetchTickets} className="ml-auto underline font-bold hover:text-red-100">Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 font-medium">Loading your tickets...</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="bg-gradient-to-br from-white/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-16 text-center border border-white/20 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <ClipboardList className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-black text-white mb-3">No tickets found</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto text-base">
                {search
                  ? `No results for "${search}".`
                  : activeTab === 'COMPLETE'
                  ? 'No technician replies available yet.'
                  : 'You have not reported any tickets yet.'}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-10 py-4 rounded-full font-bold hover:shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-110 inline-block"
              >
                Create Your First Ticket
              </button>
            </div>
          </div>
        )}

        {/* Ticket List */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 font-medium">
              Showing <span className="font-bold text-orange-400">{filtered.length}</span> ticket{filtered.length !== 1 ? 's' : ''}
            </p>
            {filtered.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 cursor-pointer hover:border-orange-400/50 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 flex flex-col sm:flex-row sm:items-center gap-5"
              >
                {/* Priority bar */}
                <div className={`w-2 self-stretch rounded-full shrink-0 hidden sm:block ${priorityBar[ticket.priority]}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-xl border ${statusColors[ticket.status]}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-xl ${priorityColors[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-purple-500/30 text-purple-200 backdrop-blur-xl">
                      {ticket.category}
                    </span>
                  </div>

                  <h3 className="font-black text-white text-lg mb-2 line-clamp-1 group-hover:text-orange-300 transition-colors">{ticket.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">{ticket.description}</p>

                  {ticket.status === 'REJECTED' && ticket.rejectionReason && (
                    <div className="mb-3 rounded-lg border border-red-400/50 bg-red-500/20 px-4 py-3 backdrop-blur-xl">
                      <p className="text-xs font-bold uppercase tracking-wide text-red-300 mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-xs text-red-200 line-clamp-2">
                        {ticket.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                      <MapPin className="w-4 h-4" />{ticket.location}
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                      <Clock className="w-4 h-4" />
                      {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                      <MessageSquare className="w-4 h-4" />{ticket.comments?.length || 0} comments
                    </span>
                    {hasTechnicianReply(ticket) && (
                      <span className="flex items-center gap-1.5 text-orange-400 font-semibold">
                        <Wrench className="w-4 h-4" />Technician replied
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                      <Paperclip className="w-4 h-4" />{ticket.attachments?.length || 0} files
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 hidden sm:block group-hover:text-orange-400 transition-colors group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        )}

        {/* CTA Banner */}
        {!loading && filtered.length > 0 && (
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl p-12 text-white overflow-hidden relative mt-12 border border-white/20">
            <div className="absolute inset-0 opacity-50">
              <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div>
                <h2 className="text-3xl font-black mb-3">Need to report an issue?</h2>
                <p className="text-white/80 max-w-md">
                  Quickly create a ticket and our technicians will assist you right away.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-10 py-4 rounded-full font-bold hover:shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-110 shrink-0 whitespace-nowrap"
              >
                Create Ticket
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* CREATE TICKET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[999] p-0 sm:p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col border border-white/20">

            <div className="flex items-center justify-between p-8 border-b border-white/10 shrink-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
              <div>
                <h3 className="font-black text-white text-2xl">Create a Ticket</h3>
                <p className="text-gray-400 text-sm mt-1">Report an issue and let us help you</p>
              </div>
              <button
                onClick={() => { setShowCreateModal(false); setCreateError(''); }}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="overflow-y-auto flex-1 p-8 space-y-6">
              {createError && (
                <div className="bg-red-500/20 backdrop-blur-xl border border-red-400/50 rounded-xl p-4 text-sm text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {createError}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Title <span className="text-orange-400">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Projector not working in Lab 3"
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-5 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Description <span className="text-orange-400">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the issue in detail..."
                  rows={3}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-5 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 resize-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Location <span className="text-orange-400">*</span>
                </label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Lab 3, Block A, Ground Floor"
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-5 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-5 py-3 text-white text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition-all"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-5 py-3 text-white text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition-all"
                  >
                    {PRIORITIES.map((p) => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-4">
                <p className="text-sm font-bold text-white">Preferred Contact <span className="text-gray-400 font-normal">(optional)</span></p>
                <input
                  value={form.preferredContactName}
                  onChange={(e) => setForm({ ...form, preferredContactName: e.target.value })}
                  placeholder="Contact name"
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-orange-400 transition-all"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={form.preferredContactPhone}
                    onChange={(e) => setForm({ ...form, preferredContactPhone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-orange-400 transition-all"
                  />
                  <input
                    value={form.preferredContactEmail}
                    onChange={(e) => setForm({ ...form, preferredContactEmail: e.target.value })}
                    placeholder="Email"
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-orange-400 transition-all"
                  />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-dashed border-white/20 rounded-xl p-6">
                <label className="block text-sm font-bold text-white mb-3">
                  Screenshot / Image attachment
                </label>
                <input
                  ref={screenshotInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file && !file.type.startsWith('image/')) {
                      alert('Only image files are allowed');
                      e.target.value = '';
                      setCreateScreenshot(null);
                      return;
                    }
                    setCreateScreenshot(file);
                  }}
                  className="w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-orange-400 file:to-yellow-400 file:px-5 file:py-2 file:text-sm file:font-bold file:text-slate-900 hover:file:from-orange-500 hover:file:to-yellow-500 cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-3">
                  Optional. Add one screenshot so the technician can review it with the report.
                </p>
                {createScreenshot && (
                  <p className="text-xs font-semibold text-orange-400 mt-3 truncate">
                    ✓ Selected: {createScreenshot.name}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError('');
                    setCreateScreenshot(null);
                    if (screenshotInputRef.current) screenshotInputRef.current.value = '';
                  }}
                  className="flex-1 py-4 border border-white/20 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-slate-900 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-500/50"
                >
                  {creating
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : 'Submit Report'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          currentUser={user}
          onClose={() => setSelectedTicket(null)}
          onUpdate={handleTicketUpdate}
        />
      )}
    </div>
  );
}