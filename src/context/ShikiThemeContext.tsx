/**
 * [INPUT]: Depends on react
 * [OUTPUT]: ShikiThemeProvider, ShikiThemeProviderProps, useShikiTheme
 * [POS]: context/ — Shiki syntax theme injection for code blocks
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import { createContext, useContext, type ReactNode } from 'react'

interface ShikiThemeContextValue {
  shikiTheme: string | null
}

const ShikiThemeContext = createContext<ShikiThemeContextValue>({ shikiTheme: null })

export interface ShikiThemeProviderProps {
  children: ReactNode
  shikiTheme: string | null
}

export function ShikiThemeProvider({ children, shikiTheme }: ShikiThemeProviderProps) {
  return (
    <ShikiThemeContext.Provider value={{ shikiTheme }}>
      {children}
    </ShikiThemeContext.Provider>
  )
}

export function useShikiTheme(): string | null {
  const { shikiTheme } = useContext(ShikiThemeContext)
  return shikiTheme
}

export default ShikiThemeContext
