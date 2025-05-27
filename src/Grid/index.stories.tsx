import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { View } from "react-native";
import { Card } from "react-native-paper";
import { Grid as Component, GridItem } from ".";
import { Typography } from "../Typography";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  parameters: {
    docs: {
      description: {
        component: "Material Design 3準拠のMasonryレイアウトGridコンポーネント",
      },
    },
  },
  argTypes: {
    spacing: {
      control: { type: "select" },
      options: ["compact", "comfortable", "spacious", 8, 16, 24],
      description: "アイテム間のスペーシング",
    },
    margin: {
      control: { type: "number" },
      description: "外側のマージン",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const SampleCard = ({
  height,
  title,
  color,
}: { height: number; title: string; color?: string }) => (
  <Card
    style={{ height, backgroundColor: color || "#f5f5f5", marginBottom: 0 }}
  >
    <Card.Content style={{ padding: 16 }}>
      <Typography variant="titleMedium">{title}</Typography>
      <Typography variant="bodySmall">高さ: {height}px</Typography>
    </Card.Content>
  </Card>
);

const args: Story["args"] = {
  spacing: "comfortable",
  margin: 16,
};

export const Default: Story = {
  args,
  render: (args) => (
    <Component {...args}>
      <SampleCard height={200} title="Card 1" color="#e3f2fd" />
      <SampleCard height={150} title="Card 2" color="#f3e5f5" />
      <SampleCard height={300} title="Card 3" color="#e8f5e8" />
      <SampleCard height={180} title="Card 4" color="#fff3e0" />
      <SampleCard height={220} title="Card 5" color="#fce4ec" />
      <SampleCard height={160} title="Card 6" color="#e0f2f1" />
    </Component>
  ),
};

export const SpacingDemo: Story = {
  args: {
    ...args,
    spacing: "spacious",
  },
  render: (args) => (
    <Component {...args}>
      <SampleCard height={250} title="Large Card 1" color="#e3f2fd" />
      <SampleCard height={180} title="Medium Card 2" color="#f3e5f5" />
      <SampleCard height={320} title="Extra Large Card 3" color="#e8f5e8" />
      <SampleCard height={200} title="Medium Card 4" color="#fff3e0" />
    </Component>
  ),
};

export const CompactSpacing: Story = {
  args: {
    ...args,
    spacing: "compact",
  },
  render: (args) => (
    <Component {...args}>
      <SampleCard height={180} title="Card 1" color="#e3f2fd" />
      <SampleCard height={220} title="Card 2" color="#f3e5f5" />
      <SampleCard height={160} title="Card 3" color="#e8f5e8" />
      <SampleCard height={240} title="Card 4" color="#fff3e0" />
      <SampleCard height={200} title="Card 5" color="#fce4ec" />
      <SampleCard height={190} title="Card 6" color="#e0f2f1" />
      <SampleCard height={170} title="Card 7" color="#f1f8e9" />
      <SampleCard height={210} title="Card 8" color="#e8eaf6" />
      <SampleCard height={180} title="Card 9" color="#fef7ff" />
    </Component>
  ),
};

export const MixedHeights: Story = {
  args: {
    ...args,
    spacing: "comfortable",
  },
  render: (args) => (
    <Component {...args}>
      <SampleCard height={120} title="Small" color="#ffcdd2" />
      <SampleCard height={400} title="Extra Large" color="#c8e6c9" />
      <SampleCard height={180} title="Medium" color="#bbdefb" />
      <SampleCard height={80} title="Tiny" color="#f8bbd9" />
      <SampleCard height={280} title="Large" color="#dcedc8" />
      <SampleCard height={150} title="Small-Medium" color="#ffe0b2" />
      <SampleCard height={350} title="Very Large" color="#d1c4e9" />
      <SampleCard height={100} title="Small" color="#ffccbc" />
      <SampleCard height={220} title="Medium-Large" color="#b2dfdb" />
      <SampleCard height={60} title="Mini" color="#f0f4c3" />
    </Component>
  ),
};

export const ResponsiveDemo: Story = {
  args: {
    ...args,
    spacing: "comfortable",
  },
  render: (args) => (
    <View>
      <Typography variant="bodyLarge">
        画面サイズを変更してレスポンシブ動作を確認
      </Typography>
      <Component {...args}>
        <SampleCard height={200} title="Responsive 1" color="#e3f2fd" />
        <SampleCard height={150} title="Responsive 2" color="#f3e5f5" />
        <SampleCard height={300} title="Responsive 3" color="#e8f5e8" />
        <SampleCard height={180} title="Responsive 4" color="#fff3e0" />
        <SampleCard height={220} title="Responsive 5" color="#fce4ec" />
        <SampleCard height={160} title="Responsive 6" color="#e0f2f1" />
        <SampleCard height={240} title="Responsive 7" color="#f1f8e9" />
        <SampleCard height={190} title="Responsive 8" color="#e8eaf6" />
      </Component>
    </View>
  ),
};

export const StandardGridResponsive: Story = {
  args: {
    ...args,
    variant: "standard",
    spacing: "comfortable",
  },
  render: (args) => (
    <View>
      <Typography variant="bodyLarge">
        Material Design 3 - レスポンシブグリッドシステム
      </Typography>
      <Typography variant="labelLarge" color="onSurfaceVariant">
        画面サイズを変更して動作を確認してください
      </Typography>
      <Component {...args}>
        <GridItem span={12} spacing="comfortable">
          <Card style={{ backgroundColor: "#ffcdd2" }}>
            <Card.Content style={{ padding: 16 }}>
              <Typography variant="titleMedium">Header (12/12)</Typography>
              <Typography variant="bodySmall">
                フルワイズヘッダー - 常に100%
              </Typography>
            </Card.Content>
          </Card>
        </GridItem>
        <GridItem span={8} spacing="comfortable">
          <Card style={{ backgroundColor: "#c8e6c9" }}>
            <Card.Content style={{ padding: 16 }}>
              <Typography variant="titleMedium">Main Content (8/12)</Typography>
              <Typography variant="bodySmall">
                メインコンテンツエリア
              </Typography>
            </Card.Content>
          </Card>
        </GridItem>
        <GridItem span={4} spacing="comfortable">
          <Card style={{ backgroundColor: "#bbdefb" }}>
            <Card.Content style={{ padding: 16 }}>
              <Typography variant="titleMedium">Sidebar (4/12)</Typography>
              <Typography variant="bodySmall">サイドバー</Typography>
            </Card.Content>
          </Card>
        </GridItem>
        <GridItem span={6} spacing="comfortable">
          <Card style={{ backgroundColor: "#dcedc8" }}>
            <Card.Content style={{ padding: 16 }}>
              <Typography variant="titleMedium">Feature 1 (6/12)</Typography>
              <Typography variant="bodySmall">50%幅</Typography>
            </Card.Content>
          </Card>
        </GridItem>
        <GridItem span={6} spacing="comfortable">
          <Card style={{ backgroundColor: "#ffe0b2" }}>
            <Card.Content style={{ padding: 16 }}>
              <Typography variant="titleMedium">Feature 2 (6/12)</Typography>
              <Typography variant="bodySmall">50%幅</Typography>
            </Card.Content>
          </Card>
        </GridItem>
        <GridItem span={3} spacing="comfortable">
          <Card style={{ backgroundColor: "#f8bbd9" }}>
            <Card.Content style={{ padding: 16 }}>
              <Typography variant="titleMedium">Card 1 (3/12)</Typography>
              <Typography variant="bodySmall">25%幅</Typography>
            </Card.Content>
          </Card>
        </GridItem>
        <GridItem span={3} spacing="comfortable">
          <Card style={{ backgroundColor: "#e1bee7" }}>
            <Card.Content style={{ padding: 16 }}>
              <Typography variant="titleMedium">Card 2 (3/12)</Typography>
              <Typography variant="bodySmall">25%幅</Typography>
            </Card.Content>
          </Card>
        </GridItem>
        <GridItem span={3} spacing="comfortable">
          <Card style={{ backgroundColor: "#c5cae9" }}>
            <Card.Content style={{ padding: 16 }}>
              <Typography variant="titleMedium">Card 3 (3/12)</Typography>
              <Typography variant="bodySmall">25%幅</Typography>
            </Card.Content>
          </Card>
        </GridItem>
        <GridItem span={3} spacing="comfortable">
          <Card style={{ backgroundColor: "#b2dfdb" }}>
            <Card.Content style={{ padding: 16 }}>
              <Typography variant="titleMedium">Card 4 (3/12)</Typography>
              <Typography variant="bodySmall">25%幅</Typography>
            </Card.Content>
          </Card>
        </GridItem>
      </Component>
    </View>
  ),
};

export const Behavior: Story = {
  args,
  render: (args) => (
    <Component {...args}>
      <SampleCard height={200} title="Test Card 1" />
      <SampleCard height={150} title="Test Card 2" />
      <SampleCard height={300} title="Test Card 3" />
    </Component>
  ),
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();

    const gridElement = canvas.getByText("Test Card 1");
    expect(gridElement).toBeTruthy();
  },
};
