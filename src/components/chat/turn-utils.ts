/**
 * [INPUT]: @/types/message (Message, StoredMessage, MessageRole), @/types/activity (ActivityItem, ActivityStatus, ActivityType, ResponseContent, TodoItem)
 * [OUTPUT]: storedToMessage, AssistantTurn, UserTurn, SystemTurn, AuthRequestTurn, Turn, TurnPhase, deriveTurnPhase, shouldShowThinkingIndicator, groupMessagesByTurn, getTurnIntent, hasPendingActivities, hasErrorActivities, getActivitySummary, formatTurnAsMarkdown, formatActivityAsMarkdown, getLastAssistantTurn, getLastUserMessageTime, isLastTurnStreaming, computeLastChildSet, formatDuration, formatTokens, TaskOutputData, ActivityGroup, isActivityGroup, groupActivitiesByParent, countTotalActivities
 * [POS]: chat/ — turn grouping utilities, converts flat Message[] into grouped turns for TurnCard rendering
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import type { Message, StoredMessage } from '@/types/message'
import type { ActivityItem, ActivityStatus, ActivityType, ResponseContent, TodoItem } from '@/types/activity'

// Re-export ActivityItem for consumers
export type { ActivityItem }

// ============================================================================
// Helpers
// ============================================================================

/**
 * Strip error wrapper tags and prefixes from tool error messages.
 * The Claude Agent SDK wraps errors in tags like <error><tool_use_error>...</tool_use_error></error>
 * which aren't user-friendly. Additionally, errorResponse() and blockWithReason() prefix
 * messages with "[ERROR] " so the Codex model can detect failures (the OpenAI API has no
 * error signaling field). We strip that prefix here for clean UI display.
 */
function stripErrorTags(content: string | undefined): string | undefined {
  if (!content) return content
  return content
    .replace(/<\/?error>/gi, '')
    .replace(/<\/?tool_use_error>/gi, '')
    .replace(/^\[ERROR]\s*/i, '')
    .trim()
}

/** Convert StoredMessage to Message format for turn processing */
export function storedToMessage(stored: StoredMessage): Message {
  return {
    id: stored.id,
    role: stored.type,
    content: stored.content,
    timestamp: stored.timestamp ?? Date.now(),
    toolName: stored.toolName,
    toolUseId: stored.toolUseId,
    toolInput: stored.toolInput,
    toolResult: stored.toolResult,
    toolStatus: stored.toolStatus,
    toolDuration: stored.toolDuration,
    toolIntent: stored.toolIntent,
    toolDisplayName: stored.toolDisplayName,
    toolDisplayMeta: stored.toolDisplayMeta,
    parentToolUseId: stored.parentToolUseId,
    taskId: stored.taskId,
    shellId: stored.shellId,
    elapsedSeconds: stored.elapsedSeconds,
    isBackground: stored.isBackground,
    attachments: stored.attachments,
    badges: stored.badges,
    isError: stored.isError,
    isIntermediate: stored.isIntermediate,
    turnId: stored.turnId,
    errorCode: stored.errorCode,
    errorTitle: stored.errorTitle,
    errorDetails: stored.errorDetails,
    errorOriginal: stored.errorOriginal,
    errorCanRetry: stored.errorCanRetry,
    ultrathink: stored.ultrathink,
    planPath: stored.planPath,
    // Auth-request fields
    authRequestId: stored.authRequestId,
    authRequestType: stored.authRequestType,
    authSourceSlug: stored.authSourceSlug,
    authSourceName: stored.authSourceName,
    authStatus: stored.authStatus,
    authCredentialMode: stored.authCredentialMode,
    authHeaderName: stored.authHeaderName,
    authLabels: stored.authLabels,
    authDescription: stored.authDescription,
    authHint: stored.authHint,
    authError: stored.authError,
    authEmail: stored.authEmail,
    authWorkspace: stored.authWorkspace,
  }
}

// ============================================================================
// Types
// ============================================================================

/** Represents one complete assistant turn */
export interface AssistantTurn {
  type: 'assistant'
  turnId: string
  activities: ActivityItem[]
  response?: ResponseContent
  intent?: string
  isStreaming: boolean
  isComplete: boolean
  timestamp: number
  /** Extracted from TodoWrite tool - latest todo state in this turn */
  todos?: TodoItem[]
}

