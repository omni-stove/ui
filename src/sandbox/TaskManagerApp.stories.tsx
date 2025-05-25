import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
    const [tasks, setTasks] = useState([
      {
        id: 1,
        title: "プロジェクトの企画書作成",
        completed: false,
        priority: "high",
      },
      {
        id: 2,
        title: "チームミーティング",
        completed: true,
        priority: "medium",
      },
      { id: 3, title: "コードレビュー", completed: false, priority: "high" },
      { id: 4, title: "ドキュメント更新", completed: false, priority: "low" },
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
            completed: false,
            priority: "medium",
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
                  selected={showCompleted}
                  onPress={() => setShowCompleted(!showCompleted)}
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
