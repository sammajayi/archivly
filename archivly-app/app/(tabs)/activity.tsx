import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { RecentLogs } from '../../components/stats/RecentLogs';
import { fetchRecentLogs } from '../../lib/logs';
import { colors } from '../../lib/theme';
import type { LogRow } from '../../types/database';

const LOGS_LIMIT = 100;

export default function Activity() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setLogs(await fetchRecentLogs(LOGS_LIMIT));
    } catch (err) {
      console.error('Failed to load activity', err);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

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
        <Text className="text-2xl font-bold text-text-primary">Activity</Text>

        {loading ? (
          <View className="items-center py-12">
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : logs.length === 0 ? (
          <Card>
            <Text className="text-center text-text-secondary">Nothing logged yet. Tap + to add an entry.</Text>
          </Card>
        ) : (
          <RecentLogs logs={logs} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
