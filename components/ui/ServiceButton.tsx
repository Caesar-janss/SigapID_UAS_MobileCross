import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow, spacing, typography } from "@/theme";
import { EmergencyType } from "@/types";

interface ServiceButtonProps {
  type: Exclude<EmergencyType, "sos">;
  onPress: () => void;
  disabled?: boolean;
}

const config: Record<
  Exclude<EmergencyType, "sos">,
  { label: string; emoji: string; color: string; description: string }
> = {
  police: {
    label: "Polisi",
    emoji: "🚓",
    color: colors.police,
    description: "Kejahatan, gangguan",
  },
  ambulance: {
    label: "Ambulans",
    emoji: "🚑",
    color: colors.ambulance,
    description: "Medis darurat",
  },
  firefighter: {
    label: "Pemadam",
    emoji: "🚒",
    color: colors.firefighter,
    description: "Kebakaran",
  },
};

export const ServiceButton: React.FC<ServiceButtonProps> = ({
  type,
  onPress,
  disabled,
}) => {
  const c = config[type];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        shadow.sm,
        pressed && !disabled && styles.pressed,
        disabled && { opacity: 0.5 },
      ]}
    >
      <View style={[styles.iconBubble, { backgroundColor: c.color + "1A" }]}>
        <Text style={styles.emoji}>{c.emoji}</Text>
      </View>
      <Text style={[typography.bodyStrong, { color: colors.text }]}>
        {c.label}
      </Text>
      <Text style={[typography.caption, styles.desc]}>{c.description}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { transform: [{ scale: 0.97 }] },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  emoji: { fontSize: 28 },
  desc: {
    color: colors.textSubtle,
    marginTop: 2,
    textAlign: "center",
  },
});
