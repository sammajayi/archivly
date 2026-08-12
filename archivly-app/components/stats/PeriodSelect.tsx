import { useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../../lib/cn';
import { colors } from '../../lib/theme';
import type { Period } from '../../lib/stats';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'week', label: 'Weekly' },
  { key: 'month', label: 'Monthly' },
  { key: 'year', label: 'Yearly' },
];

export function PeriodSelect({ value, onChange }: { value: Period; onChange: (period: Period) => void }) {
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, width: 0 });

  const openMenu = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y: y + height + 4, width });
      setOpen(true);
    });
  };

  const selectedLabel = PERIODS.find((p) => p.key === value)?.label ?? '';

  return (
    <>
      <Pressable
        ref={triggerRef}
        onPress={openMenu}
        className="flex-row items-center gap-1.5 self-start rounded-full border border-border bg-surface px-4 py-2"
      >
        <Text className="text-sm font-medium text-text-primary">{selectedLabel}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1" onPress={() => setOpen(false)}>
          <View
            className="absolute overflow-hidden rounded-card border border-border bg-surface"
            style={{ top: anchor.y, left: anchor.x, minWidth: anchor.width }}
          >
            {PERIODS.map((p) => {
              const selected = p.key === value;
              return (
                <Pressable
                  key={p.key}
                  onPress={() => {
                    onChange(p.key);
                    setOpen(false);
                  }}
                  className={cn('flex-row items-center justify-between gap-6 px-4 py-3', selected && 'bg-background')}
                >
                  <Text className={cn('text-sm font-medium', selected ? 'text-primary' : 'text-text-primary')}>{p.label}</Text>
                  {selected ? <Ionicons name="checkmark" size={16} color={colors.primary} /> : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
