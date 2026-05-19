import React from "react";
import { StyleSheet, Text, View } from "react-native";

type HeroCardProps = {
  subjectsCount: number;
  openTasksCount: number;
};

export default function HeroCard({
  subjectsCount,
  openTasksCount,
}: HeroCardProps) {
  return (
    <View style={styles.heroCard}>
      <Text style={styles.eyebrow}>Deadline Radar</Text>
      <Text style={styles.title}>Welkom terug</Text>
      <Text style={styles.subtitle}>
        Hier zie je snel hoe je studieplanning ervoor staat.
      </Text>

      <View style={styles.heroMetaRow}>
        <View style={styles.heroPill}>
          <Text style={styles.heroPillText}>{subjectsCount} vakken</Text>
        </View>
        <View style={styles.heroPill}>
          <Text style={styles.heroPillText}>{openTasksCount} open taken</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2563EB",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#475569",
    fontWeight: "500",
    maxWidth: "92%",
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  heroPill: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  heroPillText: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "700",
  },
});
