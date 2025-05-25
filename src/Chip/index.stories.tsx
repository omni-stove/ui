import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { Text, View } from "react-native";
import { Chip as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    // variant propをcontrolsで選択できるようにする
    variant: {
      control: { type: "select" },
      options: ["assist", "filter", "input", "suggestion"],
    },
    children: {
      control: { type: "text" },
    },
    leadingIcon: {
      control: { type: "text" },
    },
    trailingIcon: {
      control: { type: "text" },
    },
    isSelected: {
      control: { type: "boolean" },
    },
    isDisabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    children: "Default Chip",
    variant: "assist", // Default variant for this story
  },
  render: (args) => <Component {...args} />,
};

export const Behavior: Story = {
  args: {
    children: "Behavior Test Chip",
  },
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ padding: 16, gap: 24 }}>
      <View>
        <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: "bold" }}>
          Assist Chips
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Component variant="assist">Assist</Component>
          <Component variant="assist" leadingIcon="information-outline">
            With Icon
          </Component>
          <Component variant="assist" onPress={() => alert("Assist pressed!")}>
            Pressable
          </Component>
          <Component variant="assist" isDisabled>
            Disabled
          </Component>
          <Component
            variant="assist"
            leadingIcon="information-outline"
            isDisabled
          >
            Disabled Icon
          </Component>
        </View>
      </View>

      <View>
        <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: "bold" }}>
          Filter Chips
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Component variant="filter">Filter</Component>
          <Component variant="filter" isSelected>
            Selected
          </Component>
          <Component variant="filter" leadingIcon="check">
            Icon
          </Component>
          <Component variant="filter" isSelected leadingIcon="check">
            Selected Icon
          </Component>
          <Component
            variant="filter"
            trailingIcon="close-circle"
            onTrailingIconPress={() => alert("Trailing icon pressed!")}
          >
            Trailing Icon
          </Component>
          <Component variant="filter" isSelected trailingIcon="close-circle">
            Selected Trailing
          </Component>
          <Component variant="filter" isDisabled>
            Disabled
          </Component>
          <Component variant="filter" isSelected isDisabled>
            Selected Disabled
          </Component>
        </View>
      </View>

      <View>
        <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: "bold" }}>
          Input Chips
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Component variant="input">Input</Component>
          <Component variant="input" leadingIcon="account-circle-outline">
            Leading Icon
          </Component>
          <Component
            variant="input"
            trailingIcon="close-circle"
            onTrailingIconPress={() => alert("Remove input!")}
          >
            Removable
          </Component>
          <Component variant="input" isDisabled>
            Disabled
          </Component>
          <Component
            variant="input"
            leadingIcon="account-circle-outline"
            trailingIcon="close-circle"
            isDisabled
          >
            All Disabled
          </Component>
        </View>
      </View>

      <View>
        <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: "bold" }}>
          Suggestion Chips
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Component variant="suggestion">Suggestion</Component>
          <Component variant="suggestion" leadingIcon="lightbulb-on-outline">
            With Icon
          </Component>
          <Component
            variant="suggestion"
            onPress={() => alert("Suggestion selected!")}
          >
            Pressable
          </Component>
          <Component variant="suggestion" isDisabled>
            Disabled
          </Component>
          <Component
            variant="suggestion"
            leadingIcon="lightbulb-on-outline"
            isDisabled
          >
            Disabled Icon
          </Component>
        </View>
      </View>
    </View>
  ),
};
