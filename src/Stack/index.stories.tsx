import type { Meta, StoryObj } from "@storybook/react";
import { View, Text } from "react-native";
import { Stack } from "./index";

const meta = {
  title: "UI/Stack",
  component: Stack,
  args: {
    children: (
      <>
        <View
          style={{ width: 50, height: 50, backgroundColor: "powderblue" }}
        />
        <View style={{ width: 50, height: 50, backgroundColor: "skyblue" }} />
        <View style={{ width: 50, height: 50, backgroundColor: "steelblue" }} />
      </>
    ),
  },
  decorators: [
    (Story) => (
      <View style={{ alignItems: "flex-start", padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    direction: "column",
    spacing: 2,
  },
};

export const Horizontal: Story = {
  args: {
    direction: "row",
    spacing: 2,
    alignItems: "center",
  },
  render: (args) => (
    <Stack {...args}>
      <Text>One</Text>
      <Text>Two</Text>
      <Text>Three</Text>
    </Stack>
  ),
};

export const VerticalWithMoreSpacing: Story = {
  args: {
    direction: "column",
    spacing: 4,
  },
};

export const HorizontalNoSpacing: Story = {
  args: {
    direction: "row",
    spacing: 0,
    alignItems: "flex-end",
  },
};

export const WithTextChildren: Story = {
  args: {
    direction: "column",
    spacing: 1,
  },
  render: (args) => (
    <Stack {...args}>
      <Text style={{ padding: 8, backgroundColor: "lightgray" }}>
        First Item
      </Text>
      <Text style={{ padding: 8, backgroundColor: "lightgray" }}>
        Second Item
      </Text>
      <Text style={{ padding: 8, backgroundColor: "lightgray" }}>
        Third Item
      </Text>
    </Stack>
  ),
};
