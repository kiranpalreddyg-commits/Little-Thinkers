import { logAuditEvent } from './auditLog';

export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'escalated';
export type EscalationTarget = 'engineering' | 'legal' | 'security';

export interface SupportTicket {
  id: string;
  createdAt: string;
  parentEmail: string;
  childName?: string;
  issue: string;
  status: TicketStatus;
  resolution?: string;
  escalationTarget?: EscalationTarget;
  escalationNote?: string;
  resolvedAt?: string;
}

export interface AccountSearchResult {
  parentEmail: string;
  parentId: string;
  children: Array<{ id: string; name: string; age: number }>;
  activityTimeline: Array<{ event: string; timestamp: string }>;
}

// Mock account data for support search (matches mock DB)
const MOCK_ACCOUNTS: AccountSearchResult[] = [
  {
    parentEmail: 'james@example.com',
    parentId: 'parent-1',
    children: [
      { id: 'child-1', name: 'Aiden', age: 8 },
      { id: 'child-2', name: 'Maya', age: 14 },
    ],
    activityTimeline: [
      { event: 'Account created', timestamp: '2026-05-01T00:00:00Z' },
      { event: 'Child Aiden added with COPPA consent', timestamp: '2026-05-01T01:00:00Z' },
      { event: 'Child Maya added with COPPA consent', timestamp: '2026-05-01T01:05:00Z' },
      { event: 'Parent logged in', timestamp: '2026-05-16T08:00:00Z' },
    ],
  },
];

export function searchAccounts(query: string): AccountSearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return MOCK_ACCOUNTS.filter((acc) => {
    const emailMatch = acc.parentEmail.toLowerCase().includes(q);
    const childMatch = acc.children.some((c) => c.name.toLowerCase().includes(q));
    return emailMatch || childMatch;
  });
}

export function createSupportTicket(
  parentEmail: string,
  issue: string,
  childName?: string,
): SupportTicket {
  return {
    id: `ticket-${Date.now()}`,
    createdAt: new Date().toISOString(),
    parentEmail,
    childName,
    issue,
    status: 'open',
  };
}

export function resolveTicket(
  tickets: SupportTicket[],
  ticketId: string,
  resolution: string,
): SupportTicket[] {
  return tickets.map((t) => {
    if (t.id !== ticketId) return t;
    logAuditEvent('support_interaction', {
      metadata: { ticketId, action: 'resolved', resolution },
    });
    return { ...t, status: 'resolved', resolution, resolvedAt: new Date().toISOString() };
  });
}

export function escalateTicket(
  tickets: SupportTicket[],
  ticketId: string,
  target: EscalationTarget,
  note: string,
): SupportTicket[] {
  return tickets.map((t) => {
    if (t.id !== ticketId) return t;
    logAuditEvent('support_interaction', {
      metadata: { ticketId, action: 'escalated', target, note },
    });
    return { ...t, status: 'escalated', escalationTarget: target, escalationNote: note };
  });
}

export function processDeletionRequest(
  tickets: SupportTicket[],
  ticketId: string,
): { tickets: SupportTicket[]; completesAt: string } {
  const completesAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const updated = tickets.map((t) => {
    if (t.id !== ticketId) return t;
    logAuditEvent('deletion_requested', { metadata: { ticketId, completesAt } });
    return { ...t, status: 'in-progress' as TicketStatus, resolution: `30-day deletion scheduled. Completes: ${completesAt}` };
  });
  return { tickets: updated, completesAt };
}
