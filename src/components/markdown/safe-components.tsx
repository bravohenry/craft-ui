/**
 * [INPUT]: react, react-markdown (Components type)
 * [OUTPUT]: UnknownTag, isValidTagName, wrapWithSafeProxy
 * [POS]: markdown/ — safe fallback for invalid HTML-like tags in react-markdown
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import React from 'react'
import type { Components } from 'react-markdown'

export const UnknownTag: React.FC<{ tagName: string; children?: React.ReactNode }> = ({
  tagName,
  children,
}) => (
  <span className="text-muted-foreground">
    {`<${tagName}>`}
    {children}
    {`</${tagName}>`}
  </span>
)

const VALID_HTML_TAG = /^[a-z][a-z0-9]*$/
const VALID_COMPONENT_NAME = /^[A-Z][a-zA-Z0-9_]*$/

export function isValidTagName(tagName: string): boolean {
  return VALID_HTML_TAG.test(tagName) || VALID_COMPONENT_NAME.test(tagName)
}

function shouldUseFallback(prop: string | symbol, target: object): boolean {
  if (typeof prop === 'symbol') return false
  if (prop in target) return false
  return !isValidTagName(prop)
}

const INVALID_TAG_DESCRIPTOR: PropertyDescriptor = {
  configurable: true,
  enumerable: true,
  value: undefined,
  writable: true,
}

export function wrapWithSafeProxy(components: Partial<Components>): Partial<Components> {
  return new Proxy(components, {
    get(target, prop) {
      if (typeof prop === 'symbol') return Reflect.get(target, prop)
      if (prop in target) return target[prop as keyof typeof target]
      if (!shouldUseFallback(prop, target)) return undefined

      return ({ children }: { children?: React.ReactNode }) => (
        <UnknownTag tagName={prop}>{children}</UnknownTag>
      )
    },

    has(target, prop) {
      if (typeof prop === 'symbol') return Reflect.has(target, prop)
      return prop in target || shouldUseFallback(prop, target)
    },

    getOwnPropertyDescriptor(target, prop) {
      if (typeof prop === 'symbol') return Reflect.getOwnPropertyDescriptor(target, prop)

      const descriptor = Reflect.getOwnPropertyDescriptor(target, prop)
      if (descriptor) return descriptor

      return shouldUseFallback(prop, target) ? INVALID_TAG_DESCRIPTOR : undefined
    },
  })
}
