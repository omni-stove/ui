import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { View } from "react-native";
import { TimePicker as Component } from "."; // ローカルの TimePicker を使うように修正
// Button は TimePicker 内部で TextField を使うので、ここでは不要になるかも

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    label: "Select Time", // TextField のラベル
    // value や onChange は各 Story で管理する
    // initialHours, initialMinutes, use24HourClock は必要に応じて Story で設定
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
    // 初期値を Date オブジェクトで設定
    const initialDate = new Date();
    initialDate.setHours(args.initialHours ?? 10); // args から取得、なければデフォルト
    initialDate.setMinutes(args.initialMinutes ?? 0); // args から取得、なければデフォルト
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
    locale: "ja", // 日本語ロケール
  },
};
