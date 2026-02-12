/**
 * [INPUT]: react, lucide-react, @/utils/cn, ./PreviewOverlay, ../primitives/CopyButton
 * [OUTPUT]: MermaidPreviewOverlay component, MermaidPreviewOverlayProps
 * [POS]: overlay/ — fullscreen diagram preview with zoom/pan, wraps PreviewOverlay
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { GitGraph, RotateCcw, Minus, Plus, Check } from 'lucide-react'
import { cn } from '@/utils/cn'
import { PreviewOverlay } from './PreviewOverlay'
import { CopyButton } from '../primitives/CopyButton'

// ── Zoom constants ───────────────────────────────────────────────────────

const MIN_SCALE = 0.25
const MAX_SCALE = 4

// Step factor for +/- buttons and keyboard shortcuts (25% increments).
// 1.25 and 0.8 (1/1.25) are clean fractions that perfectly cancel out.
const ZOOM_STEP_FACTOR = 1.25

// Zoom presets shown in the dropdown (percentages)
const ZOOM_PRESETS = [25, 50, 75, 100, 150, 200, 400]

// ── Helpers ──────────────────────────────────────────────────────────────

/** Parse width/height from an SVG string's root element attributes. */
function parseSvgDimensions(svgString: string): { width: number; height: number } | null {
  const widthMatch = svgString.match(/width="(\d+(?:\.\d+)?)"/)
  const heightMatch = svgString.match(/height="(\d+(?:\.\d+)?)"/)
  if (!widthMatch?.[1] || !heightMatch?.[1]) return null
  return { width: parseFloat(widthMatch[1]), height: parseFloat(heightMatch[1]) }
}

// ── Inline zoom dropdown ─────────────────────────────────────────────────
// Rendered in-place (no portal) to avoid Radix Dialog focus-trap issues.

interface ZoomDropdownProps {
  zoomPercent: number
  activePreset: number | undefined
  onZoomToFit: () => void
  onZoomToPreset: (preset: number) => void
}

function ZoomDropdown({ zoomPercent, activePreset, onZoomToFit, onZoomToPreset }: ZoomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on click-outside or Escape
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation() // Don't let Escape close the overlay too
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger — shows current zoom percentage */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-0.5 px-1 py-1 hover:bg-foreground/5 text-[13px] tabular-nums min-w-[4rem] justify-center transition-colors"
        title="Zoom presets"
      >
        {zoomPercent}%
      </button>

      {/* Menu — absolute positioned, no portal needed */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full right-0 mt-1 min-w-[140px] p-1",
            "bg-background rounded-[8px] shadow-strong border border-border/50",
            "animate-in fade-in-0 zoom-in-95 duration-100",
          )}
        >
          {/* Zoom to Fit */}
          <button
            type="button"
            onClick={() => { onZoomToFit(); setIsOpen(false) }}
            className="flex items-center gap-2 w-full px-2.5 py-1.5 text-left text-[13px] rounded-[4px] hover:bg-foreground/[0.05] transition-colors"
          >
            Zoom to Fit
          </button>
          <div className="h-px bg-foreground/5 my-1" />
          {/* Preset zoom levels */}
          {ZOOM_PRESETS.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => { onZoomToPreset(preset); setIsOpen(false) }}
              className="flex items-center gap-2 w-full px-2.5 py-1.5 text-left text-[13px] rounded-[4px] hover:bg-foreground/[0.05] transition-colors"
            >
              <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                {activePreset === preset && <Check className="w-3.5 h-3.5" />}
              </span>
              <span className={activePreset === preset ? 'font-medium' : ''}>
                {preset}%
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Component ────────────────────────────────────────────────────────────

export interface MermaidPreviewOverlayProps {
  isOpen: boolean
  onClose: () => void
  /** Pre-rendered SVG string from renderMermaid() */
  svg: string
  /** Original mermaid source code (for copy button) */
  code: string
}