/** Represents a user message */
export interface UserTurn {
  type: 'user'
  message: Message
  timestamp: number
}

/** Represents a system/info/error message that stands alone */
export interface SystemTurn {
  type: 'system'
  message: Message
  timestamp: number
}

/** Represents an auth request (credential input, OAuth flow) */
export interface AuthRequestTurn {
  type: 'auth-request'
  message: Message
  timestamp: number
}

export type Turn = AssistantTurn | UserTurn | SystemTurn | AuthRequestTurn

// ============================================================================
// Turn Lifecycle Phase
// ============================================================================

export type TurnPhase =
  | 'pending'
  | 'tool_active'
  | 'awaiting'
  | 'streaming'
  | 'complete'

export function deriveTurnPhase(turn: AssistantTurn): TurnPhase {
  if (turn.isComplete) {
    return 'complete'
  }
  if (turn.response && turn.response.isStreaming) {
    return 'streaming'
  }
  const hasRunningTools = turn.activities.some(a => a.type === 'tool' && a.status === 'running')
  if (hasRunningTools) {
    return 'tool_active'
  }
  if (turn.activities.length > 0) {
    return 'awaiting'
  }
  return 'pending'
}

export function shouldShowThinkingIndicator(phase: TurnPhase, isBuffering: boolean): boolean {
  return phase === 'pending' || phase === 'awaiting' || (phase === 'streaming' && isBuffering)
}

// ============================================================================
// Helper Functions
// ============================================================================

function getToolStatus(message: Message): ActivityStatus {
  if (message.errorCode === 'response_too_large') return 'completed'
  if (message.isError) return 'error'
  if (message.toolStatus === 'completed') return 'completed'
  if (message.toolResult !== undefined) return 'completed'
  if (message.toolStatus === 'pending') return 'pending'
  return 'running'
}

function messageToActivity(message: Message, existingActivities: ActivityItem[] = []): ActivityItem {
  const activity: ActivityItem = {
    id: message.id,
    type: 'tool' as ActivityType,
    status: getToolStatus(message),
    toolName: message.toolName,
    toolUseId: message.toolUseId,
    toolInput: message.toolInput,
    content: message.toolResult || message.content,
    intent: message.toolIntent,
    displayName: message.toolDisplayName,
    toolDisplayMeta: message.toolDisplayMeta,
    timestamp: message.timestamp,
    error: message.isError ? stripErrorTags(message.toolResult || message.content) : undefined,
    parentId: message.parentToolUseId,
  }

  if (activity.parentId) {
    const parent = existingActivities.find(a => a.toolUseId === activity.parentId)
    activity.depth = parent ? (parent.depth || 0) + 1 : 1
  } else {
    activity.depth = 0
  }

  return activity
}

function calculateActivityDepths(activities: ActivityItem[]): void {
  const toolIdToActivity = new Map<string, ActivityItem>()
  for (const activity of activities) {
    if (activity.toolUseId) {
      toolIdToActivity.set(activity.toolUseId, activity)
    }
  }

  for (const activity of activities) {
    let depth = 0
    let parentId = activity.parentId

    while (parentId && depth < 10) {
      depth++
      const parent = toolIdToActivity.get(parentId)
      parentId = parent?.parentId
    }

    activity.depth = depth
  }
}

// ============================================================================
// TodoWrite Extraction
// ============================================================================

function extractTodosFromActivities(activities: ActivityItem[]): TodoItem[] | undefined {
  const todoWriteActivities = activities
    .filter(a => a.toolName === 'TodoWrite' && a.status === 'completed' && a.content)
    .sort((a, b) => b.timestamp - a.timestamp)

  const latestActivity = todoWriteActivities[0]
  if (!latestActivity) return undefined

  const latestResult = latestActivity.content
  if (!latestResult) return undefined

  try {
    const input = latestActivity.toolInput
    if (input && Array.isArray(input.todos)) {
      return input.todos.map((todo: { content: string; status: string; activeForm?: string }) => ({
        content: todo.content,
        status: todo.status as 'pending' | 'in_progress' | 'completed',
        activeForm: todo.activeForm,
      }))
    }
  } catch {
    // Failed to parse, return undefined
  }

  return undefined
}

// ============================================================================
// Main Grouping Function
// ============================================================================

