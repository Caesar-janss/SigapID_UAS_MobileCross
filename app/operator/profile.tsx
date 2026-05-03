import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { colors, spacing, typography } from "@/theme";
import {
  Avatar,
  FieldCard,
  PrimaryAction,
  ScreenShell,
} from "@/components/app/MockAppUI";

export default function OperatorProfile() {
  const { profile, signOut } = useAuth();
  const [name, setName] = useState(profile?.full_name ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [password, setPassword] = useState("");

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/auth/LoginScreen");
    } catch (e) {
      Alert.alert("Gagal keluar", e instanceof Error ? e.message : "Terjadi kesalahan");
    }
  };

  return (
    <ScreenShell
      role="operator"
      activeTab="profile"
      eyebrow="Dispatcher - Profile"
      title="Profil Operator"
      subtitle="Kelola data operator dan keamanan akun."
    >
      <View style={styles.identity}>
        <Avatar name={profile?.full_name ?? "Operator"} tone="secondary" size={112} />
        <Text style={styles.name}>{profile?.full_name ?? "Operator"}</Text>
        <Text style={styles.meta}>ID: {profile?.user_code ?? "Belum tersedia"}</Text>
        <Text style={styles.address}>
          {address || "Tambahkan alamat atau unit kerja operator."}
        </Text>
      </View>

      <FieldCard
        label="Masukan Nama Baru"
        placeholder="nama"
        value={name}
        onChangeText={setName}
      />
      <FieldCard
        label="Masukan Alamat Baru"
        placeholder="jalan sepi rt 02 rw 03"
        value={address}
        onChangeText={setAddress}
      />
      <FieldCard
        label="Masukan Password Baru"
        placeholder="password baru"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <PrimaryAction
        label="Update Profile"
        tone="soft"
        onPress={() => Alert.alert("Tersimpan", "Simulasi update profile.")}
      />
      <PrimaryAction
        label="Keluar"
        tone="danger"
        onPress={handleSignOut}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  name: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.md,
  },
  meta: {
    ...typography.caption,
    color: colors.secondary,
  },
  address: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 19,
  },
});
