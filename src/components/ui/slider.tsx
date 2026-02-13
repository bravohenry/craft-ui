/**
 * [INPUT]: Depends on React, @radix-ui/react-slider, and @/utils/cn.
 * [OUTPUT]: Slider component.
 * [POS]: components/ui shadcn-compatible range input for continuous values.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/utils/cn"

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    data-slot="slider"
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      data-slot="slider-track"
      className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-foreground/10"
    >
      <SliderPrimitive.Range
        data-slot="slider-range"
        className="absolute h-full bg-foreground"
      />
    </SliderPrimitive.Track>

    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className="block size-4 rounded-full border border-foreground/20 bg-background shadow-minimal transition-colors hover:bg-foreground/3 focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
