import type {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  TextInputSubmitEditingEventData,
} from "react-native";

/**
 * Defines the visual style variant of the TextField.
 * - `filled`: A TextField with a background color (React Native Paper's `flat` mode).
 * - `outlined`: A TextField with an outline border.
 */
export type TextFieldVariant = "filled" | "outlined";

export type Props = {
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