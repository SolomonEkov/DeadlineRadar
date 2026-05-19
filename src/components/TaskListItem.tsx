import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Task } from "../types";

type TaskListItemProps = {
  task: Task;
  subjectName: string;
  onPress: () => void;
};

export default function TaskListItem({
  task,
  subjectName,
  onPress,
}: TaskListItemProps) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.taskTitle,
            task.completed && styles.taskTitleCompleted,
          ]}
        >
          {task.title}
        </Text>
        <Text style={styles.taskSubject}>{subjectName}</Text>
        {task.deadline ? (
          <Text style={styles.taskDeadline}>Deadline: {task.deadline}</Text>
        ) : null}
      </View>
    </Pressable>
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
});
