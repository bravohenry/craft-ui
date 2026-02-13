/**
 * [INPUT]: None
 * [OUTPUT]: Mermaid rendering helper with optional dependency handling
 * [POS]: lib/ — optional mermaid renderer with graceful fallback
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

interface MermaidThemeOptions {
  bg?: string
  fg?: string
  accent?: string
  line?: string
  muted?: string
  surface?: string
  border?: string
  transparent?: boolean
}

interface MermaidModule {
  renderMermaidSync(code: string, options?: MermaidThemeOptions): string
}

let mermaidModule: MermaidModule | null = null

/**
 * Lazily loads @craft-agent/mermaid and returns the renderMermaidSync function.
 * Returns null if the package is not installed.
 */
export async function getMermaidRenderer(): Promise<MermaidModule | null> {
  if (mermaidModule !== null) {
    return mermaidModule
  }

  try {
    const mod = await import('@craft-agent/mermaid')
    mermaidModule = {
      renderMermaidSync: mod.renderMermaidSync,
    }
    return mermaidModule
  } catch {
    mermaidModule = null
    return null
  }
}

/**
 * Renders mermaid code to SVG synchronously.
 * Returns null if @craft-agent/mermaid is not installed.
 */
export async function renderMermaidSync(
  code: string,
  options?: MermaidThemeOptions
): Promise<string | null> {
  const module = await getMermaidRenderer()
  if (!module) {
    return null
  }
  return module.renderMermaidSync(code, options)
}

/**
 * Check if mermaid rendering is available.
 */
export function isMermaidAvailable(): Promise<boolean> {
  return getMermaidRenderer().then((m) => m !== null)
}
