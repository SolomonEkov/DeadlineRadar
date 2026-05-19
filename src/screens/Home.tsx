import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../Firestore/FirebaseConfig";
import { Subject, Task } from "../types";
import HeroCard from "../components/HeroCard";
import SectionHeader from "../components/SectionHeader";
import StatCard from "../components/StatCard";
import FocusCard from "../components/FocusCard";

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
