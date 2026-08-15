import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

// expo-auth-session's default native redirect URI is `${applicationId}:/oauthredirect`
// (e.g. xyz.archivly.app:/oauthredirect), but Google's Android-type OAuth client only
// trusts one custom scheme: the reversed client ID below. Anything else gets rejected
// with "Custom URI scheme is not enabled for your Android client". Must stay in sync
// with the android.intentFilters entry in app.json (that's what routes the redirect
// back into the app -- Android won't know who owns this scheme otherwise).
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const androidRedirectScheme = ANDROID_CLIENT_ID
  ? `com.googleusercontent.apps.${ANDROID_CLIENT_ID.replace(/\.apps\.googleusercontent\.com$/, '')}`
  : undefined;

// Requires EXPO_PUBLIC_GOOGLE_*_CLIENT_ID values from the Google Cloud
// console (see .env.example). Returns an id_token that Supabase exchanges
// for a session via signInWithIdToken.
export function useGoogleAuth() {
  const { signInWithGoogleIdToken } = useAuth();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      androidClientId: ANDROID_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    },
    Platform.OS === 'android' && androidRedirectScheme
      ? { native: `${androidRedirectScheme}:/oauthredirect` }
      : {}
  );

  useEffect(() => {
    if (response?.type === 'success' && response.params.id_token) {
      signInWithGoogleIdToken(response.params.id_token);
    }
  }, [response]);

  return { request, promptAsync };
}
