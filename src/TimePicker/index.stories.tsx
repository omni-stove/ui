import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { View } from "react-native";
import { TimePicker as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    label: "Select Time",
  },
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [time, setTime] = useState<Date | undefined>(undefined);
    return (
      <Component
        {...args}
        value={time}
        onChange={(newTime) => {
          setTime(newTime);
          console.log("Selected Time:", newTime);
        }}
      />
    );
  },
};

export const WithInitialTime: Story = {
  render: (args) => {
    const initialDate = new Date();
    initialDate.setHours(args.initialHours ?? 10);
    initialDate.setMinutes(args.initialMinutes ?? 0);
    initialDate.setSeconds(0);
    initialDate.setMilliseconds(0);

    const [time, setTime] = useState<Date | undefined>(initialDate);

    return (
      <Component
        {...args}
        value={time}
        onChange={(newTime) => {
          setTime(newTime);
          console.log("Selected Time:", newTime);
        }}
      />
    );
  },
  args: {
    label: "Time (Initial: 10:00 AM)",
    initialHours: 10,
    initialMinutes: 0,
  },
};

export const TwentyFourHourClock: Story = {
  render: (args) => {
    const initialDate = new Date();
    initialDate.setHours(args.initialHours ?? 14);
    initialDate.setMinutes(args.initialMinutes ?? 45);
    initialDate.setSeconds(0);
    initialDate.setMilliseconds(0);

    const [time, setTime] = useState<Date | undefined>(initialDate);
    return (
      <Component
        {...args}
        value={time}
        onChange={(newTime) => {
          setTime(newTime);
          console.log("Selected Time (24h):", newTime);
        }}
      />
    );
  },
  args: {
    label: "Time (24h, Initial: 14:45)",
    use24HourClock: true,
    initialHours: 14,
    initialMinutes: 45,
  },
};

export const CustomLocale: Story = {
  render: (args) => {
    const [time, setTime] = useState<Date | undefined>(undefined);
    return (
      <Component
        {...args}
        value={time}
        onChange={(newTime) => {
          setTime(newTime);
          console.log("Selected Time (ja):", newTime);
        }}
      />
    );
  },
  args: {
    label: "時間を選択 (ja)",
    locale: "ja",
  },
};
