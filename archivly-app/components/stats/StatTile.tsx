import { Text, View } from 'react-native';
import { cn } from '../../lib/cn';

export function StatTile({
  value,
  label,
  colorClassName,
}: {
  value: string | number;
  label: string;
  colorClassName?: string;
}) {
  return (
    <View>
      <Text className={cn('text-3xl font-bold', colorClassName ?? 'text-text-primary')}>{value}</Text>
      <Text className="mt-0.5 text-sm text-text-secondary">{label}</Text>
    </View>
  );
}
