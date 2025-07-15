import { type Ref, forwardRef } from "react";
import type { View, ViewStyle } from "react-native";
import { Icon, TouchableRipple } from "react-native-paper";
import { useTheme } from "../hooks";

/**
 * Defines the overall size of the IconButton, affecting icon size and container dimensions.
 * - `extra-small`
 * - `small`
 * - `medium`
 * - `large`
 * - `extra-large`
 */
type Size = "extra-small" | "small" | "medium" | "large" | "extra-large";

/**
 * Defines the shape of the IconButton's container.
 * - `round`: A circular button.
 * - `square`: A button with rounded corners (radius varies by size).
 */
type Shape = "round" | "square";

/**
 * Defines the visual style variant of the IconButton.
 * - `filled`: A contained button with a background color.
 * - `tonal`: A contained button with a secondary/tonal background color.
 * - `outlined`: A button with a transparent background and a border.
 * - `standard`: A button with a transparent background and no border (icon only).
 */
type Variant = "filled" | "tonal" | "outlined" | "standard";

/**
 * Defines the width type of the IconButton's visual container, allowing for adjustments to the default width.
 * - `default`: Standard width for the given size.
 * - `narrow`: A narrower version of the button.
 * - `wide`: A wider version of the button.
 */
type WidthType = "default" | "narrow" | "wide";

/**
 * Props for the IconButton component.
 * @param {string} props.icon - The name of the icon to display.
 * @param {Size} [props.size="small"] - The overall size of the IconButton.
 * @param {Shape} [props.shape="round"] - The shape of the IconButton.
 * @param {Variant} [props.variant="filled"] - The visual style variant of the IconButton.
 * @param {WidthType} [props.widthType="default"] - The width type of the IconButton's visual container.
 * @param {() => void} [props.onPress] - Function to call when the button is pressed.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {boolean} [props.selected] - Whether the button is in a selected state (used for toggle buttons). This affects styling for some variants.
 * @param {string} [props.accessibilityLabel] - Accessibility label for the button.

 * @param {string} [props.testID] - Test ID for the button.
 */
type Props = {
  icon: string;
  size?: Size;
  shape?: Shape;
  variant?: Variant;
  widthType?: WidthType;
  onPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
  accessibilityLabel?: string;

  testID?: string;
};

const getM3IconSize = (size: Size): number => {
  switch (size) {
    case "extra-small":
      return 20;
    case "small":
      return 24;
    case "medium":
      return 24;
    case "large":
      return 32;
    case "extra-large":
      return 40;
    default:
      return 24;
  }
};

const getVisualContainerDimensions = (
  size: Size,
  widthType: WidthType,
): { width: number; height: number } => {
  switch (size) {
    case "extra-small":
      switch (widthType) {
        case "default":
          return { width: 32, height: 32 };
        case "narrow":
          return { width: 28, height: 32 };
        case "wide":
          return { width: 40, height: 32 };
        default:
          return { width: 32, height: 32 };
      }
    case "small":
      switch (widthType) {
        case "default":
          return { width: 40, height: 40 };
        case "narrow":
          return { width: 32, height: 40 };
        case "wide":
          return { width: 52, height: 40 };
        default:
          return { width: 40, height: 40 };
      }
    case "medium":
      switch (widthType) {
        case "default":
          return { width: 56, height: 56 };
        case "narrow":
          return { width: 48, height: 56 };
        case "wide":
          return { width: 72, height: 56 };
        default:
          return { width: 56, height: 56 };
      }
    case "large":
      switch (widthType) {
        case "default":
          return { width: 96, height: 96 };
        case "narrow":
          return { width: 64, height: 96 };
        case "wide":
          return { width: 128, height: 96 };
        default:
          return { width: 96, height: 96 };
      }
    case "extra-large":
      switch (widthType) {
        case "default":
          return { width: 136, height: 136 };
        case "narrow":
          return { width: 104, height: 136 };
        case "wide":
          return { width: 184, height: 136 };
        default:
          return { width: 136, height: 136 };
      }
    default:
      return { width: 40, height: 40 };
  }
};

const getCornerRadius = (
  shape: Shape,
  size: Size,
  selected?: boolean,
): number => {
  const fullRoundness = 1000;
  const actualShape = selected ? "square" : shape;

  if (actualShape === "round") {
    return fullRoundness;
  }
  switch (size) {
    case "extra-small":
      return 12;
    case "small":
      return 12;
    case "medium":
      return 16;
    case "large":
      return 28;
    case "extra-large":
      return 28;
    default:
      return 12;
  }
};

