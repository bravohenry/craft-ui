/**
 * [INPUT]: react, lucide-react, @/utils/cn
 * [OUTPUT]: PreviewHeader, PreviewHeaderBadge, PREVIEW_BADGE_VARIANTS
 * [POS]: primitives/ — header bar with badge pills and close button for preview panels
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */
import * as React from 'react'
import { X, type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

export const PREVIEW_BADGE_VARIANTS = {
  edit: 'text-foreground/70',
  write: 'text-foreground/70',
  read: 'text-foreground/70',
  bash: 'text-foreground/70',
  grep: 'text-foreground/70',
  glob: 'text-foreground/70',
  blue: 'text-foreground/70',
  amber: 'text-foreground/70',
  orange: 'text-foreground/70',
  green: 'text-foreground/70',
  purple: 'text-foreground/70',
  gray: 'text-foreground/70',
  default: 'text-foreground/70',
} as const

export type PreviewBadgeVariant = keyof typeof PREVIEW_BADGE_VARIANTS

export interface PreviewHeaderBadgeProps {
  icon?: LucideIcon
  label: string
  variant?: PreviewBadgeVariant
  onClick?: () => void
  title?: string
  className?: string
  shrinkable?: boolean
}

export function PreviewHeaderBadge({
  icon: Icon,
  label,
  variant = 'default',
  onClick,
  title,
  className,
  shrinkable = false,
}: PreviewHeaderBadgeProps) {
  const variantClasses = PREVIEW_BADGE_VARIANTS[variant]
  const baseClasses = cn(
    'flex items-center gap-1.5 h-[26px] px-2.5 rounded-[6px] font-sans text-[13px] font-medium bg-background shadow-minimal',
    variantClasses,
    className
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(baseClasses, 'min-w-0 cursor-pointer group')}
        title={title || label}
      >
        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
        <span className="truncate group-hover:underline">{label}</span>
      </button>
    )
  }

  return (
    <div className={cn(baseClasses, shrinkable ? 'min-w-0' : 'shrink-0')} title={title || label}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span className="truncate">{label}</span>
    </div>
  )
}

export interface PreviewHeaderProps {
  children?: React.ReactNode
  onClose?: () => void
  rightActions?: React.ReactNode
  height?: number
  className?: string
  style?: React.CSSProperties
}

export function PreviewHeader({
  children,
  onClose,
  rightActions,
  height = 50,
  className,
  style,
}: PreviewHeaderProps) {
  return (
    <div
      className={cn(
        'shrink-0 flex items-center justify-between px-3',
        className
      )}
      style={{ height, ...style }}
    >
      <div className="flex-1 min-w-[70px]" />

      <div className="flex items-center gap-2 min-w-0" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {children}
      </div>

      <div className="flex-1 min-w-[70px] flex items-center gap-2 justify-end" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {rightActions}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-1.5 rounded-[6px] bg-background shadow-minimal cursor-pointer',
              'opacity-70 hover:opacity-100 transition-opacity',
              'focus:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            )}
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
