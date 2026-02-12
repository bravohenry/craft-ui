# @craft/ui - Cross-platform React UI component library
TypeScript + React + Tailwind v4 + Radix UI + oklch color system

<directory>
src/types/ - Standalone type definitions replacing @craft-agent/core (3 files: message, session, activity)
src/utils/ - Pure utility functions: cn(), path helpers (2 files)
src/styles/ - Design system CSS: 6-color oklch, 13-level foreground gradients, shadow system, animations
src/context/ - React context providers: PlatformContext (Electron/Web), ShikiThemeContext (syntax themes)
src/lib/ - Pure utilities: layout constants, language-map, table-export, linkify, attachment-helpers, file-classification (6 files)
src/hooks/ - React hooks: useScrollFade (1 file)
src/components/ - L1 primitives, code-viewer/, markdown/, overlay/ component layers
src/components/primitives/ - Atomic UI components: Tooltip, Spinner, CopyButton, Dropdowns, PreviewHeader (7 files)
src/components/primitives/icons/ - Custom SVG icon components: Folder, Home, Inbox (3 files + types)
src/components/code-viewer/ - Diff viewer icons, Shiki theme registration (2 files)
src/components/markdown/ - Safe tag proxy, collapsible section context + remark plugin (3 files)
src/components/overlay/ - OverlayErrorBanner, ContentFrame terminal-style card (2 files)
</directory>

<config>
package.json - @craft/ui package, ESM, peer deps for React/Radix/Tailwind/Shiki
tsconfig.json - ES2022, bundler resolution, strict, react-jsx, @/* path alias
</config>
