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
    color: {
      control: { type: "radio" },
      options: ["standard", "vibrant"],
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
    icon: "heart",
    onPress: () => console.log("Favorite pressed"),
    accessibilityLabel: "Favorite",
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

export const AllColors: Story = {
  render: () => {
    console.log("AllColors rendering...");
    return (
      <View style={{ gap: 20, padding: 16 }}>
        <View>
          <Component
            color="standard"
            variant="docked"
            navigationIcon="menu"
            onNavigationPress={() => console.log("Standard menu pressed")}
            actions={[
              {
                icon: "magnify",
                onPress: () => console.log("Standard search pressed"),
                accessibilityLabel: "Search",
              },
            ]}
          />
        </View>
        <View>
          <Component
            color="vibrant"
            variant="docked"
            navigationIcon="menu"
            onNavigationPress={() => console.log("Vibrant menu pressed")}
            actions={[
              {
                icon: "magnify",
                onPress: () => console.log("Vibrant search pressed"),
                accessibilityLabel: "Search",
              },
            ]}
          />
        </View>
      </View>
    );
  },
};

const manyActions = [
  {
    icon: "magnify",
    onPress: () => console.log("Search pressed"),
    accessibilityLabel: "Search",
  },
  {
    icon: "heart",
    onPress: () => console.log("Favorite pressed"),
    accessibilityLabel: "Favorite",
  },
  {
    icon: "share",
    onPress: () => console.log("Share pressed"),
    accessibilityLabel: "Share",
  },
  {
    icon: "bookmark",
    onPress: () => console.log("Bookmark pressed"),
    accessibilityLabel: "Bookmark",
  },
  {
    icon: "download",
    onPress: () => console.log("Download pressed"),
    accessibilityLabel: "Download",
  },
  {
    icon: "delete",
    onPress: () => console.log("Delete pressed"),
    accessibilityLabel: "Delete",
  },
];

export const ResponsiveActions: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Component
        navigationIcon="menu"
        onNavigationPress={() => console.log("Menu pressed")}
        actions={manyActions}
        fab={defaultFab}
      />
      <Component
        variant="docked"
        navigationIcon="menu"
        onNavigationPress={() => console.log("Menu pressed")}
        actions={manyActions}
        fab={defaultFab}
      />
    </View>
  ),
};

export const WithoutFab: Story = {
  args: {
    navigationIcon: "menu",
    onNavigationPress: () => console.log("Menu pressed"),
    actions: manyActions,
  },
};

export const Behavior: Story = {
  args: {
    variant: "docked",
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
