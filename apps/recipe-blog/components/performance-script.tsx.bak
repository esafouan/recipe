"use client"

import { useEffect } from 'react'
import { PerformanceMonitor, preloadCriticalResources, loadNonCriticalScripts } from '@/lib/performance'

export function PerformanceScript() {
  useEffect(() => {
    // Initialize performance monitoring
    const monitor = PerformanceMonitor.getInstance()
    monitor.initializeWebVitals()
    
    // Preload critical resources
    preloadCriticalResources()
    
    // Load non-critical scripts after page load
    loadNonCriticalScripts()
    
    // Report Web Vitals to analytics (if needed)
    if (typeof window !== 'undefined') {
      // You can add custom analytics reporting here
      console.log('Performance monitoring initialized')
    }
  }, [])

  return null // This component doesn't render anything visible
}

// Web Vitals reporting component
export function WebVitalsReporter() {
  useEffect(() => {
    // Import web-vitals dynamically to reduce bundle size
    import('web-vitals').then((webVitals) => {
      if (webVitals.onCLS) webVitals.onCLS(console.log)
      if (webVitals.onFID) webVitals.onFID(console.log)
      if (webVitals.onFCP) webVitals.onFCP(console.log)
      if (webVitals.onLCP) webVitals.onLCP(console.log)
      if (webVitals.onTTFB) webVitals.onTTFB(console.log)
    }).catch(() => {
      // Fallback if web-vitals is not available
      console.log('Web Vitals not available')
    })
  }, [])

  return null
}
