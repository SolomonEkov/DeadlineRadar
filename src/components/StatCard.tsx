import React from "react";
import { StyleSheet, Text, View } from "react-native";

type StatCardProps = {
  label: string;
  value: string | number;
  hint: string;
  variant?: "default" | "blue" | "soft";
  valueIsDeadline?: boolean;
};

export default function StatCard({
  label,
  value,
  hint,
  variant = "default",
  valueIsDeadline = false,
}: StatCardProps) {
  return (
    <View
      style={[
        styles.statCard,
        variant === "blue" && styles.statCardBlue,
        variant === "soft" && styles.statCardSoft,
      ]}
    >
      <Text style={styles.statLabel}>{label}</Text>
      <Text
        style={valueIsDeadline ? styles.deadlineValue : styles.statValue}
        numberOfLines={valueIsDeadline ? 2 : 1}
      >
        {value}
      </Text>
      <Text style={styles.statHint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    width: "48%",
    minHeight: 136,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 16,
    paddingHorizontal: 15,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  statCardBlue: {
    backgroundColor: "#EEF4FF",
    borderColor: "#C7DAFE",
  },
  statCardSoft: {
    backgroundColor: "#F8FAFC",
  },
  statLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  statValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  deadlineValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E40AF",
    lineHeight: 22,
    marginBottom: 8,
  },
  statHint: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
  },
});
