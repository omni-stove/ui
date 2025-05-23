import { memo, type ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { useTheme } from "../../hooks";

// M3 Button variants and sizes
type Variant = "filled" | "tonal" | "outlined" | "text" | "elevated";
type Size = "extra-small" | "small" | "medium" | "large" | "extra-large";

type Props = {
  variant?: Variant;
  size?: Size;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  onPress?: () => void;
  children: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
};

// M3 Button size specifications based on the provided image
const getButtonDimensions = (size: Size) => {
  switch (size) {
    case "extra-small": // 1
      return {
        height: 32,
        paddingHorizontal: 12,
        fontSize: 14,
      };
    case "small": // 2 (existing default)
      return {
        height: 40,
        paddingHorizontal: 16,
        fontSize: 14,
      };
    case "medium": // 3
      return {
        height: 56,
        paddingHorizontal: 24,
        fontSize: 16,
      };
    case "large": // 4
      return {
        height: 96,
        paddingHorizontal: 48,
        fontSize: 24,
      };
    case "extra-large": // 5
      return {
        height: 136,
        paddingHorizontal: 64,
        fontSize: 32,
      };
    default:
      return {
        height: 40,
        paddingHorizontal: 16,
        fontSize: 14,
      };
  }
};

export const Button = memo(
  ({
    variant = "filled",
    size = "small",
    style,
    labelStyle,
    disabled = false,
    onPress,
    children,
    testID,
    accessibilityLabel,
  }: Props) => {
    const theme = useTheme();
    const dimensions = getButtonDimensions(size);

    // M3のvariant別カラー設定
    const getButtonColors = () => {
      if (disabled) {
        return {
          backgroundColor: theme.colors.surfaceVariant,
          textColor: theme.colors.outline,
          borderColor: theme.colors.outline,
        };
      }

      switch (variant) {
        case "filled":
          return {
            backgroundColor: theme.colors.primary,
            textColor: theme.colors.onPrimary,
          };
        case "tonal":
          return {
            backgroundColor: theme.colors.secondaryContainer,
            textColor: theme.colors.onSecondaryContainer,
          };
        case "outlined":
          return {
            backgroundColor: "transparent",
            textColor: theme.colors.primary,
            borderColor: theme.colors.outline,
          };
        case "text":
          return {
            backgroundColor: "transparent",
            textColor: theme.colors.primary,
          };
        case "elevated":
          return {
            backgroundColor: theme.colors.surfaceContainerLow,
            textColor: theme.colors.primary,
          };
        default:
          return {
            backgroundColor: theme.colors.primary,
            textColor: theme.colors.onPrimary,
          };
      }
    };

    const colors = getButtonColors();

    // ボタンスタイル
    const buttonStyle: StyleProp<ViewStyle> = [
      {
        height: dimensions.height,
        paddingHorizontal: dimensions.paddingHorizontal,
        borderRadius: dimensions.height / 2, // md.sys.shape.corner.full
        backgroundColor: colors.backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: variant === "outlined" ? 1 : 0,
        borderColor: colors.borderColor,
        opacity: disabled ? 0.38 : 1,
      },
      style,
    ];

    // テキストスタイル
    const textStyle: StyleProp<TextStyle> = [
      {
        fontSize: dimensions.fontSize,
        lineHeight: dimensions.fontSize * 1.2,
        color: colors.textColor,
        fontWeight: "500",
        textAlign: "center",
      },
      labelStyle,
    ];

    // リップルカラー
    const rippleColor =
      variant === "filled" || variant === "tonal"
        ? theme.colors.onPrimary
        : theme.colors.primary;

    return (
      <TouchableRipple
        onPress={onPress}
        disabled={disabled}
        style={buttonStyle}
        rippleColor={rippleColor}
        borderless={false}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={textStyle}>{children}</Text>
        </View>
      </TouchableRipple>
    );
  },
);

Button.displayName = "Button";
