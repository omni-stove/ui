import { forwardRef } from "react";
import type {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  StyleProp,
  TextInputSubmitEditingEventData,
  ViewStyle,
} from "react-native";
import type { TextInput as RNTextInput } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

/**
 * Defines the visual style variant of the TextField.
 * - `filled`: A TextField with a background color (React Native Paper's `flat` mode).
 * - `outlined`: A TextField with an outline border.
 */
type TextFieldVariant = "filled" | "outlined";
type Props = {
  /**
   * ラベル
   */
  label?: string;
  /**
   * エラーメッセージ (ValidationResult | string)
   */
  errorMessage?: string;
  /**
   * 複数行入力にするか
   * @default false
   */
  multiline?: boolean;
  /**
   * multiline 時の最大表示行数
   * これを超えるとスクロールバーが表示される
   */
  maxLines?: number;
  /**
   * テキストフィールドのスタイル種別
   * ラッパーコンポーネントで使用
   * @default 'filled'
   */
  variant?: TextFieldVariant;
  /**
   * 入力フィールドの前に表示する要素 (アイコンまたはテキスト)
   */
  startAdornment?: { type: "icon" | "label"; value: string };
  /**
   * 入力フィールドの後に表示する要素 (アイコンまたはテキスト)
   */
  endAdornment?: { type: "icon" | "label"; value: string };
  /**
   * 必須項目かどうか
   * @default false
   */
  required?: boolean;
  onChangeText?: (text: string) => void;
  supportingText?: string;
  style?: StyleProp<ViewStyle>;
  value?: string;
  disabled?: boolean;
  readOnly?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  maxLength?: number;
  onPress?: () => void;
};

/**
 * A customizable TextField component based on `react-native-paper`'s `TextInput`.
 * It supports features like error messages, supporting text, character counter,
 * start/end adornments (icons or text), and different visual variants.
 *
 * @param {Props} props - The component's props.
 * @param {React.Ref<RNTextInput>} ref - Ref to be forwarded to the underlying `react-native-paper` TextInput component.
 * @returns {JSX.Element} The TextField component.
 * @see {@link https://callstack.github.io/react-native-paper/docs/components/TextInput/|React Native Paper TextInput}
 * @see {@link HelperText}
 */
export const TextField = forwardRef<RNTextInput, Props>(
  (
    {
      label,
      errorMessage,
      multiline = false,
      maxLines,
      variant = "filled",
      startAdornment,
      endAdornment,
      required = false,
      onChangeText,
      supportingText,
      style,
      value,
      disabled,
      readOnly,
      secureTextEntry,
      keyboardType,
      autoCapitalize,
      autoCorrect,
      returnKeyType,
      maxLength,
      onSubmitEditing,
      onFocus,
      onBlur,
      onPress,
    },
    ref,
  ) => {
    const hasError = !!errorMessage;
    const showHelperText =
      hasError || !!supportingText || (!!maxLength && value !== undefined);

    const paperVariant = variant === "filled" ? "flat" : variant;

    const textFieldLabel = required && label ? `${label}*` : label;

    return (
      <>
        <TextInput
          ref={ref}
          label={textFieldLabel}
          mode={paperVariant}
          multiline={multiline}
          numberOfLines={multiline ? maxLines : undefined}
          left={
            startAdornment &&
            (startAdornment.type === "icon" ? (
              <TextInput.Icon icon={startAdornment.value} />
            ) : (
              <TextInput.Affix text={startAdornment.value} />
            ))
          }
          right={
            endAdornment &&
            (endAdornment.type === "icon" ? (
              <TextInput.Icon icon={endAdornment.value} />
            ) : (
              <TextInput.Affix text={endAdornment.value} />
            ))
          }
          error={hasError}
          onChangeText={onChangeText}
          style={style}
          value={value}
          disabled={disabled}
          editable={readOnly === undefined ? undefined : !readOnly}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={onFocus}
          onBlur={onBlur}
          onPress={onPress}
        />
        {showHelperText && (
          <HelperText
            type={hasError ? "error" : "info"}
            visible={showHelperText}
            style={
              maxLength && value !== undefined && !hasError
                ? { textAlign: "right" }
                : undefined
            }
          >
            {hasError
              ? errorMessage
              : maxLength && value !== undefined
                ? `${value.length} / ${maxLength}`
                : supportingText}
          </HelperText>
        )}
      </>
    );
  },
);
