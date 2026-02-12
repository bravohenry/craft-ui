/**
 * [INPUT]: ./types (IconProps)
 * [OUTPUT]: FolderIcon
 * [POS]: primitives/icons/ — 16px folder SVG icon
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */
import type { IconProps } from './types'

export function FolderIcon({ size = 16, ...props }: IconProps) {
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
        d="M1.5 3.5C1.5 2.94772 1.94772 2.5 2.5 2.5H6.29289C6.4255 2.5 6.55268 2.55268 6.64645 2.64645L7.85355 3.85355C7.94732 3.94732 8.0745 4 8.20711 4H13.5C14.0523 4 14.5 4.44772 14.5 5V12.5C14.5 13.0523 14.0523 13.5 13.5 13.5H2.5C1.94772 13.5 1.5 13.0523 1.5 12.5V3.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
