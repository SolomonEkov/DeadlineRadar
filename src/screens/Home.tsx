import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../Firestore/FirebaseConfig";
import { Subject, Task } from "../types";

const formatDeadline = (deadline?: string) => {
  if (!deadline) return "Geen deadline";

  const isoLikeValue = deadline.includes(" ")
    ? deadline.replace(" ", "T")
    : deadline;
  const date = new Date(isoLikeValue);

  if (Number.isNaN(date.getTime())) {
    return deadline;
  }

  return new Intl.DateTimeFormat("nl-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const deadlineToTimestamp = (deadline?: string) => {
  if (!deadline) return Number.POSITIVE_INFINITY;

  const isoLikeValue = deadline.includes(" ")
    ? deadline.replace(" ", "T")
    : deadline;
  const date = new Date(isoLikeValue);

  return Number.isNaN(date.getTime())
    ? Number.POSITIVE_INFINITY
    : date.getTime();
};

const Home = ({ navigation }: any) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setIsLoading(false);
      return;
    }

    const subjectsQuery = query(
      collection(db, "subjects"),
      where("userId", "==", auth.currentUser.uid),
    );

    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", auth.currentUser.uid),
    );

    let subjectsLoaded = false;
    let tasksLoaded = false;

    const unsubscribeSubjects = onSnapshot(subjectsQuery, (snapshot) => {
      const subjectList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Subject[];

      setSubjects(subjectList);
      subjectsLoaded = true;
      if (subjectsLoaded && tasksLoaded) setIsLoading(false);
    });

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      setTasks(taskList);
      tasksLoaded = true;
      if (subjectsLoaded && tasksLoaded) setIsLoading(false);
    });

    return () => {
      unsubscribeSubjects();
      unsubscribeTasks();
    };
  }, []);

  const openTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks],
  );

  const nextDeadlineTask = useMemo(() => {
    if (tasks.length === 0) return undefined;

    return [...tasks]
      .filter((task) => !task.completed && task.deadline)
      .sort(
        (a, b) =>
          deadlineToTimestamp(a.deadline) - deadlineToTimestamp(b.deadline),
      )[0];
  }, [tasks]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Deadline Radar</Text>
          <Text style={styles.title}>Welkom terug</Text>
          <Text style={styles.subtitle}>
            Hier zie je snel hoe je studieplanning ervoor staat.
          </Text>

          <View style={styles.heroMetaRow}>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>{subjects.length} vakken</Text>
            </View>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>
                {openTasks.length} open taken
              </Text>
            </View>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Dashboard laden...</Text>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Overzicht</Text>
                <Text style={styles.sectionSubtitle}>
                  Je belangrijkste cijfers
                </Text>
              </View>

              <Pressable
                style={styles.minimalActionButton}
                onPress={() => navigation.navigate("Taken")}
              >
                <Text style={styles.minimalActionText}>Alle taken</Text>
                <Ionicons name="chevron-forward" size={14} color="#334155" />
              </Pressable>
            </View>

            <View style={styles.grid}>
              <View style={[styles.statCard, styles.statCardBlue]}>
                <Text style={styles.statLabel}>Vakken</Text>
                <Text style={styles.statValue}>{subjects.length}</Text>
                <Text style={styles.statHint}>Actieve vakken in je lijst</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Taken</Text>
                <Text style={styles.statValue}>{tasks.length}</Text>
                <Text style={styles.statHint}>Totaal opgeslagen taken</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Open</Text>
                <Text style={styles.statValue}>{openTasks.length}</Text>
                <Text style={styles.statHint}>Taken die nog open staan</Text>
              </View>

              <View style={[styles.statCard, styles.statCardSoft]}>
                <Text style={styles.statLabel}>Deadline</Text>
                <Text style={styles.deadlineValue} numberOfLines={2}>
                  {nextDeadlineTask
                    ? formatDeadline(nextDeadlineTask.deadline)
                    : "Geen open deadlines"}
                </Text>
                <Text style={styles.statHint}>Eerstvolgende geplande taak</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Focus</Text>
              <Text style={styles.sectionSubtitle}>Wat komt hierna?</Text>
            </View>

            <View style={styles.highlightCard}>
              {nextDeadlineTask ? (
                <>
                  <View style={styles.highlightBadge}>
                    <Text style={styles.highlightBadgeText}>Volgende taak</Text>
                  </View>

                  <Text style={styles.highlightTitle}>
                    {nextDeadlineTask.title}
                  </Text>

                  <Text style={styles.highlightDeadline}>
                    {formatDeadline(nextDeadlineTask.deadline)}
                  </Text>

                  <Text style={styles.highlightDescription}>
                    Werk best eerst aan deze taak zodat je planning onder
                    controle blijft.
                  </Text>
                </>
              ) : (
                <>
                  <View style={styles.highlightBadge}>
                    <Text style={styles.highlightBadgeText}>Goed bezig</Text>
                  </View>

                  <Text style={styles.highlightTitle}>Geen open deadlines</Text>

                  <Text style={styles.highlightDescription}>
                    Je hebt momenteel geen open deadline met datum. Voeg een
                    taak toe of plan je volgende studiemoment.
                  </Text>
                </>
              )}
            </View>
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
  sectionHeader: {
    marginBottom: 12,
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 4,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
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
  statHint: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
  },
  deadlineValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E40AF",
    lineHeight: 22,
    marginBottom: 8,
  },
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

export default Home;
