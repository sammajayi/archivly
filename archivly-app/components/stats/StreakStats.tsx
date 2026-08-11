import { View } from 'react-native';
import { Card } from '../ui/Card';
import { StatTile } from './StatTile';
import type { Streaks } from '../../lib/stats';

export function StreakStats({ streaks }: { streaks: Streaks }) {
  return (
    <Card className="flex-row justify-between">
      <StatTile value={streaks.current} label="Current streak" colorClassName="text-primary" />
      <StatTile value={streaks.longest} label="Longest streak" />
    </Card>
  );
}
