import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';
import { cn } from '../../lib/cn';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export function Button({ label, variant = 'primary', loading, disabled, className, ...props }: ButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      disabled={disabled || loading}
      className={cn(
        'items-center justify-center rounded-card px-4 py-3',
        isPrimary ? 'bg-primary' : 'border border-border bg-surface',
        (disabled || loading) && 'opacity-50',
        className
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#5B21B6'} />
      ) : (
        <Text className={cn('font-semibold', isPrimary ? 'text-white' : 'text-primary')}>{label}</Text>
      )}
    </Pressable>
  );
}
