import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  DatePickerModal,
  type DatePickerModalMultiProps,
  type DatePickerModalRangeProps,
  type DatePickerModalSingleProps,
} from "react-native-paper-dates";
import { TextField } from "../TextField";

/**
 * Defines the type of the DatePicker.
 * - `single`: Allows selection of a single date.
 * - `range`: Allows selection of a date range (start and end dates).
 * - `multiple`: Allows selection of multiple individual dates.
 */
export type DatePickerType = "single" | "range" | "multiple";

/**
 * Defines the type of the value for the DatePicker based on its `DatePickerType`.
 * - For `single` type, it's a single `Date` object or `undefined`.
 * - For `range` or `multiple` types, it's an array of `Date` objects or `undefined`.
 */
export type DatePickerValue<T extends DatePickerType> = T extends "single"
  ? Date | undefined
  : Date[] | undefined;

/**
 * Defines the type of the parameters received by the `onConfirm` callback of the `DatePickerModal`,
 * based on the `DatePickerType`. This is used internally to correctly handle confirmation parameters.
 */
type ConfirmParamsType<T extends DatePickerType> = T extends "single"
  ? Parameters<NonNullable<DatePickerModalSingleProps["onConfirm"]>>[0]
  : T extends "range"
    ? Parameters<NonNullable<DatePickerModalRangeProps["onConfirm"]>>[0]
    : T extends "multiple"
      ? Parameters<NonNullable<DatePickerModalMultiProps["onConfirm"]>>[0]
      : never;

/**
 * Props for the DatePicker component.
 * @template T - The type of the date picker, extending `DatePickerType`.
 * @param {T} props.type - The type of date picker (`single`, `range`, or `multiple`).
 * @param {DatePickerValue<T>} [props.value] - The currently selected date(s). This makes the component controlled.
 * @param {DatePickerValue<T>} [props.defaultValue] - The default selected date(s) for uncontrolled usage.
 * @param {(value: DatePickerValue<T>) => void} [props.onChange] - Callback function invoked when the date selection is confirmed.
 * @param {string} [props.label] - Label for the TextField that displays the selected date(s).
 * @param {string} [props.supportingText] - Supporting text displayed below the TextField.
 * @param {"outlined" | "filled"} [props.textFieldVariant="filled"] - Variant of the TextField.
 * @param {boolean} [props.isDisabled=false] - Whether the DatePicker is disabled.
 * @param {string} [props.errorMessage] - Error message displayed below the TextField.
 * @param {boolean} [props.required=false] - Whether the field is required. Adds an asterisk to the label.
 * @param {object} [props.validRange] - Defines the valid range of dates that can be selected.
 * @param {Date} [props.validRange.startDate] - The earliest selectable date.
 * @param {Date} [props.validRange.endDate] - The latest selectable date.
 * @param {Date[]} [props.validRange.disabledDates] - An array of specific dates that are disabled.
 * @param {string} [props.locale="ja"] - Locale for the date picker modal (e.g., "en", "ja").
 * @param {string} [props.saveLabel] - Custom label for the save button in the modal.
 * @param {string} [props.cancelLabel] - Custom label for the cancel button in the modal.
 * @param {string} [props.startLabel] - Custom label for the start date input (for `range` type).
 * @param {string} [props.endLabel] - Custom label for the end date input (for `range` type).
 */
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
   * Supporting text displayed below the text field.
   */
  supportingText?: string;
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
};

/**
 * A DatePicker component that allows users to select a single date, a date range, or multiple dates.
 * It uses a `TextField` to display the selected date(s) and opens a `DatePickerModal` from
 * `react-native-paper-dates` for selection.
 *
 * @template T - The type of the date picker, extending `DatePickerType`.
 * @param {Props<T>} props - The component's props.
 * @returns {JSX.Element} The DatePicker component.
 * @see {@link TextField}
 * @see {@link https://www.react-native-paper-dates.com/docs/date-picker/date-picker-modal|React Native Paper Dates - DatePickerModal}
 */
export const DatePicker = <T extends DatePickerType>({
  type,
  value: controlledValue,
  defaultValue,
  onChange,
  label,
  supportingText,
  textFieldVariant = "filled",
  isDisabled = false,
  errorMessage,
  required = false,
  validRange,
  locale = "ja",
  saveLabel,
  cancelLabel,
  startLabel,
  endLabel,
}: Props<T>) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] =
    useState<DatePickerValue<T>>(defaultValue);

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
      newValue = (params as { date: Date }).date as DatePickerValue<T>;
    } else if (type === "range") {
      const rangeParams = params as { startDate?: Date; endDate?: Date };
      newValue = [rangeParams.startDate, rangeParams.endDate].filter(
        Boolean,
      ) as DatePickerValue<T>;
    } else if (type === "multiple") {
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
    };
  } else {
    modalProps = {
      ...commonModalProps,
      mode: "multiple",
      dates: currentValue as Date[] | undefined,
      onConfirm: handleConfirm as DatePickerModalMultiProps["onConfirm"],
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
            startAdornment={{ type: "icon", value: "calendar" }}
            label={textFieldLabel}
            value={getFormattedDate()}
            variant={textFieldVariant}
            readOnly
            disabled={isDisabled}
            errorMessage={errorMessage}
            supportingText={supportingText}
          />
        </View>
      </TouchableOpacity>
      {/* TextField 側で HelperText を表示するので、DatePicker 側では不要になる */}
      {/* {supportingText && !errorMessage && (
        <HelperText type="info" visible={!!supportingText}>
          {supportingText}
        </HelperText>
      )}
      {errorMessage && (
        <HelperText type="error" visible={!!errorMessage}>
          {errorMessage}
        </HelperText>
      )} */}
      <DatePickerModal {...modalProps} />
    </View>
  );
};
