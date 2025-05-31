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
    const [valueFilled, setValueFilled] = useState<string | number>("1");
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
  },
  render: (args) => {
    const [value, setValue] = useState<string | number>("1");
    return <Component {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};

export const WithErrorAndSupportingText: Story = {
  args: {
    ...commonArgs,
    label: "Select with Messages",
  },
  render: (args) => {
    const [valueFilledError, setValueFilledError] = useState<string | number>(
      "1",
    );
    const [valueOutlinedError, setValueOutlinedError] = useState<
      string | number
    >("1");
    const [valueFilledSupport, setValueFilledSupport] = useState<
      string | number
    >("1");
    const [valueOutlinedSupport, setValueOutlinedSupport] = useState<
      string | number
    >("1");

    return (
      <View style={{ gap: 32 }}>
        <Component
          {...args}
          variant="filled"
          value={valueFilledError}
          onChange={setValueFilledError}
          errorMessage="This is an error message for filled variant."
        />
        <Component
          {...args}
          variant="outlined"
          value={valueOutlinedError}
          onChange={setValueOutlinedError}
          errorMessage="This is an error message for outlined variant."
        />
        <Component
          {...args}
          variant="filled"
          value={valueFilledSupport}
          onChange={setValueFilledSupport}
          supportingText="This is a supporting text for filled variant."
        />
        <Component
          {...args}
          variant="outlined"
          value={valueOutlinedSupport}
          onChange={setValueOutlinedSupport}
          supportingText="This is a supporting text for outlined variant."
        />
      </View>
    );
  },
};

export const DisabledAndReadOnly: Story = {
  args: {
    ...commonArgs,
    label: "Select States",
  },
  render: (args) => {
    const [valueDisabled, setValueDisabled] = useState<string | number>("2");
    const [valueReadOnly, setValueReadOnly] = useState<string | number>("3");
    const [valueNormal, setValueNormal] = useState<string | number>("1");

    return (
      <View style={{ gap: 32 }}>
        <Component
          {...args}
          variant="filled"
          value={valueNormal}
          onChange={setValueNormal}
          label="Normal Select"
        />
        <Component
          {...args}
          variant="filled"
          value={valueDisabled}
          onChange={setValueDisabled}
          disabled
          label="Disabled Select"
        />
        <Component
          {...args}
          variant="filled"
          value={valueReadOnly}
          onChange={setValueReadOnly}
          readOnly
          label="Read-Only Select"
        />
      </View>
    );
  },
};
