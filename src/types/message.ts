/**
 * [INPUT]: None (root type definitions)
 * [OUTPUT]: MessageRole, Message, StoredMessage, ToolDisplayMeta, ToolStatus,
 *           AttachmentType, MessageAttachment, ContentBadge, StoredAttachment,
 *           TokenUsage, ErrorCode, TypedError, RecoveryAction, PermissionRequest,
 *           AgentEvent, AgentEventUsage, generateMessageId
 * [POS]: types/ — core message & event types, replaces @craft-agent/core/types/message
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

// ── Roles & Status ──────────────────────────────────────────────────────────

export type MessageRole =
  | 'user'
  | 'assistant'
  | 'tool'
  | 'error'
  | 'status'
  | 'info'
  | 'warning'
  | 'plan'
  | 'auth-request';

export type ToolStatus = 'pending' | 'executing' | 'completed' | 'error' | 'backgrounded';

export type AuthRequestType =
  | 'credential'
  | 'oauth'
  | 'oauth-google'
  | 'oauth-slack'
  | 'oauth-microsoft';

export type AuthStatus = 'pending' | 'completed' | 'cancelled' | 'failed';

export type CredentialInputMode =
  | 'bearer'
  | 'basic'
  | 'header'
  | 'query'
  | 'multi-header';

// ── Tool Display ────────────────────────────────────────────────────────────

export interface ToolDisplayMeta {
  displayName: string;
  iconDataUrl?: string;
  description?: string;
  category?: 'skill' | 'source' | 'native' | 'mcp';
}

// ── Attachments ─────────────────────────────────────────────────────────────

export type AttachmentType = 'image' | 'text' | 'pdf' | 'office' | 'unknown';

export interface MessageAttachment {
  type: AttachmentType;
  name: string;
  mimeType: string;
  size: number;
  base64?: string;
}

export interface StoredAttachment {
  id: string;
  type: AttachmentType;
  name: string;
  mimeType: string;
  size: number;
  originalSize?: number;
  storedPath: string;
  thumbnailPath?: string;
  thumbnailBase64?: string;
  markdownPath?: string;
  wasResized?: boolean;
  resizedBase64?: string;
}

// ── Content Badges ──────────────────────────────────────────────────────────

export interface ContentBadge {
  type: 'source' | 'skill' | 'context' | 'command' | 'file' | 'folder';
  label: string;
  rawText: string;
  iconDataUrl?: string;
  start: number;
  end: number;
  collapsedLabel?: string;
  filePath?: string;
}

// ── Auth Label Overrides ────────────────────────────────────────────────────

interface AuthLabels {
  credential?: string;
  username?: string;
  password?: string;
}

// ── Messages ────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  // Tool
  toolName?: string;
  toolUseId?: string;
  toolInput?: Record<string, unknown>;
  toolResult?: string;
  toolStatus?: ToolStatus;
  toolDuration?: number;
  toolIntent?: string;
  toolDisplayName?: string;
  toolDisplayMeta?: ToolDisplayMeta;
  parentToolUseId?: string;
  // Background
  taskId?: string;
  shellId?: string;
  elapsedSeconds?: number;
  isBackground?: boolean;
  // Attachments & badges
  attachments?: StoredAttachment[];
  badges?: ContentBadge[];
  // Flags
  isError?: boolean;
  isStreaming?: boolean;
  isPending?: boolean;
  isQueued?: boolean;
  isIntermediate?: boolean;
  // Turn grouping
  turnId?: string;
  // Status
  statusType?: 'compacting' | 'compaction_complete';
  infoLevel?: 'info' | 'warning' | 'error' | 'success';
  // Error
  errorCode?: string;
  errorTitle?: string;
  errorDetails?: string[];
  errorOriginal?: string;
  errorCanRetry?: boolean;
  // Ultrathink
  ultrathink?: boolean;
  // Plan
  planPath?: string;
  // Auth
  authRequestId?: string;
  authRequestType?: AuthRequestType;
  authSourceSlug?: string;
  authSourceName?: string;
  authStatus?: AuthStatus;
  authCredentialMode?: CredentialInputMode;
  authHeaderName?: string;
  authHeaderNames?: string[];
  authLabels?: AuthLabels;
  authDescription?: string;
  authHint?: string;
  authSourceUrl?: string;
  authPasswordRequired?: boolean;
  authError?: string;
  authEmail?: string;
  authWorkspace?: string;
}

export interface StoredMessage {
  id: string;
  type: MessageRole;
  content: string;
  timestamp?: number;
  // Tool
  toolName?: string;
  toolUseId?: string;
  toolInput?: Record<string, unknown>;
  toolResult?: string;
  toolStatus?: ToolStatus;
  toolDuration?: number;
  toolIntent?: string;
  toolDisplayName?: string;
  toolDisplayMeta?: ToolDisplayMeta;
  parentToolUseId?: string;
  // Background
  taskId?: string;
  shellId?: string;
  elapsedSeconds?: number;
  isBackground?: boolean;
  // Attachments & badges
  attachments?: StoredAttachment[];
  badges?: ContentBadge[];
  // Flags
  isError?: boolean;
  isIntermediate?: boolean;
  isQueued?: boolean;
  // Turn grouping
  turnId?: string;
  // Status
  statusType?: 'compacting' | 'compaction_complete';
  // Error
  errorCode?: string;
  errorTitle?: string;
  errorDetails?: string[];
  errorOriginal?: string;
  errorCanRetry?: boolean;
  // Ultrathink
  ultrathink?: boolean;
  // Plan
  planPath?: string;
  // Auth
  authRequestId?: string;
  authRequestType?: AuthRequestType;
  authSourceSlug?: string;
  authSourceName?: string;
  authStatus?: AuthStatus;
  authCredentialMode?: CredentialInputMode;
  authHeaderName?: string;
  authHeaderNames?: string[];
  authLabels?: AuthLabels;
  authDescription?: string;
  authHint?: string;
  authSourceUrl?: string;
  authPasswordRequired?: boolean;
  authError?: string;
  authEmail?: string;
  authWorkspace?: string;
}

// ── Token Usage ─────────────────────────────────────────────────────────────

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  contextTokens: number;
  costUsd: number;
  cacheReadTokens?: number;
  cacheCreationTokens?: number;
}

// ── Errors ──────────────────────────────────────────────────────────────────

export type ErrorCode =
  | 'invalid_api_key'
  | 'invalid_credentials'
  | 'response_too_large'
  | 'expired_oauth_token'
  | 'token_expired'
  | 'rate_limited'
  | 'service_error'
  | 'service_unavailable'
  | 'network_error'
  | 'mcp_auth_required'
  | 'mcp_unreachable'
  | 'billing_error'
  | 'model_no_tool_support'
  | 'invalid_model'
  | 'data_policy_error'
  | 'invalid_request'
  | 'image_too_large'
  | 'provider_error'
  | 'unknown_error';

export interface RecoveryAction {
  key: string;
  label: string;
  command?: string;
  action?: 'retry' | 'settings' | 'reauth';
}

export interface TypedError {
  code: ErrorCode;
  title: string;
  message: string;
  actions: RecoveryAction[];
  canRetry: boolean;
  retryDelayMs?: number;
  details?: string[];
  originalError?: string;
}

export type PermissionRequestType = 'bash' | 'file_write' | 'mcp_mutation' | 'api_mutation';

export interface PermissionRequest {
  requestId: string;
  toolName: string;
  command?: string;
  description: string;
  type?: PermissionRequestType;
}

// ── Agent Events ────────────────────────────────────────────────────────────

export interface AgentEventUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  cacheCreationTokens?: number;
  costUsd?: number;
  contextWindow?: number;
}

export type AgentEvent =
  | { type: 'status'; message: string }
  | { type: 'info'; message: string }
  | { type: 'text_delta'; text: string; turnId?: string; parentToolUseId?: string }
  | { type: 'text_complete'; text: string; isIntermediate?: boolean; turnId?: string; parentToolUseId?: string }
  | { type: 'tool_start'; toolName: string; toolUseId: string; input: Record<string, unknown>; intent?: string; displayName?: string; turnId?: string; parentToolUseId?: string; toolDisplayMeta?: ToolDisplayMeta }
  | { type: 'tool_result'; toolUseId: string; toolName?: string; result: string; isError: boolean; input?: Record<string, unknown>; turnId?: string; parentToolUseId?: string }
  | { type: 'permission_request'; requestId: string; toolName: string; command: string; description: string }
  | { type: 'error'; message: string }
  | { type: 'typed_error'; error: TypedError }
  | { type: 'complete'; usage?: AgentEventUsage }
  | { type: 'working_directory_changed'; workingDirectory: string }
  | { type: 'task_backgrounded'; toolUseId: string; taskId: string; intent?: string; turnId?: string }
  | { type: 'shell_backgrounded'; toolUseId: string; shellId: string; intent?: string; command?: string; turnId?: string }
  | { type: 'task_progress'; toolUseId: string; elapsedSeconds: number; turnId?: string }
  | { type: 'shell_killed'; shellId: string; turnId?: string }
  | { type: 'source_activated'; sourceSlug: string; originalMessage: string }
  | { type: 'usage_update'; usage: Pick<AgentEventUsage, 'inputTokens' | 'contextWindow'> }
  | { type: 'todos_updated'; todos: Array<{ content: string; status: 'pending' | 'in_progress' | 'completed'; activeForm?: string }>; turnId?: string; explanation?: string | null };

// ── Helpers ─────────────────────────────────────────────────────────────────

export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
