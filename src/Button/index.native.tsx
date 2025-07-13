import {
  type ComponentProps,
  type Ref,
  forwardRef,
} from "react";
import type { ViewStyle } from "react-native";
import { View } from "react-native";
import { Icon, TouchableRipple } from "react-native-paper";
import { Typography } from "../Typography";
import { useTheme } from "../hooks";
import type { Props, Size, Variant } from "./types";
import { getButtonDimensions } from "./types";

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

    const buttonStyle: ViewStyle = {
      height: dimensions.height,
      paddingHorizontal: dimensions.paddingHorizontal,
      borderRadius: dimensions.height / 2,
      backgroundColor: colors.backgroundColor,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: variant === "outlined" ? 1 : 0,
      borderColor: colors.borderColor,
      opacity: disabled ? 0.38 : 1,
      ...(variant === "elevated" &&
        !disabled && {
          elevation: 1,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
        }),
    };

    const getTypographyVariantForSize = (
      currentSize: Size,
    ): ComponentProps<typeof Typography>["variant"] => {
      switch (currentSize) {
        case "extra-small":
          return "labelLarge"; // 14px
        case "small":
          return "labelLarge"; // 14px
        case "medium":
          return "bodyLarge"; // 16px
        case "large":
          return "headlineSmall"; // 24px
        case "extra-large":
          return "displaySmall"; // 32px
        default:
          return "labelLarge";
      }
    };

    const getTypographyColorForVariant = (
      currentVariant: Variant,
      isDisabled: boolean,
    ): ComponentProps<typeof Typography>["color"] => {
      if (isDisabled) {
        return "outline";
      }
      switch (currentVariant) {
        case "filled":
          return "onPrimary";
        case "tonal":
          return "onSecondaryContainer";
        case "outlined":
        case "text":
        case "elevated":
          return "primary";
        default:
          return "onPrimary";
      }
    };

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
          pointerEvents="none"
        >
          {icon && (
            <Icon
              source={icon}
              size={dimensions.iconSize}
              color={colors.textColor}
            />
          )}
          {children && (
            <Typography
              variant={getTypographyVariantForSize(size)}
              color={getTypographyColorForVariant(variant, disabled)}
            >
              {children}
            </Typography>
          )}
        </View>
      </TouchableRipple>
    );
  },
);

Button.displayName = "Button";