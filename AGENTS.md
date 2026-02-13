# @craft/ui - Cross-platform React UI component library
TypeScript + React + Tailwind v4 + Radix UI + oklch color system

<directory>
preview/ - Vite-powered documentation and component showcase app that imports source components directly for visual validation.
src/types/ - Standalone type definitions replacing @craft-agent/core (3 files: message, session, activity)
src/utils/ - Pure utility functions: cn(), path helpers (2 files)
src/styles/ - Design system CSS: 6-color oklch, 13-level foreground gradients, shadow system, animations
src/context/ - React context providers: PlatformContext (Electron/Web), ShikiThemeContext (syntax themes)
src/lib/ - Pure utilities: layout constants, language-map, table-export, linkify, attachment-helpers, file-classification, tool-parsers (7 files)
src/hooks/ - React hooks: useScrollFade (1 file)
src/components/ - L1 ui/, primitives/, code-viewer/, markdown/, overlay/, terminal/, cards/, chat/ component layers
src/components/ui/ - Shadcn-compatible + Craft-styled base layer: Button/Input/Select/Dialog/Dropdown/Tabs/Table/Calendar/Drawer + Checkbox/RadioGroup/Slider/Progress + Alert/Card/Skeleton/Tooltip + Styled menus/DataTable + ToneBadge/RuleSetCard/SectionHeader recipes (40 files: 38 component files + index.ts + AGENTS.md)
src/components/primitives/ - Atomic UI components: Tooltip, Spinner, CopyButton, Dropdowns, PreviewHeader (7 files)
src/components/primitives/icons/ - Custom SVG icon components: Folder, Home, Inbox (3 files + types)
src/components/code-viewer/ - Code/diff viewing: ShikiCodeViewer, ShikiDiffViewer, UnifiedDiffViewer, DiffViewerControls, DiffIcons, registerShikiThemes (6 files)
src/components/markdown/ - Markdown renderer, CodeBlock, CollapsibleSection, block renderers (Diff, JSON, Mermaid, Datatable, Spreadsheet), TableExportDropdown (12 files)
src/components/overlay/ - FullscreenOverlayBase, PreviewOverlay, GenericOverlay, composed previews (Code, Terminal, JSON, PDF, Mermaid, MultiDiff, DataTable, Document), OverlayErrorBanner, ContentFrame (15 files)
src/components/terminal/ - ANSI escape code parser, TerminalOutput command+output display component (3 files)
src/components/cards/ - Card components: ActionCard (1 file)
src/components/chat/ - Chat turn rendering: TurnCard, SessionViewer, UserMessageBubble, SystemMessage, turn-utils, InlineExecution (10 files)
.github/workflows/ - GitHub Actions delivery automation, including GitHub Pages deployment for preview site.
</directory>

<config>
package.json - @craft/ui package, ESM, peer deps for React/Radix/Tailwind/Shiki
tsconfig.json - ES2022, bundler resolution, strict, react-jsx, @/* path alias
preview/vite.config.ts - preview build config with alias mapping and GitHub Pages-aware base path.
.github/workflows/deploy-pages.yml - CI workflow that builds preview/dist and deploys it to GitHub Pages.
</config>
