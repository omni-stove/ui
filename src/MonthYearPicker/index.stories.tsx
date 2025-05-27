import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { useState } from "react";
import { View } from "react-native";
import { MonthYearPicker as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  title: "Components/MonthYearPicker",
  parameters: {
    docs: {
      description: {
        component:
          "年月を選択するためのピッカーコンポーネント。履歴書の学歴・職歴入力などに適している。",
      },
    },
  },
  argTypes: {
    value: {
      control: false,
      description: "選択された年月（制御コンポーネント用）",
    },
    defaultValue: {
      control: false,
      description: "デフォルトの年月（非制御コンポーネント用）",
    },
    onChange: {
      action: "changed",
      description: "年月が変更された時のコールバック",
    },
    label: {
      control: "text",
      description: "テキストフィールドのラベル",
    },
    supportingText: {
      control: "text",
      description: "テキストフィールド下部のサポートテキスト",
    },
    textFieldVariant: {
      control: "select",
      options: ["filled", "outlined"],
      description: "テキストフィールドのバリアント",
    },
    isDisabled: {
      control: "boolean",
      description: "無効状態かどうか",
    },
    errorMessage: {
      control: "text",
      description: "エラーメッセージ",
    },
    required: {
      control: "boolean",
      description: "必須フィールドかどうか",
    },
    yearRange: {
      control: "number",
      description: "現在年から過去何年まで表示するか",
    },
    locale: {
      control: "text",
      description: "ロケール",
    },
    saveLabel: {
      control: "text",
      description: "保存ボタンのラベル",
    },
    cancelLabel: {
      control: "text",
      description: "キャンセルボタンのラベル",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const args: Story["args"] = {
  label: "入社年月",
  supportingText: "入社した年月を選択してください",
};

export const Default: Story = {
  args,
  render: (args) => <Component {...args} />,
};

export const WithDefaultValue: Story = {
  args: {
    ...args,
    label: "卒業年月",
    defaultValue: new Date(2020, 2, 1), // 2020年3月
    supportingText: "大学を卒業した年月",
  },
  render: (args) => <Component {...args} />,
};

export const Required: Story = {
  args: {
    ...args,
    label: "生年月",
    required: true,
    supportingText: "生まれた年月を入力してください（必須）",
  },
  render: (args) => <Component {...args} />,
};

export const WithError: Story = {
  args: {
    ...args,
    label: "退職年月",
    errorMessage: "退職年月は入社年月より後である必要があります",
    supportingText: "退職した年月を選択してください",
  },
  render: (args) => <Component {...args} />,
};

export const Disabled: Story = {
  args: {
    ...args,
    label: "確定年月",
    isDisabled: true,
    defaultValue: new Date(2024, 4, 1), // 2024年5月
    supportingText: "この項目は編集できません",
  },
  render: (args) => <Component {...args} />,
};

export const Outlined: Story = {
  args: {
    ...args,
    label: "資格取得年月",
    textFieldVariant: "outlined",
    supportingText: "資格を取得した年月",
  },
  render: (args) => <Component {...args} />,
};

export const CustomLabels: Story = {
  args: {
    ...args,
    label: "開始年月",
    saveLabel: "決定",
    cancelLabel: "戻る",
    supportingText: "プロジェクト開始年月",
  },
  render: (args) => <Component {...args} />,
};

export const LimitedYearRange: Story = {
  args: {
    ...args,
    label: "最近の年月",
    yearRange: 5, // 過去5年のみ
    supportingText: "過去5年以内の年月のみ選択可能",
  },
  render: (args) => <Component {...args} />,
};

export const Controlled: Story = {
  args: {
    ...args,
    label: "制御された年月選択",
    supportingText: "外部の状態で制御されています",
  },
  render: (args) => {
    const [value, setValue] = useState<Date | undefined>(
      new Date(2023, 5, 1), // 2023年6月
    );

    return (
      <View style={{ gap: 16 }}>
        <Component {...args} value={value} onChange={setValue} />
        {value && (
          <Component
            label="選択された年月の表示"
            value={value}
            isDisabled
            supportingText={`選択: ${value.getFullYear()}年${value.getMonth() + 1}月`}
          />
        )}
      </View>
    );
  },
};

export const MultipleFields: Story = {
  args,
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    return (
      <View style={{ gap: 16 }}>
        <Component
          {...args}
          label="開始年月"
          value={startDate}
          onChange={setStartDate}
          supportingText="プロジェクト開始年月"
        />
        <Component
          {...args}
          label="終了年月"
          value={endDate}
          onChange={setEndDate}
          supportingText="プロジェクト終了年月"
          errorMessage={
            startDate && endDate && endDate <= startDate
              ? "終了年月は開始年月より後である必要があります"
              : undefined
          }
        />
      </View>
    );
  },
};

export const Behavior: Story = {
  args,
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};
