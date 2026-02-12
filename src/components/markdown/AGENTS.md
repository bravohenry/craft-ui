# markdown/
> L2 | Parent: src/components/AGENTS.md

Rich markdown rendering system with mode-based output (terminal/minimal/full), specialized code block renderers, and streaming-optimized memoization.

## Members

Markdown.tsx: Main renderer orchestrating all block types, three render modes, GFM + rehype-raw, memoized streaming variant
CodeBlock.tsx: Shiki-powered syntax highlighting, inline code, language detection, copy button
MarkdownDiffBlock.tsx: Unified diff viewer for ```diff code fences
MarkdownJsonBlock.tsx: Interactive JSON tree viewer for ```json code fences
MarkdownMermaidBlock.tsx: Mermaid diagram SVG renderer with scroll-fade, expand button, zinc theme
MarkdownDatatableBlock.tsx: Sortable/groupable/filterable data table for ```datatable code fences
MarkdownSpreadsheetBlock.tsx: Excel-style grid for ```spreadsheet code fences, cell selection, CSV export
TableExportDropdown.tsx: Shared export dropdown (CSV/TSV/JSON/Clipboard) used by datatable + spreadsheet blocks
CollapsibleSection.tsx: Collapsible heading sections with expand/collapse toggle
CollapsibleMarkdownContext.tsx: React context provider managing collapsed section state
remarkCollapsibleSections.ts: Remark plugin wrapping headings in collapsible section divs
safe-components.tsx: Proxy-based fallback for invalid HTML-like tags (e.g. `<sq+qr>`) preventing React crashes
index.ts: Barrel exports for all public components, types, and utilities

[PROTOCOL]: Update this header on change, then check AGENTS.md
