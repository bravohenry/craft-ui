/**
 * [INPUT]: Depends on react
 * [OUTPUT]: PlatformActions, PlatformProvider, PlatformProviderProps, usePlatform
 * [POS]: context/ — platform abstraction layer for Electron/Web portability
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import { createContext, useContext, type ReactNode } from 'react'

export interface PlatformActions {
  onOpenFile?: (path: string) => void
  onOpenFileExternal?: (path: string) => void
  onOpenUrl?: (url: string) => void
  onOpenCodePreview?: (sessionId: string, toolUseId: string) => void
  onOpenTerminalPreview?: (sessionId: string, toolUseId: string) => void
  onOpenMarkdownPreview?: (content: string) => void
  onOpenMultiFileDiff?: (sessionId: string, turnId: string) => void
  onCopyToClipboard?: (text: string) => Promise<void>
  onOpenTurnDetails?: (sessionId: string, turnId: string) => void
  onOpenActivityDetails?: (sessionId: string, activityId: string) => void
  onReadFile?: (path: string) => Promise<string>
  onRevealInFinder?: (path: string) => void
  onSetTrafficLightsVisible?: (visible: boolean) => void
}

const PlatformContext = createContext<PlatformActions>({})

export interface PlatformProviderProps {
  children: ReactNode
  actions?: PlatformActions
}

export function PlatformProvider({ children, actions = {} }: PlatformProviderProps) {
  return (
    <PlatformContext.Provider value={actions}>
      {children}
    </PlatformContext.Provider>
  )
}

export function usePlatform(): PlatformActions {
  return useContext(PlatformContext)
}

export default PlatformContext
