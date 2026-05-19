import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../Firestore/FirebaseConfig";
import { Subject } from "../types";

export default function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editText, setEditText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const dbRef = query(
      collection(db, "subjects"),
      where("userId", "==", auth.currentUser.uid),
    );

    const unsubscribe = onSnapshot(dbRef, (qs) => {
      const receivedSubjects: Subject[] = qs.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Subject[];

      setSubjects(receivedSubjects);
    });

    return () => unsubscribe();
  }, []);

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

  const handleStartEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setEditText(subject.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, "subjects", id), {
        name: editText,
      });
      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error(error);
    }
  };

  const closeSubjectModal = () => setIsModalOpen(false);

  return {
    subjects,
    editText,
    editingId,
    isModalOpen,
    setIsModalOpen,
    setEditText,
    handleAddSubject,
    handleDeleteSubject,
    handleStartEdit,
    handleSaveEdit,
    closeSubjectModal,
  };
}
