import { supabase } from './supabase';
import { fetchLogsInRange } from './logs';
import type { LogRow } from '../types/database';

export type Period = 'week' | 'month' | 'year';

export interface PeriodRange {
  start: string; // YYYY-MM-DD, inclusive
  end: string; // YYYY-MM-DD, inclusive -- clamped to today for the current period
  label: string;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
}

export interface PeriodStats {
  total: number;
  wins: number;
  losses: number;
  neutrals: number;
  winPct: number;
  lossPct: number;
  neutralPct: number;
  winLossRatio: number | null; // null when there are no losses to divide by
  topCategories: CategoryCount[];
  heatmap: HeatmapDay[];
}

export interface Streaks {
  current: number;
  longest: number;
}

export const EMPTY_STATS: PeriodStats = {
  total: 0,
  wins: 0,
  losses: 0,
  neutrals: 0,
  winPct: 0,
  lossPct: 0,
  neutralPct: 0,
  winLossRatio: null,
  topCategories: [],
  heatmap: [],
};

// Builds a YYYY-MM-DD string from a Date's local calendar fields. Deliberately
// not toISOString().slice(0, 10) -- that converts to UTC first, which shifts
// the date by one for any local-midnight Date in a positive UTC-offset
// timezone (most of Africa, Europe, Asia, Australia).
export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = (day === 0 ? -6 : 1) - day; // shift back to Monday
  d.setDate(d.getDate() + diff);
  return d;
}

const WEEK_LABEL_FORMAT: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

/** Computes the [start, end] window for a period, `offset` periods back from now (0 = current). */
export function getPeriodRange(period: Period, offset: number, today: Date = new Date()): PeriodRange {
  const todayStr = toDateString(today);

  if (period === 'week') {
    const monday = startOfWeek(today);
    monday.setDate(monday.getDate() + offset * 7);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    const start = toDateString(monday);
    const end = offset === 0 ? todayStr : toDateString(sunday);
    return {
      start,
      end,
      label: `${monday.toLocaleDateString('en-US', WEEK_LABEL_FORMAT)} - ${sunday.toLocaleDateString('en-US', WEEK_LABEL_FORMAT)}`,
    };
  }

  if (period === 'month') {
    const base = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const lastDay = new Date(base.getFullYear(), base.getMonth() + 1, 0);
    const start = toDateString(base);
    const end = offset === 0 ? todayStr : toDateString(lastDay);
    return { start, end, label: base.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) };
  }

  const year = today.getFullYear() + offset;
  const start = `${year}-01-01`;
  const end = offset === 0 ? todayStr : `${year}-12-31`;
  return { start, end, label: String(year) };
}

function pct(n: number, total: number): number {
  return total === 0 ? 0 : Math.round((n / total) * 100);
}

function buildStats(total: number, wins: number, losses: number, neutrals: number, topCategories: CategoryCount[], heatmap: HeatmapDay[]): PeriodStats {
  return {
    total,
    wins,
    losses,
    neutrals,
    winPct: pct(wins, total),
    lossPct: pct(losses, total),
    neutralPct: pct(neutrals, total),
    winLossRatio: losses === 0 ? null : Math.round((wins / losses) * 100) / 100,
    topCategories,
    heatmap,
  };
}

function computeStatsFromLogs(logs: LogRow[]): PeriodStats {
  let wins = 0;
  let losses = 0;
  let neutrals = 0;
  const categoryCounts = new Map<string, number>();
  const dayCounts = new Map<string, number>();

  for (const log of logs) {
    if (log.outcome === 'win') wins += 1;
    else if (log.outcome === 'loss') losses += 1;
    else neutrals += 1;

    if (log.category) categoryCounts.set(log.category, (categoryCounts.get(log.category) ?? 0) + 1);
    dayCounts.set(log.date, (dayCounts.get(log.date) ?? 0) + 1);
  }

  const topCategories = [...categoryCounts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const heatmap = [...dayCounts.entries()].map(([date, count]) => ({ date, count }));

  return buildStats(logs.length, wins, losses, neutrals, topCategories, heatmap);
}

/** Weekly/monthly: pull the (small) set of raw rows and aggregate in JS. */
export async function fetchPeriodStats(period: Period, range: PeriodRange): Promise<PeriodStats> {
  if (period === 'year') return fetchYearlyStats(range);
  const logs = await fetchLogsInRange(range.start, range.end);
  return computeStatsFromLogs(logs);
}

/** Yearly: up to 365 rows, so aggregate in Postgres via RPC instead of pulling every row. */
export async function fetchYearlyStats(range: PeriodRange): Promise<PeriodStats> {
  const { data, error } = await supabase.rpc('get_period_stats', {
    p_start: range.start,
    p_end: range.end,
  });
  if (error) throw error;

  return buildStats(data.total, data.wins, data.losses, data.neutrals, data.categories ?? [], data.heatmap ?? []);
}

/** All-time, independent of the selected period -- always computed in Postgres. */
export async function fetchStreaks(): Promise<Streaks> {
  const { data, error } = await supabase.rpc('get_streaks');
  if (error) throw error;
  return { current: data.current, longest: data.longest };
}
