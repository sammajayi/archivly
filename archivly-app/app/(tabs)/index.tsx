import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { ActivityHeatmap } from '../../components/stats/ActivityHeatmap';
import { AiSummary } from '../../components/stats/AiSummary';
import { OutcomeBreakdown } from '../../components/stats/OutcomeBreakdown';
import { PeriodNav } from '../../components/stats/PeriodNav';
import { PeriodSelect } from '../../components/stats/PeriodSelect';
import { StatTile } from '../../components/stats/StatTile';
import { StreakBadge } from '../../components/stats/StreakBadge';
import { TopCategories } from '../../components/stats/TopCategories';
import { colors } from '../../lib/theme';
import {
  EMPTY_STATS,
  fetchPeriodStats,
  fetchStreaks,
  getPeriodRange,
  type Period,
  type PeriodStats,
  type Streaks,
} from '../../lib/stats';

const EMPTY_STREAKS: Streaks = { current: 0, longest: 0 };

export default function Home() {
  const [period, setPeriod] = useState<Period>('week');
  const [offset, setOffset] = useState(0);
  const [stats, setStats] = useState<PeriodStats>(EMPTY_STATS);
  const [streaks, setStreaks] = useState<Streaks>(EMPTY_STREAKS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const range = useMemo(() => getPeriodRange(period, offset), [period, offset]);

  const changePeriod = useCallback((next: Period) => {
    setPeriod(next);
    setOffset(0);
  }, []);

  const load = useCallback(async () => {
    // Kept as two independent calls (not Promise.all) so a streaks failure
    // can't blank out period stats that already loaded fine, and vice versa.
    try {
      setStats(await fetchPeriodStats(period, range));
    } catch (err) {
      console.error('Failed to load period stats', err);
    }
    try {
      setStreaks(await fetchStreaks());
    } catch (err) {
      console.error('Failed to load streaks', err);
    }
    setLoading(false);
    setRefreshing(false);
  }, [period, range]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  const topCategory = stats.topCategories[0]?.category ?? '—';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        contentContainerClassName="gap-4 px-6 pb-8 pt-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
      >
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-2xl font-bold text-text-primary">Archivly</Text>
            <Text className="text-base text-text-secondary">Your activity, at a glance</Text>
          </View>
          <StreakBadge current={streaks.current} />
        </View>

        <PeriodSelect value={period} onChange={changePeriod} />
        <PeriodNav label={range.label} onPrev={() => setOffset((o) => o - 1)} onNext={() => setOffset((o) => o + 1)} nextDisabled={offset >= 0} />

        {loading ? (
          <View className="items-center py-12">
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : stats.total === 0 ? (
          <Card>
            <Text className="text-center text-text-secondary">Nothing logged in this period yet. Tap + to add an entry.</Text>
          </Card>
        ) : (
          <>
            <Card className="flex-row items-center justify-between">
              <StatTile value={stats.total} label="Total logs" />
              <StatTile value={topCategory} label="Most active category" />
            </Card>

            <OutcomeBreakdown stats={stats} />

            <View className="gap-2">
              <Text className="text-sm font-medium text-text-secondary">Activity</Text>
              <Card>
                <ActivityHeatmap start={range.start} end={range.end} data={stats.heatmap} />
              </Card>
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-text-secondary">Top categories</Text>
              <TopCategories categories={stats.topCategories} />
            </View>

            {period !== 'year' ? (
              <View className="gap-2">
                <Text className="text-sm font-medium text-text-secondary">AI recap</Text>
                <AiSummary
                  period={period}
                  range={range}
                  disabled={period === 'month' && offset === 0}
                  disabledReason={period === 'month' && offset === 0 ? 'Unlocks on the 1st of next month, once this month is complete.' : undefined}
                />
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
