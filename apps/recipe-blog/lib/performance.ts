// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTiming(label: string): void {
    this.metrics.set(`${label}_start`, performance.now())
  }

  endTiming(label: string): number {
    const start = this.metrics.get(`${label}_start`)
    if (start) {
      const duration = performance.now() - start
      this.metrics.set(label, duration)
      return duration
    }
    return 0
  }

  measureLCP(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
      }).observe({ entryTypes: ['largest-contentful-paint'] })
    }
  }

  measureCLS(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      let clsValue = 0
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        console.log('CLS:', clsValue)
      }).observe({ entryTypes: ['layout-shift'] })
    }
  }

  measureFID(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const fidEntry = entry as any
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime)
        }
      }).observe({ entryTypes: ['first-input'] })
    }
  }

  initializeWebVitals(): void {
    this.measureLCP()
    this.measureCLS()
    this.measureFID()
  }
}

// Preload critical resources
export function preloadCriticalResources(): void {
  if (typeof window !== 'undefined') {
    // Preload critical fonts
    const fontUrls = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ]

    fontUrls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = url
      document.head.appendChild(link)
    })

    // Preload critical images
    const criticalImages = [
      '/placeholder.svg',
      '/beautiful-food-photography-colorful-ingredients-co.jpg'
    ]

    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }
}

// Lazy load non-critical scripts
export function loadNonCriticalScripts(): void {
  if (typeof window !== 'undefined') {
    // Load analytics after page is interactive
    window.addEventListener('load', () => {
      setTimeout(() => {
        // Add your analytics scripts here
        console.log('Loading non-critical scripts...')
      }, 1000)
    })
  }
}

// Image loading optimization
export function optimizeImageLoading(): void {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]')
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src || ''
          img.classList.remove('lazy')
          observer.unobserve(img)
        }
      })
    })

    images.forEach(img => imageObserver.observe(img))
  }
}

// Bundle splitting helper
export function loadComponentAsync<T>(importFunction: () => Promise<T>): Promise<T> {
  return importFunction()
}
