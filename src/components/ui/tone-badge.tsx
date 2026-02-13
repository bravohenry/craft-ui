/**
 * [INPUT]: Depends on React and @/utils/cn.
 * [OUTPUT]: ToneBadge component and Tone type.
 * [POS]: components/ui shared styled badge primitive by semantic tone.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import * as React from 'react'

import { cn } from '@/utils/cn'

export type Tone = 'success' | 'warning' | 'destructive' | 'default' | 'muted'

interface ToneBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  icon?: React.ReactNode
  children: React.ReactNode
}

const toneConfig: Record<Tone, { bg: string; text: string; shadow: string; shadowColor?: string }> = {
  success: {
    bg: 'bg-[oklch(from_var(--success)_l_c_h_/_0.08)]',
    text: 'text-[var(--success-text)]',
    shadow: 'shadow-tinted',
    shadowColor: 'var(--success-rgb)',
  },
  warning: {
    bg: 'bg-[oklch(from_var(--info)_l_c_h_/_0.08)]',
    text: 'text-[var(--info-text)]',
    shadow: 'shadow-tinted',
    shadowColor: 'var(--info-rgb)',
  },
  destructive: {
    bg: 'bg-[oklch(from_var(--destructive)_l_c_h_/_0.08)]',
    text: 'text-[var(--destructive-text)]',
    shadow: 'shadow-tinted',
    shadowColor: 'var(--destructive-rgb)',
  },
  default: {
    bg: 'bg-foreground/10',
    text: 'text-foreground/70',
    shadow: 'shadow-tinted',
    shadowColor: 'var(--foreground-rgb)',
  },
  muted: {
    bg: 'bg-background',
    text: 'text-foreground/70',
    shadow: 'shadow-minimal',
  },
}

export function ToneBadge({
  tone = 'default',
  icon,
  children,
  className,
  style,
  ...props
}: ToneBadgeProps) {
  const config = toneConfig[tone]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[5px] pl-2.5 pr-3 py-1 text-xs font-medium',
        config.bg,
        config.text,
        config.shadow,
        className,
      )}
      style={
        config.shadowColor
          ? ({ '--shadow-color': config.shadowColor, ...style } as React.CSSProperties)
          : style
      }
      {...props}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </span>
  )
}
