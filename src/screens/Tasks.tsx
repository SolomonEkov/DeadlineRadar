import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeaderAction from "../components/ScreenHeaderAction";
import TaskListItem from "../components/TaskListItem";
import TaskModal from "../components/TaskModal";
import useTasks from "../hooks/useTasks";

export default function Tasks() {
  const {
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
  } = useTasks();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeaderAction
        title="Taken"
        actionLabel="Taak toevoegen"
        onPressAction={openAddModal}
      />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        style={{ width: "100%", marginTop: 8 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const subject = subjects.find((s) => s.id === item.subjectId);

          return (
            <TaskListItem
              task={item}
              subjectName={subject?.name || "Geen vak"}
              onPress={() => openEditModal(item)}
            />
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nog geen taken toegevoegd.</Text>
        }
      />

      <TaskModal
        visible={isModalOpen}
        editingTaskId={editingTaskId}
        taskTitle={taskTitle}
        onTaskTitleChange={setTaskTitle}
        deadlineDate={deadlineDate}
        deadlineTime={deadlineTime}
        deadlinePreview={deadlinePreview}
        showDeadlinePicker={showDeadlinePicker}
        deadlinePickerMode={deadlinePickerMode}
        openDeadlinePicker={openDeadlinePicker}
        deadlinePickerValue={deadlinePickerValue}
        onDeadlinePickerChange={handleDeadlinePickerChange}
        onDeadlinePickerDone={handleDeadlinePickerDone}
        isCompleted={isCompleted}
        onToggleCompleted={handleToggleCompleted}
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        onSelectSubject={setSelectedSubjectId}
        onSavePress={async () => {
          await handleSaveTask();
          closeTaskModal();
        }}
        onDeletePress={handleDeleteCurrentTask}
        onClose={closeTaskModal}
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
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },
  taskSubject: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "500",
  },
  taskDeadline: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },

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
  sheetContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 24,
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
