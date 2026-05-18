import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Modal, Pressable, KeyboardAvoidingView, Platform } from "react-native";
// Note: using simple Modal fallback for Expo Go compatibility.
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
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Vakken</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setIsModalOpen(true)}
        >
          <Text style={styles.primaryButtonText}>Vak toevoegen</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isEditing = editingId === item.id;

          return (
            <View style={styles.item}>
              {isEditing ? (
                <TextInput
                  value={editText}
                  onChangeText={setEditText}
                  style={{
                    flex: 1,
                    borderBottomWidth: 1,
                    marginRight: 10,
                  }}
                />
              ) : (
                <Text style={{ flex: 1 }}>{item.name}</Text>
              )}

              <TouchableOpacity
                onPress={async () => {
                  if (isEditing) {
                    await updateDoc(doc(db, "subjects", item.id), {
                      name: editText,
                    });

                    setEditingId(null);
                    setEditText("");
                  } else {
                    setEditingId(item.id);
                    setEditText(item.name);
                  }
                }}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>
                  {isEditing ? "Save" : "Edit"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDeleteSubject(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        }}
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
            <Text style={styles.modalTitle}>Nieuw vak</Text>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setIsModalOpen(false)}
            >
              <Text style={styles.modalCloseText}>Sluiten</Text>
            </TouchableOpacity>
          </View>

          <Formik
            initialValues={{ name: "" }}
            validationSchema={subjectSchema}
            onSubmit={async (values, { resetForm }) => {
              await handleAddSubject(values.name);
              resetForm();
              setIsModalOpen(false);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <Text style={styles.inputLabel}>Vaknaam</Text>
                <TextInput
                  placeholder="Bijvoorbeeld: Web 3"
                  placeholderTextColor="#94A3B8"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  style={styles.input}
                />

                {touched.name && errors.name ? (
                  <Text style={styles.errorText}>{errors.name}</Text>
                ) : null}

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSubmit()}
                >
                  <Text style={styles.buttonText}>Toevoegen</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
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
