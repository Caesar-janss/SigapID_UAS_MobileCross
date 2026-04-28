import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow, spacing, typography } from "@/theme";
import { EmergencyWithReporter } from "@/types";
import {
  emergencyStatusLabel,
  emergencyTypeLabel,
  formatRelativeTime,
} from "@/utils/format";

interface Props {
  emergency: EmergencyWithReporter;
  onPress: () => void;
}

const typeColor: Record<string, string> = {
  police: colors.police,
  ambulance: colors.ambulance,
  firefighter: colors.firefighter,
  sos: colors.sos,
};

const statusBg: Record<string, string> = {
  pending: "#FEE2E2",
  accepted: "#DBEAFE",
  on_route: "#FEF3C7",
};

const statusText: Record<string, string> = {
  pending: colors.danger,
  accepted: colors.secondary,
  on_route: "#92400E",
};

export const EmergencyCard: React.FC<Props> = ({ emergency, onPress }) => {
  const isUrgent = emergency.status === "pending";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        shadow.sm,
        isUrgent && styles.urgent,
        pressed && { transform: [{ scale: 0.985 }] },
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.dot,
            { backgroundColor: typeColor[emergency.type] ?? colors.danger },
          ]}
        />
        <Text style={[typography.bodyStrong, { color: colors.text }]}>
          {emergencyTypeLabel(emergency.type)}
        </Text>
        <View style={{ flex: 1 }} />
        <View
          style={[
            styles.statusPill,
            { backgroundColor: statusBg[emergency.status] ?? colors.surfaceMuted },
          ]}
        >
          <Text
            style={[
              typography.micro,
              { color: statusText[emergency.status] ?? colors.textMuted },
            ]}
          >
            {emergencyStatusLabel(emergency.status).toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={[typography.h3, styles.reporter]} numberOfLines={1}>
        {emergency.reporter?.full_name ?? "Pelapor"}
      </Text>

      <Text style={styles.address} numberOfLines={2}>
        📍 {emergency.address ?? `${emergency.latitude.toFixed(4)}, ${emergency.longitude.toFixed(4)}`}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.time}>
          {formatRelativeTime(emergency.created_at)}
        </Text>
        {emergency.fall_detected && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>JATUH TERDETEKSI</Text>
          </View>
        )}
        {emergency.photo_url && (
          <View style={[styles.tag, { backgroundColor: colors.secondaryLight }]}>
            <Text style={[styles.tagText, { color: colors.secondary }]}>
              📷 FOTO
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  urgent: { borderColor: colors.primary, borderWidth: 1.5 },
  row: { flexDirection: "row", alignItems: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  reporter: { marginTop: spacing.sm, color: colors.text },
  address: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  time: { fontSize: 12, color: colors.textSubtle, flex: 1 },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 0.4,
  },
});
