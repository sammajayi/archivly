import { useCallback, useState } from 'react';
import { Alert, Linking, Platform, Pressable, Switch, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { colors } from '../../lib/theme';
import {
  DEFAULT_REMINDER_SETTINGS,
  disableDailyReminder,
  loadReminderSettings,
  requestNotificationPermission,
  setDailyReminder,
  type ReminderSettings,
} from '../../lib/notifications';

function formatTime(hour: number, minute: number): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function Profile() {
  const { session, signOut } = useAuth();
  const [reminder, setReminder] = useState<ReminderSettings>(DEFAULT_REMINDER_SETTINGS);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadReminderSettings().then(setReminder);
    }, [])
  );

  const toggleReminder = useCallback(
    async (enabled: boolean) => {
      setBusy(true);
      try {
        if (enabled) {
          const granted = await requestNotificationPermission();
          if (!granted) {
            Alert.alert('Notifications disabled', 'Enable notifications for Archivly in your device settings to get reminders.');
            return;
          }
          setReminder(await setDailyReminder(reminder.hour, reminder.minute));
        } else {
          setReminder(await disableDailyReminder(reminder));
        }
      } finally {
        setBusy(false);
      }
    },
    [reminder]
  );

  const changeTime = useCallback(async (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    setBusy(true);
    try {
      setReminder(await setDailyReminder(hour, minute));
    } finally {
      setBusy(false);
    }
  }, []);

  const timeValue = new Date();
  timeValue.setHours(reminder.hour, reminder.minute, 0, 0);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="gap-4 px-6 pt-4">
        <Text className="text-2xl font-bold text-text-primary">Me</Text>

        <Card>
          <Text className="text-sm text-text-secondary">Signed in as</Text>
          <Text className="mt-1 text-base font-medium text-text-primary">{session?.user.email}</Text>
        </Card>

        <Card className="gap-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-medium text-text-primary">Daily reminder</Text>
              <Text className="mt-0.5 text-sm text-text-secondary">Get nudged to log your day</Text>
            </View>
            <Switch value={reminder.enabled} onValueChange={toggleReminder} disabled={busy} trackColor={{ true: colors.primary }} />
          </View>

          {reminder.enabled ? (
            <Pressable
              onPress={() => setShowTimePicker(true)}
              className="flex-row items-center justify-between border-t border-border pt-4"
            >
              <Text className="text-base text-text-primary">Reminder time</Text>
              <Text className="text-base font-medium text-primary">{formatTime(reminder.hour, reminder.minute)}</Text>
            </Pressable>
          ) : null}

          {showTimePicker ? (
            <DateTimePicker
              value={timeValue}
              mode="time"
              onChange={(_event, selected) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (selected) changeTime(selected);
              }}
            />
          ) : null}
        </Card>

        <Card>
          <Pressable
            onPress={() => Linking.openURL('mailto:sam@archivly.xyz?subject=Archivly%20support')}
            className="flex-row items-center justify-between"
          >
            <Text className="text-base text-text-primary">Contact support</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.border} />
          </Pressable>
        </Card>

        <Button label="Log out" variant="secondary" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}
