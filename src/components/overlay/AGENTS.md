# overlay/
> L2 | Parent: src/components/AGENTS.md

OverlayErrorBanner.tsx: Destructive-tinted error banner with label+message
ContentFrame.tsx: Terminal-style card with title bar, optional sidebars
FullscreenOverlayBase.tsx: Radix Dialog wrapper — fullscreen overlay with masked scroll, floating header, traffic light hiding
FullscreenOverlayBaseHeader.tsx: Badge row header with dual-trigger file path menu (dropdown + context), copy button
PreviewOverlay.tsx: Unified modal/fullscreen/embedded overlay — delegates to FullscreenOverlayBase or portal modal
GenericOverlay.tsx: Convenience wrapper — renders children inside PreviewOverlay
ImagePreviewOverlay.tsx: Image preview overlay with error handling and copy-URL button
DataTableOverlay.tsx: Data table overlay with export dropdown, delegates to PreviewOverlay
MermaidPreviewOverlay.tsx: Mermaid diagram preview with pan/zoom, SVG rendering, theme toggle
CodePreviewOverlay.tsx: Code preview overlay with Shiki syntax highlighting
TerminalPreviewOverlay.tsx: Terminal output preview overlay with ANSI rendering
JSONPreviewOverlay.tsx: JSON tree viewer overlay with collapsible nodes, dark/light themes
PDFPreviewOverlay.tsx: PDF document preview overlay with page navigation, zoom controls
MultiDiffPreviewOverlay.tsx: Multi-file diff preview with split/unified views, file navigation
DocumentFormattedMarkdownOverlay.tsx: Full-document markdown overlay with FullscreenOverlayBase
index.ts: Barrel re-export for all overlay components and types

[PROTOCOL]: Update this file on member changes, then check parent AGENTS.md
