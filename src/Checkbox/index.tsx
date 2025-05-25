import { useCallback } from "react";
import { Pressable } from "react-native";
import {
  Icon,
  Checkbox as PaperCheckbox,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useTheme } from "../hooks";

/**
 * Represents the possible states of a checkbox.
 * - `true`: The checkbox is checked.
 * - `false`: The checkbox is unchecked.
 * - `"indeterminate"`: The checkbox is in an indeterminate state.
 */
type CheckedState = boolean | "indeterminate";

/**
 * Props for the Checkbox component.
 * @param {CheckedState} props.checked - The current checked state of the checkbox.
 * @param {(checked: CheckedState) => void} [props.onChangeCheck] - Callback function invoked when the checkbox state changes.
 * @param {boolean} [props.disabled=false] - Whether the checkbox is disabled.
 * @param {string} [props.testID] - Test ID for the checkbox.
 * @param {string} [props.label] - Optional label to display next to the checkbox.
 */
type Props = {
  checked: CheckedState;
  onChangeCheck?: (checked: CheckedState) => void;
  disabled?: boolean;
  testID?: string;
  label?: string;
};

/**
 * Core Checkbox rendering component.
 * Handles the visual representation of checked, unchecked, and indeterminate states.
 * This component is primarily for internal use by the main `Checkbox` component.
 *
 * @param {object} props - The component's props.
 * @param {CheckedState} props.checked - The current checked state.
 * @param {boolean} [props.disabled=false] - Whether the checkbox is disabled.
 * @param {string} [props.testID] - Test ID for the checkbox.
 * @param {() => void} props.onPress - Function to call when the checkbox is pressed.
 * @returns {JSX.Element} The core checkbox element.
 */
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

/**
 * A Checkbox component that supports checked, unchecked, and indeterminate states.
 * It can optionally display a label next to the checkbox.
 * The component handles state transitions:
 * - `false` -> `true`
 * - `true` -> `false`
 * - `indeterminate` -> `true` (when pressed)
 *
 * It uses `react-native-paper`'s `Checkbox` for standard states and provides a custom
 * implementation for the `indeterminate` state.
 *
 * @param {Props} props - The component's props.
 * @returns {JSX.Element} The Checkbox component.
 * @see {@link https://callstack.github.io/react-native-paper/docs/components/Checkbox/|React Native Paper Checkbox}
 */
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
