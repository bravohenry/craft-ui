/**
 * [INPUT]: react
 * [OUTPUT]: useCollapsibleMarkdown, CollapsibleMarkdownProvider
 * [POS]: markdown/ — context for collapsible section state management
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import * as React from 'react'

interface CollapsibleMarkdownContextValue {
  collapsedSections: Set<string>
  toggleSection: (sectionId: string) => void
  expandAll: () => void
}

const CollapsibleMarkdownContext = React.createContext<CollapsibleMarkdownContextValue | null>(null)

export function useCollapsibleMarkdown(): CollapsibleMarkdownContextValue | null {
  return React.useContext(CollapsibleMarkdownContext)
}

interface CollapsibleMarkdownProviderProps {
  children: React.ReactNode
}

export function CollapsibleMarkdownProvider({ children }: CollapsibleMarkdownProviderProps) {
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(() => new Set())

  const toggleSection = React.useCallback((sectionId: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }, [])

  const expandAll = React.useCallback(() => {
    setCollapsedSections(new Set())
  }, [])

  const value = React.useMemo(
    () => ({ collapsedSections, toggleSection, expandAll }),
    [collapsedSections, toggleSection, expandAll]
  )

  return (
    <CollapsibleMarkdownContext.Provider value={value}>
      {children}
    </CollapsibleMarkdownContext.Provider>
  )
}
