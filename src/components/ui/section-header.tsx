/**
 * [INPUT]: Depends on React and @/utils/cn.
 * [OUTPUT]: SectionHeader component.
 * [POS]: components/ui shared layout primitive for title/description/action headers.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import * as React from 'react'

import { cn } from '@/utils/cn'

interface SectionHeaderProps {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
  contentClassName?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function SectionHeader({
  title,
  description,
  action,
  className,
  contentClassName,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 pl-1', className)}>
      <div className={cn('min-w-0 space-y-0.5', contentClassName)}>
        <h4 className={cn('text-base font-semibold', titleClassName)}>{title}</h4>
        {description ? (
          <p className={cn('text-sm text-muted-foreground', descriptionClassName)}>{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
