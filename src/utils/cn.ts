/**
 * [INPUT]: Depends on clsx, tailwind-merge
 * [OUTPUT]: cn() — Tailwind-aware class name merger
 * [POS]: utils/ — foundational utility, consumed by every component
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
