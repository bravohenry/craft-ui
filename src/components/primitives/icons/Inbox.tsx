/**
 * [INPUT]: ./types (IconProps)
 * [OUTPUT]: InboxIcon
 * [POS]: primitives/icons/ — 16px inbox SVG icon
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */
import type { IconProps } from './types'

export function InboxIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M14.5 9H10.5L9.5 11H6.5L5.5 9H1.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.63 4.36L1.5 9V12.5C1.5 13.0523 1.94772 13.5 2.5 13.5H13.5C14.0523 13.5 14.5 13.0523 14.5 12.5V9L12.37 4.36C12.2144 4.0169 11.8717 3.79688 11.495 3.8H4.505C4.12828 3.79688 3.78558 4.0169 3.63 4.36Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
