import React, { useState } from 'react';
import {
  Mail, Repeat, FileText, Globe, ToggleLeft, ToggleRight,
  Copy, Check, Save, Eye, EyeOff, Shield
} from 'lucide-react';

export default function Settings() {
  const [dunningEnabled, setDunningEnabled] = useState(true);
  const [retrySchedule, setRetrySchedule] = useState([1, 3, 7, 14]);
  const [emailPreview, setEmailPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);

  const webhookUrl = 'https://api.simplerecover.io/v1/webhooks/stripe/live_xxxxxxxxxxxx';

  function copyWebhook() {
    navigator.clipboard.writeText(webhookUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure your recovery workflow and integrations</p>
      </div>

      {/* Saved indicator */}
      {saved && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium text-white bg-emerald-600 transform transition-all duration-300">
          Settings saved successfully
        </div>
      )}

      {/* Dunning Emails */}
      <div className="bg-white rounded-xl border border-gray-100 card-shadow p-5 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
            <Mail className="w-[18px] h-[18px] text-primary-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Dunning Emails</h2>
            <p className="text-xs text-gray-500">Automated payment failure notifications</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-900">Enable dunning emails</p>
            <p className="text-xs text-gray-500 mt-0.5">Send automated emails when payments fail</p>
          </div>
          <button
            onClick={() => setDunningEnabled(!dunningEnabled)}
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            {dunningEnabled ? <ToggleRight className="w-10 h-6" /> : <ToggleLeft className="w-10 h-6 text-gray-400" />}
          </button>
        </div>

        {dunningEnabled && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">From Name</label>
              <input
                type="text"
                defaultValue="SimpleRecover"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">From Email</label>
              <input
                type="email"
                defaultValue="recoveries@simplerecover.io"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Retry Schedule */}
      <div className="bg-white rounded-xl border border-gray-100 card-shadow p-5 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-accent-50 flex items-center justify-center">
            <Repeat className="w-[18px] h-[18px] text-accent-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Retry Schedule</h2>
            <p className="text-xs text-gray-500">Days to wait between retry attempts</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {retrySchedule.map((day, i) => (
            <div key={i} className="relative">
              <label className="block text-xs font-medium text-gray-500 mb-1">Attempt {i + 1}</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={day}
                  onChange={(e) => {
                    const newSchedule = [...retrySchedule];
                    newSchedule[i] = parseInt(e.target.value) || 0;
                    setRetrySchedule(newSchedule);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min={0}
                />
                <span className="ml-2 text-xs text-gray-500">days</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Template Preview */}
      <div className="bg-white rounded-xl border border-gray-100 card-shadow p-5 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
            <FileText className="w-[18px] h-[18px] text-gray-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">Email Template Preview</h2>
            <p className="text-xs text-gray-500">What your customers will receive</p>
          </div>
          <button
            onClick={() => setEmailPreview(!emailPreview)}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            {emailPreview ? 'Hide preview' : 'Show preview'}
          </button>
        </div>

        {emailPreview && (
          <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-700 space-y-3">
            <div className="border-b border-gray-200 pb-2">
              <p className="text-xs text-gray-400 mb-1">Subject</p>
              <p className="font-medium">Your payment failed — let's fix it</p>
            </div>
            <div className="space-y-2">
              <p>Hi {{customer_name}},</p>
              <p>We weren't able to process your latest payment of <strong>{{amount}}</strong> for <strong>{{plan_name}}</strong>.</p>
              <p>This usually happens when a card expires or there are insufficient funds. It takes 30 seconds to update:</p>
              <div className="my-3">
                <a href="#" className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">Update Payment Method</a>
              </div>
              <p className="text-xs text-gray-500">If you have questions, reply to this email — we're here to help.</p>
            </div>
          </div>
        )}
      </div>

      {/* Webhook URL */}
      <div className="bg-white rounded-xl border border-gray-100 card-shadow p-5 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
            <Globe className="w-[18px] h-[18px] text-gray-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Webhook URL</h2>
            <p className="text-xs text-gray-500">Add this to your Stripe webhook endpoints</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type={showWebhook ? 'text' : 'password'}
              value={webhookUrl}
              readOnly
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 font-mono text-gray-600 pr-10"
            />
            <button
              onClick={() => setShowWebhook(!showWebhook)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showWebhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={copyWebhook}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Stripe Connect */}
      <div className="bg-white rounded-xl border border-gray-100 card-shadow p-5 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
            <Shield className="w-[18px] h-[18px] text-gray-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">Stripe Connect</h2>
            <p className="text-xs text-gray-500">Link your Stripe account to enable recovery</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Connected
          </span>
        </div>

        <div className="flex items-center gap-3 py-3 border-t border-gray-100">
          <div className="w-8 h-8 rounded-full bg-[#635bff] flex items-center justify-center text-white text-xs font-bold">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Acme Corp Production</p>
            <p className="text-xs text-gray-500">acct_1Hxxxxxxxxxxxx</p>
          </div>
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
            Disconnect
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm shadow-primary-500/20"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
