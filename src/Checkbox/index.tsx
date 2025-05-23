import { useCallback } from "react";
import { Pressable } from "react-native";
import {
  Icon,
  Checkbox as PaperCheckbox,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

type CheckedState = boolean | "indeterminate";

type Props = {
  checked: CheckedState;
  onChangeCheck?: (checked: CheckedState) => void;
  disabled?: boolean;
  testID?: string;
  label?: string;
};

const CheckboxCore = ({
  checked,
  disabled = false,
  testID,
  onPress,
}: {
  checked: CheckedState;
  disabled?: boolean;
  testID?: string;
  onPress: () => void;
}) => {
  const theme = useTheme();

  // indeterminate状態の場合は独自実装
  if (checked === "indeterminate") {
    return (
      <TouchableRipple
        onPress={onPress}
        disabled={disabled}
        testID={testID}
        style={{
          width: 36,
          height: 36,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: "mixed",
          disabled,
        }}
        rippleColor={theme.colors.primary}
      >
        <Pressable
          style={{
            width: 18,
            height: 18,
            borderRadius: 2,
            borderWidth: 2,
            borderColor: disabled
              ? theme.colors.onSurface
              : theme.colors.primary,
            backgroundColor: disabled ? "transparent" : theme.colors.primary,
            justifyContent: "center",
            alignItems: "center",
            opacity: disabled ? 0.38 : 1,
          }}
          pointerEvents="none"
        >
          <Icon
            source="minus"
            size={12}
            color={disabled ? theme.colors.onSurface : theme.colors.onPrimary}
          />
        </Pressable>
      </TouchableRipple>
    );
  }

  // checked/unchecked状態はPaperのCheckboxを使用
  return (
    <PaperCheckbox
      status={checked ? "checked" : "unchecked"}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
    />
  );
};

export const Checkbox = ({
  checked,
  onChangeCheck,
  disabled = false,
  testID,
  label,
}: Props) => {
  const theme = useTheme();

  const handlePress = useCallback(() => {
    if (disabled || !onChangeCheck) return;

    // デフォルトの状態遷移: false → true → false
    if (checked === false) {
      onChangeCheck(true);
      return;
    }
    if (checked === true) {
      onChangeCheck(false);
      return;
    }
    if (checked === "indeterminate") {
      onChangeCheck(true);
    }
  }, [checked, onChangeCheck, disabled]);

  // labelがある場合は横並びで表示
  if (label) {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: checked === "indeterminate" ? "mixed" : checked,
          disabled,
        }}
        accessibilityLabel={label}
      >
        <CheckboxCore
          checked={checked}
          disabled={disabled}
          testID={testID}
          onPress={handlePress}
        />
        <Text
          style={{
            color: disabled ? theme.colors.onSurface : theme.colors.onSurface,
            opacity: disabled ? 0.38 : 1,
          }}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <CheckboxCore
      checked={checked}
      disabled={disabled}
      testID={testID}
      onPress={handlePress}
    />
  );
};

Checkbox.displayName = "Checkbox";
