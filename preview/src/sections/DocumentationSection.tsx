/**
 * [INPUT]: depends on @craft/ui/ui primitives and lucide-react icons.
 * [OUTPUT]: DocumentationSection component with human-first guide and AI-first implementation spec.
 * [POS]: preview homepage delivery document and default entry for sidebar navigation.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import { Bot, BookOpen, Code2, Rocket, Sparkles } from 'lucide-react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
        title="Craft UI Delivery Document"
        description="Human-first onboarding at the top; AI-first integration contract below."
        action={<Badge className="gap-1"><BookOpen className="size-3.5" />Docs Home</Badge>}
      />

      <Card className="border-foreground/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="size-4" />
            For Humans: Start Here
          </CardTitle>
          <CardDescription>
            This block is for teammates. It explains what this kit is, where to click first, and how to run it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Alert>
            <Sparkles className="size-4" />
            <AlertTitle>Default experience</AlertTitle>
            <AlertDescription>
              Sidebar now opens on the first item by default, so newcomers always land on this document page first.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">5-minute setup</h3>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Install dependencies and include the style entry.</li>
              <li>Wrap app with <Kbd>PlatformProvider</Kbd>.</li>
              <li>Build shell with sidebar and content panel.</li>
              <li>Use `@craft/ui/ui` components before custom markup.</li>
              <li>Run type-check and preview build before delivery.</li>
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
