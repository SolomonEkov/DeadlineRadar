import React from "react";
import { StyleSheet, Text, View } from "react-native";

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={styles.headerSection}>
      <Text style={styles.mainTitle}>{title}</Text>
      <Text style={styles.tagline}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    alignItems: "center",
    marginBottom: 56,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  tagline: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
});
