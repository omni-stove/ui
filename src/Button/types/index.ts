import type { ReactNode } from "react";

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

 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {() => void} [props.onPress] - Function to call when the button is pressed.
 * @param {string} [props.testID] - Test ID for the button.
 * @param {string} [props.accessibilityLabel] - Accessibility label for the button.
 */
type BaseProps = {
  variant?: Variant;
  size?: Size;

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
export type Props = BaseProps &
  (
    | { children: ReactNode; icon?: string }
    | { children?: ReactNode; icon: string }
  );
