import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { LoadingIndicator as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  title: "LoadingIndicator",
  parameters: {
    docs: {
      description: {
        component:
          "A Material Design 3 loading indicator with smooth animations and theme integration.",
      },
    },
  },
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {},
};

export const Behavior: Story = {
  args: {},
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};
