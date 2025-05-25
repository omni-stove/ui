import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { NavigationRail as Component, type NavigationRailItem } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    selectedItemKey: { control: "text" },
    fabIcon: { control: "text" },
    fabLabel: { control: "text" },
    initialStatus: { control: "radio", options: ["collapsed", "expanded"] },
    variant: { control: "radio", options: ["standard", "modal"] },
    initialModalOpen: {
      control: "boolean",
      description: "Initial open state for modal variant",
    },
    onDismiss: { action: "dismissed" },
    onMenuPress: { action: "menuPressed" },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const defaultItems: NavigationRailItem[] = [
  { key: "home", icon: "home", label: "Home", onPress: action("onPress-home") },
  {
    key: "favorites",
    icon: "heart",
    label: "Favorites",
    onPress: action("onPress-favorites"),
    badge: { label: "3", size: "large" },
  },
  {
    key: "recent",
    icon: "history",
    label: "Recent",
    onPress: action("onPress-recent"),
  },
  {
    key: "settings",
    icon: "cog",
    label: "Settings",
    onPress: action("onPress-settings"),
    badge: { label: "New", size: "large" },
  },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    selectedItemKey: "home",
    onMenuPress: action("onMenuPress"),
    fabIcon: "pencil",
    fabLabel: "Create",
    onFabPress: action("onFabPress"),
  },
  render: (args) => <Component {...args} />,
};

export const Collapsed: Story = {
  args: {
    ...Default.args,
    initialStatus: "collapsed",
  },
  render: (args) => <Component {...args} />,
};

export const ExpandedWithFab: Story = {
  args: {
    items: defaultItems,
    selectedItemKey: "favorites",
    onMenuPress: action("onMenuPress"),
    fabIcon: "plus",
    fabLabel: "Add Item",
    onFabPress: action("onFabPress"),
    initialStatus: "expanded",
  },
  render: (args) => <Component {...args} />,
};

export const NoFab: Story = {
  args: {
    items: defaultItems,
    selectedItemKey: "recent",
    onMenuPress: action("onMenuPress"),
  },
  render: (args) => <Component {...args} />,
};

export const Behavior: Story = {
  args: {
    items: defaultItems,
    selectedItemKey: "home",
    onMenuPress: action("onMenuPress"),
    fabIcon: "pencil",
    fabLabel: "Create",
    onFabPress: action("onFabPress"),
  },
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};

export const ModalVariant: Story = {
  args: {
    items: defaultItems,
    selectedItemKey: "home",
    fabIcon: "pencil",
    fabLabel: "Create",
    onFabPress: action("onFabPress-modal"),
    variant: "modal",
    initialModalOpen: false,
  },
  render: (args) => <Component {...args} />,
};
