import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SectionHeaderProps = {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onPressAction,
}: SectionHeaderProps) {
  const hasAction = Boolean(actionLabel && onPressAction);

  return (
    <View style={styles.sectionHeaderRow}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>

      {hasAction ? (
        <Pressable style={styles.minimalActionButton} onPress={onPressAction}>
          <Text style={styles.minimalActionText}>{actionLabel}</Text>
          <Ionicons name="chevron-forward" size={14} color="#334155" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  minimalActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#DDE4EE",
    borderRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  minimalActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    letterSpacing: 0.2,
  },
});
