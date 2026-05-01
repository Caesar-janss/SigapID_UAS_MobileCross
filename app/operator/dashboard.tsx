import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { colors, spacing, typography } from "@/theme";

export default function OperatorDashboard() {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/auth/LoginScreen");
    } catch (e) {
      Alert.alert(
        "Gagal keluar",
        e instanceof Error ? e.message : "Terjadi kesalahan",
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View>
          <Text style={[typography.caption, styles.eyebrow]}>
            Dashboard Operator
          </Text>
          <Text style={[typography.h1, styles.title]}>
            Halo, {profile?.full_name ?? "Operator"}
          </Text>
          <Text style={[typography.body, styles.subtitle]}>
            Halaman ini untuk pengguna yang menerima dan menangani laporan.
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={[typography.h3, styles.panelTitle]}>
            Aksi utama operator
          </Text>
          <Text style={[typography.body, styles.panelText]}>
            Nanti daftar laporan masuk, detail laporan, dan panggilan bantuan
            bisa masuk di folder operator ini.
          </Text>
        </View>

        <Button label="Keluar" variant="ghost" onPress={handleSignOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  eyebrow: {
    color: colors.secondary,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  panelTitle: {
    color: colors.text,
  },
  panelText: {
    color: colors.textMuted,
  },
});
