import { type ReactNode, type Ref, forwardRef } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text, View } from "react-native";
import { Icon, TouchableRipple } from "react-native-paper";
import { useTheme } from "../hooks";

/**
 * Defines the visual style of the button.
 * - `filled`: A contained button with a background color.
 * - `tonal`: A contained button with a secondary background color.
 * - `outlined`: A button with a transparent background and a border.
 * - `text`: A button with a transparent background and no border.
 * - `elevated`: A contained button with a shadow.
 */
type Variant = "filled" | "tonal" | "outlined" | "text" | "elevated";

/**
 * Defines the size of the button, affecting its height, padding, and font size.
 * - `extra-small`
 * - `small`
 * - `medium`
 * - `large`
 * - `extra-large`
 */
type Size = "extra-small" | "small" | "medium" | "large" | "extra-large";

/**
 * Base props for the Button component.
 * @param {Variant} [props.variant="filled"] - The visual style of the button.
 * @param {Size} [props.size="small"] - The size of the button.
 * @param {StyleProp<ViewStyle>} [props.style] - Custom style for the button's outer View.
 * @param {StyleProp<TextStyle>} [props.labelStyle] - Custom style for the button's label Text.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {() => void} [props.onPress] - Function to call when the button is pressed.
 * @param {string} [props.testID] - Test ID for the button.
 * @param {string} [props.accessibilityLabel] - Accessibility label for the button.
 */
type BaseProps = {
  variant?: Variant;
  size?: Size;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
};

/**
 * Props for the Button component. It must have either `children` (label) or an `icon`, or both.
 * @param {ReactNode} [props.children] - The text or ReactNode to display as the button's label.
 * @param {string} [props.icon] - The name of the icon to display.
 */
type Props = BaseProps &
  (
    | { children: ReactNode; icon?: string }
    | { children?: ReactNode; icon: string }
  );

// M3 Button size specifications based on the provided image
const getButtonDimensions = (size: Size) => {
  switch (size) {
    case "extra-small": // 1
      return {
        height: 32,
        paddingHorizontal: 12,
        fontSize: 14,
        iconSize: 16,
      };
    case "small": // 2 (existing default)
      return {
        height: 40,
        paddingHorizontal: 16,
        fontSize: 14,
        iconSize: 18,
      };
    case "medium": // 3
      return {
        height: 56,
        paddingHorizontal: 24,
        fontSize: 16,
        iconSize: 20,
      };
    case "large": // 4
      return {
        height: 96,
        paddingHorizontal: 48,
        fontSize: 24,
        iconSize: 28,
      };
    case "extra-large": // 5
      return {
        height: 136,
        paddingHorizontal: 64,
        fontSize: 32,
        iconSize: 36,
      };
    default:
      return {
        height: 40,
        paddingHorizontal: 16,
        fontSize: 14,
        iconSize: 18,
      };
  }
};

/**
 * A customizable Button component adhering to Material Design 3 (M3) specifications.
 * It supports different visual variants, sizes, and can include an icon and/or a label.
 * The button uses `TouchableRipple` for press feedback.
 *
 * @param {Props} props - The component's props.
 * @param {Ref<View>} ref - Ref for the underlying TouchableRipple component.
 * @returns {JSX.Element} The Button component.
 */
export const Button = forwardRef(
  (
    {
      variant = "filled",
      size = "small",
      style,
      labelStyle,
      disabled = false,
      onPress,
      children,
      icon,
      testID,
      accessibilityLabel,
    }: Props,
    ref: Ref<View>,
  ) => {
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
        // M3 elevated button elevation (level1)
        ...(variant === "elevated" &&
          !disabled && {
            elevation: 1,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
          }),
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

    // リップルカラー（M3仕様に基づく）
    const getRippleColor = () => {
      if (disabled) {
        return theme.colors.outline;
      }

      switch (variant) {
        case "filled":
          return theme.colors.onPrimary;
        case "tonal":
          return theme.colors.onSecondaryContainer;
        case "outlined":
          return theme.colors.primary;
        case "text":
          return theme.colors.primary;
        case "elevated":
          return theme.colors.primary;
        default:
          return theme.colors.onPrimary;
      }
    };

    const rippleColor = getRippleColor();

    return (
      <TouchableRipple
        ref={ref}
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
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: icon && children ? 8 : 0,
          }}
        >
          {icon && (
            <Icon
              source={icon}
              size={dimensions.iconSize}
              color={colors.textColor}
            />
          )}
          {children && <Text style={textStyle}>{children}</Text>}
        </View>
      </TouchableRipple>
    );
  },
);

Button.displayName = "Button";
