import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '@/theme';

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Jika tidak login, lempar ke halaman Login
  if (!session) {
    return <Redirect href="/auth/LoginScreen" />;
  }

  // Jika sudah login, lempar ke Dashboard utama
  return <Redirect href="/(tabs)" />;
}