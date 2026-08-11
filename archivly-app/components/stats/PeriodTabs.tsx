import { Pressable, Text, View } from 'react-native';
import { cn } from '../../lib/cn';
import type { Period } from '../../lib/stats';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'week', label: 'Weekly' },
  { key: 'month', label: 'Monthly' },
  { key: 'year', label: 'Yearly' },
];

export function PeriodTabs({ value, onChange }: { value: Period; onChange: (period: Period) => void }) {
  return (
    <View className="flex-row rounded-full border border-border bg-surface p-1">
      {PERIODS.map((p) => {
        const selected = value === p.key;
        return (
          <Pressable
            key={p.key}
            onPress={() => onChange(p.key)}
            className={cn('flex-1 items-center rounded-full py-2', selected && 'bg-primary')}
          >
            <Text className={cn('text-sm font-medium', selected ? 'text-white' : 'text-text-secondary')}>
              {p.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
