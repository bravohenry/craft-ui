/**
 * [INPUT]: @pierre/diffs (registerCustomTheme, resolveTheme)
 * [OUTPUT]: registerCraftShikiThemes
 * [POS]: code-viewer/ — one-shot craft-dark/craft-light Shiki theme registration
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import { registerCustomTheme, resolveTheme } from '@pierre/diffs'

const GLOBAL_THEME_KEY = '__craftShikiThemesRegistered__'

export function registerCraftShikiThemes() {
  if (typeof globalThis === 'undefined') return
  const globalRef = globalThis as typeof globalThis & { [GLOBAL_THEME_KEY]?: boolean }
  if (globalRef[GLOBAL_THEME_KEY]) return
  globalRef[GLOBAL_THEME_KEY] = true

  registerCustomTheme('craft-dark', async () => {
    const theme = await resolveTheme('pierre-dark')
    return { ...theme, name: 'craft-dark', bg: 'transparent', colors: { ...theme.colors, 'editor.background': 'transparent' } }
  })

  registerCustomTheme('craft-light', async () => {
    const theme = await resolveTheme('pierre-light')
    return { ...theme, name: 'craft-light', bg: 'transparent', colors: { ...theme.colors, 'editor.background': 'transparent' } }
  })
}
