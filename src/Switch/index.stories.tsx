import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Switch as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

const args: Story["args"] = {
  value: false,
  onValueChange: (newValue) => console.log("Switch value changed!", newValue),
  fluid: false,
  switchOnIcon: "check",
  disabled: false,
};

export const Default: Story = {
  args,
  render: function Render(args) {
    const [currentValue, setCurrentValue] = useState(args.value);

    return (
      <Component
        {...args}
        value={currentValue}
        onValueChange={(newValue) => {
          setCurrentValue(newValue);
          args.onValueChange?.(newValue);
        }}
      />
    );
  },
};

export const Behavior: Story = {
  args,
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchControl = await canvas.getByRole("switch");

    expect(switchControl).toHaveAttribute("aria-checked", "false");
    await userEvent.click(switchControl);
    expect(switchControl).toHaveAttribute("aria-checked", "true");

    await userEvent.click(switchControl);
    expect(switchControl).toHaveAttribute("aria-checked", "false");
  },
};
