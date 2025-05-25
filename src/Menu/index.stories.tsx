import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { View } from "react-native";
import { Button, Menu as Component, Divider } from "react-native-paper";

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    visible: false,
    onDismiss: () => console.log("Dismissed"),
    anchor: <Button onPress={() => console.log("Pressed")}>Show menu</Button>,
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 20, flex: 1, alignItems: "center" }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Component>;

const MenuItems = () => (
  <>
    <Component.Item onPress={() => {}} title="Item 1" />
    <Component.Item onPress={() => {}} title="Item 2" />
    <Divider />
    <Component.Item onPress={() => {}} title="Item 3" disabled />
  </>
);

export const Default: Story = {
  render: function Render(args) {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
      <Component
        {...args}
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu}>Show menu</Button>}
      >
        <MenuItems />
      </Component>
    );
  },
};

export const WithLeadingIcon: Story = {
  render: function Render(args) {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
      <Component
        {...args}
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu}>Show menu with icons</Button>}
      >
        <Component.Item leadingIcon="redo" onPress={() => {}} title="Undo" />
        <Component.Item leadingIcon="undo" onPress={() => {}} title="Redo" />
        <Divider />
        <Component.Item
          leadingIcon="content-cut"
          onPress={() => {}}
          title="Cut"
          disabled
        />
        <Component.Item
          leadingIcon="content-copy"
          onPress={() => {}}
          title="Copy"
        />
        <Component.Item
          leadingIcon="content-paste"
          onPress={() => {}}
          title="Paste"
        />
      </Component>
    );
  },
};

export const Behavior: Story = {
  render: Default.render,
};
