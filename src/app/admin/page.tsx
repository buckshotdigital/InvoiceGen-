'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  appStats: {
    totalUsers: number;
    totalInvoices: number;
    premiumUsers: number;
    totalReminders: number;
  };
  trafficStats: {
    visitsLast30Days: number;
    visitsLast7Days: number;
    topReferrers: { domain: string; count: number }[];
    topPages: { path: string; count: number }[];
  };
  aiCitations: {
    totalFromAI: number;
    bySource: Record<string, number>;
    recentVisits: { referrer_domain: string; referrer: string; created_at: string }[];
  };
  recentSignups: { email: string; date: string }[];
}

const ADMIN_EMAILS = ['info@bdsalesinc.ca'];

export default function AdminDashboard() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !isAdmin) {
      router.push('/');
      return;
    }

    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user, session, authLoading, isAdmin, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg">
          <h2 className="font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">InvoiceGen Analytics</p>
          </div>
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Back to App
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* App Stats */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">App Usage</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Users" value={stats?.appStats.totalUsers || 0} color="blue" />
            <StatCard title="Total Invoices" value={stats?.appStats.totalInvoices || 0} color="green" />
            <StatCard title="Premium Users" value={stats?.appStats.premiumUsers || 0} color="purple" />
            <StatCard title="Reminders Sent" value={stats?.appStats.totalReminders || 0} color="orange" />
          </div>
        </section>

        {/* Traffic Stats */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <StatCard title="Visits (Last 7 Days)" value={stats?.trafficStats.visitsLast7Days || 0} color="blue" />
            <StatCard title="Visits (Last 30 Days)" value={stats?.trafficStats.visitsLast30Days || 0} color="blue" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Top Referrers */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-3">Top Referrers (30 days)</h3>
              {stats?.trafficStats.topReferrers.length ? (
                <ul className="space-y-2">
                  {stats.trafficStats.topReferrers.map((ref, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate">{ref.domain}</span>
                      <span className="font-medium text-gray-900 ml-2">{ref.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No referrer data yet</p>
              )}
            </div>

            {/* Top Pages */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-3">Top Pages (30 days)</h3>
              {stats?.trafficStats.topPages.length ? (
                <ul className="space-y-2">
                  {stats.trafficStats.topPages.map((page, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate">{page.path}</span>
                      <span className="font-medium text-gray-900 ml-2">{page.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No page data yet</p>
              )}
            </div>
          </div>
        </section>

        {/* AI Citations */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Tool Citations</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="mb-4">
              <StatCard
                title="Visits from AI Tools (30 days)"
                value={stats?.aiCitations.totalFromAI || 0}
                color="purple"
                inline
              />
            </div>

            {stats?.aiCitations.totalFromAI ? (
              <>
                <h4 className="font-medium text-gray-700 text-sm mb-2">By Source:</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(stats.aiCitations.bySource).map(([source, count]) => (
                    <span
                      key={source}
                      className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                    >
                      {source}: {count}
                    </span>
                  ))}
                </div>

                <h4 className="font-medium text-gray-700 text-sm mb-2">Recent AI Visits:</h4>
                <ul className="space-y-1 text-sm">
                  {stats.aiCitations.recentVisits.map((visit, i) => (
                    <li key={i} className="text-gray-600">
                      <span className="font-medium">{visit.referrer_domain}</span>
                      {' - '}
                      <span className="text-gray-400">
                        {new Date(visit.created_at).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                No AI tool referrals detected yet. This tracks visits from ChatGPT, Claude, Perplexity, Bing Chat, and other AI tools.
              </p>
            )}
          </div>
        </section>

        {/* Recent Signups */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Signups</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {stats?.recentSignups.length ? (
              <ul className="space-y-2">
                {stats.recentSignups.map((signup, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{signup.email}</span>
                    <span className="text-gray-400">
                      {new Date(signup.date).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No signups yet</p>
            )}
          </div>
        </section>

        {/* Note */}
        <p className="text-center text-sm text-gray-400 mt-8">
          Stats refresh on page load. Referrer tracking requires the PageTracker component.
        </p>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
  inline = false,
}: {
  title: string;
  value: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
  inline?: boolean;
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  };

  if (inline) {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${colors[color]}`}>
        <span className="font-medium">{title}:</span>
        <span className="text-2xl font-bold">{value.toLocaleString()}</span>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-4 ${colors[color]}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}
