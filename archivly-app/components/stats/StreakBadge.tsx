import { Pressable, Text } from 'react-native';

export function StreakBadge({ current, onPress }: { current: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5"
    >
      <Text className="text-base">🔥</Text>
      <Text className="text-base font-bold text-text-primary">{current}</Text>
    </Pressable>
  );
}
