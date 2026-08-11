import { Text, View } from 'react-native';
import { Card } from '../ui/Card';
import type { PeriodStats } from '../../lib/stats';

function Row({ label, count, pct, colorClassName }: { label: string; count: number; pct: number; colorClassName: string }) {
  return (
    <View className="flex-row items-center justify-between py-1.5">
      <Text className="text-sm font-medium text-text-secondary">{label}</Text>
      <View className="flex-row items-baseline gap-1.5">
        <Text className={`text-base font-bold ${colorClassName}`}>{count}</Text>
        <Text className="text-xs text-text-secondary">({pct}%)</Text>
      </View>
    </View>
  );
}

export function OutcomeBreakdown({ stats }: { stats: PeriodStats }) {
  return (
    <Card>
      <Row label="Wins" count={stats.wins} pct={stats.winPct} colorClassName="text-win" />
      <Row label="Losses" count={stats.losses} pct={stats.lossPct} colorClassName="text-loss" />
      <Row label="Neutral" count={stats.neutrals} pct={stats.neutralPct} colorClassName="text-neutral" />
      <View className="mt-2 flex-row items-center justify-between border-t border-border pt-2">
        <Text className="text-sm font-medium text-text-secondary">Win-loss ratio</Text>
        <Text className="text-base font-bold text-text-primary">
          {stats.winLossRatio === null ? (stats.wins > 0 ? '∞' : '—') : stats.winLossRatio.toFixed(2)}
        </Text>
      </View>
    </Card>
  );
}
