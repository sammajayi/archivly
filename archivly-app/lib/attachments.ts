import { File } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from './supabase';
import type { AttachmentType } from '../types/database';

export const ATTACHMENT_BUCKET = 'log-attachments';
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10MB

export interface PickedAttachment {
  uri: string;
  name: string;
  mimeType: string;
  size: number | null;
  type: AttachmentType;
}

export interface UploadedAttachment {
  path: string;
  type: AttachmentType;
}

function assertSize(size: number | null | undefined) {
  if (size != null && size > MAX_ATTACHMENT_BYTES) {
    throw new Error('That file is too large -- attachments must be under 10MB.');
  }
}

export async function pickAttachmentImage(source: 'library' | 'camera'): Promise<PickedAttachment | null> {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error(source === 'camera' ? 'Camera permission is required.' : 'Photo library permission is required.');
  }

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });

  if (result.canceled || result.assets.length === 0) return null;

  const asset = result.assets[0];
  assertSize(asset.fileSize);

  return {
    uri: asset.uri,
    name: asset.fileName ?? `photo-${Date.now()}.jpg`,
    mimeType: asset.mimeType ?? 'image/jpeg',
    size: asset.fileSize ?? null,
    type: 'image',
  };
}

export async function pickAttachmentPdf(): Promise<PickedAttachment | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true });
  if (result.canceled || result.assets.length === 0) return null;

  const asset = result.assets[0];
  assertSize(asset.size);

  return {
    uri: asset.uri,
    name: asset.name,
    mimeType: asset.mimeType ?? 'application/pdf',
    size: asset.size ?? null,
    type: 'pdf',
  };
}

function extensionFor(attachment: PickedAttachment): string {
  const fromName = attachment.name.includes('.') ? attachment.name.split('.').pop() : null;
  return fromName || (attachment.type === 'pdf' ? 'pdf' : 'jpg');
}

export async function uploadAttachment(userId: string, attachment: PickedAttachment): Promise<UploadedAttachment> {
  const file = new File(attachment.uri);
  const bytes = await file.bytes();
  assertSize(bytes.byteLength);

  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(attachment)}`;

  const { error } = await supabase.storage.from(ATTACHMENT_BUCKET).upload(path, bytes, {
    contentType: attachment.mimeType,
    upsert: false,
  });
  if (error) throw error;

  return { path, type: attachment.type };
}

export async function deleteAttachment(path: string): Promise<void> {
  await supabase.storage.from(ATTACHMENT_BUCKET).remove([path]);
}

export async function getAttachmentSignedUrl(path: string, expiresInSeconds = 3600): Promise<string> {
  const { data, error } = await supabase.storage.from(ATTACHMENT_BUCKET).createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}