export function groupMessagesByTurn(messages: Message[]): Turn[] {
  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp)

  const turns: Turn[] = []
  let currentTurn: AssistantTurn | null = null

  const flushCurrentTurn = (interrupted = false) => {
    if (currentTurn) {
      currentTurn.activities.sort((a, b) => a.timestamp - b.timestamp)
      calculateActivityDepths(currentTurn.activities)
      currentTurn.todos = extractTodosFromActivities(currentTurn.activities)

      if (interrupted) {
        currentTurn.activities = currentTurn.activities.map(activity =>
          activity.status === 'running'
            ? { ...activity, status: 'error' as ActivityStatus, error: 'Interrupted' }
            : activity
        )
        if (currentTurn.todos) {
          currentTurn.todos = currentTurn.todos.map(todo =>
            todo.status === 'in_progress'
              ? { ...todo, status: 'interrupted' as const }
              : todo
          )
        }
        currentTurn.isStreaming = false
        currentTurn.isComplete = true
      }

      const hasPlan = currentTurn.activities.some(a => a.type === 'plan')
      if (!interrupted && !hasPlan && !currentTurn.response && currentTurn.isComplete && currentTurn.activities.length > 0) {
        const lastTextActivity = [...currentTurn.activities]
          .reverse()
          .find(a => a.type === 'intermediate' && a.content)

        if (lastTextActivity?.content) {
          currentTurn.response = {
            text: lastTextActivity.content,
            isStreaming: false,
          }
        }
      }

      turns.push(currentTurn)
      currentTurn = null
    }
  }

  for (const message of sortedMessages) {
    if (message.role === 'auth-request') {
      if (currentTurn) currentTurn.isComplete = true
      flushCurrentTurn()
      turns.push({
        type: 'auth-request',
        message,
        timestamp: message.timestamp,
      })
      continue
    }

    if (message.role === 'user') {
      if (currentTurn) currentTurn.isComplete = true
      flushCurrentTurn()
      turns.push({
        type: 'user',
        message,
        timestamp: message.timestamp,
      })
      continue
    }

    if (message.role === 'status') {
      if (!currentTurn) {
        currentTurn = {
          type: 'assistant',
          turnId: message.id,
          activities: [],
          response: undefined,
          intent: undefined,
          isStreaming: true,
          isComplete: false,
          timestamp: message.timestamp,
        }
      }
      const statusActivity: ActivityItem = {
        id: message.id,
        type: 'status',
        status: 'running',
        content: message.content,
        timestamp: message.timestamp,
        statusType: message.statusType,
        depth: 0,
      }
      currentTurn.activities.push(statusActivity)
      continue
    }

    if (message.role === 'info' && message.statusType === 'compaction_complete') {
      if (currentTurn) {
        const statusIdx = currentTurn.activities.findIndex(
          a => a.type === 'status' && a.statusType === 'compacting'
        )
        const existingActivity = currentTurn.activities[statusIdx]
        if (statusIdx !== -1 && existingActivity) {
          currentTurn.activities[statusIdx] = {
            ...existingActivity,
            status: 'completed',
            content: message.content,
          }
        }
      }
      continue
    }

    if (message.role === 'error' || message.role === 'info' || message.role === 'warning') {
      const isInterruption = message.role === 'info'
      if (currentTurn && !isInterruption) currentTurn.isComplete = true
      flushCurrentTurn(isInterruption)
      turns.push({
        type: 'system',
        message,
        timestamp: message.timestamp,
      })
      continue
    }

    if (message.role === 'plan') {
      if (!currentTurn) {
        currentTurn = {
          type: 'assistant',
          turnId: message.turnId || message.id,
          activities: [],
          response: undefined,
          intent: undefined,
          isStreaming: false,
          isComplete: false,
          timestamp: message.timestamp,
        }
      }
      currentTurn.activities.push({
        id: message.id,
        type: 'plan' as ActivityType,
        status: 'completed',
        content: message.content,
        displayName: 'Plan',
        timestamp: message.timestamp,
      })
      currentTurn.isStreaming = false
      currentTurn.isComplete = true
      flushCurrentTurn()
      continue
    }

    if (message.role === 'tool') {
      const isToolComplete = message.toolStatus === 'completed' || message.toolResult !== undefined
      if (!currentTurn) {
        currentTurn = {
          type: 'assistant',
          turnId: message.turnId || message.id,
          activities: [],
          response: undefined,
          intent: message.toolIntent,
          isStreaming: !isToolComplete,
          isComplete: false,
          timestamp: message.timestamp,
        }
      }
      currentTurn.activities.push(messageToActivity(message, currentTurn.activities))
      currentTurn.isStreaming = !isToolComplete
      continue
    }

    if (message.role === 'assistant') {
      if (message.isIntermediate || message.isPending) {
        if (!currentTurn) {
          currentTurn = {
            type: 'assistant',
            turnId: message.turnId || message.id,
            activities: [],
            response: undefined,
            intent: undefined,
            isStreaming: !!message.isPending,
            isComplete: false,
            timestamp: message.timestamp,
          }
        }
        const intermediateActivity: ActivityItem = {
          id: message.id,
          type: 'intermediate',
          status: message.isPending ? 'running' : 'completed',
          content: message.content,
          timestamp: message.timestamp,
          parentId: message.parentToolUseId,
        }
        if (intermediateActivity.parentId) {
          const parent = currentTurn.activities.find(a => a.toolUseId === intermediateActivity.parentId)
          intermediateActivity.depth = parent ? (parent.depth || 0) + 1 : 1
        } else {
          intermediateActivity.depth = 0
        }
        currentTurn.activities.push(intermediateActivity)

        if (!message.isPending && !message.isStreaming) {
          currentTurn.isStreaming = false
        }
        continue
      }

      if (!currentTurn) {
        currentTurn = {
          type: 'assistant',
          turnId: message.turnId || message.id,
          activities: [],
          response: undefined,
          intent: undefined,
          isStreaming: !!message.isStreaming,
          isComplete: !message.isStreaming,
          timestamp: message.timestamp,
        }
      }

      currentTurn.response = {
        text: message.content,
        isStreaming: !!message.isStreaming,
        streamStartTime: message.isStreaming ? message.timestamp : undefined,
      }
      currentTurn.isStreaming = !!message.isStreaming
      currentTurn.isComplete = !message.isStreaming

      if (!message.isStreaming) {
        flushCurrentTurn()
      }
      continue
    }
  }

  flushCurrentTurn()

  return turns
}

