import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { View } from "react-native";
import { getCanvas } from "../libs/storybook";
import { SplitButton } from "./index";

const meta: Meta<typeof SplitButton> = {
  component: SplitButton,
};

export default meta;

type Story = StoryObj<typeof SplitButton>;

const args: Story["args"] = {};

const actions = [
  { title: "Edit", onPress: () => alert("Edit押したよ！") },
  { title: "Delete", onPress: () => alert("Delete押したよ！") },
];

export const Default: Story = {
  args,
  render: (args) => <SplitButton {...args} />,
};

export const Behavior: Story = {
  args,
  render: (args) => <SplitButton {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};

export const Variants = () => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <View style={{ marginRight: 16 }}>
      <SplitButton
        label="Filled"
        variant="filled"
        onPress={() => alert("Filled!")}
        actions={actions}
      />
    </View>
    <View style={{ marginRight: 16 }}>
      <SplitButton
        label="Outlined"
        variant="outlined"
        onPress={() => alert("Outlined!")}
        actions={actions}
      />
    </View>
    <View style={{ marginRight: 16 }}>
      <SplitButton
        label="Elevated"
        variant="elevated"
        onPress={() => alert("Elevated!")}
        actions={actions}
      />
    </View>
    <View>
      <SplitButton
        label="Tonal"
        variant="tonal"
        onPress={() => alert("Tonal!")}
        actions={actions}
      />
    </View>
  </View>
);

export const Sizes = () => {
  const actions = [
    { title: "Edit", onPress: () => alert("Edit押したよ！") },
    { title: "Delete", onPress: () => alert("Delete押したよ！") },
  ];
  return (
    <View style={{ gap: 16 }}>
      <SplitButton
        label="XS"
        size="xs"
        icon="pencil"
        onPress={() => {}}
        actions={actions}
      />
      <SplitButton
        label="S"
        size="s"
        icon="pencil"
        onPress={() => {}}
        actions={actions}
      />
      <SplitButton
        label="M"
        size="m"
        icon="pencil"
        onPress={() => {}}
        actions={actions}
      />
      <SplitButton
        label="L"
        size="l"
        icon="pencil"
        onPress={() => {}}
        actions={actions}
      />
      <SplitButton
        label="XL"
        size="xl"
        icon="pencil"
        onPress={() => {}}
        actions={actions}
      />
    </View>
  );
};
