/**
 * [INPUT]: ./types (IconProps)
 * [OUTPUT]: HomeIcon
 * [POS]: primitives/icons/ — 16px home SVG icon
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */
import type { IconProps } from './types'

export function HomeIcon({ size = 16, ...props }: IconProps) {
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
        d="M2.5 6.5L8 2L13.5 6.5V13C13.5 13.2761 13.2761 13.5 13 13.5H3C2.72386 13.5 2.5 13.2761 2.5 13V6.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 13.5V9H10V13.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
