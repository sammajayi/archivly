import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/theme';

export function PeriodNav({
  label,
  onPrev,
  onNext,
  nextDisabled,
}: {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  nextDisabled: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <Pressable onPress={onPrev} hitSlop={10} className="p-1">
        <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
      </Pressable>
      <Text className="text-base font-semibold text-text-primary">{label}</Text>
      <Pressable onPress={onNext} disabled={nextDisabled} hitSlop={10} className="p-1">
        <Ionicons name="chevron-forward" size={20} color={nextDisabled ? colors.border : colors.textSecondary} />
      </Pressable>
    </View>
  );
}
