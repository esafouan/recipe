"use client"

import { useEffect } from 'react'

export function PreloadOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadResources = [
      '/beautiful-food-photography-colorful-ingredients-co.jpg',
      '/placeholder.svg',
    ]

    preloadResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = resource
      document.head.appendChild(link)
    })

    // Prefetch navigation routes
    const routes = ['/recipes', '/about', '/contact']
    
    routes.forEach(route => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = route
      document.head.appendChild(link)
    })

    // Add intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              imageObserver.unobserve(img)
            }
          }
        })
      })

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
    }

    // Service worker registration for caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(error => {
        console.log('SW registration failed: ', error)
      })
    }
  }, [])

  return null
}
