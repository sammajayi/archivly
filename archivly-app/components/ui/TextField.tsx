import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { cn } from '../../lib/cn';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string | null;
}

export function TextField({ label, error, className, ...props }: TextFieldProps) {
  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm font-medium text-text-secondary">{label}</Text> : null}
      <TextInput
        placeholderTextColor="#9CA3AF"
        className={cn(
          'rounded-card border border-border bg-surface px-4 py-3 text-base text-text-primary',
          error && 'border-loss',
          className
        )}
        {...props}
      />
      {error ? <Text className="text-sm text-loss">{error}</Text> : null}
    </View>
  );
}
