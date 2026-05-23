import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, AlertCircle, DollarSign, Activity,
  ArrowUpRight, ArrowDownRight, Loader2
} from 'lucide-react';
import {
  mockPayments, revenueData, declineBreakdown, kpiData,
  COLORS, statusBadgeClasses
} from '../data/mockData';

const kpiCards = [
  {
    label: 'Revenue Recovered',
    value: `$${kpiData.revenueRecovered.toLocaleString()}`,
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    label: 'Recovery Rate',
    value: `${kpiData.recoveryRate}%`,
    change: '+3.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
  {
    label: 'Active Failures',
    value: kpiData.activeFailures.toString(),
    change: '-2',
    trend: 'down',
    icon: AlertCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    label: 'MRR at Risk',
    value: `$${kpiData.mrrAtRisk.toLocaleString()}`,
    change: '-8.1%',
    trend: 'down',
    icon: Activity,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 card-shadow animate-pulse">
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
    <div className="bg-white rounded-xl p-5 border border-gray-100 card-shadow animate-pulse h-80">
      <div className="w-40 h-5 rounded bg-gray-200 mb-4" />
      <div className="h-64 bg-gray-100 rounded-lg" />
    </div>
  );
}

export default function Dashboard() {
  const recentPayments = mockPayments.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of your payment recovery performance</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-500" />
          Auto-refreshing every 5m
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl p-5 border border-gray-100 card-shadow hover:card-shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-[18px] h-[18px] ${kpi.color}`} />
              </div>
              <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {kpi.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Revenue Recovered — Last 30 Days</h2>
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">Daily</span>
          </div>
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
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }}
                  formatter={(v) => [`$${v}`, 'Recovered']}
                />
                <Area type="monotone" dataKey="recovered" stroke="#6366f1" strokeWidth={2} fill="url(#colorRecovered)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Decline Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 card-shadow">
          <h2 className="font-semibold text-gray-900 mb-4">Decline Code Breakdown</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={declineBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {declineBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Failed Payments */}
      <div className="bg-white rounded-xl border border-gray-100 card-shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Failed Payments</h2>
          <a href="#/payments" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Decline Code</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentPayments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{p.customer}</td>
                  <td className="px-5 py-3.5 text-gray-700">{p.amountFormatted}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {p.declineLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${statusBadgeClasses[p.status]}`}>
                      {p.statusLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{p.lastEmailFormatted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
