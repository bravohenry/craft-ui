/**
 * [INPUT]: ./PreviewOverlay, ./ContentFrame
 * [OUTPUT]: GenericOverlay component, GenericOverlayProps type
 * [POS]: overlay/ convenience wrapper — renders arbitrary children inside PreviewOverlay + ContentFrame
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import { type ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'
import { PreviewOverlay, type BadgeVariant } from './PreviewOverlay'

export interface GenericOverlayProps {
  isOpen: boolean
  onClose: () => void
  typeBadge: {
    icon: LucideIcon
    label: string
    variant: BadgeVariant
  }
  filePath?: string
  title?: string
  onTitleClick?: () => void
  subtitle?: string
  error?: { label: string; message: string }
  headerActions?: ReactNode
  children: ReactNode
}

export function GenericOverlay({
  isOpen,
  onClose,
  typeBadge,
  filePath,
  title,
  onTitleClick,
  subtitle,
  error,
  headerActions,
  children,
}: GenericOverlayProps) {
  return (
    <PreviewOverlay
      isOpen={isOpen}
      onClose={onClose}
      typeBadge={typeBadge}
      filePath={filePath}
      title={title}
      onTitleClick={onTitleClick}
      subtitle={subtitle}
      error={error}
      headerActions={headerActions}
    >
      {children}
    </PreviewOverlay>
  )
}
