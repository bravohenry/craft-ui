/**
 * [INPUT]: ./TerminalOutput, ./ansi-parser
 * [OUTPUT]: re-exports all terminal public API
 * [POS]: terminal/ — barrel entry point
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

export { TerminalOutput, type TerminalOutputProps, type ToolType } from './TerminalOutput'
export {
  parseAnsi,
  stripAnsi,
  isGrepContentOutput,
  parseGrepOutput,
  ANSI_COLORS,
  type AnsiSpan,
  type GrepLine,
} from './ansi-parser'
