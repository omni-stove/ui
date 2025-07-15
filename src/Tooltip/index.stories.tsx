import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { Tooltip as Component } from ".";
import { Button } from "../Button/index.native";
import { Icon } from "../Icon";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["plain", "rich"],
    },
    children: {
      control: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Plain: Story = {
  args: {
    variant: "plain",
    title: "This is a plain tooltip!",
    children: <Button icon="information-outline">Plain Tooltip</Button>,
  },
};

export const Rich: Story = {
  args: {
    variant: "rich",
    supportingText: "This is the supporting text for the rich tooltip.",
    children: (
      <Button icon="tooltip-text-outline">Rich Tooltip (Tap me!)</Button>
    ),
    subhead: "Optional Subhead",
    actions: [
      {
        label: "Action 1",
        onPress: () => console.log("Action 1 pressed"),
      },
      {
        label: "Action 2",
        onPress: () => console.log("Action 2 pressed"),
      },
    ],
  },
};

export const RichWithIconAsChild: Story = {
  args: {
    variant: "rich",
    supportingText: "This tooltip is for an icon.",
    children: <Icon source="information" size={24} />,
    subhead: "Icon Tooltip",
  },
};

export const Behavior: Story = {
  args: {
    variant: "plain",
    title: "Interaction Test",
    children: <Button>Test Me</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};
