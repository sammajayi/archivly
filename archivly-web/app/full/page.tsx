import type { Metadata } from 'next';
import { FullLanding } from '../../components/landing/FullLanding';

// Always-on preview of the full landing page, independent of the
// NEXT_PUBLIC_SHOW_FULL_LANDING flag that controls what "/" serves.
export const metadata: Metadata = {
  title: 'Archivly (preview)',
};

export default function FullPreviewPage() {
  return <FullLanding />;
}
