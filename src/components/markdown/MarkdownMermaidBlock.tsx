/**
 * [INPUT]: @/lib/mermaid-helper (renderMermaidSync), lucide-react (Maximize2), @/utils/cn, @/hooks/useScrollFade, ./CodeBlock, ../overlay/MermaidPreviewOverlay
 * [OUTPUT]: MarkdownMermaidBlock component, MarkdownMermaidBlockProps
 * [POS]: markdown/ — renders mermaid code fences as SVG diagrams with fullscreen overlay, consumed by Markdown renderer
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import * as React from 'react'
import { renderMermaidSync } from '@/lib/mermaid-helper'
import { Maximize2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { CodeBlock } from './CodeBlock'
import { MermaidPreviewOverlay } from '../overlay/MermaidPreviewOverlay'
import { useScrollFade } from '@/hooks/useScrollFade'

// Minimum rendered height for diagrams
const MIN_READABLE_HEIGHT = 280
const FADE_SIZE = 32
const SMALL_OVERFLOW_THRESHOLD = 200

/** Parse width/height from an SVG string's root element attributes. */
function parseSvgDimensions(svgString: string): { width: number; height: number } | null {
  const widthMatch = svgString.match(/width="(\d+(?:\.\d+)?)"/)
  const heightMatch = svgString.match(/height="(\d+(?:\.\d+)?)"/)
  if (!widthMatch?.[1] || !heightMatch?.[1]) return null
  return { width: parseFloat(widthMatch[1]), height: parseFloat(heightMatch[1]) }
}

export interface MarkdownMermaidBlockProps {
  code: string
  className?: string
  showExpandButton?: boolean
}

export function MarkdownMermaidBlock({ code, className, showExpandButton = true }: MarkdownMermaidBlockProps) {
  const [svg, setSvg] = React.useState<string | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const [isMermaidLoaded, setIsMermaidLoaded] = React.useState(false)

  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const { scrollRef, maskImage } = useScrollFade(FADE_SIZE)

  React.useEffect(() => {
    let cancelled = false

    async function renderDiagram() {
      try {
        const result = await renderMermaidSync(code, {
          bg: 'var(--background)',
          fg: 'var(--foreground)',
          accent: 'var(--accent)',
          line: 'var(--foreground-30)',
          muted: 'var(--muted-foreground)',
          surface: 'var(--foreground-3)',
          border: 'var(--foreground-20)',
          transparent: true,
        })
        if (!cancelled) {
          if (result === null) {
            setIsMermaidLoaded(false)
            setSvg(null)
          } else {
            setIsMermaidLoaded(true)
            setSvg(result)
            setError(null)
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setSvg(null)
        }
      }
    }

    renderDiagram()

    return () => {
      cancelled = true
    }
  }, [code])

  const getScaledDimensions = React.useCallback(() => {
    if (!svg) return null

    const dims = parseSvgDimensions(svg)
    if (!dims) return null

    const containerWidth = scrollRef.current?.clientWidth ?? 600
    const fitToContainerScale = containerWidth / dims.width
    const projectedHeight = dims.height * fitToContainerScale

    if (projectedHeight >= MIN_READABLE_HEIGHT) {
      const overflow = dims.width - containerWidth

      if (overflow > 0 && overflow < SMALL_OVERFLOW_THRESHOLD) {
        const scaledHeight = dims.height * fitToContainerScale
        return { scale: fitToContainerScale, width: containerWidth, height: scaledHeight, needsScroll: false }
      }

      const needsScroll = overflow > 0
      return {
        scale: 1,
        width: needsScroll ? dims.width : undefined,
        height: needsScroll ? dims.height : undefined,
        needsScroll,
      }
    }

    const desiredScale = MIN_READABLE_HEIGHT / dims.height
    const scale = Math.min(desiredScale, 1.0)
    const scaledWidth = dims.width * scale
    const scaledHeight = dims.height * scale
    const scaledOverflow = scaledWidth - containerWidth

    if (scaledOverflow > 0 && scaledOverflow < SMALL_OVERFLOW_THRESHOLD) {
      const fitScale = containerWidth / dims.width
      const fitHeight = dims.height * fitScale
      return { scale: fitScale, width: containerWidth, height: fitHeight, needsScroll: false }
    }

    return {
      scale,
      width: scaledWidth,
      height: scaledHeight,
      needsScroll: scaledOverflow > 0,
    }
  }, [svg])

  if (error) {
    return <CodeBlock code={code} language="mermaid" mode="full" className={className} />
  }

  if (!isMermaidLoaded || !svg) {
    return <CodeBlock code={code} language="mermaid" mode="full" className={className} />
  }

  const scaledDims = getScaledDimensions()
  const needsScaling = scaledDims && (scaledDims.width != null || scaledDims.scale !== 1)

  return (
    <>
      <div className={cn('relative group', className)}>
        {showExpandButton && (
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className={cn(
              "absolute top-2 right-2 p-1 rounded-[6px] transition-all z-10 select-none",
              "opacity-0 group-hover:opacity-100",
              "bg-background shadow-minimal",
              "text-muted-foreground/50 hover:text-foreground",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:opacity-100"
            )}
            title="View Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}

        <div
          ref={scrollRef}
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            maskImage,
            WebkitMaskImage: maskImage,
          }}
        >
          <div
            style={{
              width: needsScaling && scaledDims?.width ? `${scaledDims.width}px` : undefined,
              height: needsScaling && scaledDims?.height ? `${scaledDims.height}px` : undefined,
              display: needsScaling ? 'block' : 'flex',
              justifyContent: needsScaling ? undefined : 'center',
            }}
          >
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG injection required for mermaid rendering */}
            <div
              dangerouslySetInnerHTML={{ __html: svg }}
              style={{
                transformOrigin: 'top left',
                transform: scaledDims && scaledDims.scale !== 1 ? `scale(${scaledDims.scale})` : undefined,
              }}
            />
          </div>
        </div>
      </div>

      <MermaidPreviewOverlay
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        svg={svg}
        code={code}
      />
    </>
  )
}
