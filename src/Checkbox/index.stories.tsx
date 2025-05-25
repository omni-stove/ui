import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { useState } from "react";
import { View } from "react-native";
import { Checkbox as Component } from ".";
import { Typography } from "../Typography";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "M3デザインに準拠したCheckboxコンポーネント。checked、unchecked、indeterminateの3つの状態をサポートします。",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Typography variant="titleMedium">通常状態</Typography>
      <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
        <Component checked={false} />
        <Component checked="indeterminate" />
        <Component checked={true} />
      </View>

      <Typography variant="titleMedium">無効状態</Typography>
      <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
        <Component checked={false} disabled />
        <Component checked="indeterminate" disabled />
        <Component checked={true} disabled />
      </View>

      <Typography variant="titleMedium">ラベル付き</Typography>
      <View style={{ gap: 8 }}>
        <Component checked={false} label="未チェック" />
        <Component checked="indeterminate" label="部分選択" />
        <Component checked={true} label="チェック済み" />
      </View>

      <Typography variant="titleMedium">ラベル付き（無効状態）</Typography>
      <View style={{ gap: 8 }}>
        <Component checked={false} label="無効な未チェック" disabled />
        <Component checked="indeterminate" label="無効な部分選択" disabled />
        <Component checked={true} label="無効なチェック済み" disabled />
      </View>
    </View>
  ),
};

export const Behavior: Story = {
  render: () => {
    const [checked, setChecked] = useState<boolean | "indeterminate">(false);

    const getStateText = () => {
      if (checked === true) return "チェック済み";
      if (checked === false) return "未チェック";
      return "部分選択";
    };

    return (
      <View style={{ gap: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Component
            checked={checked}
            onChangeCheck={setChecked}
            label={`現在の状態: ${getStateText()}`}
          />
        </View>

        <View style={{ gap: 8 }}>
          <Typography variant="titleSmall">状態を直接変更:</Typography>
          <Component
            checked={false}
            onChangeCheck={() => setChecked(false)}
            label="未チェックに設定"
          />
          <Component
            checked="indeterminate"
            onChangeCheck={() => setChecked("indeterminate")}
            label="部分選択に設定"
          />
          <Component
            checked={true}
            onChangeCheck={() => setChecked(true)}
            label="チェック済みに設定"
          />
        </View>
      </View>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};
