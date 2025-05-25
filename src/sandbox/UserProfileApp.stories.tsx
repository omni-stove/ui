import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native"; // Added View back
import {
  AppLayout, // Added AppLayout
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  FAB,
  List,
  Searchbar,
  Snackbar,
  Surface,
  Switch,
  Typography,
} from ".."; // Path adjusted for new location

const meta: Meta = {
  title: "Sandbox/Application Examples/User Profile App", // Title adjusted
  parameters: {
    docs: {
      autodocs: false,
    },
  },
};

export default meta;

type Story = StoryObj;

export const UserProfileApp: Story = {
  render: () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
      <AppLayout
        appbar={{
          title: "プロフィール",
          backAction: { onPress: () => {} },
          actions: [{ icon: "dots-vertical", onPress: () => {} }],
        }}
      >
        <ScrollView style={styles.content}>
          {/* プロフィールセクション */}
          <Surface style={styles.profileSection}>
            <View style={styles.profileHeader}>
              <Avatar source="https://picsum.photos/200" />
              <View style={styles.profileInfo}>
                <Typography variant="headlineSmall">春日部つむぎ</Typography>
                <Typography variant="bodyMedium" style={styles.subtitle}>
                  ハイパー埼玉ギャル
                </Typography>
                <View style={styles.chipContainer}>
                  <Chip mode="outlined" compact>
                    フォロワー 1.2K
                  </Chip>
                  <Chip mode="outlined" compact style={styles.chipSpacing}>
                    フォロー中 234
                  </Chip>
                </View>
              </View>
            </View>
            <Button variant="filled" style={styles.editButton}>
              プロフィールを編集
            </Button>
          </Surface>

          {/* 検索バー */}
          <Searchbar
            placeholder="投稿を検索..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />

          {/* 設定セクション */}
          <Card style={styles.settingsCard}>
            <Card.Title title="設定" />
            <Card.Content>
              <List.Item
                title="通知"
                description="プッシュ通知を受け取る"
                left={(props) => <List.Icon {...props} icon="bell" />}
                right={() => (
                  <Switch
                    selected={notificationsEnabled}
                    onPress={() =>
                      setNotificationsEnabled(!notificationsEnabled)
                    }
                  />
                )}
              />
              <Divider />
              <List.Item
                title="プライバシー"
                description="プライバシー設定を管理"
                left={(props) => <List.Icon {...props} icon="shield-account" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => setSnackbarVisible(true)}
              />
              <Divider />
              <List.Item
                title="アカウント"
                description="アカウント情報を編集"
                left={(props) => <List.Icon {...props} icon="account-cog" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => setSnackbarVisible(true)}
              />
            </Card.Content>
          </Card>

          {/* アクティビティセクション */}
          <Card style={styles.activityCard}>
            <Card.Title title="最近のアクティビティ" />
            <Card.Content>
              <List.Item
                title="新しい投稿にいいね"
                description="2時間前"
                left={(props) => <List.Icon {...props} icon="heart" />}
              />
              <List.Item
                title="フォロワーが増えました"
                description="5時間前"
                left={(props) => <List.Icon {...props} icon="account-plus" />}
              />
              <List.Item
                title="コメントを投稿"
                description="1日前"
                left={(props) => <List.Icon {...props} icon="comment" />}
              />
            </Card.Content>
          </Card>
        </ScrollView>

        <FAB icon="plus" onPress={() => setSnackbarVisible(true)} />

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          機能が実装されました！
        </Snackbar>
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
  profileSection: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  subtitle: {
    color: "#666",
    marginTop: 4,
  },
  chipContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  chipSpacing: {
    marginLeft: 8,
  },
  editButton: {
    marginTop: 16,
  },
  searchbar: {
    marginBottom: 16,
  },
  settingsCard: {
    marginBottom: 16,
  },
  activityCard: {
    marginBottom: 16,
  },
});
