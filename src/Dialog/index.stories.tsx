import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { View } from "react-native";
import { Dialog as Component } from ".";
import { Button } from "../Button";
import { Typography } from "../Typography";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["basic"],
    },
    headline: {
      control: { type: "text" },
    },
    supportingText: {
      control: { type: "text" },
    },
    icon: {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const defaultArgs: Story["args"] = {
  variant: "basic",
  headline: "Dialog Title",
  supportingText:
    "This is a supporting text that provides more information about the dialog content.",
  children: <Button>Open Dialog</Button>,
};

export const Default: Story = {
  args: defaultArgs,
  render: (args) => (
    <View style={{ padding: 20 }}>
      <Component {...args} />
    </View>
  ),
};

export const WithIcon: Story = {
  args: {
    ...defaultArgs,
    headline: "Delete Item",
    supportingText:
      "Are you sure you want to delete this item? This action cannot be undone.",
    icon: "delete",
  },
  render: (args) => (
    <View style={{ padding: 20 }}>
      <Component {...args} />
    </View>
  ),
};

export const WithActions: Story = {
  args: {
    ...defaultArgs,
    headline: "Confirm Action",
    supportingText: "Please confirm that you want to proceed with this action.",
    actions: [
      {
        label: "Cancel",
        onPress: () => console.log("Cancel pressed"),
      },
      {
        label: "Confirm",
        onPress: () => console.log("Confirm pressed"),
      },
    ],
  },
  render: (args) => (
    <View style={{ padding: 20 }}>
      <Component {...args} />
    </View>
  ),
};

export const WithIconAndActions: Story = {
  args: {
    ...defaultArgs,
    headline: "Delete Account",
    supportingText:
      "This will permanently delete your account and all associated data. This action cannot be undone.",
    icon: "account-remove",
    actions: [
      {
        label: "Cancel",
        onPress: () => console.log("Cancel pressed"),
      },
      {
        label: "Delete",
        onPress: () => console.log("Delete pressed"),
      },
    ],
  },
  render: (args) => (
    <View style={{ padding: 20 }}>
      <Component {...args} />
    </View>
  ),
};

export const CustomTrigger: Story = {
  args: {
    ...defaultArgs,
    headline: "Information",
    supportingText: "This dialog was triggered by a custom element.",
    children: (
      <View
        style={{ padding: 16, backgroundColor: "#e3f2fd", borderRadius: 8 }}
      >
        <Typography variant="bodyMedium" color="primary">
          Click me to open dialog
        </Typography>
      </View>
    ),
  },
  render: (args) => (
    <View style={{ padding: 20 }}>
      <Component {...args} />
    </View>
  ),
};

export const MinimalDialog: Story = {
  args: {
    variant: "basic",
    headline: "Simple Dialog",
    children: <Button variant="outlined">Open Simple Dialog</Button>,
  },
  render: (args) => (
    <View style={{ padding: 20 }}>
      <Component {...args} />
    </View>
  ),
};

export const Behavior: Story = {
  args: defaultArgs,
  render: (args) => (
    <View style={{ padding: 20 }}>
      <Component {...args} />
    </View>
  ),
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};
