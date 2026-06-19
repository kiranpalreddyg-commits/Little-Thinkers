const AUDIT_LOG_KEY = 'lt_audit_log';

export type AuditEventType =
  | 'consent_granted'
  | 'consent_withdrawn'
  | 'deletion_requested'
  | 'login'
  | 'logout'
  | 'content_review_approved'
  | 'content_review_rejected'
  | 'support_interaction'
  | 'data_export'
  | 'password_reset_requested';

export interface AuditEvent {
  id: string;
  event: AuditEventType;
  timestamp: string;
  userId?: string;
  childId?: string;
  metadata?: Record<string, unknown>;
}

export function logAuditEvent(
  event: AuditEventType,
  context: { userId?: string; childId?: string; metadata?: Record<string, unknown> } = {},
): AuditEvent {
  const entry: AuditEvent = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    event,
    timestamp: new Date().toISOString(),
    ...context,
  };
  if (typeof window !== 'undefined') {
    try {
      const existing = getAuditLog();
      existing.push(entry);
      localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(existing));
    } catch { /* quota/private */ }
  }
  return entry;
}

export function getAuditLog(): AuditEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function clearAuditLog(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(AUDIT_LOG_KEY); } catch { /* quota/private */ }
}

export function getAuditLogForChild(childId: string): AuditEvent[] {
  return getAuditLog().filter((e) => e.childId === childId);
}

export function getAuditLogByType(eventType: AuditEventType): AuditEvent[] {
  return getAuditLog().filter((e) => e.event === eventType);
}

// Encryption status indicator — in production this would verify TLS and storage encryption.
// In our mock environment we declare the policy.
export const ENCRYPTION_POLICY = {
  inTransit: 'TLS 1.3',
  atRest: 'AES-256-GCM',
  keyManagement: 'per-tenant rotation',
} as const;
