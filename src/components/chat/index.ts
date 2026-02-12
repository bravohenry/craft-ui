/**
 * [INPUT]: All chat module components and utilities
 * [OUTPUT]: Public API for @craft/ui/chat — components, types, utilities
 * [POS]: chat/ barrel export, single entry point for consumers
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

// Turn utilities (pure functions, no React)
export * from './turn-utils'

// Components
export { TurnCard, ResponseCard, SIZE_CONFIG, ActivityStatusIcon, type TurnCardProps, type ResponseCardProps } from './TurnCard'
export type { ActivityItem, ActivityStatus, ActivityType, ResponseContent, TodoItem, TodoStatus } from '@/types/activity'
export { InlineExecution, mapToolEventToActivity, type InlineExecutionProps, type InlineExecutionStatus, type InlineActivityItem } from './InlineExecution'
export { TurnCardActionsMenu, type TurnCardActionsMenuProps } from './TurnCardActionsMenu'
export { SessionViewer, type SessionViewerProps, type SessionViewerMode } from './SessionViewer'
export { UserMessageBubble, type UserMessageBubbleProps } from './UserMessageBubble'
export { SystemMessage, type SystemMessageProps, type SystemMessageType } from './SystemMessage'

// Accept plan dropdown (for plan cards)
export { AcceptPlanDropdown } from './AcceptPlanDropdown'
