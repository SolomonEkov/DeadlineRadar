import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Modal, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  addDoc,
  collection,
  FirestoreDataConverter,
  getDocs,
  QueryDocumentSnapshot,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../Firestore/FirebaseConfig";
import { Formik } from "formik";
import * as Yup from "yup";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Subject } from "../types";
import ScreenHeaderAction from "../components/ScreenHeaderAction";
import SubjectListItem from "../components/SubjectListItem";
import SubjectModal from "../components/SubjectModal";

const subjectSchema = Yup.object({
  name: Yup.string().required("hmm vul eens een naam in!"),
});

const subjectConverter: FirestoreDataConverter<Subject> = {
  toFirestore: (subject) => {
    const { id, ...data } = subject;
    return data;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    return { id: snapshot.id, ...data } as Subject;
  },
};

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editText, setEditText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddSubject = async (name: string) => {
    if (!name.trim()) return;
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, "subjects"), {
        name,
        userId: auth.currentUser.uid,
      });
    } catch (error) {
      console.error("Fout bij toevoegen van vak: ", error);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, "subjects", id));
    } catch (error) {
      console.error("Fout bij verwijderen:", error);
    }
  };
  const handleEditSubject = async (id: string, newName: string) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, "subjects", id), {
        name: newName,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    const dbRef = query(
      collection(db, "subjects").withConverter(subjectConverter),
      where("userId", "==", auth.currentUser.uid),
    );

    const unsubscribe = onSnapshot(dbRef, (qs) => {
      let receivedSubjects: Subject[] = qs.docs.map((doc) => doc.data());

      setSubjects(receivedSubjects);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeaderAction
        title="Vakken"
        actionLabel="Vak toevoegen"
        onPressAction={() => setIsModalOpen(true)}
      />

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isEditing = editingId === item.id;

          return (
            <SubjectListItem
              subject={item}
              isEditing={isEditing}
              editText={editText}
              onEditTextChange={setEditText}
              onToggleEdit={() => {
                setEditingId(item.id);
                setEditText(item.name);
              }}
              onSaveEdit={async () => {
                await updateDoc(doc(db, "subjects", item.id), {
                  name: editText,
                });

                setEditingId(null);
                setEditText("");
              }}
              onDelete={() => handleDeleteSubject(item.id)}
            />
          );
        }}
      />

      <SubjectModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSubject={handleAddSubject}
      />
    </SafeAreaView>
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
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 14,
    fontSize: 15,
    color: "#0F172A",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    minWidth: 160,
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
  deleteButton: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#475569",
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
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
  },
});
