import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Modal, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../Firestore/FirebaseConfig";
import { Subject } from "../types";

type TaskItem = {
  id: string;
  title: string;
  subjectId: string;
  userId: string;
};

export default function Tasks() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, [selectedSubjectId]);

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
      })) as TaskItem[];

      setTasks(taskList);
    });

    return () => unsubscribeTasks();
  }, []);

  const handleAddTask = async () => {
    if (!task.trim()) return;
    if (!auth.currentUser) return;
    if (!selectedSubjectId) return;

    try {
      await addDoc(collection(db, "tasks"), {
        title: task,
        subjectId: selectedSubjectId,
        userId: auth.currentUser.uid,
      });

      setTask("");
    } catch (error) {
      console.error("Fout bij toevoegen taak:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      console.error("Fout bij verwijderen taak:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Taken</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setIsModalOpen(true)}
        >
          <Text style={styles.primaryButtonText}>Taak toevoegen</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        style={{ width: "100%", marginTop: 8 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const subject = subjects.find((s) => s.id === item.subjectId);

          return (
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskSubject}>
                  {subject?.name || "Geen vak"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTask(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nog geen taken toegevoegd.</Text>
        }
      />

      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsModalOpen(false)}
        />
        <KeyboardAvoidingView
          style={styles.modalSheet}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nieuwe taak</Text>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setIsModalOpen(false)}
            >
              <Text style={styles.modalCloseText}>Sluiten</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Taak</Text>
          <TextInput
            placeholder="Bijvoorbeeld: Deadline indienen"
            placeholderTextColor="#94A3B8"
            value={task}
            onChangeText={setTask}
            style={styles.input}
          />

          <Text style={styles.label}>Kies een vak</Text>

          <View style={styles.subjectList}>
            {subjects.map((subject) => {
              const isSelected = selectedSubjectId === subject.id;

              return (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.subjectButton,
                    isSelected && styles.subjectButtonActive,
                  ]}
                  onPress={() => setSelectedSubjectId(subject.id)}
                >
                  <Text
                    style={[
                      styles.subjectButtonText,
                      isSelected && styles.subjectButtonTextActive,
                    ]}
                  >
                    {subject.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await handleAddTask();
              setIsModalOpen(false);
            }}
          >
            <Text style={styles.buttonText}>Toevoegen</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.6,
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 16,
    fontSize: 15,
    color: "#0F172A",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 12,
  },
  subjectList: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  subjectButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  subjectButtonActive: {
    backgroundColor: "#DBEAFE",
    borderColor: "#2563EB",
  },
  subjectButtonText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 14,
  },
  subjectButtonTextActive: {
    color: "#1D4ED8",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 24,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  primaryButton: {
    backgroundColor: "#0F172A",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  primaryButtonText: {
    color: "#F8FAFC",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  taskTitle: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  taskSubject: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 13,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#CBD5F5",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.5)",
  },
  modalSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "90%",
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalClose: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
  },
  modalCloseText: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
});
