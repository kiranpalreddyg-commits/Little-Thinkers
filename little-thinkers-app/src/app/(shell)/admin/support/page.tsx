'use client';

import { useState } from 'react';
import { searchAccounts, createSupportTicket, resolveTicket, escalateTicket, processDeletionRequest, AccountSearchResult, SupportTicket, EscalationTarget } from '@/lib/utils/supportManager';

export default function SupportAdminPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AccountSearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [newIssue, setNewIssue] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setResults(searchAccounts(query));
    setSearched(true);
  }

  function handleCreateTicket(parentEmail: string) {
    if (!newIssue.trim()) return;
    const ticket = createSupportTicket(parentEmail, newIssue.trim());
    setTickets((prev) => [...prev, ticket]);
    setNewIssue('');
  }

  function handleResolve(ticketId: string, resolution: string) {
    setTickets((prev) => resolveTicket(prev, ticketId, resolution));
  }

  function handleEscalate(ticketId: string, target: EscalationTarget, note: string) {
    setTickets((prev) => escalateTicket(prev, ticketId, target, note));
  }

  function handleProcessDeletion(ticketId: string) {
    const { tickets: updated } = processDeletionRequest(tickets, ticketId);
    setTickets(updated);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Support Admin</h1>

        {/* Search */}
        <section data-testid="section-search" className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Search</h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              data-testid="account-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Parent email or child name…"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              data-testid="account-search-button"
              className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700"
            >
              Search
            </button>
          </form>

          {searched && results.length === 0 && (
            <p data-testid="search-no-results" className="mt-3 text-sm text-gray-400">No accounts found.</p>
          )}

          {results.map((acc) => (
            <div key={acc.parentId} data-testid={`account-result-${acc.parentId}`} className="mt-4 border border-gray-100 rounded-xl p-4 space-y-3">
              <div>
                <p className="font-semibold text-gray-900" data-testid={`account-email-${acc.parentId}`}>{acc.parentEmail}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Children: {acc.children.map((c) => c.name).join(', ')}
                </p>
              </div>

              {/* Activity Timeline */}
              <div data-testid={`activity-timeline-${acc.parentId}`} className="mt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Activity Timeline</p>
                <ul className="space-y-1">
                  {acc.activityTimeline.map((entry, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-gray-300">{new Date(entry.timestamp).toLocaleDateString()}</span>
                      <span>{entry.event}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Create ticket */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  data-testid={`ticket-issue-input-${acc.parentId}`}
                  placeholder="Describe the issue…"
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <button
                  type="button"
                  data-testid={`create-ticket-button-${acc.parentId}`}
                  onClick={() => handleCreateTicket(acc.parentEmail)}
                  className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700"
                >
                  Create Ticket
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Tickets */}
        {tickets.length > 0 && (
          <section data-testid="section-tickets" className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Open Tickets</h2>
            {tickets.map((ticket) => (
              <div key={ticket.id} data-testid={`ticket-${ticket.id}`} className="border border-gray-100 rounded-xl p-4 mb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{ticket.issue}</p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{ticket.status}</span>
                </div>
                <p className="text-xs text-gray-400">{ticket.parentEmail}</p>
                {ticket.resolution && (
                  <p data-testid={`ticket-resolution-${ticket.id}`} className="text-xs text-green-600">{ticket.resolution}</p>
                )}
                {ticket.status === 'open' && (
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      data-testid={`resolve-ticket-${ticket.id}`}
                      onClick={() => handleResolve(ticket.id, 'Issue resolved by support staff.')}
                      className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700"
                    >
                      Resolve
                    </button>
                    <button
                      type="button"
                      data-testid={`escalate-ticket-${ticket.id}`}
                      onClick={() => handleEscalate(ticket.id, 'engineering', 'Requires engineering investigation.')}
                      className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
                    >
                      Escalate to Engineering
                    </button>
                    <button
                      type="button"
                      data-testid={`deletion-ticket-${ticket.id}`}
                      onClick={() => handleProcessDeletion(ticket.id)}
                      className="px-3 py-1 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700"
                    >
                      Process Deletion (30d)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
