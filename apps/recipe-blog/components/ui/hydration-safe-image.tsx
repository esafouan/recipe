"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

interface HydrationSafeImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
}

export function HydrationSafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className = ""
}: HydrationSafeImageProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // During SSR and initial hydration, render without the problematic props
  if (!isClient) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        suppressHydrationWarning={true}
      />
    )
  }

  // After hydration, render with full props
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  )
}
