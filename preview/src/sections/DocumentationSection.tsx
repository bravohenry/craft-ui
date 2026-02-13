/**
 * [INPUT]: depends on @craft/ui/ui primitives, @craft/ui/chat components, and lucide-react icons.
 * [OUTPUT]: DocumentationSection component with human-first guide and AI-first implementation spec.
 * [POS]: preview homepage delivery document and default entry for sidebar navigation.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import { Bot, BookOpen, Code2, Rocket } from 'lucide-react'
import {
  SystemMessage,
  UserMessageBubble,
} from '@craft/ui/chat'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Kbd,
  ScrollArea,
  SectionHeader,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@craft/ui/ui'

const quickInstallCode = `npm install @craft/ui react react-dom @radix-ui/react-slot @radix-ui/react-dialog
# tailwind v4 project should also import:
# @import "@craft/ui/styles";`

const appShellCode = `import { useState } from 'react'
import { PlatformProvider } from '@craft/ui/context'

const sections = ['Overview', 'Foundations', 'Components'] as const
type Section = (typeof sections)[number]

export function AppShell() {
  const [active, setActive] = useState<Section>(sections[0])

  return (
    <PlatformProvider actions={{}}>
      <div className="flex h-dvh">
        <aside>{/* sidebar */}</aside>
        <main>{active}</main>
      </div>
    </PlatformProvider>
  )
}`

const componentUsageCode = `import { Button, Card, CardHeader, CardContent, Input, Label } from '@craft/ui/ui'

export function LoginCard() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <h3 className="text-base font-semibold">Sign in</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="team@craft.dev" />
        </div>
        <Button className="w-full">Continue</Button>
      </CardContent>
    </Card>
  )
}`

const aiExecutionContract = `# AI EXECUTION CONTRACT
mode: deterministic
styling: shadcn-api and craft tokens
layout:
  shell: sidebar and content
  default_sidebar_item: first
rules:
  - always import from "@craft/ui/ui" first
  - avoid local one-off styles before checking existing ui primitives
  - keep reusable variants in ui layer, not in page layer
