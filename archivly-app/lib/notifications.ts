import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const SETTINGS_KEY = 'archivly:reminder-settings';
const NOTIFICATION_ID_KEY = 'archivly:reminder-notification-id';

export interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = { enabled: false, hour: 20, minute: 0 };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function loadReminderSettings(): Promise<ReminderSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return DEFAULT_REMINDER_SETTINGS;
  try {
    return { ...DEFAULT_REMINDER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_REMINDER_SETTINGS;
  }
}

async function saveReminderSettings(settings: ReminderSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function cancelExistingReminder(): Promise<void> {
  const id = await AsyncStorage.getItem(NOTIFICATION_ID_KEY);
  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(NOTIFICATION_ID_KEY);
  }
}

/** Schedules (or reschedules) the daily reminder and persists the settings + OS notification id. */
export async function setDailyReminder(hour: number, minute: number): Promise<ReminderSettings> {
  await cancelExistingReminder();
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Log today’s activity',
      body: 'Keep your streak going — add a quick entry in Archivly.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
  await AsyncStorage.setItem(NOTIFICATION_ID_KEY, id);
  const settings: ReminderSettings = { enabled: true, hour, minute };
  await saveReminderSettings(settings);
  return settings;
}

export async function disableDailyReminder(settings: ReminderSettings): Promise<ReminderSettings> {
  await cancelExistingReminder();
  const next: ReminderSettings = { ...settings, enabled: false };
  await saveReminderSettings(next);
  return next;
}
