/**
 * Ezoic Ad Placement Component
 * 
 * This component renders Ezoic ad placeholders and calls the showAds() function.
 * 
 * Usage:
 * <EzoicAd placementId={101} />
 * 
 * For multiple ads on the same page, use separate components:
 * <EzoicAd placementId={101} />
 * <EzoicAd placementId={102} />
 * 
 * The showAds() call is optimized to batch all placements on page load.
 * 
 * @see https://support.ezoic.com/kb/article/how-do-i-integrate-ezoic-using-javascript
 */

'use client';

import { useEffect, useRef } from 'react';

interface EzoicAdProps {
  placementId: number;
  className?: string;
}

// Track which placements have been registered on the current page
const registeredPlacements = new Set<number>();
let showAdsTimeout: NodeJS.Timeout | null = null;

export function EzoicAd({ placementId, className = '' }: EzoicAdProps) {
  const hasRendered = useRef(false);

  useEffect(() => {
    // Only run on client side and when Ezoic is enabled
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_EZOIC_ENABLED) {
      return;
    }

    // Prevent duplicate registrations
    if (hasRendered.current || registeredPlacements.has(placementId)) {
      return;
    }

    hasRendered.current = true;
    registeredPlacements.add(placementId);

    // Wait for ezstandalone to be available
    const checkEzoic = () => {
      if (typeof window !== 'undefined' && (window as any).ezstandalone) {
        // Clear any existing timeout
        if (showAdsTimeout) {
          clearTimeout(showAdsTimeout);
        }

        // Batch all showAds calls to run together after a short delay
        // This reduces server requests and improves performance
        showAdsTimeout = setTimeout(() => {
          const placements = Array.from(registeredPlacements);
          console.log('[Ezoic] Loading ads for placements:', placements);
          
          (window as any).ezstandalone.cmd.push(function () {
            (window as any).ezstandalone.showAds(...placements);
          });
        }, 100);
      } else {
        // Retry after 100ms if ezstandalone isn't ready yet
        setTimeout(checkEzoic, 100);
      }
    };

    checkEzoic();

    // Cleanup function
    return () => {
      registeredPlacements.delete(placementId);
      if (registeredPlacements.size === 0 && showAdsTimeout) {
        clearTimeout(showAdsTimeout);
        showAdsTimeout = null;
      }
    };
  }, [placementId]);

  // Don't render anything if Ezoic is disabled
  if (process.env.NEXT_PUBLIC_EZOIC_ENABLED !== 'true') {
    return null;
  }

  return (
    <div 
      id={`ezoic-pub-ad-placeholder-${placementId}`}
      className={className}
      data-ezoic-placement={placementId}
    />
  );
}

/**
 * Pre-defined ad placement components for common locations
 */

export function EzoicAdHeader() {
  return <EzoicAd placementId={101} className="my-4" />;
}

export function EzoicAdSidebar() {
  return <EzoicAd placementId={102} className="my-4" />;
}

export function EzoicAdInContent() {
  return <EzoicAd placementId={103} className="my-6" />;
}

export function EzoicAdFooter() {
  return <EzoicAd placementId={104} className="my-4" />;
}

export function EzoicAdRecipeCard() {
  return <EzoicAd placementId={105} className="my-4" />;
}

export function EzoicAdBetweenRecipes() {
  return <EzoicAd placementId={106} className="my-8" />;
}
