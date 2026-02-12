/**
 * [INPUT]: react, @pierre/diffs (PatchDiff, DIFFS_TAG_NAME), @/utils/cn, ./CodeBlock, ../code-viewer/registerShikiThemes
 * [OUTPUT]: MarkdownDiffBlock component, MarkdownDiffBlockProps
 * [POS]: markdown/ — inline diff viewer for ```diff code blocks, falls back to CodeBlock
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import * as React from 'react'
import { PatchDiff, type PatchDiffProps } from '@pierre/diffs/react'
import { DIFFS_TAG_NAME } from '@pierre/diffs'
import { cn } from '@/utils/cn'
import { CodeBlock } from './CodeBlock'
import { registerCraftShikiThemes } from '../code-viewer/registerShikiThemes'

// Custom element + theme registration (idempotent)
if (typeof HTMLElement !== 'undefined' && !customElements.get(DIFFS_TAG_NAME)) {
  class FileDiffContainer extends HTMLElement {
    constructor() {
      super()
      if (this.shadowRoot != null) return
      this.attachShadow({ mode: 'open' })
    }
  }
  customElements.define(DIFFS_TAG_NAME, FileDiffContainer)
}

registerCraftShikiThemes()

function isDarkMode(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

/**
 * Ensure raw diff text is a valid unified diff that PatchDiff can parse.
 * Markdown diff blocks often omit --- / +++ / @@ headers — synthesise them if missing.
 */
function ensureUnifiedDiffFormat(raw: string): string {
  if (/^@@\s/m.test(raw)) return raw

  const lines = raw.split('\n')
  let origCount = 0
  let modCount = 0

  for (const line of lines) {
    if (line.startsWith('-')) {
      origCount++
    } else if (line.startsWith('+')) {
      modCount++
    } else {
      origCount++
      modCount++
    }
  }

  return [
    '--- a/file',
    '+++ b/file',
    `@@ -1,${origCount} +1,${modCount} @@`,
    raw,
  ].join('\n')
}

class DiffErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: Error) {
    console.warn('[MarkdownDiffBlock] PatchDiff render failed, falling back to CodeBlock:', error)
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

export interface MarkdownDiffBlockProps {
  code: string
  className?: string
}

export function MarkdownDiffBlock({ code, className }: MarkdownDiffBlockProps) {
  const dark = isDarkMode()
  const themeName = dark ? 'craft-dark' : 'craft-light'

  const options: PatchDiffProps<undefined>['options'] = React.useMemo(() => ({
    theme: themeName,
    diffStyle: 'unified' as const,
    diffIndicators: 'bars' as const,
    disableBackground: false,
    lineDiffType: 'word' as const,
    overflow: 'scroll' as const,
    disableFileHeader: true,
    themeType: dark ? ('dark' as const) : ('light' as const),
  }), [themeName, dark])

  const patch = React.useMemo(() => ensureUnifiedDiffFormat(code), [code])
  const fallback = <CodeBlock code={code} language="diff" mode="full" className={className} />

  return (
    <DiffErrorBoundary fallback={fallback}>
      <div
        className={cn('relative rounded-[8px] overflow-hidden border bg-muted/30', className)}
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <PatchDiff patch={patch} options={options} />
      </div>
    </DiffErrorBoundary>
  )
}
