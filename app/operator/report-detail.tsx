import { Href } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/theme";
import {
  Card,
  IconButton,
  InfoGrid,
  MiniMap,
  PrimaryAction,
  ScreenShell,
  StatusPill,
  navigateTo,
} from "@/components/app/MockAppUI";

export default function OperatorReportDetail() {
  return (
    <ScreenShell
      role="operator"
      eyebrow="Dispatcher - Home - Detail"
      title="Detail Laporan"
      subtitle="Insiden aktif dengan informasi prioritas dan kontak cepat."
      action={
        <IconButton
          icon="dots-horizontal"
          tone="secondary"
          onPress={() => Alert.alert("Opsi laporan")}
        />
      }
    >
      <MiniMap height={200} />

      <InfoGrid
        items={[
          { label: "Jenis", value: "Medis" },
          { label: "Prioritas", value: "Tinggi" },
          { label: "Lokasi", value: "Jl. Melati 18" },
          { label: "Masuk", value: "09:41 WIB" },
        ]}
      />

      <Card style={styles.reporterCard}>
        <View style={styles.reporterHeader}>
          <View style={styles.reporterText}>
            <Text style={styles.reporterName}>Alya Permata</Text>
            <Text style={styles.reporterMeta}>
              Perempuan - 27 tahun - Kontak darurat tersimpan
            </Text>
          </View>
          <StatusPill label="Darurat" tone="danger" />
        </View>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>+62 812-4456-1123</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Respons lambat</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Detak jantung naik</Text>
          </View>
        </View>
      </Card>

      <View style={styles.quickActions}>
        <PrimaryAction
          label="Call"
          icon="phone"
          tone="soft"
          style={styles.quickButton}
          onPress={() => Alert.alert("Call", "Simulasi panggilan.")}
        />
        <PrimaryAction
          label="Message"
          icon="message-outline"
          tone="soft"
          style={styles.quickButton}
          onPress={() => navigateTo("/operator/chat" as Href)}
        />
        <PrimaryAction
          label="Voice"
          icon="microphone"
          tone="soft"
          style={styles.quickButton}
          onPress={() => Alert.alert("Voice", "Simulasi suara.")}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  reporterCard: {
    gap: spacing.md,
  },
  reporterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  reporterText: {
    flex: 1,
  },
  reporterName: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  reporterMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    backgroundColor: "#F8FEFF",
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  tagText: {
    fontSize: 11,
    color: colors.text,
  },
  quickActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  quickButton: {
    flex: 1,
    minHeight: 56,
    paddingHorizontal: spacing.sm,
  },
});
