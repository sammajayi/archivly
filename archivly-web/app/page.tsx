import { ComingSoon } from '../components/coming-soon/ComingSoon';
import { FullLanding } from '../components/landing/FullLanding';

// Feature flag: flip NEXT_PUBLIC_SHOW_FULL_LANDING to "true" post-launch to
// serve the full marketing page at "/" instead of the coming-soon page.
// The full page is also always viewable at /full regardless of this flag.
const showFullLanding = process.env.NEXT_PUBLIC_SHOW_FULL_LANDING === 'true';

export default function HomePage() {
  return showFullLanding ? <FullLanding /> : <ComingSoon />;
}
