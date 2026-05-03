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
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  useEmergencyActions,
  useEmergencyChat,
  useEmergencyReport,
  useReporterReports,
} from "@/hooks/useEmergencyReports";
import { useAuth } from "@/hooks/useAuth";
import { emergencyStatusLabel } from "@/utils/format";
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
  const params = useLocalSearchParams<{ reportId?: string }>();
  const { profile } = useAuth();
  const { activeReport } = useReporterReports();
  const reportId = params.reportId ?? activeReport?.id;
  const { report } = useEmergencyReport(reportId);
  const { messages, loading, error, sending, sendMessage, reload } =
    useEmergencyChat(reportId);
  const { finishReport } = useEmergencyActions();
  const [draft, setDraft] = useState("");
  const visibleMessages = messages.filter((message) => message.kind !== "system");
  const scrollRef = useRef<ScrollView>(null);

  const scrollToLatest = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated });
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload({ silent: true });
      scrollToLatest(false);
    }, [reload, scrollToLatest]),
  );

  useEffect(() => {
    scrollToLatest();
  }, [scrollToLatest, visibleMessages.length]);

  const handleSend = async () => {
    try {
      await sendMessage(draft);
      setDraft("");
    } catch (sendError) {
      Alert.alert(
        "Gagal mengirim pesan",
        sendError instanceof Error ? sendError.message : "Terjadi kesalahan.",
      );
    }
  };

  const handleVoice = async () => {
    try {
      await sendMessage("Pelapor mengirim pesan suara.", "voice", {
        voiceDurationSeconds: 10,
      });
    } catch (sendError) {
      Alert.alert(
        "Voice gagal",
        sendError instanceof Error ? sendError.message : "Terjadi kesalahan.",
      );
    }
  };

  const handleFinish = async () => {
    if (!reportId) return;

    try {
      await finishReport(reportId);
      router.replace("/reporter/history");
    } catch (finishError) {
      Alert.alert(
        "Gagal menyelesaikan laporan",
        finishError instanceof Error ? finishError.message : "Terjadi kesalahan.",
      );
    }
  };

  return (
    <ScreenShell
      role="reporter"
      title={report?.assigned_operator?.full_name ?? "Operator"}
      subtitle={
        report
          ? `Terhubung - ${emergencyStatusLabel(report.status)}`
          : "Pilih laporan aktif untuk mulai chat"
      }
      action={
        <IconButton
          icon="phone"
          tone="secondary"
          onPress={() => Alert.alert("Call", "Fitur panggilan sedang disiapkan.")}
        />
      }
      scroll={false}
    >
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={12}
      >
        {!!error && <Text style={styles.errorText}>Chat gagal dimuat.</Text>}

        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollToLatest(false)}
        >
          {loading ? (
            <Text style={styles.emptyText}>Memuat pesan...</Text>
          ) : visibleMessages.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada pesan. Sapa operator dulu.</Text>
          ) : (
            visibleMessages.map((message) =>
              message.kind === "voice" ? (
                <Card
                  key={message.id}
                  style={[
                    styles.voiceBubble,
                    message.sender_id === profile?.id && styles.voiceBubbleMine,
                  ]}
                >
                  <View style={styles.playButton}>
                    <MaterialCommunityIcons
                      name="play"
                      size={20}
                      color={colors.textInverse}
                    />
                  </View>
                  <View>
                    <Text style={styles.voiceTitle}>{message.body ?? "Pesan suara"}</Text>
                    <Text style={styles.voiceTime}>
                      {message.voice_duration_seconds ?? 0} detik
                    </Text>
                  </View>
                </Card>
              ) : (
                <ChatBubble key={message.id} mine={message.sender_id === profile?.id}>
                  {message.body}
                </ChatBubble>
              ),
            )
          )}
        </ScrollView>

        <View style={styles.composer}>
          <View style={styles.quickActions}>
            <PrimaryAction
              label="Voice"
              icon="microphone"
              tone="soft"
              style={styles.quickButton}
              onPress={handleVoice}
            />
            <PrimaryAction
              label="Call"
              icon="phone"
              tone="secondary"
              style={styles.quickButton}
              onPress={() => Alert.alert("Call", "Fitur panggilan sedang disiapkan.")}
            />
            <PrimaryAction
              label="Selesai"
              icon="check-circle-outline"
              tone="danger"
              style={styles.quickButton}
              onPress={handleFinish}
            />
          </View>

          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              placeholder="Tulis pesan..."
              placeholderTextColor={colors.textSubtle}
              value={draft}
              onChangeText={setDraft}
              editable={!sending && !!reportId}
            />
            <MaterialCommunityIcons
              name="send"
              size={20}
              color={colors.text}
              onPress={handleSend}
            />
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
  errorText: {
    ...typography.caption,
    color: colors.danger,
    textAlign: "center",
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
  voiceBubbleMine: {
    alignSelf: "flex-end",
    backgroundColor: "#E8F4FF",
    borderColor: "#BFDBFE",
  },
  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
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
