/**
 * [INPUT]: Depends on ./message, ./session, ./activity
 * [OUTPUT]: Re-exports all public types from message.ts, session.ts, activity.ts
 * [POS]: types/ barrel — single import point for all type definitions
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

export type {
  MessageRole,
  ToolStatus,
  AuthRequestType,
  AuthStatus,
  CredentialInputMode,
  ToolDisplayMeta,
  AttachmentType,
  MessageAttachment,
  StoredAttachment,
  ContentBadge,
  Message,
  StoredMessage,
  TokenUsage,
  ErrorCode,
  RecoveryAction,
  TypedError,
  PermissionRequestType,
  PermissionRequest,
  AgentEventUsage,
  AgentEvent,
} from './message';

export { generateMessageId } from './message';

export type {
  SessionStatus,
  Session,
  StoredSession,
  SessionMetadata,
} from './session';

export type {
  ActivityStatus,
  ActivityType,
  TodoStatus,
  TodoItem,
  ActivityItem,
  ResponseContent,
} from './activity';
