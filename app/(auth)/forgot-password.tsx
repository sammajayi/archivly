import { useState } from 'react';
import { Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    setError(null);
    setLoading(true);
    const { error: resetError } = await sendPasswordReset(email.trim());
    setLoading(false);
    if (resetError) {
      setError(resetError);
      return;
    }
    setSent(true);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerClassName="flex-1 justify-center px-6" keyboardShouldPersistTaps="handled">
        <Text className="mb-1 text-3xl font-bold text-text-primary">Reset password</Text>
        <Text className="mb-8 text-base text-text-secondary">
          We&apos;ll email you a link to reset your password.
        </Text>

        {sent ? (
          <Text className="text-base text-text-primary">
            Check your inbox at {email} for a reset link.
          </Text>
        ) : (
          <View className="gap-4">
            <TextField
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
            />

            {error ? <Text className="text-sm text-loss">{error}</Text> : null}

            <Button label="Send reset link" onPress={handleReset} loading={loading} />
          </View>
        )}

        <Link href="/(auth)/sign-in" className="mt-8 text-center font-semibold text-primary">
          Back to log in
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
