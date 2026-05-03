import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, spacing, typography } from "@/theme";
import {
  Card,
  ChatBubble,
  IconButton,
  PrimaryAction,
  ScreenShell,
} from "@/components/app/MockAppUI";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ReporterChat() {
  return (
    <ScreenShell
      role="reporter"
      eyebrow="User - Tracking - Pesan"
      title="Alya Permata"
      subtitle="Terhubung dengan dispatcher"
      action={<IconButton icon="phone" tone="secondary" />}
      scroll={false}
    >
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={12}
      >
        <Card style={styles.alertCard}>
          <Text style={styles.alertText}>
            Status darurat aktif. Bantuan sedang menuju. Tetap tenang dan balas
            jika memungkinkan.
          </Text>
        </Card>

        <ScrollView
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ChatBubble>
            Halo, ini pusat bantuan. Apakah Anda bisa memberi tahu kondisi saat
            ini?
          </ChatBubble>
          <ChatBubble mine>
            Saya sesak napas dan sulit berdiri. Saya ada di depan minimarket.
          </ChatBubble>
          <ChatBubble>
            Baik, unit medis sudah menuju lokasi Anda. Mohon tetap di tempat
            yang aman.
          </ChatBubble>
          <Card style={styles.voiceBubble}>
            <View style={styles.playButton}>
              <MaterialCommunityIcons
                name="play"
                size={20}
                color={colors.textInverse}
              />
            </View>
            <View>
              <Text style={styles.voiceTitle}>Pesan suara</Text>
              <Text style={styles.voiceTime}>00:18 detik</Text>
            </View>
          </Card>
          <ChatBubble mine>Baik, saya tunggu. Terima kasih.</ChatBubble>
        </ScrollView>

        <View style={styles.composer}>
          <View style={styles.quickActions}>
            <PrimaryAction
              label="Voice"
              icon="microphone"
              tone="soft"
              style={styles.quickButton}
              onPress={() => Alert.alert("Voice", "Simulasi pesan suara.")}
            />
            <PrimaryAction
              label="Call"
              icon="phone"
              tone="secondary"
              style={styles.quickButton}
              onPress={() => Alert.alert("Call", "Simulasi panggilan.")}
            />
          </View>

          <View style={styles.inputBar}>
            <MaterialCommunityIcons
              name="emoticon-outline"
              size={20}
              color={colors.textMuted}
            />
            <TextInput
              style={styles.input}
              placeholder="Tulis pesan..."
              placeholderTextColor={colors.textSubtle}
            />
            <MaterialCommunityIcons
              name="paperclip"
              size={20}
              color={colors.text}
            />
            <MaterialCommunityIcons name="send" size={20} color={colors.text} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    gap: spacing.md,
    minHeight: 0,
  },
  alertCard: {
    backgroundColor: "#ECFDF5",
    borderColor: "#BBF7D0",
  },
  alertText: {
    ...typography.caption,
    color: "#047857",
    lineHeight: 19,
  },
  messages: {
    flex: 1,
    minHeight: 0,
  },
  messagesContent: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  voiceBubble: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  playButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F80C5",
  },
  voiceTitle: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  voiceTime: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  quickButton: {
    flex: 1,
  },
  composer: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  inputBar: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    color: colors.text,
  },
});
