import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import type { ComponentProps } from "react";
import { useState } from "react";
import { View } from "react-native";
import { Slider as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  parameters: {
    docs: {
      description: {
        component:
          "Material Design 3 Slider component for selecting values from a range.",
      },
    },
  },
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 100, step: 1 },
      description: "Current value of the slider",
    },
    minValue: {
      control: { type: "number" },
      description: "Minimum value",
    },
    maxValue: {
      control: { type: "number" },
      description: "Maximum value",
    },
    step: {
      control: { type: "number", min: 1 },
      description: "Step increment",
    },
    variant: {
      control: { type: "select" },
      options: ["number", "range"],
      description: "Visual variant of the slider",
    },
    mode: {
      control: { type: "select" },
      options: ["continuous", "centered"],
      description: "Interaction mode",
    },
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
      description: "Slider orientation",
    },
    isDisabled: {
      control: { type: "boolean" },
      description: "Whether the slider is disabled",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const InteractiveSlider = (args: ComponentProps<typeof Component>) => {
  const [value, setValue] = useState(args.value || 50);

  return (
    <Component
      {...args}
      value={value}
      onChange={(newValue) => setValue(newValue as number)}
    />
  );
};

export const Default: Story = {
  args: {
    label: "Volume",
    value: 50,
    minValue: 0,
    maxValue: 100,
    step: 1,
    variant: "number",
    mode: "continuous",
    orientation: "horizontal",
    isDisabled: false,
  },
  render: InteractiveSlider,
};

export const WithLabel: Story = {
  args: {
    ...Default.args,
    label: "Brightness Level",
  },
  render: InteractiveSlider,
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    label: "Disabled Slider",
    isDisabled: true,
    value: 30,
  },
  render: InteractiveSlider,
};

export const CustomRange: Story = {
  args: {
    ...Default.args,
    label: "Temperature (°C)",
    value: 22,
    minValue: -10,
    maxValue: 40,
    step: 0.5,
  },
  render: InteractiveSlider,
};

export const LargeStep: Story = {
  args: {
    ...Default.args,
    label: "Rating",
    value: 3,
    minValue: 1,
    maxValue: 5,
    step: 1,
  },
  render: InteractiveSlider,
};

export const Vertical: Story = {
  args: {
    ...Default.args,
    label: "Vertical Volume",
    orientation: "vertical",
    value: 75,
  },
  render: (args) => (
    <View style={{ height: 250, alignItems: "center" }}>
      <InteractiveSlider {...args} />
    </View>
  ),
};

export const MultipleSliders: Story = {
  render: () => {
    const [volume, setVolume] = useState(50);
    const [brightness, setBrightness] = useState(75);
    const [temperature, setTemperature] = useState(22);

    return (
      <View style={{ gap: 24, padding: 16 }}>
        <Component
          label="Volume"
          value={volume}
          onChange={(value) => setVolume(value as number)}
          minValue={0}
          maxValue={100}
        />
        <Component
          label="Brightness"
          value={brightness}
          onChange={(value) => setBrightness(value as number)}
          minValue={0}
          maxValue={100}
        />
        <Component
          label="Temperature (°C)"
          value={temperature}
          onChange={(value) => setTemperature(value as number)}
          minValue={16}
          maxValue={30}
          step={0.5}
        />
      </View>
    );
  },
};

export const Behavior: Story = {
  args: Default.args,
  render: InteractiveSlider,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();

    const slider = canvas.getByTestId("slider");
    expect(slider).toBeTruthy();
  },
};