export function getTurnIntent(turn: AssistantTurn): string | undefined {
  if (turn.intent) return turn.intent
  for (const activity of turn.activities) {
    if (activity.intent) return activity.intent
  }
  return undefined
}

export function hasPendingActivities(turn: AssistantTurn): boolean {
  return turn.activities.some(a => a.status === 'running' || a.status === 'pending')
}

export function hasErrorActivities(turn: AssistantTurn): boolean {
  return turn.activities.some(a => a.status === 'error')
}

export function getActivitySummary(turn: AssistantTurn): string {
  const completed = turn.activities.filter(a => a.status === 'completed').length
  const running = turn.activities.filter(a => a.status === 'running').length
  const errors = turn.activities.filter(a => a.status === 'error').length

  const parts: string[] = []
  if (running > 0) parts.push(`${running} running`)
  if (completed > 0) parts.push(`${completed} completed`)
  if (errors > 0) parts.push(`${errors} failed`)

  return parts.join(', ') || 'No activities'
}

export function formatTurnAsMarkdown(turn: AssistantTurn): string {
  const lines: string[] = []

  if (turn.intent) {
    lines.push(`# ${turn.intent}`)
  } else {
    lines.push('# Turn Details')
  }
  lines.push('')

  const summary = getActivitySummary(turn)
  lines.push(`**Status:** ${turn.isComplete ? 'Complete' : 'In Progress'} · ${summary}`)
  lines.push('')

  if (turn.activities.length > 0) {
    lines.push('---')
    lines.push('')
    lines.push('## Activities')
    lines.push('')

    for (const activity of turn.activities) {
      if (activity.type === 'intermediate') {
        lines.push(`### 💭 Commentary`)
        lines.push('')
        if (activity.content) {
          lines.push(activity.content)
        }
        lines.push('')
      } else if (activity.toolName) {
        const statusEmoji = activity.status === 'completed' ? '✅' :
                           activity.status === 'error' ? '❌' :
                           activity.status === 'running' ? '⏳' : '⏸️'

        lines.push(`### ${statusEmoji} ${activity.toolName}`)
        lines.push('')

        if (activity.intent) {
          lines.push(`> ${activity.intent}`)
          lines.push('')
        }

        if (activity.toolInput && Object.keys(activity.toolInput).length > 0) {
          lines.push('**Input:**')
          lines.push('```json')
          lines.push(JSON.stringify(activity.toolInput, null, 2))
          lines.push('```')
          lines.push('')
        }

        if (activity.content) {
          lines.push('**Result:**')
          const trimmed = activity.content.trim()
          if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            try {
              const parsed = JSON.parse(trimmed)
              lines.push('```json')
              lines.push(JSON.stringify(parsed, null, 2))
              lines.push('```')
            } catch {
              lines.push('```')
              lines.push(activity.content)
              lines.push('```')
            }
          } else {
            lines.push('```')
            lines.push(activity.content)
            lines.push('```')
          }
          lines.push('')
        }

        if (activity.error) {
          lines.push('**Error:**')
          lines.push('```')
          lines.push(activity.error)
          lines.push('```')
          lines.push('')
        }
      }
    }
  }

  if (turn.response?.text) {
    lines.push('---')
    lines.push('')
    lines.push('## Response')
    lines.push('')
    lines.push(turn.response.text)
  }

  return lines.join('\n')
}