/**
 * A customizable IconButton component adhering to Material Design 3 (M3) specifications.
 * It supports various sizes, shapes (round/square), visual variants (filled, tonal, outlined, standard),
 * and width types (default, narrow, wide). It can also function as a toggle button using the `selected` prop.
 * The component ensures a minimum touch target size for accessibility.
 *
 * @param {Props} props - The component's props.
 * @returns {JSX.Element} The IconButton component.
 * @see {@link https://m3.material.io/components/icon-buttons/specs|Material Design 3 - Icon buttons}
 */
export const IconButton = forwardRef(
  (
    {
      icon,
      size = "small",
      shape = "round",
      variant = "filled",
      widthType = "default",
      onPress,
      disabled,
      selected,
      accessibilityLabel,
      testID,
    }: Props,
    ref: Ref<View>,
  ) => {
    const theme = useTheme();
    const iconSize = getM3IconSize(size);
    const visualDimensions = getVisualContainerDimensions(size, widthType);
    const borderRadius = getCornerRadius(shape, size, selected);

    const targetSize = 48;

    const containerStyle: ViewStyle = {
      width: Math.max(
        visualDimensions.width,
        size === "extra-small" || size === "small"
          ? targetSize
          : visualDimensions.width,
      ),
      height: Math.max(
        visualDimensions.height,
        size === "extra-small" || size === "small"
          ? targetSize
          : visualDimensions.height,
      ),
      borderRadius,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    };

    let iconColor: string = theme.colors.primary;
    let backgroundColor: string | undefined = "transparent";

    if (disabled) {
      iconColor = theme.colors.outline;
      backgroundColor =
        variant === "filled" || variant === "tonal"
          ? theme.colors.surfaceVariant
          : "transparent";
      if (variant === "outlined") {
        containerStyle.borderColor = theme.colors.outline;
        containerStyle.borderWidth = 1;
      }
    } else {
      switch (variant) {
        case "filled":
          if (selected === true) {
            backgroundColor = theme.colors.primary;
            iconColor = theme.colors.onPrimary;
          } else if (selected === false) {
            backgroundColor = theme.colors.surfaceContainerHighest;
            iconColor = theme.colors.primary;
          } else {
            backgroundColor = theme.colors.primary;
            iconColor = theme.colors.onPrimary;
          }
          break;
        case "tonal":
          if (selected === true) {
            backgroundColor = theme.colors.secondaryContainer;
            iconColor = theme.colors.onSecondaryContainer;
          } else if (selected === false) {
            backgroundColor = theme.colors.surfaceContainerHighest;
            iconColor = theme.colors.onSurfaceVariant;
          } else {
            backgroundColor = theme.colors.secondaryContainer;
            iconColor = theme.colors.onSecondaryContainer;
          }
          break;
        case "outlined":
          if (selected === true) {
            backgroundColor = theme.colors.inverseSurface;
            iconColor = theme.colors.inverseOnSurface;
            containerStyle.borderWidth = 0;
          } else if (selected === false) {
            iconColor = theme.colors.onSurfaceVariant;
            containerStyle.borderColor = theme.colors.outlineVariant;
            containerStyle.borderWidth = 1;
            backgroundColor = "transparent";
          } else {
            iconColor = theme.colors.onSurfaceVariant;
            containerStyle.borderColor = theme.colors.outlineVariant;
            containerStyle.borderWidth = 1;
            backgroundColor = "transparent";
          }
          break;
        case "standard":
          if (selected === true) {
            iconColor = theme.colors.primary;
          } else if (selected === false) {
            iconColor = theme.colors.onSurfaceVariant;
          } else {
            iconColor = theme.colors.onSurfaceVariant;
          }
          backgroundColor = "transparent";
          break;
      }
    }
    containerStyle.backgroundColor = backgroundColor;
    const rippleBorderless = shape === "round";

    return (
      <TouchableRipple
        ref={ref}
        onPress={onPress}
        style={containerStyle}
        rippleColor={
          variant === "filled" || variant === "tonal"
            ? theme.colors.onPrimary
            : theme.colors.primary
        }
        borderless={rippleBorderless}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled, selected }}
        testID={testID}
      >
        <Icon source={icon} size={iconSize} color={iconColor} />
      </TouchableRipple>
    );
  },
);
