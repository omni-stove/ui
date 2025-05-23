import type { ComponentRef } from "react";
import { forwardRef } from "react";
import type {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  StyleProp,
  TextInputSubmitEditingEventData,
  ViewStyle,
} from "react-native"; // NativeSyntheticEvent, TextInputSubmitEditingEventData をインポート
import { HelperText, TextInput } from "react-native-paper";
import type { TextInput as RNTextInput } from "react-native";

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
  variant?: TextFieldVariant; // export しない TextFieldVariant を使用
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
  readOnly?: boolean; // editable から readOnly に変更
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions; // KeyboardTypeOptions に変更
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  returnKeyType?: ReturnKeyTypeOptions; // ReturnKeyTypeOptions に変更
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void; // 型を変更
  onFocus?: () => void;
  onBlur?: () => void;
  maxLength?: number;
  onPress?: () => void; // onPress プロパティを明示的に追加
};

/**
 * TextField コンポーネント
 */
export const TextField = forwardRef<RNTextInput, Props>( // Propsのみを指定
  ({
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
    readOnly, // editable から readOnly に変更
    secureTextEntry,
    keyboardType,
    autoCapitalize,
    autoCorrect,
    returnKeyType,
    maxLength,
    onSubmitEditing,
    onFocus,
    onBlur,
    onPress, // onPress プロパティを受け取る
  }, ref) => {
    const hasError = !!errorMessage;
    const showHelperText =
      hasError || !!supportingText || (!!maxLength && value !== undefined);

    // react-native-paper の TextInputProps['mode'] に合わせる
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
          editable={readOnly === undefined ? undefined : !readOnly} // readOnly を editable に変換
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength} // maxLength を TextInput に渡す
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
