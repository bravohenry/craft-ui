import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  CopyButton,
  Spinner,
  LoadingIndicator,
} from '@craft/ui/primitives'

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
      </div>
    </TooltipProvider>
  )
}
