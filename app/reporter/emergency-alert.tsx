import { Href } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, shadow, spacing, typography } from "@/theme";
import {
  IconButton,
  PrimaryAction,
  ScreenShell,
  navigateTo,
  showComingSoon,
} from "@/components/app/MockAppUI";

export default function ReporterEmergencyAlert() {
  return (
    <ScreenShell
      role="reporter"
      eyebrow="Emergency Alert"
      title="Peringatan Darurat"
      subtitle="Sensor mendeteksi kondisi tidak biasa."
      action={<IconButton icon="close" onPress={() => navigateTo("/reporter/tracking" as Href)} />}
    >
      <View style={styles.alertPanel}>
        <View style={styles.ringOuter}>
          <View style={styles.ringMiddle}>
            <View style={styles.ringInner}>
              <MaterialCommunityIcons
                name="bell-ring"
                size={38}
                color={colors.textInverse}
              />
            </View>
          </View>
        </View>

        <Text style={styles.question}>Apakah Anda baik-baik saja?</Text>
        <Text style={styles.copy}>
          Kami mendeteksi guncangan keras. Jika tidak ada respons, sistem akan
          mengirim laporan medis otomatis.
        </Text>
        <Text style={styles.countdown}>10</Text>

        <PrimaryAction
          label="Ya, kirim bantuan sekarang"
          icon="ambulance"
          tone="danger"
          onPress={() => showComingSoon("Bantuan medis otomatis")}
        />
        <PrimaryAction
          label="Batalkan"
          tone="soft"
          onPress={() => navigateTo("/reporter/tracking" as Href)}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  alertPanel: {
    alignItems: "center",
    gap: spacing.lg,
    borderRadius: 22,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FFF7F7",
    ...shadow.md,
  },
  ringOuter: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
  },
  ringMiddle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FECACA",
  },
  ringInner: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
  },
  question: {
    ...typography.h1,
    color: colors.primaryDark,
    textAlign: "center",
  },
  copy: {
    ...typography.body,
    color: "#9F3A3A",
    textAlign: "center",
  },
  countdown: {
    fontSize: 52,
    fontWeight: "700",
    color: colors.primary,
  },
});
