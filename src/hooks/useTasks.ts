import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../Firestore/FirebaseConfig";
import { Subject, Task } from "../types";

export default function useTasks() {
  const [taskTitle, setTaskTitle] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [deadlinePickerMode, setDeadlinePickerMode] = useState<"date" | "time">(
    "date",
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const subjectsQuery = query(
      collection(db, "subjects"),
      where("userId", "==", auth.currentUser.uid),
    );

    const unsubscribeSubjects = onSnapshot(subjectsQuery, (snapshot) => {
      const subjectList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Subject[];

      setSubjects(subjectList);

      if (!selectedSubjectId && subjectList.length > 0) {
        setSelectedSubjectId(subjectList[0].id);
      }
    });

    return () => unsubscribeSubjects();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", auth.currentUser.uid),
    );

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      setTasks(taskList);
    });

    return () => unsubscribeTasks();
  }, []);

  const resetForm = () => {
    setTaskTitle("");
    setDeadlineDate("");
    setDeadlineTime("");
    setShowDeadlinePicker(false);
    setIsCompleted(false);
    setEditingTaskId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (taskItem: Task) => {
    setEditingTaskId(taskItem.id);
    setTaskTitle(taskItem.title);
    const [storedDate = "", storedTime = ""] = (taskItem.deadline || "")
      .split(" ")
      .slice(0, 2);

    setDeadlineDate(storedDate);
    setDeadlineTime(storedTime);
    setIsCompleted(Boolean(taskItem.completed));
    setSelectedSubjectId(taskItem.subjectId);
    setIsModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSaveTask = async () => {
    if (!taskTitle.trim()) return;
    if (!auth.currentUser) return;
    if (!selectedSubjectId) return;

    try {
      const taskData = {
        title: taskTitle,
        subjectId: selectedSubjectId,
        userId: auth.currentUser.uid,
        deadline:
          deadlineDate && deadlineTime
            ? `${deadlineDate} ${deadlineTime}`
            : deadlineDate || "",
        completed: isCompleted,
      };

      if (editingTaskId) {
        await updateDoc(doc(db, "tasks", editingTaskId), taskData);
      } else {
        await addDoc(collection(db, "tasks"), taskData);
      }

      resetForm();
    } catch (error) {
      console.error("Fout bij toevoegen taak:", error);
    }
  };

  const handleDeleteCurrentTask = async () => {
    if (!editingTaskId) return;

    try {
      await deleteDoc(doc(db, "tasks", editingTaskId));
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Fout bij verwijderen taak:", error);
    }
  };

  const handleToggleCompleted = () => {
    setIsCompleted((currentValue) => !currentValue);
  };

  const parseDeadlinePickerValue = () => {
    const sourceValue =
      deadlinePickerMode === "date"
        ? deadlineDate
        : deadlineDate && deadlineTime
          ? `${deadlineDate}T${deadlineTime}:00`
          : "";

    const parsedDate = sourceValue ? new Date(sourceValue) : new Date();

    return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  };

  const formatDeadlineDate = (date: Date) => date.toISOString().slice(0, 10);

  const formatDeadlineTime = (date: Date) => date.toTimeString().slice(0, 5);

  const openDeadlinePicker = (mode: "date" | "time") => {
    setDeadlinePickerMode(mode);
    setShowDeadlinePicker(true);
  };

  const handleDeadlinePickerChange = (date: Date) => {
    if (deadlinePickerMode === "date") {
      setDeadlineDate(formatDeadlineDate(date));
    } else {
      setDeadlineTime(formatDeadlineTime(date));
    }
  };

  const handleDeadlinePickerDone = () => {
    setShowDeadlinePicker(false);
  };

  const deadlinePickerValue = parseDeadlinePickerValue();

  const deadlinePreview =
    deadlineDate && deadlineTime
      ? `${deadlineDate} ${deadlineTime}`
      : deadlineDate || deadlineTime || "Kies een datum en uur";

  return {
    taskTitle,
    setTaskTitle,
    deadlineDate,
    deadlineTime,
    showDeadlinePicker,
    deadlinePickerMode,
    isCompleted,
    tasks,
    subjects,
    selectedSubjectId,
    isModalOpen,
    editingTaskId,
    openAddModal,
    openEditModal,
    closeTaskModal,
    handleSaveTask,
    handleDeleteCurrentTask,
    handleToggleCompleted,
    openDeadlinePicker,
    handleDeadlinePickerChange,
    handleDeadlinePickerDone,
    deadlinePickerValue,
    deadlinePreview,
    setSelectedSubjectId,
  };
}
