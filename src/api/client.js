// API client for SimpleRecover Dashboard
// Connects to the backend API

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const API_KEY = localStorage.getItem('sr_api_key') || '';

async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function getDashboardStats() {
  return api('/dashboard');
}

export async function getFailedPayments(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.limit) params.set('limit', filters.limit.toString());
  return api(`/failed-payments?${params}`);
}

export async function getFailedPayment(id) {
  return api(`/failed-payments/${id}`);
}

export async function getSettings() {
  return api('/settings');
}

export async function updateSettings(settings) {
  return api('/settings', {
    method: 'POST',
    body: JSON.stringify(settings),
  });
}

export async function getStats(days = 30) {
  return api(`/stats?days=${days}`);
}

export async function triggerRetry(id, delay) {
  return api(`/retry/${id}`, {
    method: 'POST',
    body: JSON.stringify({ delay }),
  });
}

export function setApiKey(key) {
  localStorage.setItem('sr_api_key', key);
}

export function getApiKey() {
  return localStorage.getItem('sr_api_key');
}

export function clearApiKey() {
  localStorage.removeItem('sr_api_key');
}
