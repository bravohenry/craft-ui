/**
 * [INPUT]: Depends on ./PlatformContext, ./ShikiThemeContext
 * [OUTPUT]: Re-exports PlatformProvider, usePlatform, ShikiThemeProvider, useShikiTheme
 * [POS]: context/ barrel — single import point for all context providers
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

export {
  PlatformProvider,
  usePlatform,
  type PlatformActions,
  type PlatformProviderProps,
} from './PlatformContext';

export {
  ShikiThemeProvider,
  useShikiTheme,
  type ShikiThemeProviderProps,
} from './ShikiThemeContext';
