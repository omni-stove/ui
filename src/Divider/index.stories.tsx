import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { View } from "react-native";
import { Divider as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
    },
    inset: {
      control: { type: "boolean" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const args: Story["args"] = {};

export const Default: Story = {
  args,
  render: (args) => <Component {...args} />,
};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <View style={{ padding: 16 }}>
      <Component {...args} />
    </View>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <View style={{ flexDirection: "row", height: 200, padding: 16 }}>
      <View style={{ flex: 1, backgroundColor: "#f0f0f0" }} />
      <Component {...args} />
      <View style={{ flex: 1, backgroundColor: "#f0f0f0" }} />
    </View>
  ),
};

export const HorizontalInset: Story = {
  args: {
    orientation: "horizontal",
    inset: true,
  },
  render: (args) => (
    <View style={{ padding: 16 }}>
      <Component {...args} />
    </View>
  ),
};

export const VerticalInset: Story = {
  args: {
    orientation: "vertical",
    inset: true,
  },
  render: (args) => (
    <View style={{ flexDirection: "row", height: 200, padding: 16 }}>
      <View style={{ flex: 1, backgroundColor: "#f0f0f0" }} />
      <Component {...args} />
      <View style={{ flex: 1, backgroundColor: "#f0f0f0" }} />
    </View>
  ),
};

export const Behavior: Story = {
  args,
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};
