import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../Firestore/FirebaseConfig";
import { Subject, Task } from "../types";

const formatDeadlineTimestamp = (deadline?: string) => {
  if (!deadline) return Number.POSITIVE_INFINITY;

  const isoLikeValue = deadline.includes(" ")
    ? deadline.replace(" ", "T")
    : deadline;
  const date = new Date(isoLikeValue);

  return Number.isNaN(date.getTime())
    ? Number.POSITIVE_INFINITY
    : date.getTime();
};

export const formatDeadline = (deadline?: string) => {
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

export default function useHomeDashboard() {
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
          formatDeadlineTimestamp(a.deadline) -
          formatDeadlineTimestamp(b.deadline),
      )[0];
  }, [tasks]);

  return {
    subjects,
    tasks,
    openTasks,
    nextDeadlineTask,
    isLoading,
  };
}
