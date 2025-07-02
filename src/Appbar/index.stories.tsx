import type { Meta, StoryObj } from '@storybook/react';
import { Appbar as Component } from '.';
import { getCanvas } from "../libs/storybook";
import { expect } from "@storybook/test";

const meta: Meta<typeof Component> = {
  component: Component,
  }

  export default meta;

  type Story = StoryObj<typeof Component>;

    const args: Story["args"] = {}

    export const Default: Story = {
    args,
    render: (args) =>
    <Component {...args} />
    }

    export const Behavior: Story = {
    args,
    render: (args) =>
    <Component {...args} />
    ,
    play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
    },
    }