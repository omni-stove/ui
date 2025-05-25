import type { ReactNode } from "react";
import { Chip as PaperChip } from "react-native-paper";
import { useTheme } from "../hooks";
import type { ComponentProps, ComponentRef } from "react"; // ComponentRef を直接インポート
import { forwardRef } from "react";
// import * as React from "react"; // こちらは不要になったので削除

/**
 * Base props common to all chip variants.
 */
type BaseProps = {
  /** The content displayed within the chip, typically text. */
  children: ReactNode;
  /** An optional icon displayed at the beginning of the chip. */
  leadingIcon?: ComponentProps<typeof PaperChip>["icon"];
  /** Whether the chip is disabled. */
  isDisabled?: boolean;
  /** Callback function executed when the chip is pressed. */
  onPress?: () => void;
  /** Accessibility label for the chip. */
  "aria-label"?: string;
};

// ChipVariant は ChipProps のユニオン型によって不要になったため削除

// --- 型定義を variant ごとに分割 ---
type AssistChipProps = BaseProps & {
  variant: "assist";
  isSelected?: never;
  trailingIcon?: never;
  onTrailingIconPress?: never;
};

type FilterChipProps = BaseProps & {
  variant: "filter";
  /** Whether the filter chip is currently selected. */
  isSelected?: boolean;
  /** An optional icon displayed at the end of the chip, typically for removal in input chips or custom actions in filter chips. */
  trailingIcon?: ComponentProps<typeof PaperChip>["closeIcon"];
  /** Callback function executed when the trailing icon on a filter chip is pressed. */
  onTrailingIconPress?: () => void;
};

type InputChipProps = BaseProps & {
  variant: "input";
  isSelected?: never;
  /** An optional icon displayed at the end of the chip, typically for removal. */
  trailingIcon?: ComponentProps<typeof PaperChip>["closeIcon"];
  /** Callback function executed when the trailing icon on an input chip is pressed. */
  onTrailingIconPress?: () => void;
};

type SuggestionChipProps = BaseProps & {
  variant: "suggestion";
  isSelected?: never;
  trailingIcon?: never;
  onTrailingIconPress?: never;
};

export type ChipProps =
  | AssistChipProps
  | FilterChipProps
  | InputChipProps
  | SuggestionChipProps;
// --- 型定義修正ここまで ---

/**
 * A component to display a chip, extending React Native Paper's Chip with M3 styling and variants.
 * Chips can be used to display information, make selections, filter content, or trigger actions.
 * This component supports `forwardRef` to pass a ref to the underlying `PaperChip` component.
 *
 * The props for the Chip component vary based on the `variant` selected, providing type safety
 * for variant-specific attributes like `isSelected` or `trailingIcon`.
 *
 * @param {ChipProps} props - The props for the Chip component. The specific props available depend on the `variant`.
 * @param {React.Ref<React.ComponentRef<typeof PaperChip>>} ref - Ref to be forwarded to the PaperChip component.
 * @returns {JSX.Element} The rendered Chip component.
 * @see {@link https://callstack.github.io/react-native-paper/docs/components/Chip/|React Native Paper Chip}
 * @see {@link https://m3.material.io/components/chips/overview|Material Design 3 Chips}
 */
// --- forwardRef の導入 ---
export const Chip = forwardRef<
  ComponentRef<typeof PaperChip>, // PaperChip の ref の型
  ChipProps
>((props, ref) => {
  const {
    children,
    leadingIcon,
    isDisabled,
    onPress,
    "aria-label": ariaLabel,
  } = props;
  const theme = useTheme();

  const paperChipMode: "flat" | "outlined" = // 型を明示
    props.variant === "filter" || props.variant === "input" ? "flat" : "flat";

  const showSelectedCheck =
    props.variant === "filter" && props.isSelected && !props.trailingIcon;

  let chipStyle: object = {};
  let elevated = false;

  // --- variant ごとのプロパティアクセスを修正 ---
  switch (props.variant) {
    case "assist":
      elevated = !isDisabled;
      chipStyle = {
        backgroundColor: theme.colors.surface,
        borderColor: isDisabled
          ? theme.colors.surfaceVariant
          : theme.colors.outline, // 枠線を追加
        borderWidth: 1, // 枠線の太さを追加
      };
      break;
    case "filter":
      elevated = false;
      if (props.isSelected) {
        chipStyle = {
          backgroundColor: isDisabled
            ? theme.colors.surfaceVariant
            : theme.colors.secondaryContainer,
          borderColor: isDisabled
            ? theme.colors.surfaceVariant
            : theme.colors.secondaryContainer,
          borderWidth: 1,
        };
      } else {
        chipStyle = {
          backgroundColor: isDisabled
            ? theme.colors.surfaceVariant
            : theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
          borderWidth: 1,
        };
      }
      break;
    case "input":
      elevated = false;
      chipStyle = {
        backgroundColor: isDisabled
          ? theme.colors.surfaceVariant
          : theme.colors.surface,
        borderColor: theme.colors.outlineVariant,
        borderWidth: 1,
      };
      break;
    case "suggestion":
      elevated = false;
      chipStyle = {
        backgroundColor: isDisabled
          ? theme.colors.surfaceVariant
          : theme.colors.surfaceContainerLow,
        borderColor: theme.colors.outlineVariant,
        borderWidth: 1,
      };
      break;
    default:
      // Discriminated union により、このケースには到達しないはず
      // もし到達した場合のフォールバック (型安全のため props を使用しない)
      elevated = !isDisabled; // isDisabled は共通プロパティなのでアクセス可能
      chipStyle = {
        backgroundColor: theme.colors.surface,
      };
      break;
  }

  // --- PaperChip に渡すプロパティを調整 ---
  const commonPaperChipProps = {
    mode: paperChipMode,
    disabled: isDisabled,
    icon: leadingIcon,
    onPress,
    elevated,
    style: chipStyle,
    "aria-label": ariaLabel,
    ref, // ref を渡す
  };

  if (props.variant === "filter") {
    return (
      <PaperChip
        {...commonPaperChipProps}
        selected={props.isSelected}
        closeIcon={props.trailingIcon}
        onClose={props.onTrailingIconPress}
        showSelectedCheck={showSelectedCheck}
      >
        {children}
      </PaperChip>
    );
  }

  if (props.variant === "input") {
    return (
      <PaperChip
        {...commonPaperChipProps}
        closeIcon={props.trailingIcon}
        onClose={props.onTrailingIconPress}
      >
        {children}
      </PaperChip>
    );
  }

  // assist, suggestion
  return <PaperChip {...commonPaperChipProps}>{children}</PaperChip>;
});

Chip.displayName = "Chip"; // forwardRef を使う場合、displayName を設定するのがおすすめ
// --- 修正ここまで ---
