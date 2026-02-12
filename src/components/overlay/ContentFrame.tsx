/**
 * [INPUT]: react (ReactNode)
 * [OUTPUT]: ContentFrame, ContentFrameProps
 * [POS]: overlay/ — terminal-style card frame with title bar and optional sidebars
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import type { ReactNode } from 'react'

export interface ContentFrameProps {
  title: string
  maxWidth?: number
  minWidth?: number
  fitContent?: boolean
  leftSidebar?: ReactNode
  rightSidebar?: ReactNode
  children: ReactNode
}

export function ContentFrame({
  title,
  maxWidth = 850,
  minWidth,
  fitContent,
  leftSidebar,
  rightSidebar,
  children,
}: ContentFrameProps) {
  const wrapperStyle = fitContent
    ? { width: 'max-content' as const, maxWidth: '100%', minWidth }
    : { maxWidth }

  return (
    <div className="flex px-6">
      <div
        className={`relative mx-auto ${fitContent ? '' : 'w-full'}`}
        style={wrapperStyle}
      >
        {leftSidebar && (
          <div className="absolute right-full top-0 h-full mr-4 overflow-y-auto">
            {leftSidebar}
          </div>
        )}

        <div className="flex flex-col rounded-2xl overflow-hidden backdrop-blur-sm shadow-strong bg-background min-h-[320px]">
          <div className="flex justify-center items-center px-4 py-3 border-b border-foreground/7 select-none shrink-0">
            <div className="text-xs font-semibold tracking-wider text-foreground/30">
              {title}
            </div>
          </div>

          <div>
            {children}
          </div>
        </div>

        {rightSidebar && (
          <div className="absolute left-full top-0 h-full ml-4 overflow-y-auto">
            {rightSidebar}
          </div>
        )}
      </div>
    </div>
  )
}
