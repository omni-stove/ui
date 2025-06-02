import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueDate: string;
};
import {
  AppLayout, // Added AppLayout
  Card,
  Divider,
  FAB,
  IconButton,
  List,
  Surface,
  Switch,
  TextField,
} from ".."; // Path adjusted

const meta: Meta = {
  title: "Sandbox/Task Manager App", // Title adjusted
  parameters: {
    docs: {
      autodocs: false,
    },
  },
};

export default meta;

type Story = StoryObj;

export const TaskManagerApp: Story = {
  render: () => {
    const [tasks, setTasks] = useState<Task[]>([
      {
        id: 1,
        title: "プロジェクトの企画書作成",
        description: "新しいプロジェクトの企画書を作成し、チームに共有する",
        completed: false,
        priority: "high",
        dueDate: "2024-01-15",
      },
      {
        id: 2,
        title: "チームミーティング",
        description: "週次のチームミーティングに参加",
        completed: true,
        priority: "medium",
        dueDate: "2024-01-10",
      },
      {
        id: 3,
        title: "コードレビュー",
        description: "新機能のコードレビューを実施",
        completed: false,
        priority: "high",
        dueDate: "2024-01-12",
      },
      {
        id: 4,
        title: "ドキュメント更新",
        description: "APIドキュメントの更新作業",
        completed: false,
        priority: "low",
        dueDate: "2024-01-20",
      },
    ]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [showCompleted, setShowCompleted] = useState(true);

    const toggleTask = (id: number) => {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        ),
      );
    };

    const addTask = () => {
      if (newTaskTitle.trim()) {
        setTasks([
          ...tasks,
          {
            id: Date.now(),
            title: newTaskTitle,
            description: "",
            completed: false,
            priority: "medium",
            dueDate: "",
          },
        ]);
        setNewTaskTitle("");
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "high":
          return "#f44336";
        case "medium":
          return "#ff9800";
        case "low":
          return "#4caf50";
        default:
          return "#9e9e9e";
      }
    };

    const filteredTasks = showCompleted
      ? tasks
      : tasks.filter((task) => !task.completed);

    return (
      <AppLayout
        appbar={{
          title: "タスク管理",
          actions: [{ icon: "filter-variant", onPress: () => {} }],
        }}
      >
        <ScrollView style={styles.content}>
          {/* 新しいタスク追加 */}
          <Card style={styles.addTaskCard}>
            <Card.Content>
              <TextField
                label="新しいタスク"
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                endAdornment={{
                  type: "icon",
                  value: "plus",
                }}
                onSubmitEditing={addTask}
              />
            </Card.Content>
          </Card>

          {/* フィルターオプション */}
          <Surface style={styles.filterSection}>
            <List.Item
              title="完了済みタスクを表示"
              right={() => (
                <Switch
                  value={showCompleted}
                  onValueChange={setShowCompleted}
                />
              )}
            />
          </Surface>

          {/* タスクリスト */}
          <Card style={styles.taskListCard}>
            <Card.Title title={`タスク (${filteredTasks.length})`} />
            <Card.Content>
              {filteredTasks.map((task) => (
                <View key={task.id}>
                  <List.Item
                    title={task.title}
                    titleStyle={{
                      textDecorationLine: task.completed
                        ? "line-through"
                        : "none",
                      opacity: task.completed ? 0.6 : 1,
                    }}
                    left={() => (
                      <View style={styles.taskLeft}>
                        <IconButton
                          icon={
                            task.completed ? "check-circle" : "circle-outline"
                          }
                          onPress={() => toggleTask(task.id)}
                        />
                        <View
                          style={[
                            styles.priorityIndicator,
                            {
                              backgroundColor: getPriorityColor(task.priority),
                            },
                          ]}
                        />
                      </View>
                    )}
                    right={() => (
                      <IconButton icon="dots-vertical" onPress={() => {}} />
                    )}
                  />
                  <Divider />
                </View>
              ))}
            </Card.Content>
          </Card>
        </ScrollView>

        <FAB icon="plus" onPress={() => {}} />
      </AppLayout>
    );
  },
};

const styles = StyleSheet.create({
  // container style is no longer needed as AppLayout handles it
  content: {
    flex: 1,
    padding: 16,
  },
  addTaskCard: {
    marginBottom: 16,
  },
  filterSection: {
    paddingVertical: 8,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 1,
  },
  taskListCard: {
    marginBottom: 16,
  },
  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
});
