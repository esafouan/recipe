import { NextResponse } from 'next/server';

/**
 * Dynamic ads.txt route that redirects to Ezoic's managed ads.txt
 * This ensures your ads.txt is always up-to-date with the latest ad partners
 * 
 * Why redirect instead of proxy?
 * - Always serves the latest version from Ezoic
 * - No caching issues
 * - Follows Ezoic's best practices
 */
export async function GET() {
  const domain = process.env.NEXT_PUBLIC_BASE_URL?.replace(/https?:\/\//, '') || 'cozybiteskitchen.com';
  const ezoicAdsUrl = `https://srv.adstxtmanager.com/19390/${domain}`;
  
  // Redirect to Ezoic's managed ads.txt
  return NextResponse.redirect(ezoicAdsUrl, 301);
}

// Set caching headers for better performance
export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Revalidate every 24 hours
