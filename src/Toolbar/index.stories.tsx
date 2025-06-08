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
    <View style={{ gap: 16, height: 200, position: "relative" }}>
      <Component
        alignment="start"
        actions={defaultActions}
        fab={defaultFab}
      />
      <View style={{ height: 100 }} />
      <Component alignment="center" actions={defaultActions} fab={defaultFab} />
    </View>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 16, height: 200, position: "relative" }}>
      <Component
        variant="docked"
        actions={defaultActions}
        fab={defaultFab}
      />
      <View style={{ height: 100 }} />
      <Component
        variant="floating"
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
      <View style={{ gap: 20, padding: 16, height: 200, position: "relative" }}>
        <View>
          <Component
            color="standard"
            variant="docked"
            actions={[
              {
                icon: "magnify",
                onPress: () => console.log("Standard search pressed"),
                accessibilityLabel: "Search",
              },
            ]}
          />
        </View>
        <View style={{ height: 50 }} />
        <View>
          <Component
            color="vibrant"
            variant="docked"
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
  {
    icon: "cog",
    onPress: () => console.log("Settings pressed"),
    accessibilityLabel: "Settings",
  },
  {
    icon: "bell",
    onPress: () => console.log("Notifications pressed"),
    accessibilityLabel: "Notifications",
  },
  {
    icon: "account",
    onPress: () => console.log("Profile pressed"),
    accessibilityLabel: "Profile",
  },
  {
    icon: "calendar",
    onPress: () => console.log("Calendar pressed"),
    accessibilityLabel: "Calendar",
  },
];

export const ResponsiveActions: Story = {
  render: () => (
    <View style={{ gap: 16, height: 200, position: "relative" }}>
      <Component
        actions={manyActions}
        fab={defaultFab}
      />
      <View style={{ height: 100 }} />
      <Component
        variant="docked"
        actions={manyActions}
        fab={defaultFab}
      />
    </View>
  ),
};

export const WithoutFab: Story = {
  args: {
    actions: manyActions,
  },
};

export const WithLabels: Story = {
  render: () => (
    <View style={{ gap: 16, height: 200, position: "relative" }}>
      <Component
        variant="floating"
        actions={[
          {
            label: "Photos",
            onPress: () => console.log("Photos pressed"),
            accessibilityLabel: "Photos",
          },
          {
            label: "Memories",
            onPress: () => console.log("Memories pressed"),
            accessibilityLabel: "Memories",
          },
          {
            label: "Library",
            onPress: () => console.log("Library pressed"),
            accessibilityLabel: "Library",
          },
        ]}
      />
      <View style={{ height: 100 }} />
      <Component
        variant="floating"
        color="vibrant"
        actions={[
          {
            label: "Bold",
            onPress: () => console.log("Bold pressed"),
            accessibilityLabel: "Bold",
          },
          {
            label: "Italic",
            onPress: () => console.log("Italic pressed"),
            accessibilityLabel: "Italic",
          },
          {
            label: "Underline",
            onPress: () => console.log("Underline pressed"),
            accessibilityLabel: "Underline",
          },
        ]}
      />
    </View>
  ),
};

export const MixedIconsAndLabels: Story = {
  render: () => (
    <View style={{ gap: 16, height: 150, position: "relative" }}>
      <Component
        variant="floating"
        actions={[
          {
            icon: "content-save",
            onPress: () => console.log("Save pressed"),
            accessibilityLabel: "Save",
          },
          {
            label: "Preview",
            onPress: () => console.log("Preview pressed"),
            accessibilityLabel: "Preview",
          },
          {
            label: "Publish",
            onPress: () => console.log("Publish pressed"),
            accessibilityLabel: "Publish",
          },
        ]}
      />
    </View>
  ),
};

export const Behavior: Story = {
  args: {
    variant: "docked",
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
