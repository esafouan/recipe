import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Dynamic ads.txt route that redirects to Ezoic's managed ads.txt
 * This ensures your ads.txt is always up-to-date with the latest ad partners
 * 
 * Why redirect instead of proxy?
 * - Always serves the latest version from Ezoic
 * - No caching issues
 * - Follows Ezoic's best practices
 */
export async function GET(request: NextRequest) {
  return NextResponse.redirect(
    'https://srv.adstxtmanager.com/82922/cozybiteskitchen.com',
    307
  );
}

// Set caching headers for better performance
export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Revalidate every 24 hours
