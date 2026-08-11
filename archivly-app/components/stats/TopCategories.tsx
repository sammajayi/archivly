import { Text, View } from 'react-native';
import { Card } from '../ui/Card';
import type { CategoryCount } from '../../lib/stats';

export function TopCategories({ categories }: { categories: CategoryCount[] }) {
  if (categories.length === 0) {
    return (
      <Card>
        <Text className="text-sm text-text-secondary">No categories logged in this period yet.</Text>
      </Card>
    );
  }

  const max = categories[0].count;

  return (
    <Card className="gap-3">
      {categories.map((c) => (
        <View key={c.category} className="gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-text-primary">{c.category}</Text>
            <Text className="text-sm text-text-secondary">{c.count}</Text>
          </View>
          <View className="h-1.5 overflow-hidden rounded-full bg-background">
            <View
              className="h-1.5 rounded-full bg-primary"
              style={{ width: `${Math.max((c.count / max) * 100, 6)}%` }}
            />
          </View>
        </View>
      ))}
    </Card>
  );
}
