import { Href } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { colors, radius, spacing, typography } from "@/theme";
import {
  Avatar,
  Card,
  IconButton,
  PrimaryAction,
  ScreenShell,
  StatusPill,
  navigateTo,
  showComingSoon,
} from "@/components/app/MockAppUI";

const emergencyTypes = [
  {
    title: "Kebakaran",
    description: "Api, asap tebal, ledakan, atau kebocoran gas.",
    icon: "fire",
    color: colors.firefighter,
    background: "#FFF7ED",
  },
  {
    title: "Medis",
    description: "Pingsan, luka berat, sesak napas, atau darurat kesehatan.",
    icon: "medical-bag",
    color: colors.success,
    background: "#ECFDF5",
  },
  {
    title: "Kriminal",
    description: "Ancaman, perampokan, kekerasan, atau tindakan mencurigakan.",
    icon: "shield-alert-outline",
    color: "#BE185D",
    background: "#FDF2F8",
  },
  {
    title: "Bencana",
    description: "Gempa, banjir, longsor, atau kondisi alam ekstrem.",
    icon: "weather-lightning",
    color: colors.warning,
    background: "#FFFBEB",
  },
] as const;

export default function ReporterDashboard() {
  const { profile } = useAuth();
  const { members, loading: familyLoading, error: familyError } = useFamilyMembers();
  const name = profile?.full_name ?? "User";
  const visibleMembers = members.slice(0, 2);

  return (
    <ScreenShell
      role="reporter"
      activeTab="home"
      eyebrow="User - Home"
      title={`Hi, ${firstName(name)}`}
      subtitle="Pantau keluarga dan kirim laporan darurat dari satu tempat."
      action={<Avatar name={name} />}
    >
      <Card style={styles.familyCard}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Monitoring Keluarga</Text>
            <Text style={styles.sectionCaption}>
              {familyLoading
                ? "Memuat anggota keluarga..."
                : `${members.length} anggota dipantau`}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => navigateTo("/reporter/family-detail" as Href)}
              style={styles.smallButton}
            >
              <Text style={styles.smallButtonText}>Detail</Text>
            </Pressable>
            <Pressable
              onPress={() => navigateTo("/reporter/add-family" as Href)}
              style={styles.smallButton}
            >
              <Text style={styles.smallButtonText}>Tambah</Text>
            </Pressable>
          </View>
        </View>

        {familyError ? (
          <Text style={styles.emptyText}>
            Data keluarga belum bisa dimuat: {familyError}
          </Text>
        ) : visibleMembers.length > 0 ? (
          <View style={styles.familyGrid}>
            {visibleMembers.map((member) => (
              <View key={member.id} style={styles.familyStatus}>
                <Text style={styles.familyName}>
                  {member.member?.full_name ?? "Anggota keluarga"}
                </Text>
                <StatusPill
                  label={member.status === "accepted" ? "Aman" : "Menunggu"}
                  tone={member.status === "accepted" ? "success" : "warning"}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyFamily}>
            <MaterialCommunityIcons
              name="account-plus-outline"
              size={26}
              color={colors.primary}
            />
            <Text style={styles.emptyTitle}>Belum ada keluarga</Text>
            <Text style={styles.emptyText}>
              Tambahkan keluarga pakai ID akun supaya status mereka muncul di
              sini.
            </Text>
          </View>
        )}
      </Card>

      <Card style={styles.reportCard}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Tombol Darurat</Text>
            <Text style={styles.sectionCaption}>
              Pilih jenis insiden untuk respons lebih cepat.
            </Text>
          </View>
          <IconButton
            icon="bell-alert-outline"
            tone="danger"
            onPress={() => navigateTo("/reporter/emergency-alert" as Href)}
          />
        </View>

        <PrimaryAction
          label="Lapor Keadaan Darurat"
          icon="alert-circle-outline"
          tone="danger"
          onPress={() => navigateTo("/reporter/tracking" as Href)}
        />

        <View style={styles.emergencyGrid}>
          {emergencyTypes.map((item) => (
            <Pressable
              key={item.title}
              onPress={() => showComingSoon(`Lapor ${item.title}`)}
              style={({ pressed }) => [
                styles.emergencyTile,
                { backgroundColor: item.background, borderColor: `${item.color}35` },
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={25}
                color={item.color}
              />
              <Text style={[styles.emergencyTitle, { color: item.color }]}>
                {item.title}
              </Text>
              <Text style={styles.emergencyText}>{item.description}</Text>
            </Pressable>
          ))}
        </View>
      </Card>
    </ScreenShell>
  );
}

function firstName(name: string) {
  return name.trim().split(" ")[0] || "User";
}

const styles = StyleSheet.create({
  familyCard: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  sectionCaption: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginLeft: "auto",
  },
  smallButton: {
    minHeight: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FEFF",
    borderWidth: 1,
    borderColor: colors.border,
  },
  smallButtonText: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: "700",
  },
  familyGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  familyStatus: {
    flex: 1,
    minHeight: 78,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F8FEFF",
    padding: spacing.md,
    justifyContent: "space-between",
  },
  familyName: {
    ...typography.caption,
    color: colors.text,
  },
  emptyFamily: {
    alignItems: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: "#F8FEFF",
    padding: spacing.lg,
  },
  emptyTitle: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
  reportCard: {
    gap: spacing.lg,
  },
  emergencyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  emergencyTile: {
    flexBasis: "47%",
    flexGrow: 1,
    minHeight: 142,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    justifyContent: "space-between",
  },
  emergencyTitle: {
    ...typography.bodyStrong,
  },
  emergencyText: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
