import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Mail, ChevronDown, RotateCcw } from 'lucide-react';
import { mockPayments, statusBadgeClasses } from '../data/mockData';

const statusOptions = ['all', 'recovered', 'in_progress', 'failed', 'pending'];
const statusLabels = { all: 'All Statuses', recovered: 'Recovered', in_progress: 'In Progress', failed: 'Failed', pending: 'Pending' };

export default function FailedPayments() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [retryingId, setRetryingId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const filtered = mockPayments.filter((p) => {
    const matchesSearch = p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function showToast(message, type = 'success') {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }

  function handleRetry(id) {
    setRetryingId(id);
    setTimeout(() => {
      setRetryingId(null);
      showToast('Retry initiated successfully', 'success');
    }, 1500);
  }

  function handleSendEmail(id) {
    showToast('Dunning email queued', 'info');
  }

  return (
    <div className="space-y-5">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium text-white transform transition-all duration-300 ${
              t.type === 'success' ? 'bg-emerald-600' : 'bg-primary-600'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Failed Payments</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {filtered.length} payment{filtered.length !== 1 ? 's' : ''} matching your filters
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or payment ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-9 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <button
          onClick={() => { setSearch(''); setStatusFilter('all'); }}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Clear filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/60 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Decline Code</th>
                <th className="px-5 py-3">Attempts</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last Email</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-gray-300" />
                      <p className="font-medium">No payments found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-medium text-gray-900">{p.customer}</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">{p.id}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">{p.amountFormatted}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {p.declineLabel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{p.attempts}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${statusBadgeClasses[p.status]}`}>
                        {p.statusLabel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{p.lastEmailFormatted}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleSendEmail(p.id)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-primary-600 transition-colors"
                          title="Send dunning email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRetry(p.id)}
                          disabled={retryingId === p.id}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-primary-600 transition-colors disabled:opacity-50"
                          title="Manual retry"
                        >
                          {retryingId === p.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <RotateCcw className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Showing {filtered.length} of {mockPayments.length}</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-40" disabled>←</button>
            <button className="px-2.5 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-40" disabled>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
