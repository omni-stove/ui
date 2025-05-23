import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { useState } from "react";
import { View } from "react-native";
import { Select as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Component>;

const commonArgs: Story["args"] = {
  options: [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
    { label: "Very Long Option Label Example", value: "4" },
  ],
};

export const Default: Story = {
  args: {
    ...commonArgs,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [valueFilled, setValueFilled] = useState<string | number>("1");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [valueOutlined, setValueOutlined] = useState<string | number>("1");

    return (
      <View style={{ gap: 32 }}>
        <Component
          {...args}
          variant="filled"
          value={valueFilled}
          onChange={setValueFilled}
        />
        <Component
          {...args}
          variant="outlined"
          value={valueOutlined}
          onChange={setValueOutlined}
        />
      </View>
    );
  },
};

export const Behavior: Story = {
  args: {
    ...commonArgs,
    // Behavior 用の初期値を設定する場合はここに書く
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<string | number>("1");
    return <Component {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
    // TODO: 操作のテストを追加する
    // 例:
    // const select = await canvas.findByRole('combobox'); // TextField部分を探す
    // await userEvent.press(select);
    // const option2 = await canvas.findByText('Option 2');
    // await userEvent.press(option2);
    // expect(select).toHaveTextContent('Option 2'); // 表示が変わることを確認
  },
};
