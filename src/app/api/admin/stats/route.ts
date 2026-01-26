import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

// Admin emails that can access the dashboard
const ADMIN_EMAILS = [
  'asmitashrestha.as@gmail.com',
  // Add more admin emails as needed
];

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Forbidden - Admin access only' }, { status: 403 });
    }

    // Get date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch all stats in parallel
    const [
      usersResult,
      invoicesResult,
      premiumUsersResult,
      remindersResult,
      visitsLast30Days,
      visitsLast7Days,
      visitsByReferrer,
      aiReferrers,
      topPages,
      recentSignups,
    ] = await Promise.all([
      // Total users
      supabaseAdmin.from('user_settings').select('id', { count: 'exact', head: true }),

      // Total invoices
      supabaseAdmin.from('invoices').select('id', { count: 'exact', head: true }),

      // Premium users
      supabaseAdmin.from('user_settings').select('id', { count: 'exact', head: true }).eq('is_premium', true),

      // Total reminders sent
      supabaseAdmin.from('reminder_history').select('id', { count: 'exact', head: true }),

      // Page visits last 30 days
      supabaseAdmin
        .from('page_visits')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString()),

      // Page visits last 7 days
      supabaseAdmin
        .from('page_visits')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString()),

      // Visits by referrer domain (top 10)
      supabaseAdmin
        .from('page_visits')
        .select('referrer_domain')
        .not('referrer_domain', 'is', null)
        .gte('created_at', thirtyDaysAgo.toISOString()),

      // AI tool referrers specifically
      supabaseAdmin
        .from('page_visits')
        .select('referrer_domain, referrer, created_at')
        .or('referrer_domain.ilike.%openai%,referrer_domain.ilike.%claude%,referrer_domain.ilike.%perplexity%,referrer_domain.ilike.%bing%,referrer_domain.ilike.%copilot%,referrer_domain.ilike.%gemini%,referrer_domain.ilike.%bard%')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(50),

      // Top pages visited
      supabaseAdmin
        .from('page_visits')
        .select('page_path')
        .gte('created_at', thirtyDaysAgo.toISOString()),

      // Recent signups (last 10)
      supabaseAdmin
        .from('user_settings')
        .select('created_at, default_from_email')
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    // Process referrer data
    const referrerCounts: Record<string, number> = {};
    if (visitsByReferrer.data) {
      for (const visit of visitsByReferrer.data) {
        const domain = visit.referrer_domain || 'Direct';
        referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
      }
    }
    const topReferrers = Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([domain, count]) => ({ domain, count }));

    // Process page data
    const pageCounts: Record<string, number> = {};
    if (topPages.data) {
      for (const visit of topPages.data) {
        const path = visit.page_path || '/';
        pageCounts[path] = (pageCounts[path] || 0) + 1;
      }
    }
    const topPagesFormatted = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    // Count AI referrers by type
    const aiReferrerCounts: Record<string, number> = {};
    if (aiReferrers.data) {
      for (const visit of aiReferrers.data) {
        const domain = visit.referrer_domain || 'Unknown AI';
        aiReferrerCounts[domain] = (aiReferrerCounts[domain] || 0) + 1;
      }
    }

    return NextResponse.json({
      appStats: {
        totalUsers: usersResult.count || 0,
        totalInvoices: invoicesResult.count || 0,
        premiumUsers: premiumUsersResult.count || 0,
        totalReminders: remindersResult.count || 0,
      },
      trafficStats: {
        visitsLast30Days: visitsLast30Days.count || 0,
        visitsLast7Days: visitsLast7Days.count || 0,
        topReferrers,
        topPages: topPagesFormatted,
      },
      aiCitations: {
        totalFromAI: aiReferrers.data?.length || 0,
        bySource: aiReferrerCounts,
        recentVisits: aiReferrers.data?.slice(0, 10) || [],
      },
      recentSignups: recentSignups.data?.map(u => ({
        email: u.default_from_email ? `${u.default_from_email.substring(0, 3)}***` : 'Unknown',
        date: u.created_at,
      })) || [],
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
