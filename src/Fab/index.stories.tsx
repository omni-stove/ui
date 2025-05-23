import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { View } from "react-native";
import { FAB as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, height: "100%" }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type OurComponentProps = ComponentProps<typeof Component>;

type BaseStory = StoryObj<OurComponentProps>;

const baseArgs: Required<Pick<OurComponentProps, "icon" | "color">> = {
  icon: "plus",
  color: "primary",
};

const commonActions = [
  { icon: "timer", label: "Action 1", onPress: () => console.log("Action 1") },
  { icon: "camera", label: "Action 2", onPress: () => console.log("Action 2") },
  {
    icon: "timer",
    label: "TOOOOOO LONG Action 3",
    onPress: () => console.log("Action 3"),
  },
];

export const Default: BaseStory = {
  name: "Default (56px)",
  args: {
    ...baseArgs,
    onPress: () => console.log("Default FAB pressed"),
    actions: commonActions,
  },
};

export const MediumSize: BaseStory = {
  name: "Medium (80px)",
  args: {
    ...baseArgs,
    size: "medium",
    onPress: () => console.log("Medium FAB pressed"),
    actions: commonActions,
  },
};

export const LargeSize: BaseStory = {
  name: "Large (96px)",
  args: {
    ...baseArgs,
    size: "large",
    onPress: () => console.log("Large FAB pressed"),
    actions: commonActions,
  },
};

export const WithActionsPrimary: BaseStory = {
  name: "With Actions (Primary)",
  args: {
    ...baseArgs,
    color: "primary",
    actions: commonActions,
    onPress: () => console.log("Primary FAB with actions pressed"),
  },
};

export const WithActionsSecondary: BaseStory = {
  name: "With Actions (Secondary)",
  args: {
    ...baseArgs,
    color: "secondary",
    actions: commonActions,
    onPress: () => console.log("Secondary FAB with actions pressed"),
  },
};

export const WithActionsTertiary: BaseStory = {
  name: "With Actions (Tertiary)",
  args: {
    ...baseArgs,
    color: "tertiary",
    actions: commonActions,
    onPress: () => console.log("Tertiary FAB with actions pressed"),
  },
};

export const ExtendedFabDefaultSize: BaseStory = {
  name: "Extended FAB (Default Size)",
  args: {
    ...baseArgs,
    label: "Extended FAB",
    onPress: () => console.log("Extended FAB Default Size pressed"),
  },
};

export const ExtendedFabMediumSize: BaseStory = {
  name: "Extended FAB (Medium Size)",
  args: {
    ...baseArgs,
    label: "Extended FAB",
    size: "medium",
    onPress: () => console.log("Extended FAB Medium Size pressed"),
  },
};

export const ExtendedFabLargeSize: BaseStory = {
  name: "Extended FAB (Large Size)",
  args: {
    ...baseArgs,
    label: "Extended FAB",
    size: "large",
    onPress: () => console.log("Extended FAB Large Size pressed"),
  },
};