export function MermaidPreviewOverlay({
  isOpen,
  onClose,
  svg,
  code,
}: MermaidPreviewOverlayProps) {
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  // Controls CSS transition on the SVG container. Enabled for discrete actions
  // (buttons, presets, keyboard, reset) for smooth animation. Disabled for
  // continuous actions (wheel, trackpad, drag) to avoid input lag.
  const [isAnimating, setIsAnimating] = useState(false)

  // Refs for drag tracking — used in window event handlers to avoid stale closures.
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const translateAtDragStartRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset zoom/pan state when overlay opens
  useEffect(() => {
    if (isOpen) {
      setScale(1)
      setTranslate({ x: 0, y: 0 })
    }
  }, [isOpen])

  // ── Zoom actions ─────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    setIsAnimating(true)
    setScale(1)
    setTranslate({ x: 0, y: 0 })
  }, [])

  /** Zoom in or out by one step (25%), keeping the viewport center fixed. */
  const zoomByStep = useCallback((direction: 'in' | 'out') => {
    setIsAnimating(true)
    setScale(prev => {
      const factor = direction === 'in' ? ZOOM_STEP_FACTOR : 1 / ZOOM_STEP_FACTOR
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * factor))
      const ratio = next / prev
      setTranslate(t => ({ x: t.x * ratio, y: t.y * ratio }))
      return next
    })
  }, [])

  /** Jump to a specific scale, centering the view. */
  const zoomToPreset = useCallback((preset: number) => {
    setIsAnimating(true)
    setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, preset / 100)))
    setTranslate({ x: 0, y: 0 })
  }, [])

  /** Calculate and apply the scale needed to fit the entire diagram in the viewport. */
  const zoomToFit = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const dims = parseSvgDimensions(svg)
    if (!dims) {
      handleReset()
      return
    }

    const rect = container.getBoundingClientRect()
    // 90% of available space so the diagram doesn't touch the edges
    const scaleX = (rect.width * 0.9) / dims.width
    const scaleY = (rect.height * 0.9) / dims.height
    const fitScale = Math.min(scaleX, scaleY, MAX_SCALE)

    setIsAnimating(true)
    setScale(Math.max(MIN_SCALE, fitScale))
    setTranslate({ x: 0, y: 0 })
  }, [svg, handleReset])

  // ── Mousewheel zoom ──────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const rect = container.getBoundingClientRect()
      const cx = e.clientX - rect.left - rect.width / 2
      const cy = e.clientY - rect.top - rect.height / 2

      const isTrackpadPinch = e.ctrlKey
      const sensitivity = isTrackpadPinch ? 0.01 : 0.003
      const factor = Math.pow(2, -e.deltaY * sensitivity)

      setScale(prev => {
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * factor))
        const ratio = next / prev

        setTranslate(t => ({
          x: cx - ratio * (cx - t.x),
          y: cy - ratio * (cy - t.y),
        }))

        return next
      })
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  // ── Keyboard shortcuts ───────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return

      if (e.key === '=' || e.key === '+') {
        e.preventDefault()
        zoomByStep('in')
      } else if (e.key === '-') {
        e.preventDefault()
        zoomByStep('out')
      } else if (e.key === '0') {
        e.preventDefault()
        handleReset()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, zoomByStep, handleReset])

  // ── Click-drag pan ───────────────────────────────────────────────────

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // left click only
    e.preventDefault()
    isDraggingRef.current = true
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    setTranslate(t => {
      translateAtDragStartRef.current = { x: t.x, y: t.y }
      return t
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      setTranslate({
        x: translateAtDragStartRef.current.x + (e.clientX - dragStartRef.current.x),
        y: translateAtDragStartRef.current.y + (e.clientY - dragStartRef.current.y),
      })
    }

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        setIsDragging(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // ── Double-click to reset ────────────────────────────────────────────
  const handleDoubleClick = useCallback(() => {
    handleReset()
  }, [handleReset])

  // ── Header actions ───────────────────────────────────────────────────

  const isDefaultView = scale === 1 && translate.x === 0 && translate.y === 0
  const zoomPercent = Math.round(scale * 100)

  const activePreset = ZOOM_PRESETS.find(p => p === zoomPercent)

  const controlBtnClass = cn(
    'p-1.5 rounded-[6px] bg-background shadow-minimal cursor-pointer',
    'opacity-70 hover:opacity-100 transition-opacity',
    'disabled:opacity-30 disabled:cursor-not-allowed',
    'focus:outline-none focus-visible:ring-1 focus-visible:ring-ring'
  )

  const headerActions = (
    <div className="flex items-center gap-1.5">
      {/* ── Zoom stepper: [−] [▾ pct%] [+] ── */}
      <div className="flex items-center gap-px bg-background shadow-minimal rounded-[6px]">
        <button
          type="button"
          onClick={() => zoomByStep('out')}
          disabled={scale <= MIN_SCALE}
          className={cn(
            'p-1.5 rounded-l-[6px] cursor-pointer',
            'opacity-70 hover:opacity-100 transition-opacity',
            'disabled:opacity-30 disabled:cursor-not-allowed',
          )}
          title="Zoom out (⌘−)"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <ZoomDropdown
          zoomPercent={zoomPercent}
          activePreset={activePreset}
          onZoomToFit={zoomToFit}
          onZoomToPreset={zoomToPreset}
        />

        <button
          type="button"
          onClick={() => zoomByStep('in')}
          disabled={scale >= MAX_SCALE}
          className={cn(
            'p-1.5 rounded-r-[6px] cursor-pointer',
            'opacity-70 hover:opacity-100 transition-opacity',
            'disabled:opacity-30 disabled:cursor-not-allowed',
          )}
          title="Zoom in (⌘+)"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Reset button */}
      <button
        type="button"
        onClick={handleReset}
        disabled={isDefaultView}
        className={controlBtnClass}
        title="Reset zoom (⌘0)"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* Copy code button */}
      <CopyButton content={code} title="Copy code" className="bg-background shadow-minimal opacity-70 hover:opacity-100" />
    </div>
  )

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <PreviewOverlay
      isOpen={isOpen}
      onClose={onClose}
      typeBadge={{
        icon: GitGraph,
        label: 'Diagram',
        variant: 'purple',
      }}
      title="Mermaid Diagram"
      headerActions={headerActions}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: zoom/pan canvas — keyboard shortcuts handled separately via window listener */}
      <div
        ref={containerRef}
        role="application"
        aria-label="Zoomable mermaid diagram viewer"
        className="flex items-center justify-center select-none"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        style={{
          marginTop: -72,
          marginBottom: -24,
          height: '100vh',
          cursor: isDragging ? 'grabbing' : 'grab',
          overflow: 'hidden',
        }}
      >
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG string injection required for mermaid diagram rendering */}
        <div
          dangerouslySetInnerHTML={{ __html: svg }}
          onTransitionEnd={() => setIsAnimating(false)}
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isAnimating ? 'transform 150ms ease-out' : 'none',
          }}
        />
      </div>
    </PreviewOverlay>
  )
}
