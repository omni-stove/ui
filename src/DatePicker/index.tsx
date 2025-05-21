import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import {
  DatePickerModal,
  type DatePickerModalMultiProps,
  type DatePickerModalRangeProps,
  type DatePickerModalSingleProps,
} from "react-native-paper-dates";
import { HelperText } from "../HelperText";
import { TextField } from "../TextField";

export type DatePickerType = "single" | "range" | "multiple";

// Make this type exported so it can be used directly when needed
export type DatePickerValue<T extends DatePickerType> = T extends "single"
  ? Date | undefined
  : Date[] | undefined;

// Helper type to extract the onConfirm params type from the library's props
type ConfirmParamsType<T extends DatePickerType> = T extends "single"
  ? Parameters<NonNullable<DatePickerModalSingleProps["onConfirm"]>>[0]
  : T extends "range"
    ? Parameters<NonNullable<DatePickerModalRangeProps["onConfirm"]>>[0]
    : T extends "multiple"
      ? Parameters<NonNullable<DatePickerModalMultiProps["onConfirm"]>>[0]
      : never;

export type Props<T extends DatePickerType> = {
  /**
   * The type of date picker.
   * - `single`: Select a single date.
   * - `range`: Select a date range.
   * - `multiple`: Select multiple dates.
   */
  type: T;
  /**
   * The currently selected date or dates.
   */
  value?: DatePickerValue<T>;
  /**
   * The default selected date or dates.
   */
  defaultValue?: DatePickerValue<T>;
  /**
   * Callback function called when the date is changed.
   */
  onChange?: (value: DatePickerValue<T>) => void;
  /**
   * Label for the text field.
   */
  label?: string;
  /**
   * Description text displayed below the text field.
   */
  description?: string;
  /**
   * Variant of the text field.
   * @default 'filled'
   */
  textFieldVariant?: "outlined" | "filled";
  /**
   * Whether the date picker is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Error message displayed below the text field.
   */
  errorMessage?: string;
  /**
   * Whether the field is required. Adds an asterisk to the label.
   * @default false
   */
  required?: boolean;
  /**
   * The earliest and/or latest date that can be selected.
   * Also allows disabling specific dates.
   */
  validRange?: {
    startDate?: Date;
    endDate?: Date;
    disabledDates?: Date[];
  };
  /**
   * Locale for the date picker.
   * @default 'ja'
   */
  locale?: string;
  /**
   * The label for the save button.
   * @default 'Save' or localized equivalent
   */
  saveLabel?: string;
  /**
   * The label for the cancel button.
   * @default 'Cancel' or localized equivalent
   */
  cancelLabel?: string;
  /**
   * The label for the start date input (for range picker).
   * @default 'Start date' or localized equivalent
   */
  startLabel?: string;
  /**
   * The label for the end date input (for range picker).
   * @default 'End date' or localized equivalent
   */
  endLabel?: string;
  // selectMultipleLabel, selectDateLabel, selectRangeLabel は react-native-paper-dates の DatePickerModalProps に直接存在しないため削除
  // これらのラベルはライブラリがロケールに基づいて内部的に処理するか、別の方法でカスタマイズする必要があるかもしれません。
};

