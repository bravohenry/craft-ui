/**
 * [INPUT]: Depends on ./message for ToolDisplayMeta
 * [OUTPUT]: ActivityStatus, ActivityType, TodoStatus, TodoItem, ActivityItem, ResponseContent
 * [POS]: types/ — activity & turn types, extracted from TurnCard for cross-component reuse
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import type { ToolDisplayMeta } from './message';

// ── Activity Status & Type ──────────────────────────────────────────────────

export type ActivityStatus = 'pending' | 'running' | 'completed' | 'error' | 'backgrounded';
export type ActivityType = 'tool' | 'thinking' | 'intermediate' | 'status' | 'plan';

// ── Todo ────────────────────────────────────────────────────────────────────

export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'interrupted';

export interface TodoItem {
  /** Task content/description */
  content: string;
  /** Current status */
  status: TodoStatus;
  /** Present continuous form shown when in_progress (e.g., "Running tests") */
  activeForm?: string;
}

// ── Activity Item ───────────────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  type: ActivityType;
  status: ActivityStatus;
  toolName?: string;
  toolUseId?: string;
  toolInput?: Record<string, unknown>;
  content?: string;
  intent?: string;
  displayName?: string;
  toolDisplayMeta?: ToolDisplayMeta;
  timestamp: number;
  error?: string;
  // Parent-child nesting for Task subagents
  parentId?: string;
  depth?: number;
  // Status activities (e.g., compacting)
  statusType?: string;
  // Background task fields
  taskId?: string;
  shellId?: string;
  elapsedSeconds?: number;
  isBackground?: boolean;
}

// ── Response Content ────────────────────────────────────────────────────────

export interface ResponseContent {
  text: string;
  isStreaming: boolean;
  streamStartTime?: number;
  /** Whether this response is a plan (renders with plan variant) */
  isPlan?: boolean;
}
