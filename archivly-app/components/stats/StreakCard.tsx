import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Card } from '../ui/Card';
import { cn } from '../../lib/cn';
import type { StreakDay } from '../../lib/stats';

// Loops a subtle scale + tilt "flicker" so the fire reads as alive rather
// than a static emoji. Runs indefinitely -- there's no natural stopping
// point for a streak-in-progress.
function AnimatedFire() {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 450, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.92, { duration: 450, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    rotate.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 380, easing: Easing.inOut(Easing.quad) }),
        withTiming(8, { duration: 380, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, [rotate, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.Text style={style} className="text-lg">
      🔥
    </Animated.Text>
  );
}

function DayCircle({ day }: { day: StreakDay }) {
  return (
    <View className="items-center gap-1.5">
      <Text className={cn('text-xs font-medium', day.isToday ? 'text-primary' : 'text-text-secondary')}>{day.label}</Text>
      <View
        className={cn(
          'h-10 w-10 items-center justify-center rounded-full border',
          day.active
            ? 'border-primary bg-primary/10'
            : day.isToday
              ? 'border-primary border-dashed bg-surface'
              : day.isFuture
                ? 'border-border/60 bg-background'
                : 'border-border bg-background'
        )}
      >
        {day.active ? <AnimatedFire /> : null}
      </View>
    </View>
  );
}

export function StreakCard({ current, longest, days }: { current: number; longest: number; days: StreakDay[] }) {
  return (
    <Card className="gap-4">
      <View className="flex-row items-end justify-between">
        <View>
          <Text className="text-sm font-medium text-text-secondary">Current streak</Text>
          <Text className="text-2xl font-bold text-text-primary">
            {current} {current === 1 ? 'day' : 'days'}
          </Text>
        </View>
        {longest > current ? <Text className="text-xs text-text-secondary">Best: {longest} days</Text> : null}
      </View>

      <View className="flex-row justify-between">
        {days.map((day) => (
          <DayCircle key={day.date} day={day} />
        ))}
      </View>
    </Card>
  );
}
