import { Inter, Playfair_Display } from 'next/font/google'

// Optimized font loading configuration
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  preload: false, // Secondary font - don't preload
  fallback: ['serif', 'Times New Roman'],
})

// Font optimization utilities
export const fontVariables = `${inter.variable} ${playfair.variable}`

export const criticalFontCSS = `
  /* Critical font styles - inline for performance */
  .font-inter { font-family: var(--font-inter), system-ui, arial; }
  .font-playfair { font-family: var(--font-playfair), serif, "Times New Roman"; }
  
  /* Font display optimization */
  @font-face {
    font-family: 'InterFallback';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Arial'), local('Helvetica');
  }
`
