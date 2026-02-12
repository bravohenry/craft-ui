/**
 * [INPUT]: @/utils/cn, @/types/activity (ActivityStatus), @/components/primitives/LoadingIndicator, @/components/markdown, ./TurnCard (ActivityStatusIcon, SIZE_CONFIG)
 * [OUTPUT]: InlineExecution, InlineExecutionStatus, InlineExecutionProps, InlineActivityItem, mapToolEventToActivity
 * [POS]: chat/ — compact inline execution view for EditPopover, shows executing → success | error states
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import { CheckCircle2, XCircle, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { ActivityStatus } from '@/types/activity'
import { ActivityStatusIcon, SIZE_CONFIG } from './TurnCard'
import { LoadingIndicator } from '@/components/primitives/LoadingIndicator'
import { Markdown } from '@/components/markdown'

// ============================================================================
// Types
// ============================================================================

export type InlineExecutionStatus = 'executing' | 'success' | 'error'

export interface InlineActivityItem {
  id: string
  name: string
  status: ActivityStatus
  description?: string
}

export interface InlineExecutionProps {
  /** Current execution status */
  status: InlineExecutionStatus
  /** Activities to display (simplified from full ActivityItem) */
  activities: InlineActivityItem[]
  /** Result message on success */
  result?: string
  /** Error message on failure */
  error?: string
  /** Callback to cancel execution */
  onCancel?: () => void
  /** Callback to dismiss (on success/error) */
  onDismiss?: () => void
  /** Callback to retry (on error) */
  onRetry?: () => void
  /** Optional className */
  className?: string
}

// ============================================================================
// Simple Activity Row for Inline View
// ============================================================================

function InlineActivityRow({ activity }: { activity: InlineActivityItem }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 py-0.5 text-muted-foreground",
        SIZE_CONFIG.fontSize
      )}
    >
      <ActivityStatusIcon status={activity.status} toolName={activity.name} />
      <span className="shrink-0">{activity.name}</span>
      {activity.description && (
        <>
          <span className="opacity-60 shrink-0">·</span>
          <span className="truncate min-w-0 flex-1">{activity.description}</span>
        </>
      )}
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function InlineExecution({
  status,
  activities,
  result,
  error,
  onCancel,
  onDismiss,
  onRetry,
  className,
}: InlineExecutionProps) {
  if (status === 'executing') {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-2">
          <LoadingIndicator animated showElapsed />
          <span className={cn("text-foreground/80", SIZE_CONFIG.fontSize)}>
            Editing...
          </span>
        </div>

        {activities.length > 0 && (
          <div className="space-y-0.5 pl-1">
            {activities.slice(-3).map((activity) => (
              <InlineActivityRow key={activity.id} activity={activity} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-start pt-1 border-t border-border/30">
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors",
              SIZE_CONFIG.fontSize
            )}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className={cn("text-foreground font-medium", SIZE_CONFIG.fontSize)}>
            Done
          </span>
        </div>

        {result && (
          <div className={cn("text-muted-foreground leading-relaxed prose-compact", SIZE_CONFIG.fontSize)}>
            <Markdown>{result}</Markdown>
          </div>
        )}

        <div className="flex items-center justify-end pt-1 border-t border-border/30">
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors",
              SIZE_CONFIG.fontSize
            )}
          >
            <CheckCircle2 className="w-3 h-3" />
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <XCircle className="w-4 h-4 text-destructive" />
        <span className={cn("text-foreground font-medium", SIZE_CONFIG.fontSize)}>
          Failed
        </span>
      </div>

      {error && (
        <div className={cn("text-destructive/80 leading-relaxed prose-compact", SIZE_CONFIG.fontSize)}>
          <Markdown>{error}</Markdown>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/30">
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            "flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors",
            SIZE_CONFIG.fontSize
          )}
        >
          <X className="w-3 h-3" />
          Dismiss
        </button>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={cn(
              "px-2 py-1 rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors",
              SIZE_CONFIG.fontSize
            )}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Map a tool event to an InlineActivityItem.
 * Use this when processing session events in EditPopover.
 */
export function mapToolEventToActivity(
  toolName: string,
  toolUseId: string,
  status: ActivityStatus,
  description?: string
): InlineActivityItem {
  const displayName = toolName
    .replace(/^mcp__[^_]+__/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())

  return {
    id: toolUseId,
    name: displayName,
    status,
    description,
  }
}
