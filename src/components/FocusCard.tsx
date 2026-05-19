import React from "react";
import { StyleSheet, Text, View } from "react-native";

type FocusCardProps = {
  title?: string;
  deadline?: string;
};

export default function FocusCard({ title, deadline }: FocusCardProps) {
  const hasTask = Boolean(title);

  return (
    <View style={styles.highlightCard}>
      {hasTask ? (
        <>
          <View style={styles.highlightBadge}>
            <Text style={styles.highlightBadgeText}>Volgende taak</Text>
          </View>

          <Text style={styles.highlightTitle}>{title}</Text>

          {deadline ? (
            <Text style={styles.highlightDeadline}>{deadline}</Text>
          ) : null}

          <Text style={styles.highlightDescription}>
            Werk best eerst aan deze taak zodat je planning onder controle
            blijft.
          </Text>
        </>
      ) : (
        <>
          <View style={styles.highlightBadge}>
            <Text style={styles.highlightBadgeText}>Goed bezig</Text>
          </View>

          <Text style={styles.highlightTitle}>Geen open deadlines</Text>

          <Text style={styles.highlightDescription}>
            Je hebt momenteel geen open deadline met datum. Voeg een taak toe of
            plan je volgende studiemoment.
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  highlightCard: {
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: "#0F172A",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  highlightBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginBottom: 12,
  },
  highlightBadgeText: {
    color: "#BFDBFE",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  highlightTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
    lineHeight: 28,
  },
  highlightDeadline: {
    color: "#93C5FD",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  highlightDescription: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
  },
});
