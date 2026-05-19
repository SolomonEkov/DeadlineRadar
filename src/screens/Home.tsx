import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useHomeDashboard, { formatDeadline } from "../hooks/useHomeDashboard";
import HeroCard from "../components/HeroCard";
import SectionHeader from "../components/SectionHeader";
import StatCard from "../components/StatCard";
import FocusCard from "../components/FocusCard";

const Home = ({ navigation }: any) => {
  const { subjects, tasks, openTasks, nextDeadlineTask, isLoading } =
    useHomeDashboard();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <HeroCard
          subjectsCount={subjects.length}
          openTasksCount={openTasks.length}
        />

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Dashboard laden...</Text>
          </View>
        ) : (
          <>
            <SectionHeader
              title="Overzicht"
              subtitle="Je belangrijkste cijfers"
              actionLabel="Alle taken"
              onPressAction={() => navigation.navigate("Taken")}
            />

            <View style={styles.grid}>
              <StatCard
                label="Vakken"
                value={subjects.length}
                hint="Actieve vakken in je lijst"
                variant="blue"
              />

              <StatCard
                label="Taken"
                value={tasks.length}
                hint="Totaal opgeslagen taken"
              />

              <StatCard
                label="Open"
                value={openTasks.length}
                hint="Taken die nog open staan"
              />

              <StatCard
                label="Deadline"
                value={
                  nextDeadlineTask
                    ? formatDeadline(nextDeadlineTask.deadline)
                    : "Geen open deadlines"
                }
                hint="Eerstvolgende geplande taak"
                variant="soft"
                valueIsDeadline
              />
            </View>

            <SectionHeader title="Focus" subtitle="Wat komt hierna?" />

            <FocusCard
              title={nextDeadlineTask?.title}
              deadline={
                nextDeadlineTask
                  ? formatDeadline(nextDeadlineTask.deadline)
                  : undefined
              }
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
  },
  loadingWrap: {
    marginTop: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
});

export default Home;
