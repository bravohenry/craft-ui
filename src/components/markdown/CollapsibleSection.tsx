/**
 * [INPUT]: react, lucide-react, motion/react, @/utils/cn
 * [OUTPUT]: CollapsibleSection component
 * [POS]: markdown/ — animated collapsible heading wrapper, consumed by Markdown renderer
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/utils/cn'

function AnimatedCollapsibleContent({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface CollapsibleSectionProps {
  sectionId: string
  headingLevel: number
  isCollapsed: boolean
  onToggle: (sectionId: string) => void
  children: React.ReactNode
}

function ChevronIndicator({ isExpanded, isCollapsed, visible }: { isExpanded: boolean; isCollapsed: boolean; visible: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ rotate: isExpanded ? 90 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'absolute -left-4 top-[5px] select-none transition-opacity',
        !visible && 'opacity-0',
        visible && isCollapsed && 'opacity-100',
        visible && isExpanded && 'opacity-0 group-hover:opacity-100'
      )}
    >
      <ChevronRight className="h-3 w-3 text-muted-foreground" />
    </motion.div>
  )
}

export function CollapsibleSection({
  sectionId,
  headingLevel,
  isCollapsed,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  const childArray = React.Children.toArray(children)
  const heading = childArray[0]
  const content = childArray.slice(1)

  if (headingLevel > 4) return <>{children}</>

  const isExpanded = !isCollapsed
  const hasContent = content.length > 0

  return (
    <div className="markdown-collapsible-section" data-section-id={sectionId}>
      {hasContent ? (
        <button
          type="button"
          aria-expanded={isExpanded}
          className="relative group cursor-pointer w-full text-left bg-transparent border-none p-0 m-0 appearance-none font-inherit"
          onClick={() => onToggle(sectionId)}
        >
          <ChevronIndicator isExpanded={isExpanded} isCollapsed={isCollapsed} visible />
          {heading}
        </button>
      ) : (
        <div className="relative group">
          <ChevronIndicator isExpanded={isExpanded} isCollapsed={isCollapsed} visible={false} />
          {heading}
        </div>
      )}

      {hasContent && (
        <AnimatedCollapsibleContent isOpen={isExpanded}>
          <div className="collapsible-section-content">
            {content}
          </div>
        </AnimatedCollapsibleContent>
      )}
    </div>
  )
}
