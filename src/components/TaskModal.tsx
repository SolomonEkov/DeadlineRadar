import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Subject } from "../types";

type TaskModalProps = {
  visible: boolean;
  editingTaskId: string | null;
  taskTitle: string;
  onTaskTitleChange: (value: string) => void;
  deadlineDate: string;
  deadlineTime: string;
  deadlinePreview: string;
  showDeadlinePicker: boolean;
  deadlinePickerMode: "date" | "time";
  openDeadlinePicker: (mode: "date" | "time") => void;
  deadlinePickerValue: Date;
  onDeadlinePickerChange: (date: Date) => void;
  onDeadlinePickerDone: () => void;
  isCompleted: boolean;
  onToggleCompleted: () => void;
  subjects: Subject[];
  selectedSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  onSavePress: () => void;
  onDeletePress: () => void;
  onClose: () => void;
};

export default function TaskModal({
  visible,
  editingTaskId,
  taskTitle,
  onTaskTitleChange,
  deadlineDate,
  deadlineTime,
  deadlinePreview,
  showDeadlinePicker,
  deadlinePickerMode,
  openDeadlinePicker,
  deadlinePickerValue,
  onDeadlinePickerChange,
  onDeadlinePickerDone,
  isCompleted,
  onToggleCompleted,
  subjects,
  selectedSubjectId,
  onSelectSubject,
  onSavePress,
  onDeletePress,
  onClose,
}: TaskModalProps) {
  const handleDeletePress = () => {
    Alert.alert(
      "Bevestigen",
      "Weet je zeker dat je deze taak wilt verwijderen?",
      [
        { text: "Annuleren", style: "cancel" },
        {
          text: "Verwijderen",
          style: "destructive",
          onPress: onDeletePress,
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose} />
      <KeyboardAvoidingView
        style={styles.modalSheet}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalHandle} />
        <View style={styles.sheetContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingTaskId ? "Taak bewerken" : "Nieuwe taak"}
            </Text>
            <Pressable style={styles.modalClose} onPress={onClose}>
              <Text style={styles.modalCloseText}>Sluiten</Text>
            </Pressable>
          </View>

          <Text style={styles.inputLabel}>Taak</Text>
          <TextInput
            placeholder="Bijvoorbeeld: Deadline indienen"
            placeholderTextColor="#94A3B8"
            value={taskTitle}
            onChangeText={onTaskTitleChange}
            style={styles.input}
          />

          <Text style={styles.inputLabel}>Deadline</Text>
          <View style={styles.deadlineButtonsRow}>
            <Pressable
              style={styles.dateButton}
              onPress={() => openDeadlinePicker("date")}
            >
              <Text style={styles.dateButtonLabel}>Datum</Text>
              <Text style={styles.dateButtonText}>
                {deadlineDate || "Kies datum"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.dateButton}
              onPress={() => openDeadlinePicker("time")}
            >
              <Text style={styles.dateButtonLabel}>Uur</Text>
              <Text style={styles.dateButtonText}>
                {deadlineTime || "Kies uur"}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.deadlinePreview}>{deadlinePreview}</Text>

          {showDeadlinePicker ? (
            <View style={styles.pickerWrap}>
              <DateTimePicker
                value={deadlinePickerValue}
                mode={deadlinePickerMode}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, selectedDate) => {
                  if (selectedDate) {
                    onDeadlinePickerChange(selectedDate);
                  }

                  if (Platform.OS !== "ios") {
                    onDeadlinePickerDone();
                  }
                }}
              />

              {Platform.OS === "ios" ? (
                <Pressable
                  style={styles.pickerDoneButton}
                  onPress={onDeadlinePickerDone}
                >
                  <Text style={styles.pickerDoneButtonText}>Klaar</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Afgewerkt</Text>
            <Pressable
              style={[
                styles.toggleChip,
                isCompleted && styles.toggleChipActive,
              ]}
              onPress={onToggleCompleted}
            >
              <Text
                style={[
                  styles.toggleChipText,
                  isCompleted && styles.toggleChipTextActive,
                ]}
              >
                {isCompleted ? "Ja" : "Nee"}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Kies een vak</Text>

          <View style={styles.subjectList}>
            {subjects.map((subject) => {
              const isSelected = selectedSubjectId === subject.id;

              return (
                <Pressable
                  key={subject.id}
                  style={[
                    styles.subjectButton,
                    isSelected && styles.subjectButtonActive,
                  ]}
                  onPress={() => onSelectSubject(subject.id)}
                >
                  <Text
                    style={[
                      styles.subjectButtonText,
                      isSelected && styles.subjectButtonTextActive,
                    ]}
                  >
                    {subject.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.inlineSaveButton} onPress={onSavePress}>
              <Text style={styles.buttonText}>
                {editingTaskId ? "Opslaan" : "Toevoegen"}
              </Text>
            </Pressable>

            {editingTaskId ? (
              <Pressable
                style={styles.inlineDeleteButton}
                onPress={handleDeletePress}
              >
                <Text style={styles.deleteModalButtonText}>Verwijderen</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.42)",
  },
  modalSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "96%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 44,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 18,
  },
  modalHandle: {
    alignSelf: "center",
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#CBD5E1",
    marginBottom: 18,
  },
  sheetContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  modalClose: {
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    color: "#334155",
    fontWeight: "700",
    fontSize: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 18,
    fontSize: 15,
    color: "#0F172A",
  },
  deadlineButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  dateButtonLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateButtonText: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "600",
  },
  deadlinePreview: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 18,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  subjectList: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  subjectButton: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
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
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 4,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },
  toggleChip: {
    minWidth: 64,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  toggleChipActive: {
    backgroundColor: "#DCFCE7",
    borderColor: "#86EFAC",
  },
  toggleChipText: {
    color: "#475569",
    fontWeight: "700",
    fontSize: 13,
  },
  toggleChipTextActive: {
    color: "#166534",
  },
  pickerWrap: {
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  pickerDoneButton: {
    paddingVertical: 14,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  pickerDoneButtonText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 14,
  },
  actionRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  inlineSaveButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    elevation: 6,
  },
  inlineDeleteButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  deleteModalButtonText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 15,
  },
});