quality_gate:
  - run "npx tsc --noEmit"
  - run preview build
  - verify selected state and spacing in sidebar`

const componentContracts = [
  {
    group: 'Layout',
    importPath: '@craft/ui/ui',
    primitives: 'Card, SectionHeader, Separator, ScrollArea, Tabs',
    whenToUse: 'Compose pages, headers, and documentation blocks.',
  },
  {
    group: 'Actions',
    importPath: '@craft/ui/ui',
    primitives: 'Button, Badge, Kbd',
    whenToUse: 'Primary actions, state tags, keyboard hints.',
  },
  {
    group: 'Feedback',
    importPath: '@craft/ui/ui',
    primitives: 'Alert, Tooltip, Skeleton, Progress',
    whenToUse: 'Communicate status and loading state.',
  },
  {
    group: 'Data',
    importPath: '@craft/ui/ui',
    primitives: 'Table, DataTable, RuleTable, RuleSetCard',
    whenToUse: 'Structured rows, rule management, sortable grids.',
  },
]

const sectionMap = [
  { section: 'Foundations', purpose: 'colors, radius, shadows, typography rhythm' },
  { section: 'Component Gallery', purpose: 'all base UI and craft recipes with real composition examples' },
  { section: 'Primitive Components', purpose: 'small utility primitives and icons' },
  { section: 'Code and Diff', purpose: 'shiki renderers, diff viewers, and controls' },
  { section: 'Markdown Rendering', purpose: 'markdown blocks, mermaid, data tables, spreadsheet renderers' },
  { section: 'Terminal Output', purpose: 'command and output transcript presentation' },
  { section: 'Card Patterns', purpose: 'action-oriented cards' },
  { section: 'Overlay Previews', purpose: 'fullscreen and modal preview experiences' },
  { section: 'Chat Experience', purpose: 'turn card, session viewer, inline execution UI' },
]

interface DocumentationSectionProps {
  onNavigate?: (section: 'Foundations' | 'Component Gallery') => void
}

export function DocumentationSection({ onNavigate }: DocumentationSectionProps) {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Agentic/ui Delivery Document"
        description="Agentic-Native UI Kit"
        action={<Badge className="gap-1"><BookOpen className="size-3.5" />Docs Home</Badge>}
      />

      <Card className="border-foreground/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="size-4" />
            For Humans: Start Here
          </CardTitle>
          <CardDescription>
            A short story for why this kit exists and how to ship with it fast.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-xs text-muted-foreground">
            Origin:
            {' '}
            <a
              href="https://github.com/lukilabs/craft-agents-oss/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Craft Agents OSS
            </a>
            {' '}
            with design system patterns aligned to
            {' '}
            <a
              href="https://github.com/shadcn-ui/ui"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              shadcn/ui
            </a>
            .
          </p>

          <div className="space-y-3 rounded-xl border border-primary/25 bg-gradient-to-r from-primary/10 via-info/10 to-accent/10 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">The Pitch</p>
            <h3 className="text-base font-semibold leading-tight">
              Build once for agent products, not ten times for each screen.
            </h3>
            <p className="text-sm text-muted-foreground">
              Shadcn gives solid primitives for classic app UI. Agent products need more: thinking-process UI, long-form
              Markdown, and Mermaid diagrams as first-class outputs. Agentic-Native UI Kit keeps the shadcn API style
              and adds battle-tested agent workflows from Craft.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="border border-primary/30 bg-primary/15 text-primary">Thinking Process UI</Badge>
              <Badge className="border border-info/30 bg-info/15 text-[var(--info-text)]">Markdown-Native Output</Badge>
              <Badge className="border border-accent/30 bg-accent/15 text-accent">Mermaid Visualization</Badge>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
            <p className="text-sm font-semibold">Story in One Exchange</p>
            <UserMessageBubble
              compactMode
              className="items-start gap-2"
              content="If shadcn already works, why do we need another kit?"
            />
            <SystemMessage
              className="px-0 py-0"
              type="system"
              content="Because we are not only building forms and dialogs. We are shipping agent workflows: thinking traces, markdown reports, and Mermaid diagrams. [shadcn/ui](https://github.com/shadcn-ui/ui) is the foundation; [Craft Agents OSS](https://github.com/lukilabs/craft-agents-oss/) contributes the agent-native patterns."
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Quick setup</h3>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Install and include the style entry.</li>
              <li>Wrap your app with <Kbd>PlatformProvider</Kbd>.</li>
              <li>Compose with `@craft/ui/ui` primitives before custom markup.</li>
            </ol>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
            <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
              <code>{quickInstallCode}</code>
            </pre>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="sm" onClick={() => onNavigate?.('Foundations')}>
            Open Foundations
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate?.('Component Gallery')}>
            Open Component Gallery
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <div className="space-y-1">
          <CardTitle>Section Map</CardTitle>
          <CardDescription>Every section in the sidebar has a concrete scope for review and implementation.</CardDescription>
        </div>
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section</TableHead>
                <TableHead>Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectionMap.map((row) => (
                <TableRow key={row.section}>
                  <TableCell className="font-medium">{row.section}</TableCell>
                  <TableCell>{row.purpose}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Separator />

      <SectionHeader
        title="AI Integration Zone"
        description="From this point onward, content is optimized for agent execution."
        action={<Badge variant="secondary" className="gap-1"><Bot className="size-3.5" />AI-Only</Badge>}
      />

      <Tabs defaultValue="shell" className="space-y-3">
        <TabsList>
          <TabsTrigger value="shell">App Shell</TabsTrigger>
          <TabsTrigger value="usage">Component Usage</TabsTrigger>
          <TabsTrigger value="contract">Execution Contract</TabsTrigger>
        </TabsList>

        <TabsContent value="shell">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="size-4" />
                Sidebar and First-Item Default State
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
                <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                  <code>{appShellCode}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Canonical Component Composition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
                <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                  <code>{componentUsageCode}</code>
                </pre>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group</TableHead>
                    <TableHead>Import</TableHead>
                    <TableHead>Primitives</TableHead>
                    <TableHead>When To Use</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {componentContracts.map((row) => (
                    <TableRow key={row.group}>
                      <TableCell className="font-medium">{row.group}</TableCell>
                      <TableCell>
                        <code className="text-xs">{row.importPath}</code>
                      </TableCell>
                      <TableCell className="text-xs">{row.primitives}</TableCell>
                      <TableCell>{row.whenToUse}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contract">
          <Card>
            <CardHeader>
              <CardTitle>Deterministic Build Contract</CardTitle>
              <CardDescription>Use this block as direct context for coding agents.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72 rounded-lg border border-border bg-muted/30 p-4">
                <pre className="text-xs leading-relaxed">
                  <code>{aiExecutionContract}</code>
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
