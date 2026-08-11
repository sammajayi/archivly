import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function Profile() {
  const { session, signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="gap-4 px-6 pt-4">
        <Text className="text-2xl font-bold text-text-primary">Profile</Text>

        <Card>
          <Text className="text-sm text-text-secondary">Signed in as</Text>
          <Text className="mt-1 text-base font-medium text-text-primary">{session?.user.email}</Text>
        </Card>

        <Button label="Log out" variant="secondary" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}
