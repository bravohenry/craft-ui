/**
 * [INPUT]: Depends on ./message (StoredMessage, TokenUsage)
 * [OUTPUT]: Session, StoredSession, SessionMetadata, SessionStatus
 * [POS]: types/ — session & workspace types, replaces @craft-agent/core/types/session
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import type { StoredMessage, TokenUsage } from './message';

export type SessionStatus = 'todo' | 'in_progress' | 'needs_review' | 'done' | 'cancelled';

export interface Session {
  id: string;
  sdkSessionId?: string;
  workspaceId: string;
  name?: string;
  createdAt: number;
  lastUsedAt: number;
  isArchived?: boolean;
  isFlagged?: boolean;
  status?: SessionStatus;
  lastReadMessageId?: string;
  parentSessionId?: string;
  siblingOrder?: number;
}

export interface StoredSession extends Session {
  messages: StoredMessage[];
  tokenUsage: TokenUsage;
}

export interface SessionMetadata {
  id: string;
  workspaceId: string;
  name?: string;
  createdAt: number;
  lastUsedAt: number;
  messageCount: number;
  preview?: string;
  sdkSessionId?: string;
  isArchived?: boolean;
  isFlagged?: boolean;
  status?: SessionStatus;
  hidden?: boolean;
  parentSessionId?: string;
  siblingOrder?: number;
}
