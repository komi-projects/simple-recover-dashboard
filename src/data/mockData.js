// Realistic mock data for SimpleRecover dashboard

export const customers = [
  "Acme Corp", "TechStart Inc", "CloudForge Labs", "DataPulse SaaS", "NexStream",
  "PixelPush Studios", "BetaStack", "QuantumLeap AI", "FlowState IO", "MetricMind",
  "SyncWave", "DevNest", "Prism Labs", "Orbit Analytics", "KiteDeploy",
  "Vertex Systems", "EchoBase", "Terraforma", "Gridiron DB", "NovaCart",
  "CipherLock", "DriftOps", "Helix Commerce", "SprintBase"
];

const declineCodes = [
  { code: "insufficient_funds", label: "Insufficient Funds", weight: 0.40 },
  { code: "expired_card", label: "Expired Card", weight: 0.25 },
  { code: "card_declined", label: "Card Declined", weight: 0.20 },
  { code: "processing_error", label: "Processing Error", weight: 0.10 },
  { code: "incorrect_number", label: "Incorrect Number", weight: 0.05 }
];

const statuses = [
  { value: "recovered", label: "Recovered", weight: 0.35 },
  { value: "in_progress", label: "In Progress", weight: 0.30 },
  { value: "failed", label: "Failed", weight: 0.25 },
  { value: "pending", label: "Pending", weight: 0.10 }
];

function weightedPick(items) {
  const r = Math.random();
  let cumulative = 0;
  for (const item of items) {
    cumulative += item.weight;
    if (r <= cumulative) return item;
  }
  return items[items.length - 1];
}

function randomDate(daysBack = 30) {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatRelativeDate(d) {
  const now = new Date();
  const diffMs = now - d;
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return formatDate(d);
}

export function generateFailedPayments(count = 24) {
  const payments = [];
  for (let i = 0; i < count; i++) {
    const decline = weightedPick(declineCodes);
    const status = weightedPick(statuses);
    const amount = Math.floor(29 + Math.random() * 271); // $29-$299
    const created = randomDate(45);
    const attempts = status.value === 'recovered'
      ? 1 + Math.floor(Math.random() * 3)
      : status.value === 'failed'
        ? 3 + Math.floor(Math.random() * 4)
        : 1 + Math.floor(Math.random() * 3);

    payments.push({
      id: `pi_${Math.random().toString(36).substring(2, 14)}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      amount,
      amountFormatted: formatCurrency(amount),
      declineCode: decline.code,
      declineLabel: decline.label,
      status: status.value,
      statusLabel: status.label,
      attempts,
      createdAt: created,
      createdAtFormatted: formatDate(created),
      lastEmailAt: new Date(created.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 3),
      lastEmailFormatted: formatRelativeDate(new Date(created.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 3)),
    });
  }
  return payments.sort((a, b) => b.createdAt - a.createdAt);
}

export function generateRevenueData() {
  const data = [];
  const now = new Date();
  let cumulative = 0;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayRecovered = Math.floor(Math.random() * 800 + 200);
    cumulative += dayRecovered;
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      recovered: dayRecovered,
      cumulative,
      attempts: Math.floor(Math.random() * 15 + 5),
    });
  }
  return data;
}

export function generateDeclineBreakdown(payments) {
  const counts = {};
  for (const p of payments) {
    counts[p.declineCode] = (counts[p.declineCode] || 0) + 1;
  }
  return Object.entries(counts).map(([code, count]) => {
    const meta = declineCodes.find(d => d.code === code);
    return { name: meta?.label || code, value: count, code };
  });
}

export const mockPayments = generateFailedPayments(24);
export const revenueData = generateRevenueData();
export const declineBreakdown = generateDeclineBreakdown(mockPayments);

export const kpiData = {
  revenueRecovered: mockPayments
    .filter(p => p.status === 'recovered')
    .reduce((sum, p) => sum + p.amount, 0),
  recoveryRate: Math.round((mockPayments.filter(p => p.status === 'recovered').length / mockPayments.length) * 100),
  activeFailures: mockPayments.filter(p => p.status === 'in_progress' || p.status === 'pending').length,
  mrrAtRisk: mockPayments
    .filter(p => p.status !== 'recovered')
    .reduce((sum, p) => sum + p.amount, 0),
};

export const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

export const statusBadgeClasses = {
  recovered: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  in_progress: 'bg-primary-50 text-primary-700 ring-primary-600/20',
  failed: 'bg-red-50 text-red-700 ring-red-600/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
};

export const declineIconColors = {
  insufficient_funds: '#6366f1',
  expired_card: '#8b5cf6',
  card_declined: '#a78bfa',
  processing_error: '#f59e0b',
  incorrect_number: '#ef4444',
};
