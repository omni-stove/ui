import type { ReactNode } from "react";

/**
 * Defines the visual style of the button.
 * - `filled`: A contained button with a background color.
 * - `tonal`: A contained button with a secondary background color.
 * - `outlined`: A button with a transparent background and a border.
 * - `text`: A button with a transparent background and no border.
 * - `elevated`: A contained button with a shadow.
 */
export type Variant = "filled" | "tonal" | "outlined" | "text" | "elevated";

/**
 * Defines the size of the button, affecting its height, padding, and font size.
 * - `extra-small`
 * - `small`
 * - `medium`
 * - `large`
 * - `extra-large`
 */
export type Size = "extra-small" | "small" | "medium" | "large" | "extra-large";

/**
 * Base props for the Button component.
 * @param {Variant} [props.variant="filled"] - The visual style of the button.
 * @param {Size} [props.size="small"] - The size of the button.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {() => void} [props.onPress] - Function to call when the button is pressed.
 * @param {string} [props.testID] - Test ID for the button.
 * @param {string} [props.accessibilityLabel] - Accessibility label for the button.
 */
export type BaseProps = {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
};

/**
 * Web-specific props for the Button component.
 * @param {"button" | "submit" | "reset"} [props.type="button"] - The type attribute for the HTML button element.
 * @param {string} [props.ariaLabel] - Aria label for accessibility.
 */
export type WebProps = {
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
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

/**
 * Props for the Web Button component, including web-specific props.
 */
export type WebButtonProps = Props & WebProps;

/**
 * Utility function to get button dimensions based on size.
 */
export const getButtonDimensions = (size: Size) => {
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