import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { View } from "react-native";
import { Button as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["filled", "tonal", "outlined", "text", "elevated"],
    },
    size: {
      control: { type: "select" },
      options: ["extra-small", "small", "medium", "large", "extra-large"],
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const args: Story["args"] = {
  children: "Button",
  variant: "filled",
  size: "small",
};

export const Default: Story = {
  args,
  render: (args) => <Component {...args} />,
};

export const AllVariants: Story = {
  args,
  render: (args) => (
    <View style={{ gap: 16, padding: 16 }}>
      <Component {...args} variant="filled">
        Filled Button
      </Component>
      <Component {...args} variant="tonal">
        Tonal Button
      </Component>
      <Component {...args} variant="outlined">
        Outlined Button
      </Component>
      <Component {...args} variant="text">
        Text Button
      </Component>
      <Component {...args} variant="elevated">
        Elevated Button
      </Component>
    </View>
  ),
};

export const AllSizes: Story = {
  args: { ...args, variant: "elevated" },
  render: (args) => (
    <View style={{ gap: 16, padding: 16, alignItems: "flex-start" }}>
      <Component {...args} size="extra-small">
        Extra Small
      </Component>
      <Component {...args} size="small">
        Small (Default)
      </Component>
      <Component {...args} size="medium">
        Medium
      </Component>
      <Component {...args} size="large">
        Large
      </Component>
      <Component {...args} size="extra-large">
        Extra Large
      </Component>
    </View>
  ),
};

export const SizeComparison: Story = {
  args,
  render: (args) => (
    <View style={{ gap: 24, padding: 16 }}>
      {(["filled", "tonal", "outlined", "text", "elevated"] as const).map(
        (variant) => (
          <View key={variant} style={{ gap: 8 }}>
            <View style={{ marginBottom: 8 }}>
              <Component {...args} variant={variant} size="extra-small">
                {variant} XS
              </Component>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Component {...args} variant={variant} size="small">
                {variant} S
              </Component>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Component {...args} variant={variant} size="medium">
                {variant} M
              </Component>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Component {...args} variant={variant} size="large">
                {variant} L
              </Component>
            </View>
            <View style={{ marginBottom: 16 }}>
              <Component {...args} variant={variant} size="extra-large">
                {variant} XL
              </Component>
            </View>
          </View>
        ),
      )}
    </View>
  ),
};

export const Disabled: Story = {
  args: { ...args, disabled: true },
  render: (args) => (
    <View style={{ gap: 16, padding: 16 }}>
      <Component {...args} variant="filled">
        Filled Disabled
      </Component>
      <Component {...args} variant="tonal">
        Tonal Disabled
      </Component>
      <Component {...args} variant="outlined">
        Outlined Disabled
      </Component>
      <Component {...args} variant="text">
        Text Disabled
      </Component>
      <Component {...args} variant="elevated">
        Elevated Disabled
      </Component>
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