export function formatActivityAsMarkdown(activity: ActivityItem): string {
  const lines: string[] = []

  if (activity.type === 'intermediate') {
    lines.push('# Commentary')
    lines.push('')
    if (activity.content) {
      lines.push(activity.content)
    }
    return lines.join('\n')
  }

  const statusEmoji = activity.status === 'completed' ? '✅' :
                     activity.status === 'error' ? '❌' :
                     activity.status === 'running' ? '⏳' : '⏸️'

  lines.push(`# ${statusEmoji} ${activity.toolName || 'Tool'}`)
  lines.push('')

  if (activity.intent) {
    lines.push(`> ${activity.intent}`)
    lines.push('')
  }

  if (activity.toolInput && Object.keys(activity.toolInput).length > 0) {
    lines.push('## Input')
    lines.push('')
    lines.push('```json')
    lines.push(JSON.stringify(activity.toolInput, null, 2))
    lines.push('```')
    lines.push('')
  }

  if (activity.content) {
    lines.push('## Result')
    lines.push('')
    const trimmed = activity.content.trim()
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        lines.push('```json')
        lines.push(JSON.stringify(parsed, null, 2))
        lines.push('```')
      } catch {
        lines.push('```')
        lines.push(activity.content)
        lines.push('```')
      }
    } else {
      lines.push('```')
      lines.push(activity.content)
      lines.push('```')
    }
    lines.push('')
  }

  if (activity.error) {
    lines.push('## Error')
    lines.push('')
    lines.push('```')
    lines.push(activity.error)
    lines.push('```')
  }

  return lines.join('\n')
}

// ============================================================================
// Last Turn/Message Utilities
// ============================================================================

export function getLastAssistantTurn(turns: Turn[]): AssistantTurn | undefined {
  for (let i = turns.length - 1; i >= 0; i--) {
    const turn = turns[i]
    if (turn?.type === 'assistant') {
      return turn as AssistantTurn
    }
  }
  return undefined
}

export function getLastUserMessageTime(turns: Turn[]): number | undefined {
  for (let i = turns.length - 1; i >= 0; i--) {
    const turn = turns[i]
    if (turn?.type === 'user') {
      return (turn as UserTurn).timestamp
    }
  }
  return undefined
}

export function isLastTurnStreaming(turns: Turn[]): boolean {
  const lastAssistant = getLastAssistantTurn(turns)
  return lastAssistant?.isStreaming ?? false
}

export function computeLastChildSet(activities: ActivityItem[]): Set<string> {
  const lastByParent = new Map<string | undefined, string>()

  for (const activity of activities) {
    if (activity.depth && activity.depth > 0) {
      lastByParent.set(activity.parentId, activity.id)
    }
  }

  return new Set(lastByParent.values())
}

// ============================================================================
// Formatting Helpers
// ============================================================================

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) {
    return '--'
  }
  const seconds = ms / 1000
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  if (minutes >= 2) {
    return `${minutes}m+`
  }
  return `${minutes}m ${remainingSeconds}s`
}

export function formatTokens(count: number): string {
  if (!Number.isFinite(count) || count < 0) {
    return '0'
  }
  count = Math.floor(count)
  if (count < 1000) {
    return count.toString()
  }
  const k = count / 1000
  if (k < 10) {
    return `${k.toFixed(1)}k`
  }
  return `${Math.round(k)}k`
}

