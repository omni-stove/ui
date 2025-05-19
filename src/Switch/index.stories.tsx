import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react"; // useState を import
import { Switch as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

const args: Story["args"] = {
  selected: false,
  onPress: () => console.log("Switch pressed!"),
  fluid: false,
  switchOnIcon: "check",
  disabled: false,
};

export const Default: Story = {
  args,
  render: function Render(args) {
    // render 関数を functionキーワードで定義して、中でフックを使えるようにする
    const [isSelected, setIsSelected] = useState(args.selected);

    return (
      <Component
        {...args}
        selected={isSelected}
        onPress={() => {
          setIsSelected(!isSelected);
          args.onPress?.(); // 元の onPress も呼んであげる
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

    // Initial state: off
    expect(switchControl).toHaveAttribute("aria-checked", "false");

    // Click to turn on
    await userEvent.click(switchControl);
    expect(switchControl).toHaveAttribute("aria-checked", "true");

    // Click to turn off
    await userEvent.click(switchControl);
    expect(switchControl).toHaveAttribute("aria-checked", "false");
  },
};
