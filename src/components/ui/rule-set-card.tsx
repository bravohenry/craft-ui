/**
 * [INPUT]: Depends on React, ./button, ./rule-table, and @/utils/cn.
 * [OUTPUT]: RuleSetCard component.
 * [POS]: components/ui craft recipe layer for full rule-set card layout.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import * as React from 'react'

import { cn } from '@/utils/cn'
import { Button } from './button'
import { RuleTable, type RuleItem } from './rule-table'
import { SectionHeader } from './section-header'

interface RuleSetCardProps {
  title?: string
  description?: string
  data: RuleItem[]
  maxHeight?: number
  className?: string
  onEdit?: () => void
  editLabel?: string
}

export function RuleSetCard({
  title = 'Rule Set',
  description = 'Application-level rules for matching, allow/block, and comments.',
  data,
  maxHeight = 350,
  className,
  onEdit,
  editLabel = 'Edit',
}: RuleSetCardProps) {
  return (
    <section className={cn('space-y-3', className)}>
      <SectionHeader
        title={title}
        description={description}
        action={
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-[6px] bg-background px-3 text-foreground/70 shadow-minimal hover:text-foreground"
            onClick={onEdit}
          >
            {editLabel}
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl bg-background shadow-minimal">
        <RuleTable data={data} maxHeight={maxHeight} />
      </div>
    </section>
  )
}
