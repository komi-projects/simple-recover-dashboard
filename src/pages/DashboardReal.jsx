import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, AlertCircle, DollarSign, Activity,
  ArrowUpRight, ArrowDownRight, Loader2, RefreshCw
} from 'lucide-react';
import { getDashboardStats, getFailedPayments } from '../api/client';

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];

const declineLabels = {
  'insufficient_funds': 'Insufficient Funds',
  'expired_card': 'Expired Card',
  'incorrect_cvc': 'Incorrect CVC',
  'processing_error': 'Processing Error',
  'issuer_declined': 'Issuer Declined',
  'try_again_later': 'Try Again Later',
};

const statusClasses = {
  'open': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'retrying': 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'recovered': 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'failed': 'bg-red-50 text-red-700 ring-red-600/20',
  'cancelled': 'bg-gray-50 text-gray-700 ring-gray-600/20',
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-200" />
        <div className="w-16 h-4 rounded bg-gray-200" />
      </div>
      <div className="w-24 h-8 rounded bg-gray-200 mb-2" />
      <div className="w-32 h-3 rounded bg-gray-200" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm animate-pulse h-80">
      <div className="w-40 h-5 rounded bg-gray-200 mb-4" />
      <div className="h-64 bg-gray-100 rounded-lg" />
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadData() {
    try {
      setLoading(true);
      const [dashboardData, paymentsData] = await Promise.all([
        getDashboardStats(),
        getFailedPayments({ limit: 6 }),
      ]);
      setStats(dashboardData.stats);
      setPayments(paymentsData.payments);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 300000); // 5 min auto-refresh
    return () => clearInterval(interval);
  }, []);

  // Build revenue chart data from payments
  const revenueData = React.useMemo(() => {
    if (!payments.length) return [];
    const daily = {};
    payments.forEach(p => {
      const date = new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      daily[date] = (daily[date] || 0) + parseFloat(p.recovered_amount || 0);
    });
    return Object.entries(daily).map(([date, recovered]) => ({ date, recovered: Math.round(recovered * 100) / 100 }));
  }, [payments]);

  // Build decline breakdown from payments
  const declineBreakdown = React.useMemo(() => {
    if (!payments.length) return [];
    const counts = {};
    payments.forEach(p => {
      counts[p.decline_code || 'unknown'] = (counts[p.decline_code || 'unknown'] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: declineLabels[name] || name,
      value,
    }));
  }, [payments]);

  const kpiCards = stats ? [
    {
      label: 'Revenue Recovered',
      value: `$${Math.round(stats.total_recovered_amount || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Recovery Rate',
      value: `${stats.recovery_rate?.rate || 0}%`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Active Failures',
      value: (stats.active_failed || 0).toString(),
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'MRR at Risk',
      value: `$${Math.round(stats.mrr_at_risk || 0).toLocaleString()}`,
      icon: Activity,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of your payment recovery performance</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          Error loading data: {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && !stats
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : kpiCards.map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                    <kpi.icon className={`w-[18px] h-[18px] ${kpi.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Revenue Recovered</h2>
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">Daily</span>
          </div>
          {loading && !revenueData.length ? (
            <SkeletonChart />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} formatter={(v) => [`$${v}`, 'Recovered']} />
                  <Area type="monotone" dataKey="recovered" stroke="#6366f1" strokeWidth={2} fill="url(#colorRecovered)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Decline Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Decline Code Breakdown</h2>
          {loading && !declineBreakdown.length ? (
            <SkeletonChart />
          ) : declineBreakdown.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={declineBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {declineBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-gray-600">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent Failed Payments */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Failed Payments</h2>
          <a href="#/payments" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Decline Code</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && !payments.length
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-5 py-3.5"><div className="w-32 h-4 bg-gray-200 rounded" /></td>
                      <td className="px-5 py-3.5"><div className="w-16 h-4 bg-gray-200 rounded" /></td>
                      <td className="px-5 py-3.5"><div className="w-24 h-4 bg-gray-200 rounded" /></td>
                      <td className="px-5 py-3.5"><div className="w-16 h-4 bg-gray-200 rounded" /></td>
                    </tr>
                  ))
                : payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900">{p.customer_email || 'Unknown'}</td>
                      <td className="px-5 py-3.5 text-gray-700">${parseFloat(p.amount).toFixed(2)} {p.currency?.toUpperCase()}</td>
                      <td className="px-5 py-3.5 text-gray-600">{declineLabels[p.decline_code] || p.decline_code}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${statusClasses[p.status] || statusClasses.open}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
