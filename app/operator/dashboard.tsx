import { Href } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/theme";
import {
  Card,
  IconButton,
  MiniMap,
  PrimaryAction,
  ScreenShell,
  StatusPill,
  navigateTo,
} from "@/components/app/MockAppUI";

const incomingReports = [
  {
    title: "Medis - Prioritas Tinggi",
    reporter: "Alya Permata",
    time: "09:41 WIB",
    status: "Baru",
    tone: "danger",
  },
  {
    title: "Kebakaran - Area Pemukiman",
    reporter: "Rima Nugra",
    time: "09:36 WIB",
    status: "Proses",
    tone: "warning",
  },
  {
    title: "Kriminal - Jalan Sepi",
    reporter: "Nanda Kirana",
    time: "09:30 WIB",
    status: "Ditangani",
    tone: "success",
  },
] as const;

export default function OperatorDashboard() {
  return (
    <ScreenShell
      role="operator"
      activeTab="home"
      eyebrow="Dispatcher - Home"
      title="Laporan Masuk"
      subtitle="Prioritas laporan disusun untuk operator yang paling siap."
      action={<IconButton icon="bell-outline" tone="secondary" />}
    >
      <View style={styles.list}>
        {incomingReports.map((report) => (
          <Card key={report.title} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <View style={styles.reportText}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportMeta}>
                  Pelapor: {report.reporter} - {report.time}
                </Text>
              </View>
              <StatusPill
                label={report.status}
                tone={
                  report.tone === "danger"
                    ? "danger"
                    : report.tone === "warning"
                      ? "warning"
                      : "success"
                }
              />
            </View>

            <MiniMap height={92} />

            <View style={styles.actions}>
              <PrimaryAction
                label="Call"
                icon="phone"
                tone="soft"
                style={styles.action}
                onPress={() => Alert.alert("Call", "Simulasi panggilan pelapor.")}
              />
              <PrimaryAction
                label="Chat"
                icon="message-outline"
                tone="soft"
                style={styles.action}
                onPress={() => navigateTo("/operator/chat" as Href)}
              />
              <PrimaryAction
                label="Detail"
                icon="file-search-outline"
                tone="secondary"
                style={styles.action}
                onPress={() => navigateTo("/operator/report-detail" as Href)}
              />
            </View>
          </Card>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  reportCard: {
    gap: spacing.md,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  reportText: {
    flex: 1,
  },
  reportTitle: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  reportMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  action: {
    flex: 1,
    minHeight: 42,
    paddingHorizontal: spacing.sm,
  },
});
