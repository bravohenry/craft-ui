/**
 * [INPUT]: Depends on React and @/utils/cn.
 * [OUTPUT]: Skeleton component.
 * [POS]: components/ui shadcn-compatible placeholder for loading states.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import * as React from "react"

import { cn } from "@/utils/cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-shimmer rounded-md bg-foreground/5", className)}
      {...props}
    />
  )
}

export { Skeleton }
