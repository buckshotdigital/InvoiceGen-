import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use anon key for tracking (public inserts allowed)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function extractDomain(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pagePath, referrer } = body;

    const referrerDomain = extractDomain(referrer);
    const userAgent = request.headers.get('user-agent') || null;

    // Get country from Vercel headers (if available)
    const country = request.headers.get('x-vercel-ip-country') || null;

    await supabase.from('page_visits').insert({
      page_path: pagePath,
      referrer: referrer || null,
      referrer_domain: referrerDomain,
      user_agent: userAgent,
      country: country,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Silently fail - don't break the user experience for analytics
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
