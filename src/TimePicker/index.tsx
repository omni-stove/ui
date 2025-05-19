import type React from "react";
import { useCallback, useEffect, useState } from "react";
import type { ComponentProps } from "react"; // ComponentProps をインポート
import { TouchableOpacity } from "react-native";
import { TextInput, type TextInputProps } from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates"; // TimePickerModal のみインポート
import { TextField } from "../TextField";

// 時間を HH:mm 形式にフォーマットするヘルパー関数
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

// TimePickerModalProps の代わりに ComponentProps<typeof TimePickerModal> を使用
type TimePickerModalActualProps = ComponentProps<typeof TimePickerModal>;

// CustomTimePickerModalProps の型定義を修正
type CustomTimePickerModalProps = Omit<
  TimePickerModalActualProps, // ここを修正
  "visible" | "onDismiss" | "onConfirm" | "hours" | "minutes"
>;

// 新しい TimePicker の Props
type Props = Omit<TextInputProps, "value" | "onChange" | "editable"> &
  CustomTimePickerModalProps & {
    value?: Date;
    onChange?: (date?: Date) => void;
    initialHours?: number;
    initialMinutes?: number;
    use24HourClock?: boolean;
    variant?: "outlined" | "filled";
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
  ...restTextInputProps
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
      <TouchableOpacity onPress={showModal}>
        <TextField
          {...restTextInputProps}
          left={<TextInput.Icon icon="clock" />}
          mode={variant === "outlined" ? "outlined" : "flat"}
          label={label}
          value={displayTime}
          editable={false}
          onPressIn={showModal}
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
