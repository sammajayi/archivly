import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View, type PressableProps } from 'react-native';
import { cn } from '../../lib/cn';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({ label, variant = 'primary', loading, disabled, icon, className, ...props }: ButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      disabled={disabled || loading}
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-card px-4 py-3',
        isPrimary ? 'bg-primary' : 'border border-border bg-surface',
        (disabled || loading) && 'opacity-50',
        className
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#5B21B6'} />
      ) : (
        <>
          {icon ? <View>{icon}</View> : null}
          <Text className={cn('font-semibold', isPrimary ? 'text-white' : 'text-primary')}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
