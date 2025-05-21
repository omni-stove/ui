import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { useState } from "react";
import { View } from "react-native";
import { TextField as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    label: "Label",
    supportingText: "This is a supporting text.",
    errorMessage: "",
    multiline: false,
    maxLines: 4,
    variant: "filled",
    startAdornment: undefined,
    endAdornment: undefined,
    required: false,
    readOnly: false,
    disabled: false,
    maxLength: undefined,
  },
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["filled", "outlined"],
    },
    maxLength: {
      control: { type: "number" },
    },
    startAdornment: {
      control: { type: "object" },
    },
    endAdornment: {
      control: { type: "object" },
    },
    value: { control: false },
    onChangeText: { action: "onChangeText" },
  },
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

export const Default: Story = {};

export const Filled: Story = {
  args: {
    variant: "filled",
    label: "Filled TextField",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    label: "Outlined TextField",
  },
};

export const WithError: Story = {
  args: {
    label: "Field with error",
    errorMessage: "This field has an error.",
  },
};

export const Multiline: Story = {
  args: {
    label: "Multiline TextField",
    multiline: true,
    maxLines: 5,
  },
};

export const WithAdornments: Story = {
  args: {
    label: "Adornments",
    startAdornment: { type: "icon", value: "currency-usd" },
    endAdornment: { type: "label", value: "kg" },
  },
};

export const RequiredField: Story = {
  args: {
    label: "Required Field",
    required: true,
  },
};

export const ReadOnlyField: Story = {
  args: {
    label: "Read Only Field",
    readOnly: true,
  },
};

export const DisabledField: Story = {
  args: {
    label: "Disabled Field",
    disabled: true,
  },
};

export const WithSupportingText: Story = {
  args: {
    label: "Field with Supporting Text",
    supportingText: "Helper text for this input.",
  },
};

export const WithMaxLength: Story = {
  args: {
    label: "Field with MaxLength",
    maxLength: 10,
  },
  render: function Render(args) {
    const [val, setVal] = useState("");
    return (
      <Component
        {...args}
        value={val}
        onChangeText={(text) => {
          setVal(text);
          args.onChangeText?.(text);
        }}
      />
    );
  },
};

export const Behavior: Story = {
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    // 基本的なレンダリングの確認
    expect(canvas.getByText("Label")).toBeTruthy(); // Default Story の Label

    // TODO: より具体的なインタラクションテストを追加
    // 例:
    // const input = canvas.getByLabelText("Field with MaxLength"); // WithMaxLength story の場合
    // await userEvent.type(input, "Hello world too long");
    // expect(input).toHaveValue("Hello worl"); // maxLength で切り捨てられる
    // expect(canvas.getByText("10 / 10")).toBeTruthy(); // カウンター表示の確認
  },
};
