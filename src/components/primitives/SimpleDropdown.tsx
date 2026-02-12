/**
 * [INPUT]: react, react-dom, @/utils/cn
 * [OUTPUT]: SimpleDropdown, SimpleDropdownItem
 * [POS]: primitives/ — lightweight portal-based dropdown without Radix dependency
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */
import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { cn } from '@/utils/cn'

export interface SimpleDropdownItemProps {
  onClick: (e?: React.MouseEvent) => void
  children: React.ReactNode
  icon?: React.ReactNode
  variant?: 'default' | 'destructive'
  className?: string
}

export function SimpleDropdownItem({
  onClick,
  children,
  icon,
  variant = 'default',
  className,
}: SimpleDropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 w-full px-2.5 py-1.5 text-left text-[13px] rounded-[4px]",
        "hover:bg-foreground/[0.05] focus:bg-foreground/[0.05] focus:outline-none",
        "transition-colors",
        variant === 'destructive' && "text-destructive hover:text-destructive",
        className
      )}
    >
      {icon && (
        <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
    </button>
  )
}

export interface SimpleDropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'end'
  className?: string
  disabled?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SimpleDropdown({
  trigger,
  children,
  align = 'end',
  className,
  disabled = false,
  onOpenChange,
}: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const setIsOpenWithCallback = useCallback((open: boolean | ((prev: boolean) => boolean)) => {
    setIsOpen(prev => {
      const newValue = typeof open === 'function' ? open(prev) : open
      if (newValue !== prev) {
        onOpenChange?.(newValue)
      }
      return newValue
    })
  }, [onOpenChange])
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const menuWidth = 160

    let left = align === 'end' ? rect.right - menuWidth : rect.left
    const top = rect.bottom + 4

    if (left < 8) left = 8
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8
    }

    setPosition({ top, left })
  }, [align])

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled) return

    if (!isOpen) {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        const menuWidth = 160
        let left = align === 'end' ? rect.right - menuWidth : rect.left
        const top = rect.bottom + 4
        if (left < 8) left = 8
        if (left + menuWidth > window.innerWidth - 8) {
          left = window.innerWidth - menuWidth - 8
        }
        setPosition({ top, left })
      }
    }
    setIsOpenWithCallback(prev => !prev)
  }, [disabled, isOpen, align, setIsOpenWithCallback])

  const handleClose = useCallback(() => {
    setIsOpenWithCallback(false)
  }, [setIsOpenWithCallback])

  useEffect(() => {
    if (isOpen) {
      updatePosition()
    }
  }, [isOpen, updatePosition])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        handleClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleClose])

  const wrappedChildren = React.Children.map(children, child => {
    if (React.isValidElement<SimpleDropdownItemProps>(child) && child.type === SimpleDropdownItem) {
      return React.cloneElement(child, {
        onClick: (e?: React.MouseEvent) => {
          e?.stopPropagation()
          child.props.onClick()
          handleClose()
        },
      } as Partial<SimpleDropdownItemProps>)
    }
    return child
  })

  return (
    <>
      <button
        ref={triggerRef as React.RefObject<HTMLButtonElement>}
        type="button"
        onClick={handleToggle}
        className={cn("inline-flex", disabled && "opacity-50 pointer-events-none")}
      >
        {trigger}
      </button>

      {isOpen && position && ReactDOM.createPortal(
        <div
          ref={menuRef}
          className={cn(
            "fixed z-50 min-w-[140px] p-1",
            "bg-background rounded-[8px] shadow-strong border border-border/50",
            "animate-in fade-in-0 zoom-in-95 duration-100",
            className
          )}
          style={{ top: position.top, left: position.left }}
        >
          {wrappedChildren}
        </div>,
        document.body
      )}
    </>
  )
}
