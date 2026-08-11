import { Redirect } from 'expo-router';

// This route is never actually navigated to -- the tab bar intercepts the
// press in (tabs)/_layout.tsx and pushes the log-entry modal instead. This
// file exists only because Expo Router requires a screen per tab.
export default function LogTabFallback() {
  return <Redirect href="/(tabs)" />;
}
