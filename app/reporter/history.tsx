import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/theme";
import {
  Card,
  IconButton,
  ScreenShell,
  StatusPill,
} from "@/components/app/MockAppUI";

const history = [
  { title: "Kriminal - Jalan Sepi", time: "Laporan 09:30 WIB" },
  { title: "Medis - Prioritas Tinggi", time: "Laporan 10:30 WIB" },
  { title: "Kebakaran - Area Pemukiman", time: "Laporan 11:30 WIB" },
];

export default function ReporterHistory() {
  return (
    <ScreenShell
      role="reporter"
      activeTab="history"
      eyebrow="User - History"
      title="Laporan Selesai"
      subtitle="Riwayat laporan yang sudah ditangani."
      action={<IconButton icon="bell-outline" tone="secondary" />}
    >
      <View style={styles.list}>
        {history.map((item) => (
          <Card key={item.title} style={styles.itemCard}>
            <View style={styles.itemText}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            <StatusPill label="Selesai" tone="success" />
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
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  itemTime: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
});
