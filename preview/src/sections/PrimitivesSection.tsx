/**
 * [INPUT]: depends on @craft/ui/primitives components and icons.
 * [OUTPUT]: PrimitivesSection preview page for tooltip/copy/spinner/loading/icons.
 * [POS]: preview/sections showcase page for primitive building blocks.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  CopyButton,
  Spinner,
  LoadingIndicator,
  HomeIcon,
  InboxIcon,
  FolderIcon,
} from '@craft/ui/primitives'

const ICON_BAR_ITEMS = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'inbox', label: 'Inbox', icon: InboxIcon },
  { id: 'folder', label: 'Folder', icon: FolderIcon },
] as const

export function PrimitivesSection() {
  return (
    <TooltipProvider>
      <div className="space-y-8">
        <section>
          <h3 className="mb-3 text-lg font-semibold">Tooltip</h3>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="rounded-md border border-border bg-background px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  Hover me
                </button>
              </TooltipTrigger>
              <TooltipContent>This is a tooltip</TooltipContent>
            </Tooltip>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-semibold">CopyButton</h3>
          <div className="flex items-center gap-4">
            <CopyButton content="Hello, clipboard!" />
            <span className="text-sm text-muted-foreground">
              Copies &quot;Hello, clipboard!&quot;
            </span>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-semibold">Spinner</h3>
          <div className="flex items-center gap-6">
            <Spinner />
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-semibold">LoadingIndicator</h3>
          <LoadingIndicator label="Processing request..." />
        </section>

        <section>
          <h3 className="mb-3 text-lg font-semibold">Icons</h3>
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 p-1">
              {ICON_BAR_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-label={label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  )
}
