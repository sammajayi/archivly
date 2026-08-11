import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

// Requires EXPO_PUBLIC_GOOGLE_*_CLIENT_ID values from the Google Cloud
// console (see .env.example). Returns an id_token that Supabase exchanges
// for a session via signInWithIdToken.
export function useGoogleAuth() {
  const { signInWithGoogleIdToken } = useAuth();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success' && response.params.id_token) {
      signInWithGoogleIdToken(response.params.id_token);
    }
  }, [response]);

  return { request, promptAsync };
}
