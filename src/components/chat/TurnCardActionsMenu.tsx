/**
 * [INPUT]: @/components/primitives/SimpleDropdown, @/utils/cn, lucide-react
 * [OUTPUT]: TurnCardActionsMenu, TurnCardActionsMenuProps
 * [POS]: chat/ — dropdown menu for TurnCard header actions (view changes, details)
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import * as React from 'react'
import { MoreHorizontal, FileDiff, ArrowUpRight } from 'lucide-react'
import { SimpleDropdown, SimpleDropdownItem } from '@/components/primitives/SimpleDropdown'
import { cn } from '@/utils/cn'

export interface TurnCardActionsMenuProps {
  /** Callback to open turn details in a new window */
  onOpenDetails?: () => void
  /** Callback to open all edits/writes in multi-file diff view */
  onOpenMultiFileDiff?: () => void
  /** Whether this turn has any Edit or Write activities */
  hasEditOrWriteActivities?: boolean
  /** Additional className for the trigger button */
  className?: string
}

/**
 * TurnCardActionsMenu - Dropdown menu for TurnCard header actions
 *
 * Shows:
 * - "View file changes" when turn has Edit/Write activities
 * - "View turn details" always
 */
export function TurnCardActionsMenu({
  onOpenDetails,
  onOpenMultiFileDiff,
  hasEditOrWriteActivities,
  className,
}: TurnCardActionsMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Don't render if no actions available
  if (!onOpenDetails && !onOpenMultiFileDiff) {
    return null
  }

  return (
    <SimpleDropdown
      align="end"
      onOpenChange={setIsOpen}
      trigger={
        <button
          type="button"
          className={cn(
            "p-1 rounded-[6px] transition-opacity shrink-0",
            "opacity-0 group-hover:opacity-100",
            "bg-background shadow-minimal",
            "text-muted-foreground/50 hover:text-foreground",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:opacity-100",
            isOpen && "opacity-100 text-foreground",
            className
          )}
        >
          <MoreHorizontal className="w-3 h-3" />
        </button>
      }
    >
      {onOpenMultiFileDiff && hasEditOrWriteActivities && (
        <SimpleDropdownItem
          onClick={onOpenMultiFileDiff}
          icon={<FileDiff />}
        >
          View file changes
        </SimpleDropdownItem>
      )}
      {onOpenDetails && (
        <SimpleDropdownItem
          onClick={onOpenDetails}
          icon={<ArrowUpRight />}
        >
          View turn details
        </SimpleDropdownItem>
      )}
    </SimpleDropdown>
  )
}
