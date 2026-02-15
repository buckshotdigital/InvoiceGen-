'use client';

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Legend,
} from 'recharts';
import { EmptyState } from '@/components/empty-state';
import { BarChart3 } from 'lucide-react';

interface WeeklyData {
  patient_name: string;
  week_start: string;
  adherence_percentage: number;
  taken_count: number;
  missed_count: number;
  total_calls: number;
}

export function AdherenceChart({ data }: { data: WeeklyData[] }) {
  const weeklyMap = new Map<string, { weekDate: string; week: string; adherence: number; taken: number; missed: number; count: number }>();

  data.forEach((d) => {
    const weekDate = d.week_start;
    const week = new Date(d.week_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = weeklyMap.get(weekDate);
    if (existing) {
      existing.adherence += d.adherence_percentage;
      existing.taken += d.taken_count;
      existing.missed += d.missed_count;
      existing.count += 1;
    } else {
      weeklyMap.set(weekDate, {
        weekDate,
        week,
        adherence: d.adherence_percentage,
        taken: d.taken_count,
        missed: d.missed_count,
        count: 1,
      });
    }
  });

  // Sort chronologically by actual date, not formatted string
  const chartData = Array.from(weeklyMap.values())
    .sort((a, b) => new Date(a.weekDate).getTime() - new Date(b.weekDate).getTime())
    .map((d) => ({
      week: d.week,
      adherence: Math.round(d.adherence / d.count),
      taken: d.taken,
      missed: d.missed,
    }));

  if (chartData.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No adherence data yet"
        description="Data will appear after calls are made"
      />
    );
  }

  // Calculate max count for left Y-axis domain
  const maxCount = Math.max(...chartData.map(d => Math.max(d.taken, d.missed)), 1);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f0f0f0"
          strokeOpacity={0.8}
        />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={{ stroke: '#f0f0f0' }}
        />
        <YAxis
          yAxisId="left"
          domain={[0, Math.ceil(maxCount * 1.2)]}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={{ stroke: '#f0f0f0' }}
          label={{ value: 'Calls', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' } }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={{ stroke: '#f0f0f0' }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: 'none',
            borderRadius: '0.75rem',
            boxShadow: 'var(--shadow-soft-lg)',
            color: 'hsl(var(--card-foreground))',
          }}
          labelStyle={{ color: 'hsl(var(--card-foreground))' }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
        />
        <Bar
          yAxisId="left"
          dataKey="taken"
          name="Taken"
          fill="hsl(var(--chart-taken))"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          yAxisId="left"
          dataKey="missed"
          name="Missed"
          fill="hsl(var(--chart-missed))"
          radius={[4, 4, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="adherence"
          name="Adherence %"
          stroke="hsl(var(--chart-line))"
          strokeWidth={2}
          dot={{ r: 4, fill: 'hsl(var(--chart-line))' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
