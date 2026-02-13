/**
 * [INPUT]: depends on React state and @craft/ui/ui base components.
 * [OUTPUT]: UISection component that previews shadcn-compatible primitives.
 * [POS]: preview/sections showcase page for reusable base UI layer.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import { useState } from 'react'
import { AlertTriangle, Inbox, Search } from 'lucide-react'
import type { ColumnDef, RuleItem } from '@craft/ui/ui'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  CollapsibleTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  CrossfadeAvatar,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Input,
  Kbd,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  RuleSetCard,
  RuleTable,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  SectionHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Slider,
  StyledContextMenu,
  StyledContextMenuContent,
  StyledContextMenuItem,
  StyledContextMenuSub,
  StyledContextMenuSubContent,
  StyledContextMenuSubTrigger,
  StyledContextMenuSeparator,
  StyledContextMenuTrigger,
  StyledDropdownMenu,
  StyledDropdownMenuContent,
  StyledDropdownMenuItem,
  StyledDropdownMenuSub,
  StyledDropdownMenuSubContent,
  StyledDropdownMenuSubTrigger,
  StyledDropdownMenuSeparator,
  StyledDropdownMenuTrigger,
  Switch,
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
  Textarea,
  ToneBadge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@craft/ui/ui'

type ComponentRow = {
  component: string
  status: string
  layer: string
  target: string
}

const rows: ComponentRow[] = [
  { component: 'Button', status: 'Ready', layer: 'Base UI', target: 'React and Electron' },
  { component: 'Dialog', status: 'Ready', layer: 'Overlay', target: 'React and Electron' },
  { component: 'StyledDropdown', status: 'Ready', layer: 'Craft Preset', target: 'Electron-heavy UIs' },
  { component: 'DataTable', status: 'Ready', layer: 'Data Grid', target: 'React and Electron' },
]

const columns: ColumnDef<ComponentRow>[] = [
  { accessorKey: 'component', header: 'Component' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'layer', header: 'Layer' },
  { accessorKey: 'target', header: 'Target' },
]

const defaultRuleRows: RuleItem[] = [
  { access: 'allowed', type: 'bash', pattern: '^ls\\b', comment: 'List directory contents' },
  { access: 'allowed', type: 'bash', pattern: '^ll\\b', comment: 'Long listing (ls -l alias)' },
  { access: 'allowed', type: 'bash', pattern: '^la\\b', comment: 'List all including hidden (ls -la alias)' },
  { access: 'allowed', type: 'bash', pattern: '^tree\\b', comment: 'Display directory tree structure' },
  { access: 'allowed', type: 'bash', pattern: '^file\\b', comment: 'Determine file type' },
  { access: 'allowed', type: 'bash', pattern: '^stat\\b', comment: 'Display file status and metadata' },
  { access: 'allowed', type: 'bash', pattern: '^du\\b', comment: 'Estimate file/directory disk usage' },
]

const avatarSvg =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%23e5e7eb"/><circle cx="32" cy="24" r="12" fill="%239ca3af"/><rect x="14" y="42" width="36" height="14" rx="7" fill="%239ca3af"/></svg>'

export function UISection() {
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true)
  const [executionMode, setExecutionMode] = useState('balanced')
  const [qualityScore, setQualityScore] = useState(72)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-lg font-semibold">Buttons and Badges</h3>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background p-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Form Controls</h3>
        <div className="space-y-3 rounded-lg border border-border bg-background p-4">
          <div className="space-y-2">
            <Label htmlFor="demo-title">Title</Label>
            <Input id="demo-title" placeholder="Type a title..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-message">Message</Label>
            <Textarea id="demo-message" placeholder="Write your message..." />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <div className="text-sm font-medium">Enable alerts</div>
              <div className="text-xs text-muted-foreground">
                Shortcut: <Kbd>Cmd</Kbd> + <Kbd>K</Kbd>
              </div>
            </div>
            <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
          </div>
          <div className="grid gap-3 rounded-md border border-border p-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="demo-email-digest"
                checked={emailDigestEnabled}
                onCheckedChange={(checked) => setEmailDigestEnabled(checked === true)}
              />
              <Label htmlFor="demo-email-digest">Receive daily digest email</Label>
            </div>

            <div className="space-y-2">
              <Label>Execution mode</Label>
              <RadioGroup value={executionMode} onValueChange={setExecutionMode} className="grid gap-2 sm:grid-cols-3">
                <Label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-normal">
                  <RadioGroupItem value="safe" />
                  Safe
                </Label>
                <Label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-normal">
                  <RadioGroupItem value="balanced" />
                  Balanced
                </Label>
                <Label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-normal">
                  <RadioGroupItem value="fast" />
                  Fast
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Quality threshold</Label>
                <span className="text-xs text-muted-foreground">{qualityScore}%</span>
              </div>
              <Slider
                value={[qualityScore]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setQualityScore(value[0] ?? 0)}
              />
              <Progress value={qualityScore} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Selection, Menu, and Dialog</h3>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background p-4">
          <Select defaultValue="react">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="electron">Electron</SelectItem>
              <SelectItem value="next">Next.js</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Publish Change</DialogTitle>
                <DialogDescription>This keeps the API shadcn-like while using Craft tokens.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Popover, Context Menu, and Drawer</h3>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-sm text-muted-foreground">Popover</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <p className="text-sm text-muted-foreground">Token-driven popover panel.</p>
              </PopoverContent>
            </Popover>
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-sm text-muted-foreground">Base context menu (right click)</p>
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div className="flex h-20 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                  Right click here
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>Copy</ContextMenuItem>
                <ContextMenuItem>Paste</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-sm text-muted-foreground">Drawer</p>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer Example</DrawerTitle>
                  <DrawerDescription>Reusable in web and electron renderer.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Command and Collapsible</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-sm text-muted-foreground">Command</p>
            <Command className="rounded-md border border-border">
              <CommandInput placeholder="Type to search..." />
              <CommandList>
                <CommandEmpty>No result.</CommandEmpty>
                <CommandGroup heading="Actions">
                  <CommandItem>
                    <Search className="h-4 w-4" />
                    Search in Files
                  </CommandItem>
                  <CommandItem>
                    <Inbox className="h-4 w-4" />
                    Open Inbox
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
              </CommandList>
            </Command>
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-sm text-muted-foreground">Collapsible</p>
            <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline">{isCollapsibleOpen ? 'Hide' : 'Show'} Details</Button>
              </CollapsibleTrigger>
              {isCollapsibleOpen && (
                <div className="mt-3 rounded-md border border-border p-3 text-sm text-muted-foreground">
                  Collapsible content in the base UI layer.
                </div>
              )}
            </Collapsible>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Avatar, Calendar, and Empty State</h3>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-sm text-muted-foreground">Avatar / CrossfadeAvatar</p>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={avatarSvg} alt="avatar" />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              <CrossfadeAvatar
                src={avatarSvg}
                alt="crossfade"
                fallback={<span className="text-xs">CF</span>}
                className="h-10 w-10 rounded-full border border-border"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-sm text-muted-foreground">Calendar</p>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="p-0" />
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-sm text-muted-foreground">Empty</p>
            <Empty className="min-h-0 gap-2 p-2 pb-2">
              <EmptyHeader className="gap-1">
                <EmptyMedia variant="icon">
                  <Inbox className="h-8 w-8" />
                </EmptyMedia>
                <EmptyTitle>No Items</EmptyTitle>
                <EmptyDescription>Use this for blank states.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button size="sm" variant="outline">Create</Button>
              </EmptyContent>
            </Empty>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Card, Alert, Tooltip, and Skeleton</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Summary</CardTitle>
              <CardDescription>Reusable surface primitive for dashboard blocks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <AlertTriangle className="size-4" />
                <AlertTitle>Staging check required</AlertTitle>
                <AlertDescription>
                  Build artifacts are ready. Run smoke tests before publishing to production.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="justify-between">
              <div className="text-xs text-muted-foreground">Last updated 2m ago</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm">Deploy</Button>
                  </TooltipTrigger>
                  <TooltipContent>Push current commit to production</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>

          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-sm text-muted-foreground">Skeleton</p>
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-7/12" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Resizable Panels</h3>
        <div className="h-36 overflow-hidden rounded-lg border border-border bg-background">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={35}>
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Left Panel</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={65}>
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Right Panel</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Craft Presets</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-sm text-muted-foreground">Styled dropdown preset</p>
            <StyledDropdownMenu>
              <StyledDropdownMenuTrigger asChild>
                <Button variant="outline">Open Styled Menu</Button>
              </StyledDropdownMenuTrigger>
              <StyledDropdownMenuContent>
                <StyledDropdownMenuItem>Rename</StyledDropdownMenuItem>
                <StyledDropdownMenuItem>Duplicate</StyledDropdownMenuItem>
                <StyledDropdownMenuSub>
                  <StyledDropdownMenuSubTrigger>Move to</StyledDropdownMenuSubTrigger>
                  <StyledDropdownMenuSubContent>
                    <StyledDropdownMenuItem>Backlog</StyledDropdownMenuItem>
                    <StyledDropdownMenuItem>In Progress</StyledDropdownMenuItem>
                    <StyledDropdownMenuItem>Done</StyledDropdownMenuItem>
                  </StyledDropdownMenuSubContent>
                </StyledDropdownMenuSub>
                <StyledDropdownMenuSeparator />
                <StyledDropdownMenuItem variant="destructive">Delete</StyledDropdownMenuItem>
              </StyledDropdownMenuContent>
            </StyledDropdownMenu>
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-3 text-sm text-muted-foreground">Styled context menu (right click)</p>
            <StyledContextMenu>
              <StyledContextMenuTrigger asChild>
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                  Right click here
                </div>
              </StyledContextMenuTrigger>
              <StyledContextMenuContent>
                <StyledContextMenuItem>Copy Path</StyledContextMenuItem>
                <StyledContextMenuItem>Open in Finder</StyledContextMenuItem>
                <StyledContextMenuSub>
                  <StyledContextMenuSubTrigger>Move to</StyledContextMenuSubTrigger>
                  <StyledContextMenuSubContent>
                    <StyledContextMenuItem>Backlog</StyledContextMenuItem>
                    <StyledContextMenuItem>In Progress</StyledContextMenuItem>
                    <StyledContextMenuItem>Done</StyledContextMenuItem>
                  </StyledContextMenuSubContent>
                </StyledContextMenuSub>
                <StyledContextMenuSeparator />
                <StyledContextMenuItem variant="destructive">Remove</StyledContextMenuItem>
              </StyledContextMenuContent>
            </StyledContextMenu>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Section Header, Tone Badge, and Rule Table</h3>
        <div className="space-y-4 rounded-xl border border-border bg-background p-4">
          <SectionHeader
            title="Automation Policies"
            description="Generic heading primitive with action slot for any panel."
            action={<Button variant="outline" size="sm">Manage</Button>}
          />
          <div className="flex flex-wrap gap-2">
            <ToneBadge tone="success">Healthy</ToneBadge>
            <ToneBadge tone="warning">Review Required</ToneBadge>
            <ToneBadge tone="destructive">Blocked</ToneBadge>
            <ToneBadge tone="muted">Draft</ToneBadge>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            <RuleTable data={defaultRuleRows} maxHeight={240} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Original-Style Permissions Table</h3>
        <RuleSetCard
          title="Default Permissions"
          description="App-level patterns allowed in Explore mode. Commands not on this list are blocked."
          data={defaultRuleRows}
        />
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Data Tables and Notes</h3>
        <div className="rounded-lg border border-border bg-background p-4">
          <Tabs defaultValue="data-table" className="space-y-4">
            <TabsList>
              <TabsTrigger value="data-table">DataTable</TabsTrigger>
              <TabsTrigger value="base-table">Base Table</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="data-table" className="space-y-3">
              <DataTable columns={columns} data={rows} />
            </TabsContent>

            <TabsContent value="base-table" className="space-y-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Primitive</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Table</TableCell>
                    <TableCell>Displayed</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>DataTable</TableCell>
                    <TableCell>Displayed</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="notes">
              <ScrollArea className="h-24 rounded-md border border-border p-3">
                <p className="text-sm leading-6 text-muted-foreground">
                  The UI set is shadcn-compatible and extracted from Craft renderer foundations.
                  It can be consumed from both React web apps and Electron renderer.
                </p>
                <Separator className="my-3" />
                <p className="text-sm leading-6 text-muted-foreground">
                  Styling stays token-driven, so visual parity with Craft remains stable.
                </p>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
