import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { View } from "react-native";
import { Button as Component } from "./index.native";
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
    icon: {
      control: { type: "text" },
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
  args: { ...args },
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

export const WithIcons: Story = {
  args,
  render: (args) => (
    <View style={{ gap: 16, padding: 16 }}>
      <Component {...args} icon="plus" variant="filled">
        Add Item
      </Component>
      <Component {...args} icon="download" variant="tonal">
        Download
      </Component>
      <Component {...args} icon="heart" variant="outlined">
        Like
      </Component>
      <Component {...args} icon="share" variant="text">
        Share
      </Component>
      <Component {...args} icon="star" variant="elevated">
        Favorite
      </Component>
    </View>
  ),
};

export const IconOnly: Story = {
  args: { ...args, children: "" },
  render: (args) => (
    <View style={{ gap: 16, padding: 16, flexDirection: "row" }}>
      <Component {...args} icon="plus" variant="filled" />
      <Component {...args} icon="download" variant="tonal" />
      <Component {...args} icon="heart" variant="outlined" />
      <Component {...args} icon="share" variant="text" />
      <Component {...args} icon="star" variant="elevated" />
    </View>
  ),
};

export const IconSizes: Story = {
  args: { ...args, icon: "star" },
  render: (args) => (
    <View style={{ gap: 16, padding: 16, alignItems: "flex-start" }}>
      <Component {...args} size="extra-small">
        Extra Small
      </Component>
      <Component {...args} size="small">
        Small
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

export const Behavior: Story = {
  args,
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};
