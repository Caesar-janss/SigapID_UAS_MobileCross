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

export default function ReporterTracking() {
  return (
    <ScreenShell
      role="reporter"
      activeTab="tracking"
      eyebrow="User - Tracking"
      title="Bantuan Datang"
      subtitle="Unit terdekat sudah menerima laporan dan menuju lokasi."
      action={
        <IconButton
          icon="crosshairs-gps"
          tone="secondary"
          onPress={() => Alert.alert("Lokasi diperbarui")}
        />
      }
    >
      <Card style={styles.trackingCard}>
        <MiniMap height={260} />
        <View style={styles.trackingBody}>
          <View style={styles.statusRow}>
            <View style={styles.statusText}>
              <Text style={styles.sectionTitle}>Bantuan sedang menuju</Text>
              <Text style={styles.sectionCaption}>
                Tetap berada di lokasi aman dan aktifkan notifikasi.
              </Text>
            </View>
            <StatusPill label="Aktif" tone="success" />
          </View>

          <InfoGrid
            items={[
              { label: "Jarak", value: "1.4 km" },
              { label: "Estimasi", value: "4 menit" },
            ]}
          />

          <Text style={styles.mockNote}>
            Data ini masih tampilan sementara sampai laporan darurat
            disambungkan ke backend.
          </Text>
        </View>

        <View style={styles.actionRow}>
          <PrimaryAction
            label="Kontak"
            icon="phone"
            tone="secondary"
            style={styles.actionFlex}
            onPress={() => Alert.alert("Panggilan", "Simulasi telepon operator.")}
          />
          <PrimaryAction
            label="Pesan"
            icon="message-outline"
            tone="soft"
            style={styles.actionFlex}
            onPress={() => navigateTo("/reporter/chat" as Href)}
          />
        </View>
      </Card>

      <Card style={styles.sensorCard}>
        <View style={styles.statusRow}>
          <View style={styles.statusText}>
            <Text style={styles.sectionTitle}>Deteksi guncangan</Text>
            <Text style={styles.sectionCaption}>
              Jika sensor membaca benturan keras, sistem akan menunggu konfirmasi 10 detik.
            </Text>
          </View>
          <PrimaryAction
            label="Coba"
            tone="danger"
            onPress={() => navigateTo("/reporter/emergency-alert" as Href)}
          />
        </View>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  trackingCard: {
    padding: 0,
    overflow: "hidden",
  },
  trackingBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  statusText: {
    flex: 1,
  },
  sectionTitle: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  sectionCaption: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  actionFlex: {
    flex: 1,
  },
  mockNote: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
  },
  sensorCard: {
    borderColor: "#FECACA",
    backgroundColor: "#FFF7F7",
  },
});
