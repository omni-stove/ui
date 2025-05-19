import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { FAB as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type OurComponentProps = ComponentProps<typeof Component>;

type BaseStory = StoryObj<OurComponentProps>;

const baseArgs: Partial<OurComponentProps> = {
  // visible: true,
  icon: "plus",
};

export const Default: BaseStory = {
  args: baseArgs,
  render: (args: OurComponentProps) => <Component {...args} />,
};

export const WithActions: BaseStory = {
  args: {
    ...baseArgs,
    actions: [
      { icon: "diary", label: "Action 1", onPress: () => {} },
      { icon: "camera", label: "Action 2", onPress: () => {} },
    ],
  },
};
