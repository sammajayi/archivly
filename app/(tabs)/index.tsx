import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { fetchRecentLogs } from '../../lib/logs';
import type { LogRow, Outcome } from '../../types/database';

const OUTCOME_COLOR: Record<Outcome, string> = {
  win: 'text-win',
  loss: 'text-loss',
  neutral: 'text-neutral',
};

export default function Home() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchRecentLogs();
      setLogs(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const wins = logs.filter((l) => l.outcome === 'win').length;
  const losses = logs.filter((l) => l.outcome === 'loss').length;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-6 pt-4">
        <Text className="text-2xl font-bold text-text-primary">Archivly</Text>
        <Text className="text-base text-text-secondary">Your recent activity</Text>
      </View>

      <View className="flex-row gap-3 px-6 py-4">
        <Card className="flex-1">
          <Text className="text-2xl font-bold text-text-primary">{logs.length}</Text>
          <Text className="text-sm text-text-secondary">Logs</Text>
        </Card>
        <Card className="flex-1">
          <Text className="text-2xl font-bold text-win">{wins}</Text>
          <Text className="text-sm text-text-secondary">Wins</Text>
        </Card>
        <Card className="flex-1">
          <Text className="text-2xl font-bold text-loss">{losses}</Text>
          <Text className="text-sm text-text-secondary">Losses</Text>
        </Card>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 px-6 pb-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={
          !loading ? (
            <Text className="mt-10 text-center text-text-secondary">
              Nothing logged yet. Tap + to add your first entry.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Card>
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 pr-3 text-base font-medium text-text-primary">{item.title}</Text>
              <Text className={`text-sm font-semibold ${OUTCOME_COLOR[item.outcome]}`}>
                {item.outcome.toUpperCase()}
              </Text>
            </View>
            <Text className="mt-1 text-sm text-text-secondary">
              {item.date}
              {item.category ? ` · ${item.category}` : ''}
            </Text>
            {item.note ? <Text className="mt-2 text-sm text-text-primary">{item.note}</Text> : null}
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
