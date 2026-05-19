import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Subject } from "../types";

type SubjectListItemProps = {
  subject: Subject;
  isEditing: boolean;
  editText: string;
  onEditTextChange: (value: string) => void;
  onToggleEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
};

export default function SubjectListItem({
  subject,
  isEditing,
  editText,
  onEditTextChange,
  onToggleEdit,
  onSaveEdit,
  onDelete,
}: SubjectListItemProps) {
  return (
    <View style={styles.item}>
      {isEditing ? (
        <TextInput
          value={editText}
          onChangeText={onEditTextChange}
          style={styles.editInput}
        />
      ) : (
        <Text style={styles.subjectName}>{subject.name}</Text>
      )}

      <Pressable
        onPress={isEditing ? onSaveEdit : onToggleEdit}
        style={styles.actionButton}
      >
        <Text style={styles.actionButtonText}>
          {isEditing ? "Save" : "Edit"}
        </Text>
      </Pressable>

      <Pressable onPress={onDelete} style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
  subjectName: {
    flex: 1,
  },
  editInput: {
    flex: 1,
    borderBottomWidth: 1,
    marginRight: 10,
  },
  actionButton: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginLeft: 8,
  },
  actionButtonText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 13,
  },
});
