import { useState } from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../lib/theme';
import { pickAttachmentImage, pickAttachmentPdf, type PickedAttachment } from '../../lib/attachments';

interface AttachmentFieldProps {
  attachment: PickedAttachment | null;
  onChange: (attachment: PickedAttachment | null) => void;
  onError: (message: string) => void;
}

export function AttachmentField({ attachment, onChange, onError }: AttachmentFieldProps) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const runPick = async (pick: () => Promise<PickedAttachment | null>) => {
    setPickerVisible(false);
    try {
      const result = await pick();
      if (result) onChange(result);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not attach that file.');
    }
  };

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-text-secondary">Attachment (optional)</Text>

      {attachment ? (
        <View className="flex-row items-center gap-3 rounded-card border border-border bg-surface px-4 py-3">
          {attachment.type === 'image' ? (
            <Image source={{ uri: attachment.uri }} className="h-11 w-11 rounded-md bg-background" resizeMode="cover" />
          ) : (
            <View className="h-11 w-11 items-center justify-center rounded-md bg-background">
              <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />
            </View>
          )}
          <Text className="flex-1 text-base text-text-primary" numberOfLines={1}>
            {attachment.name}
          </Text>
          <Pressable onPress={() => onChange(null)} hitSlop={8}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => setPickerVisible(true)}
          className="flex-row items-center gap-2 rounded-card border border-dashed border-border bg-surface px-4 py-3"
        >
          <Ionicons name="attach-outline" size={18} color={colors.textSecondary} />
          <Text className="text-base text-text-secondary">Attach a screenshot or PDF</Text>
        </Pressable>
      )}

      <Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={() => setPickerVisible(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setPickerVisible(false)}>
          <Pressable
            onPress={() => {}}
            className="gap-1 rounded-t-card bg-surface p-3"
            style={{ paddingBottom: insets.bottom + 12 }}
          >
            <AttachmentOption
              icon="camera-outline"
              label="Take photo"
              onPress={() => runPick(() => pickAttachmentImage('camera'))}
            />
            <AttachmentOption
              icon="images-outline"
              label="Choose photo"
              onPress={() => runPick(() => pickAttachmentImage('library'))}
            />
            <AttachmentOption
              icon="document-text-outline"
              label="Choose PDF"
              onPress={() => runPick(pickAttachmentPdf)}
            />
            <AttachmentOption label="Cancel" onPress={() => setPickerVisible(false)} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function AttachmentOption({
  icon,
  label,
  onPress,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 rounded-card px-3 py-3">
      {icon ? <Ionicons name={icon} size={20} color={colors.textPrimary} /> : null}
      <Text className="text-base text-text-primary">{label}</Text>
    </Pressable>
  );
}
