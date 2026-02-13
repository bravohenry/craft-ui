/**
 * [INPUT]: Depends on React, @radix-ui/react-dropdown-menu, ./dropdown-menu, @/utils/cn.
 * [OUTPUT]: StyledDropdownMenu*, craft-styled dropdown wrappers without export name conflicts.
 * [POS]: components/ui enhanced layer, built on top of shadcn-compatible dropdown primitives.
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

import { cn } from '@/utils/cn'
import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from './dropdown-menu'

export {
  DropdownMenu as StyledDropdownMenu,
  DropdownMenuTrigger as StyledDropdownMenuTrigger,
}

export const StyledDropdownMenuSub = DropdownMenuSub

interface StyledDropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  minWidth?: string
}

export const StyledDropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  StyledDropdownMenuContentProps
>(({ className, minWidth = 'min-w-40', sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'popover-styled overflow-x-hidden overflow-y-auto p-1 z-dropdown',
        'max-h-(--radix-dropdown-menu-content-available-height)',
        'origin-(--radix-dropdown-menu-content-transform-origin)',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        'w-fit font-sans whitespace-nowrap text-xs flex flex-col gap-0.5',
        minWidth,
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
StyledDropdownMenuContent.displayName = 'StyledDropdownMenuContent'

interface StyledDropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  variant?: 'default' | 'destructive'
}

export const StyledDropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  StyledDropdownMenuItemProps
>(({ className, variant = 'default', ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default items-center gap-2 px-2 py-1.5 text-sm outline-hidden select-none',
      '[&_svg]:pointer-events-none [&_svg]:shrink-0',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'pr-4 rounded-[4px] hover:bg-foreground/[0.03] focus:bg-foreground/[0.03]',
      '[&_svg]:size-auto [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:shrink-0',
      variant === 'destructive' &&
        'text-destructive focus:text-destructive hover:text-destructive [&_svg]:!text-destructive',
      className,
    )}
    {...props}
  />
))
StyledDropdownMenuItem.displayName = 'StyledDropdownMenuItem'

export const StyledDropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('bg-foreground/10 -mx-1 my-1 h-px', className)}
    {...props}
  />
))
StyledDropdownMenuSeparator.displayName = 'StyledDropdownMenuSeparator'

export const StyledDropdownMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'relative flex cursor-default items-center gap-2 px-2 py-1.5 text-sm outline-hidden select-none',
      '[&_svg]:pointer-events-none [&_svg]:shrink-0',
      'pr-1.5 rounded-[4px] hover:bg-foreground/10 focus:bg-foreground/10 data-[state=open]:bg-foreground/10',
      '[&_svg]:size-auto [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:shrink-0',
      className,
    )}
    {...props}
  />
))
StyledDropdownMenuSubTrigger.displayName = 'StyledDropdownMenuSubTrigger'

interface StyledDropdownMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> {
  minWidth?: string
}

export const StyledDropdownMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  StyledDropdownMenuSubContentProps
>(({ className, minWidth = 'min-w-36', sideOffset = -4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'popover-styled w-fit font-sans whitespace-nowrap text-xs flex flex-col gap-0.5 z-dropdown overflow-hidden p-1',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        minWidth,
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
StyledDropdownMenuSubContent.displayName = 'StyledDropdownMenuSubContent'
