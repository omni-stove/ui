"use client";
import { forwardRef } from "react";
import { Text } from "react-aria-components";
import styles from "./index.module.css";
import type { Props } from "./types";

/**
 * Typography component applies Material Design 3 typographic styles and colors.
 * It can render as a `<span>` or a `react-aria-components/Text` component if a `slot` is provided.
 */
export const Typography = forwardRef<HTMLSpanElement, Props>(
  ({ children, variant = "bodyMedium", color = "onSurface", slot }, ref) => {
    const toKebabCase = (str: string) => {
      return str.replace(/([A-Z])/g, "-$1").toLowerCase();
    };

    const className = styles[variant];
    const style = { color: `var(--md-sys-color-${toKebabCase(color)})` };

    if (slot) {
      return (
        <Text ref={ref} className={className} style={style} slot={slot}>
          {children}
        </Text>
      );
    }

    return (
      <span ref={ref} className={className} style={style}>
        {children}
      </span>
    );
  },
);

Typography.displayName = "Typography";
