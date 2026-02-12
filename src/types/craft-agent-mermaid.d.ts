/**
 * [INPUT]: None (ambient type declaration)
 * [OUTPUT]: Type declarations for @craft-agent/mermaid
 * [POS]: types/ — ambient module declaration for private @craft-agent/mermaid package
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */
declare module '@craft-agent/mermaid' {
  export interface MermaidThemeOptions {
    bg?: string
    fg?: string
    accent?: string
    line?: string
    muted?: string
    surface?: string
    border?: string
    transparent?: boolean
  }
  export function renderMermaidSync(code: string, options?: MermaidThemeOptions): string
}

declare module 'pdfjs-dist/build/pdf.worker.min.mjs?url' {
  const url: string
  export default url
}
