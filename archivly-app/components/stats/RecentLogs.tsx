import { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../ui/Card';
import { cn } from '../../lib/cn';
import { getAttachmentSignedUrl } from '../../lib/attachments';
import { colors } from '../../lib/theme';
import type { LogRow, Outcome } from '../../types/database';

const OUTCOME_DOT: Record<Outcome, string> = {
  win: 'bg-win',
  loss: 'bg-loss',
  neutral: 'bg-neutral',
};

const OUTCOME_LABEL: Record<Outcome, string> = { win: 'Win', loss: 'Loss', neutral: 'Neutral' };

function formatShortDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatLongDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export function RecentLogs({ logs }: { logs: LogRow[] }) {
  const [selected, setSelected] = useState<LogRow | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setAttachmentUrl(null);
    setImagePreviewVisible(false);
    if (!selected?.attachment_url) return;
    let cancelled = false;
    getAttachmentSignedUrl(selected.attachment_url)
      .then((url) => {
        if (!cancelled) setAttachmentUrl(url);
      })
      .catch((err) => console.error('Failed to load attachment', err));
    return () => {
      cancelled = true;
    };
  }, [selected]);

  return (
    <>
      <Card className="gap-3">
        {logs.map((log, i) => (
          <Pressable
            key={log.id}
            onPress={() => setSelected(log)}
            className={cn('flex-row items-center gap-3', i > 0 && 'border-t border-border pt-3')}
          >
            <View className={cn('h-2 w-2 rounded-full', OUTCOME_DOT[log.outcome])} />
            <View className="flex-1">
              <Text className="text-base font-medium text-text-primary" numberOfLines={1}>
                {log.title}
              </Text>
              <Text className="text-sm text-text-secondary">
                {formatShortDate(log.date)}
                {log.category ? ` · ${log.category}` : ''}
                {log.note ? ' · Has notes' : ''}
              </Text>
            </View>
            {log.attachment_url ? (
              <Ionicons
                name={log.attachment_type === 'pdf' ? 'document-text-outline' : 'image-outline'}
                size={16}
                color={colors.textSecondary}
              />
            ) : null}
            <Ionicons name="chevron-forward" size={18} color={colors.border} />
          </Pressable>
        ))}
      </Card>

      <Modal visible={selected !== null} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6"
          style={{ paddingBottom: insets.bottom }}
          onPress={() => setSelected(null)}
        >
          {selected ? (
            <Pressable onPress={() => {}} className="w-full max-w-sm gap-3 rounded-card bg-surface p-5">
              <View className="flex-row items-start justify-between">
                <View className={cn('self-start rounded-full px-3 py-1', OUTCOME_DOT[selected.outcome])}>
                  <Text className="text-sm font-semibold text-white">{OUTCOME_LABEL[selected.outcome]}</Text>
                </View>
                <Pressable onPress={() => setSelected(null)} hitSlop={8}>
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </Pressable>
              </View>

              <ScrollView contentContainerClassName="gap-3" style={{ maxHeight: 320 }}>
                <Text className="text-lg font-bold text-text-primary">{selected.title}</Text>
                <Text className="text-sm text-text-secondary">{formatLongDate(selected.date)}</Text>

                {selected.category ? (
                  <View className="self-start rounded-full border border-border bg-background px-3 py-1">
                    <Text className="text-sm text-text-secondary">{selected.category}</Text>
                  </View>
                ) : null}

                {selected.note ? (
                  <View className="gap-1.5">
                    <Text className="text-sm font-medium text-text-secondary">Context</Text>
                    <Text className="text-base leading-6 text-text-primary">{selected.note}</Text>
                  </View>
                ) : null}

                {selected.attachment_url ? (
                  <View className="gap-1.5">
                    <Text className="text-sm font-medium text-text-secondary">Attachment</Text>
                    {!attachmentUrl ? (
                      <Text className="text-sm text-text-secondary">Loading...</Text>
                    ) : selected.attachment_type === 'pdf' ? (
                      <Pressable
                        onPress={() => WebBrowser.openBrowserAsync(attachmentUrl)}
                        className="flex-row items-center gap-2 rounded-card border border-border bg-background px-4 py-3"
                      >
                        <Ionicons name="document-text-outline" size={18} color={colors.primary} />
                        <Text className="text-base text-primary">Open PDF</Text>
                      </Pressable>
                    ) : (
                      <Pressable onPress={() => setImagePreviewVisible(true)}>
                        <Image
                          source={{ uri: attachmentUrl }}
                          className="w-full rounded-card bg-background"
                          style={{ height: 220 }}
                          resizeMode="contain"
                        />
                      </Pressable>
                    )}
                  </View>
                ) : null}
              </ScrollView>
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>

      <Modal
        visible={imagePreviewVisible && attachmentUrl !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setImagePreviewVisible(false)}
      >
        <Pressable className="flex-1 items-center justify-center bg-black/90" onPress={() => setImagePreviewVisible(false)}>
          {attachmentUrl ? (
            <Image source={{ uri: attachmentUrl }} className="h-full w-full" resizeMode="contain" />
          ) : null}
        </Pressable>
      </Modal>
    </>
  );
}