// ============================================================================
// Activity Grouping for Task Subagents
// ============================================================================

export interface TaskOutputData {
  durationMs?: number
  inputTokens?: number
  outputTokens?: number
}

export interface ActivityGroup {
  type: 'group'
  parent: ActivityItem
  children: ActivityItem[]
  taskOutputData?: TaskOutputData
}

export function isActivityGroup(item: ActivityItem | ActivityGroup): item is ActivityGroup {
  return 'type' in item && item.type === 'group' && 'parent' in item && 'children' in item
}

function extractTaskOutputData(activity: ActivityItem): TaskOutputData | undefined {
  if (!activity.content) return undefined

  try {
    const parsed = JSON.parse(activity.content)
    const data: TaskOutputData = {}

    if (typeof parsed.duration_ms === 'number') {
      data.durationMs = parsed.duration_ms
    }

    if (parsed.usage) {
      if (typeof parsed.usage.input_tokens === 'number') {
        data.inputTokens = parsed.usage.input_tokens
      }
      if (typeof parsed.usage.output_tokens === 'number') {
        data.outputTokens = parsed.usage.output_tokens
      }
    }

    if (data.durationMs !== undefined || data.inputTokens !== undefined || data.outputTokens !== undefined) {
      return data
    }
  } catch {
    // Not valid JSON or missing fields
  }

  return undefined
}

export function groupActivitiesByParent(
  activities: ActivityItem[]
): (ActivityItem | ActivityGroup)[] {
  const taskToolUseIds = new Set<string>()
  for (const activity of activities) {
    if (activity.toolName === 'Task' && activity.toolUseId) {
      taskToolUseIds.add(activity.toolUseId)
    }
  }

  const childrenByParent = new Map<string, ActivityItem[]>()
  for (const activity of activities) {
    if (activity.parentId && taskToolUseIds.has(activity.parentId)) {
      const existing = childrenByParent.get(activity.parentId) || []
      existing.push(activity)
      childrenByParent.set(activity.parentId, existing)
    }
  }

  const childIds = new Set<string>()
  for (const children of childrenByParent.values()) {
    for (const child of children) {
      childIds.add(child.id)
    }
  }

  const taskOutputByAgentId = new Map<string, TaskOutputData>()
  for (const activity of activities) {
    if (activity.toolName === 'TaskOutput' && activity.status === 'completed') {
      const taskId = activity.toolInput?.task_id as string | undefined
      if (taskId) {
        const data = extractTaskOutputData(activity)
        if (data) {
          taskOutputByAgentId.set(taskId, data)
        }
      }
    }
  }

  const taskToAgentId = new Map<string, string>()
  for (const activity of activities) {
    if (activity.toolName === 'Task' && activity.status === 'completed' && activity.content) {
      const agentIdMatch = activity.content.match(/agentId:\s*([a-zA-Z0-9_-]+)/)
      const capturedAgentId = agentIdMatch?.[1]
      if (capturedAgentId && activity.toolUseId) {
        taskToAgentId.set(activity.toolUseId, capturedAgentId)
      }
    }
  }

  const result: (ActivityItem | ActivityGroup)[] = []

  for (const activity of activities) {
    if (childIds.has(activity.id)) {
      continue
    }

    if (activity.toolName === 'TaskOutput') {
      continue
    }

    if (activity.toolName === 'Task') {
      const children = activity.toolUseId
        ? (childrenByParent.get(activity.toolUseId) || [])
        : []

      let taskOutputData: TaskOutputData | undefined
      if (activity.toolUseId) {
        const agentId = taskToAgentId.get(activity.toolUseId)
        if (agentId) {
          taskOutputData = taskOutputByAgentId.get(agentId)
        }
      }

      result.push({
        type: 'group',
        parent: activity,
        children: children.sort((a, b) => a.timestamp - b.timestamp),
        taskOutputData,
      })
    } else {
      result.push(activity)
    }
  }

  return result
}

export function countTotalActivities(items: (ActivityItem | ActivityGroup)[]): number {
  let count = 0
  for (const item of items) {
    if (isActivityGroup(item)) {
      count += 1 + item.children.length
    } else {
      count += 1
    }
  }
  return count
}
