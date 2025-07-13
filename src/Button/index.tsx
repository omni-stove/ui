import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type MouseEvent,
} from "react";
import { useTheme } from "../hooks";
import type { Props, Size, Variant } from "./types";

const getButtonDimensions = (size: Size) => {
  switch (size) {
    case "extra-small":
      return {
        height: 32,
        paddingHorizontal: 12,
        fontSize: 14,
        iconSize: 16,
      };
    case "small":
      return {
        height: 40,
        paddingHorizontal: 16,
        fontSize: 14,
        iconSize: 18,
      };
    case "medium":
      return {
        height: 56,
        paddingHorizontal: 24,
        fontSize: 16,
        iconSize: 20,
      };
    case "large":
      return {
        height: 96,
        paddingHorizontal: 48,
        fontSize: 24,
        iconSize: 28,
      };
    case "extra-large":
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
 * A customizable Button component adhering to Material Design 3 (M3) specifications for Web.
 * It uses native HTML button element with CSS-in-JS styling for optimal accessibility and performance.
 * It supports different visual variants, sizes, and can include an icon and/or a label.
 *
 * @param {Props} props - The component's props.
 * @param {ForwardedRef<HTMLButtonElement>} ref - Ref for the underlying button element.
 * @returns {JSX.Element} The Button component.
 */
export const Button = forwardRef(function Button(
  {
    variant = "filled",
    size = "small",
    type = "button",
    disabled = false,
    onPress,
    children,
    icon,
    testID,
    accessibilityLabel,
    ariaLabel,
  }: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
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

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (onPress && !disabled) {
      onPress();
    }
  };

  const buttonStyle: CSSProperties = {
    height: dimensions.height,
    paddingLeft: dimensions.paddingHorizontal,
    paddingRight: dimensions.paddingHorizontal,
    borderRadius: dimensions.height / 2,
    backgroundColor: colors.backgroundColor,
    color: colors.textColor,
    fontSize: dimensions.fontSize,
    fontWeight: 500,
    lineHeight: `${dimensions.fontSize * 1.2}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: icon && children ? 8 : 0,
    border: variant === "outlined" ? `1px solid ${colors.borderColor}` : "none",
    opacity: disabled ? 0.38 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    userSelect: "none",
    position: "relative",
    overflow: "hidden",
    ...(variant === "elevated" &&
      !disabled && {
        boxShadow: `0 1px 2px ${theme.colors.shadow}33`,
      }),
  };

  const iconStyle: CSSProperties = {
    width: dimensions.iconSize,
    height: dimensions.iconSize,
    fontSize: dimensions.iconSize,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      style={buttonStyle}
      data-testid={testID}
      aria-label={ariaLabel || accessibilityLabel}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = colors.backgroundColor + "E6"; // Add hover effect
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = colors.backgroundColor;
        }
      }}
      onFocus={(e) => {
        if (!disabled) {
          e.currentTarget.style.outline = `2px solid ${theme.colors.primary}66`;
          e.currentTarget.style.outlineOffset = "2px";
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      {icon && (
        <span style={iconStyle} aria-hidden="true">
          {/* Icon placeholder - in a real implementation, you'd use an icon library */}
          {icon}
        </span>
      )}
      {children && <span>{children}</span>}
    </button>
  );
});

Button.displayName = "Button";