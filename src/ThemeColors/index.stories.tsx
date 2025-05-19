import type { Meta, StoryObj } from "@storybook/react";
import { ThemeColors } from ".";

export default {
  title: "Theme/Colors",
  component: ThemeColors,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ThemeColors>;

type Story = StoryObj<typeof ThemeColors>;

export const Default: Story = {};
