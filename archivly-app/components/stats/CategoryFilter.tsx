import { Pressable, ScrollView, Text } from 'react-native';
import { cn } from '../../lib/cn';

export function CategoryFilter({
  categories,
  selected,
  onChange,
}: {
  categories: string[];
  selected: string | null;
  onChange: (category: string | null) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
      <Pill label="All" active={selected === null} onPress={() => onChange(null)} />
      {categories.map((category) => (
        <Pill key={category} label={category} active={selected === category} onPress={() => onChange(category)} />
      ))}
    </ScrollView>
  );
}

function Pill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={cn('rounded-full border px-4 py-2', active ? 'border-primary bg-primary' : 'border-border bg-surface')}
    >
      <Text className={cn('text-sm font-medium', active ? 'text-white' : 'text-text-secondary')}>{label}</Text>
    </Pressable>
  );
}
