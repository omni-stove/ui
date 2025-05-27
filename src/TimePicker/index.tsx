import { useCallback, useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { TimePickerModal } from "react-native-paper-dates";
import { TextField } from "../TextField";

const formatTime = (
  hours: number,
  minutes: number,
  use24HourClock?: boolean,
): string => {
  // Guard against invalid numbers
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return "";
  }

  // Ensure values are within valid ranges
  const validHours = Math.max(0, Math.min(23, Math.floor(hours)));
  const validMinutes = Math.max(0, Math.min(59, Math.floor(minutes)));

  if (use24HourClock) {
    return `${String(validHours).padStart(2, "0")}:${String(validMinutes).padStart(2, "0")}`;
  }
  const ampm = validHours >= 12 ? "PM" : "AM";
  const h = validHours % 12 || 12;
  return `${String(h).padStart(2, "0")}:${String(validMinutes).padStart(2, "0")} ${ampm}`;
};

type TimePickerModalActualProps = ComponentProps<typeof TimePickerModal>;

type CustomTimePickerModalProps = Omit<
  TimePickerModalActualProps,
  "visible" | "onDismiss" | "onConfirm" | "hours" | "minutes"
>;

/**
 * Props for the TimePicker component.
 * Extends props from `react-native-paper-dates`' `TimePickerModal` with custom properties.
 *
 * @param {Date} [props.value] - The current selected time as a Date object.
 * @param {(date?: Date) => void} [props.onChange] - Callback function invoked when the time is confirmed. Returns a new Date object with the selected time.
 * @param {string} [props.label] - Label for the TextField.
 * @param {number} [props.initialHours=12] - Initial hours to display in the picker if no value is provided.
 * @param {number} [props.initialMinutes=0] - Initial minutes to display in the picker if no value is provided.
 * @param {boolean} [props.use24HourClock=false] - Whether to use 24-hour clock format.
 * @param {"outlined" | "filled"} [props.variant] - The variant of the TextField.
 * @param {boolean} [props.disabled=false] - Whether the TimePicker is disabled.
 * @param {string} [props.locale="en"] - Locale for the TimePickerModal.
 * @param {TimePickerModalActualProps["animationType"]} [props.animationType] - Animation type for the modal.
 * @param {number} [props.inputFontSize] - Font size for the input fields in the modal.
 */
type Props = CustomTimePickerModalProps & {
  value?: Date;
  onChange?: (date?: Date) => void;
  label?: string;
  initialHours?: number;
  initialMinutes?: number;
  use24HourClock?: boolean;
  variant?: "outlined" | "filled";
  disabled?: boolean;
  errorMessage?: string;
  supportingText?: string;
};

/**
 * A TimePicker component that combines a TextField with `react-native-paper-dates`' `TimePickerModal`.
 * Tapping the TextField opens a modal to select a time.
 *
 * @param {Props} props - The component's props.
 * @returns {JSX.Element} The TimePicker component.
 * @see {@link TextField}
 * @see {@link https://www.react-native-paper-dates.com/docs/time-picker/time-picker-modal|React Native Paper Dates - TimePickerModal}
 */
export const TimePicker = ({
  value,
  onChange,
  label,
  initialHours = 12,
  initialMinutes = 0,
  use24HourClock = false,
  locale = "en",
  animationType,
  inputFontSize,
  variant,
  disabled,
  errorMessage,
  supportingText,
  ...rest
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [displayTime, setDisplayTime] = useState<string>("");
  const [selectedHours, setSelectedHours] = useState<number>(initialHours);
  const [selectedMinutes, setSelectedMinutes] =
    useState<number>(initialMinutes);

  useEffect(() => {
    if (value) {
      const h = value.getHours();
      const m = value.getMinutes();
      // Guard against invalid values from Date object
      const safeH = Number.isFinite(h) ? h : 12;
      const safeM = Number.isFinite(m) ? m : 0;
      setSelectedHours(safeH);
      setSelectedMinutes(safeM);
      setDisplayTime(formatTime(safeH, safeM, use24HourClock));
    } else {
      // Guard against invalid initial values
      const safeInitialHours = Number.isFinite(initialHours)
        ? initialHours
        : 12;
      const safeInitialMinutes = Number.isFinite(initialMinutes)
        ? initialMinutes
        : 0;
      setDisplayTime(
        formatTime(safeInitialHours, safeInitialMinutes, use24HourClock),
      );
      setSelectedHours(safeInitialHours);
      setSelectedMinutes(safeInitialMinutes);
    }
  }, [value, use24HourClock, initialHours, initialMinutes]);

  const handleDismiss = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setModalVisible(false);

      // Guard against invalid values from modal
      const safeHours = Number.isFinite(hours) ? hours : 12;
      const safeMinutes = Number.isFinite(minutes) ? minutes : 0;

      setSelectedHours(safeHours);
      setSelectedMinutes(safeMinutes);
      const newDisplayTime = formatTime(safeHours, safeMinutes, use24HourClock);
      setDisplayTime(newDisplayTime);

      if (onChange) {
        const newDate = value ? new Date(value) : new Date();
        newDate.setHours(safeHours);
        newDate.setMinutes(safeMinutes);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        onChange(newDate);
      }
    },
    [onChange, use24HourClock, value],
  );

  const showModal = useCallback(() => {
    if (disabled) return;

    if (value) {
      const h = value.getHours();
      const m = value.getMinutes();
      // Guard against invalid values when opening modal
      const safeH = Number.isFinite(h) ? h : 12;
      const safeM = Number.isFinite(m) ? m : 0;
      setSelectedHours(safeH);
      setSelectedMinutes(safeM);
    } else {
      // Guard against invalid initial values when opening modal
      const safeInitialHours = Number.isFinite(initialHours)
        ? initialHours
        : 12;
      const safeInitialMinutes = Number.isFinite(initialMinutes)
        ? initialMinutes
        : 0;
      setSelectedHours(safeInitialHours);
      setSelectedMinutes(safeInitialMinutes);
    }
    setModalVisible(true);
  }, [value, initialHours, initialMinutes, disabled]);

  return (
    <>
      <TextField
        startAdornment={{ type: "icon", value: "clock" }}
        variant={variant}
        label={label}
        value={displayTime}
        readOnly={true}
        disabled={disabled}
        errorMessage={errorMessage}
        supportingText={supportingText}
        onPress={showModal}
      />
      <TimePickerModal
        visible={modalVisible}
        onDismiss={handleDismiss}
        onConfirm={handleConfirm}
        hours={selectedHours}
        minutes={selectedMinutes}
        use24HourClock={use24HourClock}
        locale={locale}
        animationType={animationType}
        inputFontSize={inputFontSize}
        {...rest}
      />
    </>
  );
};
