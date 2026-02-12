# code-viewer/
> L2 | Parent: src/components/AGENTS.md

Code and diff viewing components powered by Shiki and @pierre/diffs.

## Members

index.ts: barrel re-exports
DiffIcons.tsx: SVG icons for diff operations (add, remove, modify, rename)
DiffViewerControls.tsx: Toggle controls for diff view modes (split/unified)
ShikiCodeViewer.tsx: Syntax-highlighted code block via Shiki, language detection, line numbers
ShikiDiffViewer.tsx: Side-by-side diff viewer via @pierre/diffs custom element + Shiki themes
UnifiedDiffViewer.tsx: Unified patch-style diff viewer via @pierre/diffs parsePatchFiles
registerShikiThemes.ts: Registers craft light/dark themes into Shiki highlighter instance

[PROTOCOL]: Update on file add/remove/rename, then check parent AGENTS.md
