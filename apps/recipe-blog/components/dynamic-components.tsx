"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

// Dynamic imports for non-critical components
export const DynamicCategoryGrid = dynamic(
  () => import('./category-grid').then(mod => ({ default: mod.CategoryGrid })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
)

export const DynamicSearchResults = dynamic(
  () => import('./search-results').then(mod => ({ default: mod.SearchResults })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
)

export const DynamicContactForm = dynamic(
  () => import('./contact-form').then(mod => ({ default: mod.ContactForm })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
)

// Wrapper components with Suspense
export const CategoryGridWithSuspense = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <DynamicCategoryGrid />
  </Suspense>
)

export const SearchResultsWithSuspense = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <DynamicSearchResults />
  </Suspense>
)

export const ContactFormWithSuspense = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <DynamicContactForm />
  </Suspense>
)
