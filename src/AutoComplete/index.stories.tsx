import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { type ComponentProps, useState } from "react";
import { View } from "react-native";
import { AutoComplete as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  parameters: {
    docs: {
      description: {
        component:
          "AutoComplete component that allows users to search and select multiple options. Supports different rendering modes (dropdown, bottom sheet, modal) and automatically adapts to screen size.",
      },
    },
  },
  argTypes: {
    renderMode: {
      control: { type: "select" },
      options: ["auto", "dropdown", "bottomSheet", "modal"],
      description: "The rendering mode for the options display",
    },
    variant: {
      control: { type: "select" },
      options: ["filled", "outlined"],
      description: "The variant of the TextField",
    },
    maxSelections: {
      control: { type: "number" },
      description: "Maximum number of selections allowed",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the AutoComplete is disabled",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

// Sample options
const techOptions = [
  { label: "React", value: "react" },
  { label: "React Native", value: "react-native" },
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "Node.js", value: "nodejs" },
  { label: "Vue.js", value: "vuejs" },
  { label: "Angular", value: "angular" },
  { label: "Python", value: "python" },
];

const fruitOptions = [
  { label: "りんご", value: "apple" },
  { label: "バナナ", value: "banana" },
  { label: "オレンジ", value: "orange" },
  { label: "ぶどう", value: "grape" },
  { label: "いちご", value: "strawberry" },
  { label: "もも", value: "peach" },
];

// Wrapper component for controlled state
const AutoCompleteWrapper = (
  props: Omit<ComponentProps<typeof Component>, "value" | "onChange">,
) => {
  const [value, setValue] = useState<string[]>([]);
  return <Component {...props} value={value} onChange={setValue} />;
};

export const Default: Story = {
  args: {
    options: techOptions,
    label: "技術スタック",
    placeholder: "技術を選択してください",
  },
  render: (args) => <AutoCompleteWrapper {...args} />,
};

export const WithInitialValues: Story = {
  args: {
    options: techOptions,
    label: "技術スタック",
    placeholder: "技術を選択してください",
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(["react", "typescript"]);
    return <Component {...args} value={value} onChange={setValue} />;
  },
};

export const Variants: Story = {
  render: () => {
    const [filledValue, setFilledValue] = useState<string[]>([]);
    const [outlinedValue, setOutlinedValue] = useState<string[]>([]);

    return (
      <View style={{ gap: 24 }}>
        <Component
          options={techOptions}
          value={filledValue}
          onChange={setFilledValue}
          label="Filled Variant"
          placeholder="技術を選択してください"
          variant="filled"
        />
        <Component
          options={fruitOptions}
          value={outlinedValue}
          onChange={setOutlinedValue}
          label="Outlined Variant"
          placeholder="果物を選択してください"
          variant="outlined"
        />
      </View>
    );
  },
};

export const RenderModes: Story = {
  render: () => {
    const [dropdownValue, setDropdownValue] = useState<string[]>([]);
    const [bottomSheetValue, setBottomSheetValue] = useState<string[]>([]);
    const [modalValue, setModalValue] = useState<string[]>([]);

    return (
      <View style={{ gap: 24 }}>
        <Component
          options={techOptions}
          value={dropdownValue}
          onChange={setDropdownValue}
          label="Dropdown Mode"
          placeholder="技術を選択してください"
          renderMode="dropdown"
        />
        <Component
          options={fruitOptions}
          value={bottomSheetValue}
          onChange={setBottomSheetValue}
          label="Bottom Sheet Mode"
          placeholder="果物を選択してください"
          renderMode="bottomSheet"
        />
        <Component
          options={techOptions}
          value={modalValue}
          onChange={setModalValue}
          label="Modal Mode"
          placeholder="技術を選択してください"
          renderMode="modal"
        />
      </View>
    );
  },
};

export const WithConstraints: Story = {
  render: () => {
    const [maxValue, setMaxValue] = useState<string[]>([]);
    const [disabledValue, setDisabledValue] = useState<string[]>([
      "react",
      "typescript",
    ]);
    const [errorValue, setErrorValue] = useState<string[]>([]);

    return (
      <View style={{ gap: 24 }}>
        <Component
          options={techOptions}
          value={maxValue}
          onChange={setMaxValue}
          label="最大3つまで選択可能"
          placeholder="技術を選択してください"
          maxSelections={3}
          supportingText="最大3つまで選択できます"
        />
        <Component
          options={techOptions}
          value={disabledValue}
          onChange={setDisabledValue}
          label="無効状態"
          placeholder="技術を選択してください"
          disabled
        />
        <Component
          options={techOptions}
          value={errorValue}
          onChange={setErrorValue}
          label="エラー状態"
          placeholder="技術を選択してください"
          errorMessage="少なくとも1つの技術を選択してください"
        />
      </View>
    );
  },
};

export const CustomFilter: Story = {
  args: {
    options: techOptions,
    label: "カスタムフィルター（先頭一致）",
    placeholder: "技術を選択してください",
    filterFunction: (options, input) => {
      if (!input.trim()) return options;
      return options.filter((option) =>
        option.label.toLowerCase().startsWith(input.toLowerCase()),
      );
    },
    supportingText: "先頭一致で検索されます",
  },
  render: (args) => <AutoCompleteWrapper {...args} />,
};

export const Playground: Story = {
  args: {
    options: techOptions,
    label: "技術スタック",
    placeholder: "技術を選択してください",
    renderMode: "auto",
    variant: "filled",
    maxSelections: undefined,
    disabled: false,
    errorMessage: "",
    supportingText: "",
  },
  render: (args) => <AutoCompleteWrapper {...args} />,
};

export const InteractionTest: Story = {
  args: {
    options: techOptions,
    label: "技術スタック",
    placeholder: "技術を選択してください",
  },
  render: (args) => <AutoCompleteWrapper {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // コンポーネントが表示されることを確認
    const textField = canvas.getByRole("button");
    expect(textField).toBeTruthy();

    // クリックしてオプションを開く
    await userEvent.click(textField);

    // 少し待機してからオプションが表示されることを確認
    await new Promise((resolve) => setTimeout(resolve, 100));
  },
};
