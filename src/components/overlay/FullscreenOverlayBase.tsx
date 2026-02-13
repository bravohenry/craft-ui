/**
 * [INPUT]: @radix-ui/react-dialog, @/context/PlatformContext, @/utils/cn, ./FullscreenOverlayBaseHeader, ./OverlayErrorBanner
 * [OUTPUT]: FullscreenOverlayBase component, FullscreenOverlayBaseProps type
 * [POS]: overlay/ foundation — Radix Dialog wrapper for fullscreen overlays with masked scroll, floating header, traffic light hiding
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import { useEffect, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { usePlatform } from '@/context/PlatformContext'
import { cn } from '@/utils/cn'
import { FullscreenOverlayBaseHeader, type OverlayTypeBadge } from './FullscreenOverlayBaseHeader'
import { OverlayErrorBanner, type OverlayErrorBannerProps } from './OverlayErrorBanner'

// Z-index for fullscreen overlays - must be above app chrome (z-overlay: 300)
// Uses CSS variable when available, falls back to hardcoded value
const Z_FULLSCREEN = 'var(--z-fullscreen, 350)'

// HEADER_HEIGHT must match PreviewHeader's height prop (48px).
// FADE_SIZE is the transition zone where content fades in/out at edges.
const HEADER_HEIGHT = 48
const FADE_SIZE = 24

// Edge-to-edge gradient fade mask — starts at y=0, fades over FADE_SIZE at both edges.
// The floating header covers content behind it; the mask just provides the smooth fade.
const FADE_MASK = `linear-gradient(to bottom, transparent 0px, black ${FADE_SIZE}px, black calc(100% - ${FADE_SIZE}px), transparent 100%)`

export interface FullscreenOverlayBaseProps {
  /** Whether the overlay is visible */
  isOpen: boolean
  /** Callback when the overlay should close (ESC key triggers this) */
  onClose: () => void
  /** Content to render inside the overlay */
  children: ReactNode
  /** Additional CSS classes for the container */
  className?: string
  /** Accessible title for the overlay (visually hidden) */
  accessibleTitle?: string

  // --- Structured header props (optional) ---
  // When any of these are provided, a FullscreenOverlayBaseHeader is rendered above children.

  /** Type badge — tool/format indicator (e.g. "Read", "Image", "Bash") */
  typeBadge?: OverlayTypeBadge
  /** File path — shows dual-trigger menu badge with "Open" + "Reveal in Finder" */
  filePath?: string
  /** Title — displayed as a badge when no filePath */
  title?: string
  /** Click handler for the title badge */
  onTitleClick?: () => void
  /** Subtitle — extra info badge (e.g. "Lines 1-50 of 200") */
  subtitle?: string
  /** Right-side header actions (e.g. diff controls) */
  headerActions?: ReactNode
  /** When provided, renders a built-in copy button in the header right actions area */
  copyContent?: string

  /** Optional error banner — rendered between header and children */
  error?: OverlayErrorBannerProps
}

export function FullscreenOverlayBase({
  isOpen,
  onClose,
  children,
  className,
  accessibleTitle = 'Overlay',
  typeBadge,
  filePath,
  title,
  onTitleClick,
  subtitle,
  headerActions,
  copyContent,
  error,
}: FullscreenOverlayBaseProps) {
  const { onSetTrafficLightsVisible } = usePlatform()

  // Determine if we should render the structured header.
  // Any header-related prop triggers header rendering.
  const hasHeader = !!(typeBadge || filePath || title || subtitle || headerActions || copyContent)

  // Hide macOS traffic lights when overlay opens, restore when it closes
  // This prevents accidental clicks on window controls behind the fullscreen overlay
  useEffect(() => {
    if (!isOpen) return

    onSetTrafficLightsVisible?.(false)
    return () => onSetTrafficLightsVisible?.(true)
  }, [isOpen, onSetTrafficLightsVisible])

  // Content padding clears the floating header at rest (when present).
  // Without a header, just the fade zone inset.
  const contentPaddingTop = hasHeader ? HEADER_HEIGHT + FADE_SIZE : FADE_SIZE

  return (
      <Dialog.Root open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Content
          className={cn(
            'fixed inset-0 overflow-hidden outline-none',
            'bg-foreground-3 fullscreen-overlay-background',
            className
          )}
          style={{ zIndex: Z_FULLSCREEN }}
          onOpenAutoFocus={(e: Event) => e.preventDefault()}
        >
          {/* Visually hidden title for accessibility - required by Radix Dialog */}
          <Dialog.Title className="sr-only">{accessibleTitle}</Dialog.Title>

          {/* Full-viewport masked scroll area — covers the entire dialog including behind the header.
              The CSS mask gradient fades content at both edges (starting from y=0).
              Content padding clears the header at rest. */}
          <div
            className="absolute inset-0"
            style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
          >
            <div
              className="h-full overflow-y-auto"
              style={{ paddingTop: contentPaddingTop, paddingBottom: FADE_SIZE, scrollPaddingTop: contentPaddingTop }}
            >
              {/* Flow wrapper — keep a stable top-aligned baseline across preview types. */}
              <div className="min-h-full flex flex-col justify-start">
                {/* Error banner — inside shared top-aligned flow, above content */}
                {error && (
                  <div className="px-6 pb-4">
                    <OverlayErrorBanner label={error.label} message={error.message} />
                  </div>
                )}
                {children}
              </div>
            </div>
          </div>

          {/* Floating header — rendered after scroll area so it's visually on top (DOM order).
              Positioned absolutely at the top of the viewport, above the scroll content. */}
          {hasHeader && (
            <div className="absolute top-0 left-0 right-0 z-10">
              <FullscreenOverlayBaseHeader
                onClose={onClose}
                typeBadge={typeBadge}
                filePath={filePath}
                title={title}
                onTitleClick={onTitleClick}
                subtitle={subtitle}
                headerActions={headerActions}
                copyContent={copyContent}
              />
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
