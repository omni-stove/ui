import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import { Icon, TouchableRipple, useTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";

// Types based on M3 documentation
type Size = "extra-small" | "small" | "medium" | "large" | "extra-large";
type Shape = "round" | "square";
type Variant = "filled" | "tonal" | "outlined" | "standard";
type WidthType = "default" | "narrow" | "wide";

type Props = {
  icon: string;
  size?: Size;
  shape?: Shape;
  variant?: Variant;
  widthType?: WidthType;
  onPress?: () => void;
  disabled?: boolean;
  selected?: boolean; // For toggle buttons
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>; // Custom style for the TouchableRipple container
  testID?: string;
};

const getM3IconSize = (size: Size): number => {
  // Based on the "Icon" column in the first image provided by the user
  switch (size) {
    case "extra-small":
      return 20; // A
    case "small":
      return 24; // B
    case "medium":
      return 24; // C
    case "large":
      return 32; // D
    case "extra-large":
      return 40; // E
    default:
      return 24;
  }
};

const getVisualContainerDimensions = (
  size: Size,
  widthType: WidthType,
): { width: number; height: number } => {
  // Based on the "Default width", "Narrow width", "Wide width" columns for the visual button container
  switch (size) {
    case "extra-small": // A
      switch (widthType) {
        case "default":
          return { width: 32, height: 32 };
        case "narrow":
          return { width: 28, height: 32 };
        case "wide":
          return { width: 40, height: 32 };
        default:
          return { width: 32, height: 32 }; // Default for extra-small
      }
    // break; // Unreachable
    case "small": // B
      switch (widthType) {
        case "default":
          return { width: 40, height: 40 };
        case "narrow":
          return { width: 32, height: 40 };
        case "wide":
          return { width: 52, height: 40 };
        default:
          return { width: 40, height: 40 }; // Default for small
      }
    // break; // Unreachable
    case "medium": // C
      switch (widthType) {
        case "default":
          return { width: 56, height: 56 };
        case "narrow":
          return { width: 48, height: 56 };
        case "wide":
          return { width: 72, height: 56 };
        default:
          return { width: 56, height: 56 }; // Default for medium
      }
    // break; // Unreachable
    case "large": // D
      switch (widthType) {
        case "default":
          return { width: 96, height: 96 };
        case "narrow":
          return { width: 64, height: 96 };
        case "wide":
          return { width: 128, height: 96 };
        default:
          return { width: 96, height: 96 }; // Default for large
      }
    // break; // Unreachable
    case "extra-large": // E
      switch (widthType) {
        case "default":
          return { width: 136, height: 136 };
        case "narrow":
          return { width: 104, height: 136 };
        case "wide":
          return { width: 184, height: 136 };
        default:
          return { width: 136, height: 136 }; // Default for extra-large
      }
    // break; // Unreachable
    default: // Default to 'small' 'default'
      return { width: 40, height: 40 };
  }
};

// M3 Corner radius values based on documentation (XS, S, M, L, XL)
// A. Round button: Full
// B. Square button: 12dp, 12dp, 16dp, 28dp, 28dp
// C. Pressed state: 8dp, 8dp, 12dp, 16dp, 16dp (Not directly handled here, ripple handles press)
const getCornerRadius = (
  shape: Shape,
  size: Size,
  selected?: boolean,
): number => {
  const fullRoundness = 1000; // A large number for full roundness

  // If selected is true, always use square shape for toggle
  const actualShape = selected ? "square" : shape;

  if (actualShape === "round") {
    return fullRoundness;
  }
  // Square
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

export const IconButton = ({
  icon,
  size = "small",
  shape = "round",
  variant = "filled",
  widthType = "default",
  onPress,
  disabled,
  selected,
  accessibilityLabel,
  style,
  testID,
}: Props) => {
  const theme = useTheme<MD3Theme>();
  const iconSize = getM3IconSize(size);
  const visualDimensions = getVisualContainerDimensions(size, widthType);
  const borderRadius = getCornerRadius(shape, size, selected);

  // Target size handling (minimum 48x48 for accessibility)
  // The second image from user shows target sizes.
  // For XS (A) and S (B), the target is 48x48 regardless of visual widthType.
  // For M, L, XL, the visual size is already >= 48.
  const targetSize = 48;
  const touchableStyle: StyleProp<ViewStyle> = {
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
    justifyContent: "center",
    alignItems: "center",
  };

  const containerStyle: ViewStyle = {
    ...visualDimensions,
    borderRadius,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Important for ripple and shape
  };

  let iconColor: string = theme.colors.primary; // Default
  let backgroundColor: string | undefined = "transparent"; // Default for standard

  if (disabled) {
    iconColor = theme.colors.onSurfaceDisabled;
    backgroundColor =
      variant === "filled" || variant === "tonal"
        ? theme.colors.surfaceDisabled
        : "transparent";
    if (variant === "outlined") {
      containerStyle.borderColor = theme.colors.onSurfaceDisabled; // Or a more specific disabled outline
      containerStyle.borderWidth = 1;
    }
  } else {
    switch (variant) {
      case "filled":
        if (selected === true) {
          // Selected Toggle: Primary container, OnPrimary icon
          backgroundColor = theme.colors.primary;
          iconColor = theme.colors.onPrimary;
        } else if (selected === false) {
          // Unselected Toggle: SurfaceContainerHighest container, Primary icon
          backgroundColor = theme.colors.surfaceVariant; // Approx for SurfaceContainerHighest
          iconColor = theme.colors.primary;
        } else {
          // Default (not a toggle): Primary container, OnPrimary icon
          backgroundColor = theme.colors.primary;
          iconColor = theme.colors.onPrimary;
        }
        break;
      case "tonal":
        if (selected === true) {
          // Selected Toggle: SecondaryContainer container, OnSecondaryContainer icon
          backgroundColor = theme.colors.secondaryContainer;
          iconColor = theme.colors.onSecondaryContainer;
        } else if (selected === false) {
          // Unselected Toggle: SurfaceContainerHighest container, OnSurfaceVariant icon
          backgroundColor = theme.colors.surfaceVariant; // Approx for SurfaceContainerHighest
          iconColor = theme.colors.onSurfaceVariant;
        } else {
          // Default (not a toggle): SecondaryContainer container, OnSecondaryContainer icon
          backgroundColor = theme.colors.secondaryContainer;
          iconColor = theme.colors.onSecondaryContainer;
        }
        break;
      case "outlined":
        if (selected === true) {
          // Selected Toggle: InverseSurface container, InverseOnSurface icon (no border)
          backgroundColor = theme.colors.inverseSurface;
          iconColor = theme.colors.inverseOnSurface;
          containerStyle.borderWidth = 0; // Remove border for selected outlined
        } else if (selected === false) {
          // Unselected Toggle: Transparent container, OutlineVariant border, OnSurfaceVariant icon
          iconColor = theme.colors.onSurfaceVariant;
          containerStyle.borderColor = theme.colors.outlineVariant;
          containerStyle.borderWidth = 1;
          backgroundColor = "transparent";
        } else {
          // Default (not a toggle): Transparent container, OutlineVariant border, OnSurfaceVariant icon
          iconColor = theme.colors.onSurfaceVariant;
          containerStyle.borderColor = theme.colors.outlineVariant;
          containerStyle.borderWidth = 1;
          backgroundColor = "transparent";
        }
        break;
      case "standard":
        if (selected === true) {
          // Selected Toggle: Transparent container, Primary icon
          iconColor = theme.colors.primary;
        } else if (selected === false) {
          // Unselected Toggle: Transparent container, OnSurfaceVariant icon
          iconColor = theme.colors.onSurfaceVariant;
        } else {
          // Default (not a toggle): Transparent container, OnSurfaceVariant icon
          iconColor = theme.colors.onSurfaceVariant;
        }
        backgroundColor = "transparent"; // Standard is always transparent background
        break;
    }
  }
  containerStyle.backgroundColor = backgroundColor;

  // Ripple should be contained within the visual button part
  const rippleBorderless = shape === "round"; // Make ripple round for round shapes

  return (
    <Pressable
      // onPress is now handled by the TouchableRipple to ensure ripple effect
      disabled={disabled} // disabled state is still managed by Pressable for the whole area
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      style={[touchableStyle, style]} // This is the outer touchable area ensuring target size
      testID={testID}
      // Pressable itself doesn't need to handle the press for ripple,
      // but it defines the touchable area.
    >
      {() => (
        <TouchableRipple
          onPress={onPress} // onPress is now on TouchableRipple
          style={containerStyle} // This is the visual button part
          rippleColor={
            variant === "filled" || variant === "tonal"
              ? theme.colors.onPrimary
              : theme.colors.primary
          }
          borderless={rippleBorderless}
          disabled={disabled} // disabled prop for TouchableRipple
        >
          <Icon source={icon} size={iconSize} color={iconColor} />
        </TouchableRipple>
      )}
    </Pressable>
  );
};
