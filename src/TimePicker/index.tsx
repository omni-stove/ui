import type React from "react";
import { useCallback, useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { TouchableOpacity } from "react-native";
import { TimePickerModal } from "react-native-paper-dates";
import { TextField } from "../TextField";

const formatTime = (
  hours: number,
  minutes: number,
  use24HourClock?: boolean,
): string => {
  if (use24HourClock) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${String(h).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
};

type TimePickerModalActualProps = ComponentProps<typeof TimePickerModal>;

type CustomTimePickerModalProps = Omit<
  TimePickerModalActualProps,
  "visible" | "onDismiss" | "onConfirm" | "hours" | "minutes"
>;

type Props = CustomTimePickerModalProps & {
  value?: Date;
  onChange?: (date?: Date) => void;
  label?: string;
  initialHours?: number;
  initialMinutes?: number;
  use24HourClock?: boolean;
  variant?: "outlined" | "filled";
  disabled?: boolean;
};

export const TimePicker: React.FC<Props> = ({
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
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [displayTime, setDisplayTime] = useState<string>("");
  const [selectedHours, setSelectedHours] = useState<number>(initialHours);
  const [selectedMinutes, setSelectedMinutes] =
    useState<number>(initialMinutes);

  useEffect(() => {
    if (value) {
      const h = value.getHours();
      const m = value.getMinutes();
      setSelectedHours(h);
      setSelectedMinutes(m);
      setDisplayTime(formatTime(h, m, use24HourClock));
    } else {
      setDisplayTime(formatTime(initialHours, initialMinutes, use24HourClock));
      setSelectedHours(initialHours);
      setSelectedMinutes(initialMinutes);
    }
  }, [value, use24HourClock, initialHours, initialMinutes]);

  const handleDismiss = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setModalVisible(false);
      setSelectedHours(hours);
      setSelectedMinutes(minutes);
      const newDisplayTime = formatTime(hours, minutes, use24HourClock);
      setDisplayTime(newDisplayTime);

      if (onChange) {
        const newDate = value ? new Date(value) : new Date();
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        onChange(newDate);
      }
    },
    [onChange, use24HourClock, value],
  );

  const showModal = () => {
    if (value) {
      setSelectedHours(value.getHours());
      setSelectedMinutes(value.getMinutes());
    } else {
      setSelectedHours(initialHours);
      setSelectedMinutes(initialMinutes);
    }
    setModalVisible(true);
  };

  return (
    <>
      <TouchableOpacity onPress={showModal} disabled={disabled}>
        <TextField
          startAdornment={{ type: "icon", value: "clock" }}
          variant={variant}
          label={label}
          value={displayTime}
          readOnly={true}
          disabled={disabled}
        />
      </TouchableOpacity>
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
      />
    </>
  );
};
