'use client';

import { useEffect, useState } from 'react';

/**
 * HB Agency Ad Placements - Cozy Bites Kitchen
 * 
 * Active Placements from HB Agency Dashboard:
 * 1. cozybites_In Image (313355) - In Image Ad
 * 2. cozybites_In Page (313356) - In Article Ad
 * 3. cozybites_Interstitial (313354) - Interstitial Ad
 * 4. cozybites_Sticky InFooter 728x90 (313352) - Floor Ad (728x90)
 * 5. cozybites_Sticky LeftBanner 300x600 (313353) - Magic Left (300x600)
 * 6. cozybites_Sticky RightBanner 300x600 (313605) - Magic Right (300x600)
 * 7. cozybites_Outstream Video (313604) - Video Ad
 */

// ==========================================
// IN-CONTENT ADS (Server-safe)
// ==========================================

export function InImageAd() {
  return (
    <div className="my-6 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
      <div id="hbagency_space_313355" style={{ minHeight: '300px', minWidth: '100%' }} />
    </div>
  );
}

export function InPageAd() {
  return (
    <div className="my-6 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
      <div className="hb-ad-inpage">
        <div className="hb-ad-inner">
          <div className="hbagency_cls hbagency_space_313356" style={{ minHeight: '250px' }} />
        </div>
      </div>
    </div>
  );
}

export function InterstitialAd() {
  return (
    <div className="my-8 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
      <div id="hbagency_space_313354" style={{ minHeight: '600px', minWidth: '100%' }} />
    </div>
  );
}

// ==========================================
// STICKY ADS (Client-only to prevent hydration mismatch)
// ==========================================

function StickyFloorAdContent() {
  return (
    <div id="HB_Footer_Close_hbagency_space_313352" className="fixed bottom-0 left-0 right-0 z-40" suppressHydrationWarning>
      <div id="HB_CLOSE_hbagency_space_313352" />
      <div id="HB_OUTER_hbagency_space_313352" className="bg-white border-t border-gray-300 shadow-lg">
        <div id="hbagency_space_313352" style={{ minHeight: '90px' }} />
      </div>
    </div>
  );
}

export function StickyFloorAd() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <StickyFloorAdContent /> : null;
}

function StickyLeftBannerAdContent() {
  return (
    <div id="HB_Footer_Close_hbagency_space_313353" className="fixed left-2 top-1/2 transform -translate-y-1/2 z-30" suppressHydrationWarning>
      <div id="HB_CLOSE_hbagency_space_313353" />
      <div id="HB_OUTER_hbagency_space_313353" className="bg-white shadow-lg rounded">
        <div id="hbagency_space_313353" style={{ minHeight: '600px', minWidth: '300px' }} />
      </div>
    </div>
  );
}

export function StickyLeftBannerAd() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <StickyLeftBannerAdContent /> : null;
}

function StickyRightBannerAdContent() {
  return (
    <div id="HB_Footer_Close_hbagency_space_313605" className="fixed right-2 top-1/2 transform -translate-y-1/2 z-30" suppressHydrationWarning>
      <div id="HB_CLOSE_hbagency_space_313605" />
      <div id="HB_OUTER_hbagency_space_313605" className="bg-white shadow-lg rounded">
        <div id="hbagency_space_313605" style={{ minHeight: '600px', minWidth: '300px' }} />
      </div>
    </div>
  );
}

export function StickyRightBannerAd() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <StickyRightBannerAdContent /> : null;
}

// ==========================================
// OUTSTREAM VIDEO
// ==========================================

export function OutstreamAd() {
  return (
    <div className="my-6 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
      <div id="hbagency_space_313604_video">
        <div id="hbagency_space_313604" style={{ minHeight: '300px', minWidth: '100%' }} />
      </div>
    </div>
  );
}


/**
 * Complete Ad Setup Component
 * Use this to add all recommended ad placements to your page layout
 */
export function HBAdsSetup() {
  return (
    <>
      <StickyFloorAd />
      <StickyLeftBannerAd />
      <StickyRightBannerAd />
    </>
  );
}
