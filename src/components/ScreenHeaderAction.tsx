import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ScreenHeaderActionProps = {
  title: string;
  actionLabel: string;
  onPressAction: () => void;
};

export default function ScreenHeaderAction({
  title,
  actionLabel,
  onPressAction,
}: ScreenHeaderActionProps) {
  return (
    <View style={styles.headerRow}>
      <Text style={styles.title}>{title}</Text>
      <Pressable style={styles.primaryButton} onPress={onPressAction}>
        <Text style={styles.primaryButtonText}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.6,
    alignSelf: "flex-start",
  },
  primaryButton: {
    backgroundColor: "#0F172A",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  primaryButtonText: {
    color: "#F8FAFC",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.2,
  },
});