export const DatePicker = <T extends DatePickerType>({
  type,
  value: controlledValue,
  defaultValue,
  onChange,
  label,
  description,
  textFieldVariant = "filled",
  isDisabled = false,
  errorMessage,
  required = false,
  validRange,
  locale = "ja",
  saveLabel, // Default will be handled by react-native-paper-dates based on locale
  cancelLabel,
  startLabel,
  endLabel,
}: Props<T>) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] =
    useState<DatePickerValue<T>>(defaultValue);

  // Update internalValue if controlledValue changes
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const currentValue =
    controlledValue !== undefined ? controlledValue : internalValue;

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, []);

  const handleConfirm = (params: ConfirmParamsType<T>) => {
    setOpen(false);
    let newValue: DatePickerValue<T>;
    if (type === "single") {
      // params is { date: Date } in this case due to ConfirmParamsType
      newValue = (params as { date: Date }).date as DatePickerValue<T>;
    } else if (type === "range") {
      // params is { startDate?: Date, endDate?: Date }
      const rangeParams = params as { startDate?: Date; endDate?: Date };
      newValue = [rangeParams.startDate, rangeParams.endDate].filter(
        Boolean,
      ) as DatePickerValue<T>;
    } else if (type === "multiple") {
      // params is { dates: Date[] }
      newValue = (params as { dates: Date[] }).dates as DatePickerValue<T>;
    } else {
      newValue = undefined;
    }
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const getFormattedDate = () => {
    if (!currentValue) return "";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    try {
      if (type === "single") {
        return (
          (currentValue as Date)?.toLocaleDateString(locale, options) ?? ""
        );
      }
      if (type === "range") {
        const [start, end] = currentValue as Date[];
        if (start && end) {
          return `${start.toLocaleDateString(locale, options)} - ${end.toLocaleDateString(locale, options)}`;
        }
        if (start) {
          return start.toLocaleDateString(locale, options);
        }
        return "";
      }
      if (type === "multiple") {
        return (currentValue as Date[])
          .map((d) => d.toLocaleDateString(locale, options))
          .join(", ");
      }
    } catch (e) {
      // Handle potential error with toLocaleDateString if locale is not supported or date is invalid
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
    return "";
  };

  const textFieldLabel = required ? `${label}*` : label;

  const commonModalProps = {
    locale,
    visible: open,
    onDismiss,
    validRange,
    saveLabel,
    cancelLabel,
  };

  let modalProps:
    | DatePickerModalSingleProps
    | DatePickerModalRangeProps
    | DatePickerModalMultiProps;

  if (type === "single") {
    modalProps = {
      ...commonModalProps,
      mode: "single",
      date: currentValue as Date | undefined,
      onConfirm: handleConfirm as DatePickerModalSingleProps["onConfirm"],
      // selectDateLabel, // Removed
    };
  } else if (type === "range") {
    const [startDate, endDate] = (currentValue as Date[] | undefined) || [];
    modalProps = {
      ...commonModalProps,
      mode: "range",
      startDate,
      endDate,
      onConfirm: handleConfirm as DatePickerModalRangeProps["onConfirm"],
      startLabel,
      endLabel,
      // selectRangeLabel, // Removed
    };
  } else {
    // multiple
    modalProps = {
      ...commonModalProps,
      mode: "multiple",
      dates: currentValue as Date[] | undefined,
      onConfirm: handleConfirm as DatePickerModalMultiProps["onConfirm"],
      // selectMultipleLabel, // Removed
    };
  }

  return (
    <View>
      <TouchableOpacity
        onPress={() => !isDisabled && setOpen(true)}
        activeOpacity={isDisabled ? 1 : 0.7}
        disabled={isDisabled}
      >
        <View pointerEvents="none">
          <TextField
            left={<TextInput.Icon icon="calendar" />}
            label={textFieldLabel}
            value={getFormattedDate()}
            mode={textFieldVariant === "outlined" ? "outlined" : "flat"}
            editable={false} // Important: TextField should not be directly editable
            disabled={isDisabled}
            error={!!errorMessage}
            // You might want to add a calendar icon as a right adornment
            // right={<TextField.Icon icon="calendar" onPress={() => !isDisabled && setOpen(true)} />}
          />
        </View>
      </TouchableOpacity>
      {description && !errorMessage && (
        <HelperText type="info" visible={!!description}>
          {description}
        </HelperText>
      )}
      {errorMessage && (
        <HelperText type="error" visible={!!errorMessage}>
          {errorMessage}
        </HelperText>
      )}
      <DatePickerModal {...modalProps} />
    </View>
  );
};
