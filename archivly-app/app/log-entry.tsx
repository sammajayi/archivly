import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { OutcomePill } from '../components/ui/OutcomePill';
import { TextField } from '../components/ui/TextField';
import { createLog } from '../lib/logs';
import { toDateString } from '../lib/stats';
import type { Outcome } from '../types/database';

const NOTE_LIMIT = 280;

export default function LogEntry() {
  const [title, setTitle] = useState('');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!outcome) {
      setError('Pick an outcome.');
      return;
    }

    setSaving(true);
    try {
      await createLog({
        title: title.trim(),
        outcome,
        date: toDateString(date),
        note,
        category,
      });
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this entry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center justify-between border-b border-border px-5 py-3">
          <Pressable onPress={() => router.back()}>
            <Text className="text-base text-text-secondary">Cancel</Text>
          </Pressable>
          <Text className="text-base font-semibold text-text-primary">New entry</Text>
          <View style={{ width: 48 }} />
        </View>

        <ScrollView contentContainerClassName="gap-5 p-5" keyboardShouldPersistTaps="handled">
          <TextField
            label="Title"
            placeholder="Hit a new deadlift PR"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <View className="gap-1.5">
            <Text className="text-sm font-medium text-text-secondary">Outcome</Text>
            <View className="flex-row gap-2">
              {(['win', 'loss', 'neutral'] as const).map((value) => (
                <OutcomePill
                  key={value}
                  outcome={value}
                  selected={outcome === value}
                  onPress={() => setOutcome(value)}
                />
              ))}
            </View>
          </View>

          <View className="gap-1.5">
            <Text className="text-sm font-medium text-text-secondary">Date</Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="rounded-card border border-border bg-surface px-4 py-3"
            >
              <Text className="text-base text-text-primary">{toDateString(date)}</Text>
            </Pressable>
            {showDatePicker ? (
              <DateTimePicker
                value={date}
                mode="date"
                maximumDate={new Date()}
                onChange={(_event, selected) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selected) setDate(selected);
                }}
              />
            ) : null}
          </View>

          <TextField
            label="Category (optional)"
            placeholder="Fitness, Career, Finance..."
            value={category}
            onChangeText={setCategory}
          />

          <View className="gap-1.5">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-text-secondary">Note (optional)</Text>
              <Text className="text-xs text-text-secondary">
                {note.length}/{NOTE_LIMIT}
              </Text>
            </View>
            <TextField
              placeholder="Add context..."
              value={note}
              onChangeText={(text) => setNote(text.slice(0, NOTE_LIMIT))}
              multiline
              numberOfLines={3}
              maxLength={NOTE_LIMIT}
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />
          </View>

          {error ? <Text className="text-sm text-loss">{error}</Text> : null}

          <Button label="Save" onPress={handleSave} loading={saving} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
