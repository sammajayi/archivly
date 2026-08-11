import { Pressable, Text } from 'react-native';
import { cn } from '../../lib/cn';
import type { Outcome } from '../../types/database';

const LABEL: Record<Outcome, string> = {
  win: 'Win',
  loss: 'Loss',
  neutral: 'Neutral',
};

const ACTIVE_CLASSES: Record<Outcome, string> = {
  win: 'bg-win border-win',
  loss: 'bg-loss border-loss',
  neutral: 'bg-neutral border-neutral',
};

export function OutcomePill({
  outcome,
  selected,
  onPress,
}: {
  outcome: Outcome;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-1 items-center rounded-full border px-3 py-2',
        selected ? ACTIVE_CLASSES[outcome] : 'border-border bg-surface'
      )}
    >
      <Text className={cn('font-medium', selected ? 'text-white' : 'text-text-secondary')}>
        {LABEL[outcome]}
      </Text>
    </Pressable>
  );
}
