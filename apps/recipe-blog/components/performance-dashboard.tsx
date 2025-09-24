"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PerformanceMetrics {
  lcp: number
  fid: number
  cls: number
  fcp: number
  ttfb: number
  loadTime: number
  bundleSize: number
  imageOptimization: number
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development or with query parameter
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      new URLSearchParams(window.location.search).has('perf')
    setIsVisible(shouldShow)

    if (!shouldShow) return

    // Collect performance metrics
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart
      const ttfb = navigation.responseStart - navigation.requestStart

      // Mock Web Vitals (in production, these would come from real measurements)
      const mockMetrics: PerformanceMetrics = {
        lcp: 2.1, // Good < 2.5s
        fid: 45,  // Good < 100ms
        cls: 0.08, // Good < 0.1
        fcp: fcp / 1000,
        ttfb: ttfb,
        loadTime: loadTime,
        bundleSize: 245, // KB
        imageOptimization: 85 // percentage
      }

      setMetrics(mockMetrics)
    }

    // Collect metrics after page load
    if (document.readyState === 'complete') {
      setTimeout(collectMetrics, 1000)
    } else {
      window.addEventListener('load', () => setTimeout(collectMetrics, 1000))
    }
  }, [])

  if (!isVisible || !metrics) return null

  const getScoreColor = (metric: string, value: number) => {
    const thresholds: Record<string, { good: number; needs: number }> = {
      lcp: { good: 2.5, needs: 4.0 },
      fid: { good: 100, needs: 300 },
      cls: { good: 0.1, needs: 0.25 },
      fcp: { good: 1.8, needs: 3.0 },
      ttfb: { good: 800, needs: 1800 }
    }

    const threshold = thresholds[metric]
    if (!threshold) return 'default'

    if (value <= threshold.good) return 'default' // green
    if (value <= threshold.needs) return 'secondary' // yellow
    return 'destructive' // red
  }

  const chartData = [
    { name: 'LCP', value: metrics.lcp, target: 2.5 },
    { name: 'FID', value: metrics.fid, target: 100 },
    { name: 'CLS', value: metrics.cls * 100, target: 10 },
    { name: 'FCP', value: metrics.fcp, target: 1.8 },
    { name: 'TTFB', value: metrics.ttfb, target: 800 },
  ]

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[600px] overflow-y-auto bg-background border rounded-lg shadow-xl z-50">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Performance Monitor</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsVisible(false)}
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Core Web Vitals */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Core Web Vitals</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <Badge variant={getScoreColor('lcp', metrics.lcp)} className="w-full">
                  LCP: {metrics.lcp.toFixed(1)}s
                </Badge>
              </div>
              <div className="text-center">
                <Badge variant={getScoreColor('fid', metrics.fid)} className="w-full">
                  FID: {metrics.fid}ms
                </Badge>
              </div>
              <div className="text-center">
                <Badge variant={getScoreColor('cls', metrics.cls)} className="w-full">
                  CLS: {metrics.cls.toFixed(3)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Other Metrics */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Other Metrics</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>FCP: {metrics.fcp.toFixed(1)}s</div>
              <div>TTFB: {metrics.ttfb.toFixed(0)}ms</div>
              <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
              <div>Bundle: {metrics.bundleSize}KB</div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
                <Bar dataKey="target" fill="#94a3b8" opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Recommendations</h4>
            <div className="text-xs space-y-1">
              {metrics.lcp > 2.5 && (
                <div className="text-orange-600">• Optimize LCP by reducing image sizes</div>
              )}
              {metrics.fid > 100 && (
                <div className="text-orange-600">• Reduce JavaScript execution time</div>
              )}
              {metrics.cls > 0.1 && (
                <div className="text-orange-600">• Fix layout shifts with proper image dimensions</div>
              )}
              {metrics.bundleSize > 200 && (
                <div className="text-orange-600">• Consider code splitting to reduce bundle size</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
