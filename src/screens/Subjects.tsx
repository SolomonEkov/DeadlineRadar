import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
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
import { useEffect, useState } from "react";
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
      <Text style={styles.title}>Vak toevoegen</Text>

      <Formik
        initialValues={{ name: "" }}
        validationSchema={subjectSchema}
        onSubmit={async (values, { resetForm }) => {
          await handleAddSubject(values.name);
          resetForm();
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
            <TextInput
              placeholder="Vak naam"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              style={styles.input}
            />

            {touched.name && errors.name ? <Text>{errors.name}</Text> : null}

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Toevoegen</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    maxWidth: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  deleteButton: {
    backgroundColor: "transparent",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  deleteButtonText: {
    color: "#6B7280",
    fontWeight: "500",
    fontSize: 12,
  },
});
