import {
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type MouseEvent,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTheme } from "../hooks";
import type { WebButtonProps } from "./types";
import { getButtonDimensions } from "./types";
// Import CSS Modules if available, fallback to empty object
let styles: Record<string, string> = {};
try {
  styles = require("./Button.module.css");
} catch {
  // Fallback: if CSS Modules aren't supported, we'll use inline styles
  styles = {
    button: "",
    extraSmall: "",
    small: "",
    medium: "",
    large: "",
    extraLarge: "",
    filled: "",
    tonal: "",
    outlined: "",
    text: "",
    elevated: "",
    icon: "",
    content: "",
    ripple: "",
    rippleAnimation: "",
  };
}

// Add ripple animation keyframes if not available
const injectRippleKeyframes = () => {
  const styleId = "button-ripple-keyframes";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes rippleEffect {
        0% {
          transform: scale(0);
          opacity: 0.7;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Icon component for web - simplified version
const WebIcon = ({ 
  name, 
  size, 
  color, 
  className 
}: { 
  name: string; 
  size: number; 
  color: string;
  className?: string;
}) => (
  <span 
    className={`${styles.icon} ${className || ""}`}
    style={{ 
      fontSize: size, 
      color,
      width: size,
      height: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    aria-hidden="true"
  >
    {/* This would be replaced with actual icon implementation */}
    ◆
  </span>
);

/**
 * A web Button component using CSS Modules and HTML button element.
 * Adheres to Material Design 3 specifications while providing optimal web accessibility.
 * 
 * @param props - The component's props including web-specific props
 * @param ref - Ref for the underlying button element
 * @returns The Button component
 */
export const Button = forwardRef<HTMLButtonElement, WebButtonProps>(
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
      type = "button",
      ariaLabel,
      ...htmlProps
    },
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const theme = useTheme();
    const dimensions = getButtonDimensions(size);
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

    // Inject ripple keyframes on mount
    useEffect(() => {
      if (typeof document !== "undefined") {
        injectRippleKeyframes();
      }
    }, []);

    const getButtonColors = () => {
      if (disabled) {
        return {
          backgroundColor: theme.colors.surfaceVariant,
          color: theme.colors.outline,
          borderColor: theme.colors.outline,
          hoverBackgroundColor: theme.colors.surfaceVariant,
          focusOutlineColor: theme.colors.outline,
        };
      }

      switch (variant) {
        case "filled":
          return {
            backgroundColor: theme.colors.primary,
            color: theme.colors.onPrimary,
            hoverBackgroundColor: `color-mix(in srgb, ${theme.colors.primary} 92%, ${theme.colors.onPrimary} 8%)`,
            focusOutlineColor: theme.colors.primary,
          };
        case "tonal":
          return {
            backgroundColor: theme.colors.secondaryContainer,
            color: theme.colors.onSecondaryContainer,
            hoverBackgroundColor: `color-mix(in srgb, ${theme.colors.secondaryContainer} 92%, ${theme.colors.onSecondaryContainer} 8%)`,
            focusOutlineColor: theme.colors.secondary,
          };
        case "outlined":
          return {
            backgroundColor: "transparent",
            color: theme.colors.primary,
            borderColor: theme.colors.outline,
            hoverBackgroundColor: `color-mix(in srgb, transparent 92%, ${theme.colors.primary} 8%)`,
            focusOutlineColor: theme.colors.primary,
          };
        case "text":
          return {
            backgroundColor: "transparent",
            color: theme.colors.primary,
            hoverBackgroundColor: `color-mix(in srgb, transparent 92%, ${theme.colors.primary} 8%)`,
            focusOutlineColor: theme.colors.primary,
          };
        case "elevated":
          return {
            backgroundColor: theme.colors.surfaceContainerLow,
            color: theme.colors.primary,
            hoverBackgroundColor: `color-mix(in srgb, ${theme.colors.surfaceContainerLow} 92%, ${theme.colors.primary} 8%)`,
            focusOutlineColor: theme.colors.primary,
          };
        default:
          return {
            backgroundColor: theme.colors.primary,
            color: theme.colors.onPrimary,
            hoverBackgroundColor: `color-mix(in srgb, ${theme.colors.primary} 92%, ${theme.colors.onPrimary} 8%)`,
            focusOutlineColor: theme.colors.primary,
          };
      }
    };

    const colors = getButtonColors();

    // Handle ripple effect
    const createRipple = useCallback((event: MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const newRipple = {
        id: Date.now(),
        x,
        y,
      };
      
      setRipples((prev) => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
      }, 600);
    }, []);

    const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        createRipple(event);
        onPress?.();
      }
    }, [disabled, onPress, createRipple]);

    // Combine CSS classes or use fallback
    const sizeClass = {
      "extra-small": styles.extraSmall,
      "small": styles.small,
      "medium": styles.medium,
      "large": styles.large,
      "extra-large": styles.extraLarge,
    }[size];

    const variantClass = styles[variant];

    const buttonClasses = [
      styles.button,
      sizeClass,
      variantClass,
    ].filter(Boolean).join(" ");

    // Base styles for when CSS Modules aren't available
    const baseStyles: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      border: variant === "outlined" ? `1px solid ${colors.borderColor}` : "none",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit",
      fontWeight: 500,
      textDecoration: "none",
      transition: "all 0.2s ease",
      position: "relative",
      overflow: "hidden",
      height: dimensions.height,
      padding: `0 ${dimensions.paddingHorizontal}px`,
      fontSize: dimensions.fontSize,
      lineHeight: `${dimensions.iconSize}px`,
    };

    // Dynamic styles based on theme
    const buttonStyle = {
      ...baseStyles,
      "--button-bg-color": colors.backgroundColor,
      "--button-text-color": colors.color,
      "--button-border-color": colors.borderColor,
      "--button-hover-bg": colors.hoverBackgroundColor,
      "--button-focus-outline": colors.focusOutlineColor,
      borderRadius: `${dimensions.height / 2}px`,
      backgroundColor: colors.backgroundColor,
      color: colors.color,
      borderColor: variant === "outlined" ? colors.borderColor : "transparent",
      opacity: disabled ? 0.38 : 1,
      ...(variant === "elevated" && !disabled && {
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
      }),
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        style={buttonStyle}
        disabled={disabled}
        onClick={handleClick}
        data-testid={testID}
        aria-label={ariaLabel || accessibilityLabel}
        {...htmlProps}
      >
        <div 
          className={styles.content}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {icon && (
            <WebIcon
              name={icon}
              size={dimensions.iconSize}
              color={colors.color}
            />
          )}
          {children && <span>{children}</span>}
        </div>
        
        {/* Ripple effect container */}
        <div 
          className={styles.ripple}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "inherit",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {ripples.map((ripple) => (
            <div
              key={ripple.id}
              className={styles.rippleAnimation}
              style={{
                position: "absolute",
                left: ripple.x - 10,
                top: ripple.y - 10,
                width: 20,
                height: 20,
                backgroundColor: colors.color,
                borderRadius: "50%",
                opacity: 0.7,
                animation: "rippleEffect 0.6s ease-out",
                pointerEvents: "none",
              }}
            />
          ))}
        </div>
      </button>
    );
  },
);

Button.displayName = "Button";