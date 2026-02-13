/**
 * [INPUT]: Depends on React, @radix-ui/react-progress, and @/utils/cn.
 * [OUTPUT]: Progress component.
 * [POS]: components/ui shadcn-compatible progress bar for status feedback.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/utils/cn"

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value = 0, ...props }, ref) => {
  const safeValue = value ?? 0
  const clamped = Math.max(0, Math.min(100, safeValue))

  return (
    <ProgressPrimitive.Root
      ref={ref}
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-foreground/10",
        className
      )}
      value={clamped}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full bg-foreground transition-transform"
        style={{ transform: `translateX(-${100 - clamped}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
