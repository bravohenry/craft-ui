# types/
> L2 | Parent: /AGENTS.md

message.ts: Core message, event, error, attachment, badge, token types — replaces @craft-agent/core
session.ts: Session, StoredSession, SessionMetadata — depends on message.ts for StoredMessage/TokenUsage
activity.ts: ActivityItem, ActivityStatus, ActivityType, TodoItem, ResponseContent — extracted from TurnCard for cross-component reuse
index.ts: Barrel re-export of all public types

[PROTOCOL]: Update on change, then check AGENTS.md
