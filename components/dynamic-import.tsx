"use client"

import type React from "react"

import { Suspense, lazy, type ComponentType } from "react"

interface DynamicImportProps {
  component: () => Promise<{ default: ComponentType<any> }>
  fallback?: React.ReactNode
  props?: Record<string, any>
}

export function DynamicImport({ component, fallback, props = {} }: DynamicImportProps) {
  const LazyComponent = lazy(component)

  return (
    <Suspense fallback={fallback || <div className="animate-pulse h-32 bg-stone-100 rounded"></div>}>
      <LazyComponent {...props} />
    </Suspense>
  )
}
