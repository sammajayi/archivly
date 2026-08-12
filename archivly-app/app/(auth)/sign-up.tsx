import { useState } from 'react';
import { Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useGoogleAuth } from '../../lib/useGoogleAuth';
import { Button } from '../../components/ui/Button';
import { GoogleIcon } from '../../components/ui/GoogleIcon';
import { TextField } from '../../components/ui/TextField';

export default function SignUp() {
  const { signUpWithPassword } = useAuth();
  const { request, promptAsync } = useGoogleAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSignUp = async () => {
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error: signUpError } = await signUpWithPassword(email.trim(), password, name.trim());
    setLoading(false);
    if (signUpError) {
      setError(signUpError);
      return;
    }
    setConfirmationSent(true);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerClassName="flex-1 justify-center px-6" keyboardShouldPersistTaps="handled">
        <Text className="mb-1 text-3xl font-bold text-text-primary">Create your account</Text>
        <Text className="mb-8 text-base text-text-secondary">
          Start logging your wins in under 30 seconds.
        </Text>

        {confirmationSent ? (
          <Text className="text-base text-text-primary">
            Check your inbox at {email} to confirm your account, then log in.
          </Text>
        ) : (
          <View className="gap-4">
            <TextField
              label="Name"
              autoCapitalize="words"
              autoComplete="name"
              value={name}
              onChangeText={setName}
            />
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
              autoComplete="password-new"
              value={password}
              onChangeText={setPassword}
            />

            {error ? <Text className="text-sm text-loss">{error}</Text> : null}

            <Button label="Sign up" onPress={handleSignUp} loading={loading} />

            <Button
              label="Continue with Google"
              variant="secondary"
              icon={<GoogleIcon />}
              disabled={!request}
              onPress={() => promptAsync()}
            />
          </View>
        )}

        <View className="mt-8 flex-row justify-center gap-1">
          <Text className="text-text-secondary">Already have an account?</Text>
          <Link href="/(auth)/sign-in" className="font-semibold text-primary">
            Log in
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
