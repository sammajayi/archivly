import { useState } from 'react';
import { Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useGoogleAuth } from '../../lib/useGoogleAuth';
import { Button } from '../../components/ui/Button';
import { GoogleIcon } from '../../components/ui/GoogleIcon';
import { TextField } from '../../components/ui/TextField';

export default function SignIn() {
  const { signInWithPassword } = useAuth();
  const { request, promptAsync } = useGoogleAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    const { error: signInError } = await signInWithPassword(email.trim(), password);
    setLoading(false);
    if (signInError) setError(signInError);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerClassName="flex-1 justify-center px-6" keyboardShouldPersistTaps="handled">
        <Text className="mb-1 text-3xl font-bold text-text-primary">Welcome back</Text>
        <Text className="mb-8 text-base text-text-secondary">Log in to keep your streak going.</Text>

        <View className="gap-4">
          <TextField
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text className="text-sm text-loss">{error}</Text> : null}

          <Button label="Log in" onPress={handleSignIn} loading={loading} />

          <Button
            label="Continue with Google"
            variant="secondary"
            icon={<GoogleIcon />}
            disabled={!request}
            onPress={() => promptAsync()}
          />
        </View>

        <View className="mt-8 flex-row justify-center gap-1">
          <Text className="text-text-secondary">Don&apos;t have an account?</Text>
          <Link href="/(auth)/sign-up" className="font-semibold text-primary">
            Sign up
          </Link>
        </View>
        <Link href="/(auth)/forgot-password" className="mt-3 text-center text-text-secondary">
          Forgot password?
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
