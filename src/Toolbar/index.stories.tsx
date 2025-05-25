import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { View } from "react-native";
import { Toolbar as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["docked", "floating"],
    },
    size: {
      control: { type: "radio" },
      options: ["small", "medium", "large"],
    },
    alignment: {
      control: { type: "radio" },
      options: ["start", "center"],
    },
    navigationIcon: { control: "text" },
    actions: { control: "object" },
    fab: { control: "object" },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const defaultActions = [
  {
    icon: "magnify",
    onPress: () => console.log("Search pressed"),
    accessibilityLabel: "Search",
  },
  {
    icon: "dots-vertical",
    onPress: () => console.log("Menu pressed"),
    accessibilityLabel: "Menu",
  },
];

const defaultFab = {
  icon: "plus",
  onPress: () => console.log("FAB pressed"),
  accessibilityLabel: "Add new item",
};

export const Default: Story = {
  args: {
    actions: defaultActions,
    fab: defaultFab,
  },
};

export const AllAlignments: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Component
        alignment="start"
        navigationIcon="menu"
        onNavigationPress={() => console.log("Menu pressed")}
        actions={defaultActions}
        fab={defaultFab}
      />
      <Component alignment="center" actions={defaultActions} fab={defaultFab} />
    </View>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Component
        size="small"
        navigationIcon="arrow-left"
        onNavigationPress={() => console.log("Back pressed")}
        actions={defaultActions}
        fab={defaultFab}
      />
      <Component
        size="medium"
        navigationIcon="arrow-left"
        onNavigationPress={() => console.log("Back pressed")}
        actions={defaultActions}
        fab={defaultFab}
      />
      <Component
        size="large"
        navigationIcon="arrow-left"
        onNavigationPress={() => console.log("Back pressed")}
        actions={defaultActions}
        fab={defaultFab}
      />
    </View>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Component
        variant="docked"
        navigationIcon="menu"
        onNavigationPress={() => console.log("Menu pressed")}
        actions={defaultActions}
        fab={defaultFab}
      />
      <Component
        variant="floating"
        navigationIcon="menu"
        onNavigationPress={() => console.log("Menu pressed")}
        actions={defaultActions}
        fab={defaultFab}
      />
    </View>
  ),
};

export const Behavior: Story = {
  args: {
    variant: "docked",
    size: "small",
    navigationIcon: "arrow-left",
    onNavigationPress: () => console.log("Navigation (Behavior)"),
    actions: [
      {
        icon: "magnify",
        onPress: () => console.log("Search (Behavior)"),
        accessibilityLabel: "Search Behavior",
      },
    ],
    fab: defaultFab,
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas.getByRole("toolbar")).toBeTruthy();
  },
};
