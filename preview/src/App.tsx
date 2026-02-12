import { useState, type ReactNode } from 'react'
import { PlatformProvider } from '@craft/ui/context'
import {
  DesignSystemSection,
  PrimitivesSection,
  CodeViewerSection,
  MarkdownSection,
  TerminalSection,
  CardsSection,
} from './sections'

const sections = [
  'Design System',
  'Primitives',
  'Code Viewer',
  'Markdown',
  'Terminal',
  'Cards',
] as const

type Section = (typeof sections)[number]

const sectionComponents: Record<Section, () => ReactNode> = {
  'Design System': () => <DesignSystemSection />,
  'Primitives': () => <PrimitivesSection />,
  'Code Viewer': () => <CodeViewerSection />,
  'Markdown': () => <MarkdownSection />,
  'Terminal': () => <TerminalSection />,
  'Cards': () => <CardsSection />,
}

export function App() {
  const [active, setActive] = useState<Section>('Design System')

  const ActiveSection = sectionComponents[active]

  return (
    <PlatformProvider actions={{}}>
      <div className="flex h-dvh bg-background text-foreground">
        <nav className="w-56 shrink-0 border-r border-border bg-muted/30 p-4">
          <h1 className="mb-6 text-lg font-semibold tracking-tight">
            craft/ui
          </h1>
          <ul className="space-y-1">
            {sections.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => setActive(s)}
                  className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                    active === s
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-1 overflow-y-auto p-8">
          <h2 className="mb-6 text-2xl font-bold">{active}</h2>
          <ActiveSection />
        </main>
      </div>
    </PlatformProvider>
  )
}
