import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useState } from "react";
import { View } from "react-native";
import {
  DatePicker,
  type DatePickerType,
  type DatePickerValue,
  type Props,
} from "./index"; // DatePickerValue もインポート

// Storybookの基本設定
const meta: Meta<Props<DatePickerType>> = {
  component: DatePicker,
  decorators: [
    (Story) => (
      <View style={{ padding: 20, flex: 1, backgroundColor: "white" }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["single", "range", "multiple"],
    },
    value: {
      control: { disable: true },
      description: "Controlled value. Manage via component state in stories.",
    },
    defaultValue: {
      control: { disable: true },
      description: "Initial value. Set in story args or manage via state.",
    },
    onChange: { action: "onChange" },
    label: { control: "text" },
    textFieldVariant: {
      control: { type: "radio" },
      options: ["filled", "outlined"],
    },
    isDisabled: { control: "boolean" },
    errorMessage: { control: "text" },
    required: { control: "boolean" },
    validRange: {
      control: { type: "object" },
      description:
        "e.g., { startDate: new Date('2023-01-01'), endDate: new Date() }",
    },
    locale: { control: "text" },
    saveLabel: { control: "text" },
    cancelLabel: { control: "text" },
    startLabel: { control: "text" },
    endLabel: { control: "text" },
  },
  args: {
    // Default args for all stories unless overridden
    label: "Choose Date",
    onChange: action("onChange"),
    locale: "ja",
    required: false,
    isDisabled: false,
    textFieldVariant: "filled",
    errorMessage: "",
    // validRange, saveLabel, etc., can be added here if a common default is desired
  },
};

export default meta;

// Interactive story template using a generic type
const InteractiveDatePickerTemplate = <T extends DatePickerType>(
  initialArgs: Props<T>,
): StoryObj<Props<T>> => ({
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<DatePickerValue<T>>(args.defaultValue);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleChange = useCallback((newValue: DatePickerValue<T>) => {
      setValue(newValue);
      action("onChange")(newValue); // Log to Storybook actions
    }, []);

    return <DatePicker {...args} value={value} onChange={handleChange} />;
  },
  args: initialArgs,
});

export const Single: StoryObj<Props<"single">> =
  InteractiveDatePickerTemplate<"single">({
    type: "single",
    label: "Single Date",
    defaultValue: undefined, // Start with no date selected
  });

export const Range: StoryObj<Props<"range">> =
  InteractiveDatePickerTemplate<"range">({
    type: "range",
    label: "Date Range",
    defaultValue: [
      new Date(),
      new Date(new Date().setDate(new Date().getDate() + 7)),
    ],
  });

export const Multiple: StoryObj<Props<"multiple">> =
  InteractiveDatePickerTemplate<"multiple">({
    type: "multiple",
    label: "Multiple Dates",
    defaultValue: [
      new Date(),
      new Date(new Date().setDate(new Date().getDate() + 3)),
    ],
  });
