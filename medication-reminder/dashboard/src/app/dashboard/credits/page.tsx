'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCreditBalance, fetchCreditUsage, fetchCreditPurchases } from '@/lib/queries';
import { cn, formatDate, formatTime } from '@/lib/utils';
import { Coins, Package, Mail } from 'lucide-react';

const CREDIT_PACKS = [
  { label: '60 minutes', minutes: 60, priceCents: 1200, perMinute: '$0.20' },
  { label: '150 minutes', minutes: 150, priceCents: 2500, perMinute: '$0.17', popular: true },
  { label: '500 minutes', minutes: 500, priceCents: 7000, perMinute: '$0.14' },
];

export default function CreditsPage() {
  const { data: balance, isLoading: loadingBalance } = useQuery({
    queryKey: ['credit-balance'],
    queryFn: fetchCreditBalance,
  });

  const { data: usage, isLoading: loadingUsage } = useQuery({
    queryKey: ['credit-usage'],
    queryFn: () => fetchCreditUsage(),
  });

  const { data: purchases, isLoading: loadingPurchases } = useQuery({
    queryKey: ['credit-purchases'],
    queryFn: fetchCreditPurchases,
  });

  const balanceMinutes = Number(balance?.balance_minutes ?? 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Companionship Credits</h1>
        <p className="text-muted-foreground mt-1">
          Manage credits for extended companionship calls
        </p>
      </div>

      {/* Balance display */}
      <div className="rounded-2xl shadow-soft bg-white dark:bg-card p-8 text-center">
        <Coins className={cn(
          'w-12 h-12 mx-auto mb-4',
          balanceMinutes > 30
            ? 'text-emerald-500'
            : balanceMinutes > 10
              ? 'text-amber-500'
              : 'text-rose-500'
        )} />
        {loadingBalance ? (
          <div className="h-12 w-32 mx-auto rounded-xl animate-pulse bg-muted/60" />
        ) : (
          <>
            <p className={cn(
              'text-5xl font-bold',
              balanceMinutes > 30
                ? 'text-emerald-600 dark:text-emerald-400'
                : balanceMinutes > 10
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
            )}>
              {Math.floor(balanceMinutes)}
            </p>
            <p className="text-muted-foreground mt-1">minutes remaining</p>
          </>
        )}
      </div>

      {/* Credit packs */}
      <div>
        <h2 className="font-semibold mb-4">Purchase Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.minutes}
              className={cn(
                'rounded-2xl p-6 border-2 relative',
                pack.popular
                  ? 'border-primary bg-primary/5 shadow-soft-lg'
                  : 'border-border bg-white dark:bg-card shadow-soft'
              )}
            >
              {pack.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium text-white bg-primary px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="flex items-center gap-3 mb-3">
                <Package className={cn(
                  'w-8 h-8',
                  pack.popular ? 'text-primary' : 'text-muted-foreground'
                )} />
                <div>
                  <p className="font-semibold text-lg">{pack.label}</p>
                  <p className="text-sm text-muted-foreground">{pack.perMinute}/min</p>
                </div>
              </div>
              <p className="text-2xl font-bold mb-4">${(pack.priceCents / 100).toFixed(0)}</p>
              <a
                href={`mailto:support@medreminder.com?subject=Credit%20Purchase%20Request&body=I'd%20like%20to%20purchase%20the%20${encodeURIComponent(pack.label)}%20credit%20pack%20($${(pack.priceCents / 100).toFixed(0)}).`}
                className={cn(
                  'flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-colors',
                  pack.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                )}
              >
                <Mail className="w-4 h-4" />
                Request Purchase
              </a>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Stripe integration coming soon. For now, contact us to purchase credits.
        </p>
      </div>

      {/* Usage history */}
      <div>
        <h2 className="font-semibold mb-4">Usage History</h2>
        {loadingUsage ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl animate-pulse bg-muted/60" />
            ))}
          </div>
        ) : usage && usage.length > 0 ? (
          <div className="rounded-2xl shadow-soft bg-white dark:bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patient</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Duration</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Billable</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Credits Used</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Balance After</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.map((row: any) => (
                    <tr key={row.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 px-4 text-muted-foreground">
                        {formatDate(row.created_at)} {formatTime(row.created_at)}
                      </td>
                      <td className="py-3 px-4">{row.patients?.name || 'Unknown'}</td>
                      <td className="py-3 px-4 text-right">{formatCallDuration(row.total_duration_seconds)}</td>
                      <td className="py-3 px-4 text-right">{formatCallDuration(row.billable_seconds)}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {Number(row.minutes_deducted) > 0 ? `-${Number(row.minutes_deducted)}` : '0'}
                      </td>
                      <td className="py-3 px-4 text-right">{Math.floor(Number(row.balance_after))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl shadow-soft bg-white dark:bg-card p-8 text-center">
            <Coins className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No usage recorded yet</p>
          </div>
        )}
      </div>

      {/* Purchase history */}
      <div>
        <h2 className="font-semibold mb-4">Purchase History</h2>
        {loadingPurchases ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl animate-pulse bg-muted/60" />
            ))}
          </div>
        ) : purchases && purchases.length > 0 ? (
          <div className="rounded-2xl shadow-soft bg-white dark:bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Pack</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Minutes</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((row: any) => (
                    <tr key={row.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 px-4 text-muted-foreground">{formatDate(row.created_at)}</td>
                      <td className="py-3 px-4">{row.pack_label}</td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        +{Number(row.minutes_purchased)}
                      </td>
                      <td className="py-3 px-4 text-right">${(row.price_cents / 100).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl shadow-soft bg-white dark:bg-card p-8 text-center">
            <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No purchases yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function formatCallDuration(seconds: number): string {
  if (!seconds || seconds === 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
