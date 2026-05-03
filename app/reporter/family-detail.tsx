import { Href } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { colors, radius, spacing, typography } from "@/theme";
import {
  Card,
  IconButton,
  ScreenShell,
  StatusPill,
  navigateTo,
} from "@/components/app/MockAppUI";

export default function ReporterFamilyDetail() {
  const { members, loading, error } = useFamilyMembers();

  return (
    <ScreenShell
      role="reporter"
      activeTab="home"
      eyebrow="User - Home - Detail Keluarga"
      title="Keluarga"
      subtitle="Status sensor, aktivitas terakhir, dan kondisi terkini."
      action={
        <IconButton
          icon="plus"
          tone="primary"
          onPress={() => navigateTo("/reporter/add-family" as Href)}
        />
      }
    >
      {loading ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Memuat keluarga...</Text>
        </Card>
      ) : error ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Data belum bisa dimuat</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </Card>
      ) : members.length === 0 ? (
        <Card style={styles.emptyCard}>
          <MaterialCommunityIcons
            name="account-group-outline"
            size={36}
            color={colors.primary}
          />
          <Text style={styles.emptyTitle}>Belum ada anggota keluarga</Text>
          <Text style={styles.emptyText}>
            Tambahkan keluarga dari ID akun. Setelah mereka menerima permintaan,
            statusnya akan muncul di sini.
          </Text>
        </Card>
      ) : (
        <View style={styles.list}>
          {members.map((member) => (
            <Card key={member.id} style={styles.memberCard}>
            <View style={styles.memberHeader}>
              <View style={styles.memberAvatar}>
                <MaterialCommunityIcons
                  name="account-heart-outline"
                  size={22}
                  color={colors.secondary}
                />
              </View>
              <View style={styles.memberText}>
                <Text style={styles.memberName}>
                  {member.member?.full_name ?? "Anggota keluarga"}
                </Text>
                <Text style={styles.memberNote}>
                  ID: {member.member?.user_code ?? member.member_id}
                </Text>
              </View>
              <StatusPill
                label={member.status === "accepted" ? "Aman" : "Menunggu"}
                tone={member.status === "accepted" ? "success" : "warning"}
              />
            </View>
            <View style={styles.metrics}>
              {[
                member.relationship_label ?? "Keluarga",
                member.status,
                member.accepted_at ? "Sudah terhubung" : "Menunggu konfirmasi",
              ].map((metric) => (
                <View key={metric} style={styles.metricChip}>
                  <Text style={styles.metricText}>{metric}</Text>
                </View>
              ))}
            </View>
            </Card>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  emptyCard: {
    alignItems: "center",
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.bodyStrong,
    color: colors.text,
    textAlign: "center",
  },
  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
  memberCard: {
    gap: spacing.md,
  },
  memberHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  memberAvatar: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondaryLight,
  },
  memberText: {
    flex: 1,
  },
  memberName: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  memberNote: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  metricChip: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F8FEFF",
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  metricText: {
    fontSize: 11,
    color: colors.text,
  },
});
