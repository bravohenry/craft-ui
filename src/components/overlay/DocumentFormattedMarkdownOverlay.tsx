/**
 * [INPUT]: FullscreenOverlayBase + FullscreenOverlayBaseHeader (sibling), Markdown (@/components/markdown), lucide-react
 * [OUTPUT]: DocumentFormattedMarkdownOverlay component, DocumentFormattedMarkdownOverlayProps interface
 * [POS]: overlay/ — Fullscreen document view for AI responses and plans with centered card layout
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import { ListTodo } from 'lucide-react'
import { Markdown } from '@/components/markdown/Markdown'
import { FullscreenOverlayBase } from './FullscreenOverlayBase'
import type { OverlayTypeBadge } from './FullscreenOverlayBaseHeader'

export interface DocumentFormattedMarkdownOverlayProps {
  /** The content to display (markdown) */
  content: string
  /** Whether the overlay is open */
  isOpen: boolean
  /** Called when overlay should close */
  onClose: () => void
  /** Variant: 'response' (default) or 'plan' (shows header) */
  variant?: 'response' | 'plan'
  /** Callback for URL clicks */
  onOpenUrl?: (url: string) => void
  /** Callback for file path clicks */
  onOpenFile?: (path: string) => void
  /** Optional file path — shows badge with "Open" / "Reveal in Finder" menu */
  filePath?: string
  /** Optional type badge — tool/format indicator (e.g. "Write") shown in header */
  typeBadge?: OverlayTypeBadge
  /** Optional error message — renders a tinted error banner above the content card */
  error?: string
}

export function DocumentFormattedMarkdownOverlay({
  content,
  isOpen,
  onClose,
  variant = 'response',
  onOpenUrl,
  onOpenFile,
  filePath,
  typeBadge,
  error,
}: DocumentFormattedMarkdownOverlayProps) {
  return (
    <FullscreenOverlayBase
      isOpen={isOpen}
      onClose={onClose}
      filePath={filePath}
      typeBadge={typeBadge}
      copyContent={content}
      error={error ? { label: 'Write Failed', message: error } : undefined}
    >
      <div className="min-h-full flex flex-col justify-center px-6 py-16">
        <div className="bg-background rounded-[16px] shadow-strong w-full max-w-[960px] h-fit mx-auto my-auto">
          {variant === 'plan' && (
            <div className="px-4 py-2 border-b border-border/30 flex items-center gap-2 bg-success/5 rounded-t-[16px]">
              <ListTodo className="w-3 h-3 text-success" />
              <span className="text-[13px] font-medium text-success">Plan</span>
            </div>
          )}

          <div className="px-10 pt-8 pb-8">
            <div className="text-sm">
              <Markdown
                mode="minimal"
                onUrlClick={onOpenUrl}
                onFileClick={onOpenFile}
                hideFirstMermaidExpand={false}
              >
                {content}
              </Markdown>
            </div>
          </div>
        </div>
      </div>
    </FullscreenOverlayBase>
  )
}
