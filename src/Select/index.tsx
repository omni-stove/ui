import {
  type CSSProperties,
  type ChangeEvent,
  type ComponentProps,
  type ForwardedRef,
  forwardRef,
} from "react";
import type { TextField } from "../TextField";
import { useTheme } from "../hooks";

/**
 * Represents a single option in the Select component.
 * @param {string} label - The text to display for the option.
 * @param {string} value - The actual value of the option.
 */
type Option = {
  label: string;
  value: string;
};

/**
 * Props for the Select component.
 * @template T - The type of the value, which can be a string or a number.
 * @param {Option[]} props.options - An array of options to display in the select menu.
 * @param {(value: T) => void} props.onChange - Callback function invoked when an option is selected.
 * @param {T} props.value - The currently selected value.
 * @param {ComponentProps<typeof TextField>["variant"]} [props.variant="filled"] - The variant of the TextField used to display the selected value.
 * @param {string} [props.label] - Label for the TextField.
 * @param {string} [props.errorMessage] - Error message to display below the TextField.
 * @param {string} [props.supportingText] - Supporting text to display below the TextField.
 * @param {boolean} [props.required] - Indicates whether the field is required.
 * @param {boolean} [props.disabled] - Whether the select is disabled.
 * @param {boolean} [props.readOnly] - Whether the select is read-only.
 */
type Props<T extends string | number> = {
  options: Option[];
  onChange: (value: T) => void;
  value: T;
  variant?: ComponentProps<typeof TextField>["variant"];
  label?: string;
  errorMessage?: string;
  supportingText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
};

/**
 * A Select component that uses native HTML select element for web.
 * It provides Material Design 3 styling while maintaining native accessibility.
 *
 * @template T - The type of the value, which can be a string or a number.
 * @param {Props<T>} props - The component's props.
 * @param {Option[]} props.options - An array of options to display in the select menu.
 * @param {(value: T) => void} props.onChange - Callback function invoked when an option is selected.
 * @param {T} props.value - The currently selected value.
 * @param {ComponentProps<typeof TextField>["variant"]} [props.variant="filled"] - The variant of the TextField used to display the selected value.
 * @param {string} [props.label] - Label for the TextField.
 * @param {string} [props.errorMessage] - Error message to display below the TextField.
 * @param {string} [props.supportingText] - Supporting text to display below the TextField.
 * @param {boolean} [props.required] - Indicates whether the field is required.
 * @param {boolean} [props.disabled] - Whether the select is disabled.
 * @param {boolean} [props.readOnly] - Whether the select is read-only.
 * @param {ForwardedRef<HTMLSelectElement>} ref - Ref to be forwarded to the underlying select element.
 * @returns {JSX.Element} The Select component.
 */
export const Select = forwardRef(function Select<T extends string | number>(
  props: Props<T>,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  const {
    options,
    onChange,
    value,
    variant = "filled",
    label,
    errorMessage,
    supportingText,
    required,
    disabled,
    readOnly,
  } = props;

  const theme = useTheme();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as T;
    onChange(newValue);
  };

  const containerStyle: CSSProperties = {
    position: "relative",
    display: "inline-block",
    width: "100%",
  };

  const labelStyle: CSSProperties = {
    position: "absolute",
    left: variant === "outlined" ? "12px" : "16px",
    top: "16px",
    fontSize: "16px",
    color: errorMessage ? theme.colors.error : theme.colors.onSurfaceVariant,
    backgroundColor:
      variant === "outlined" ? theme.colors.surface : "transparent",
    padding: variant === "outlined" ? "0 4px" : "0",
    transition: "all 0.2s ease",
    pointerEvents: "none",
    zIndex: 1,
    transformOrigin: "left top",
    transform: value
      ? "translateY(-12px) scale(0.75)"
      : "translateY(0) scale(1)",
  };

  const selectStyle: CSSProperties = {
    width: "100%",
    padding: label ? "28px 48px 8px 16px" : "16px 48px 16px 16px",
    fontSize: "16px",
    lineHeight: "24px",
    color: disabled ? `${theme.colors.onSurface}38` : theme.colors.onSurface,
    backgroundColor:
      variant === "filled"
        ? theme.colors.surfaceContainerHighest
        : "transparent",
    border:
      variant === "outlined" ? `1px solid ${theme.colors.outline}` : "none",
    borderRadius: variant === "outlined" ? "4px" : "4px 4px 0 0",
    borderBottom:
      variant === "filled" ? `1px solid ${theme.colors.outline}` : undefined,
    outline: "none",
    appearance: "none",
    cursor: disabled || readOnly ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
  };

  const arrowStyle: CSSProperties = {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "0",
    height: "0",
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderTop: `5px solid ${theme.colors.onSurfaceVariant}`,
    pointerEvents: "none",
  };

  const helperTextStyle: CSSProperties = {
    marginTop: "4px",
    paddingLeft: "16px",
    paddingRight: "16px",
    fontSize: "12px",
    lineHeight: "16px",
    color: errorMessage ? theme.colors.error : theme.colors.onSurfaceVariant,
  };

  return (
    <div>
      <div style={containerStyle}>
        {label && (
          <label style={labelStyle}>
            {label}
            {required && " *"}
          </label>
        )}
        <select
          ref={ref}
          value={value}
          onChange={handleChange}
          disabled={disabled || readOnly}
          required={required}
          style={selectStyle}
          onFocus={(e) => {
            if (variant === "outlined") {
              e.currentTarget.style.borderColor = theme.colors.primary;
            } else {
              e.currentTarget.style.borderBottomColor = theme.colors.primary;
              e.currentTarget.style.borderBottomWidth = "2px";
            }
          }}
          onBlur={(e) => {
            if (variant === "outlined") {
              e.currentTarget.style.borderColor = theme.colors.outline;
            } else {
              e.currentTarget.style.borderBottomColor = theme.colors.outline;
              e.currentTarget.style.borderBottomWidth = "1px";
            }
          }}
        >
          {!value && (
            <option value="" disabled hidden>
              Select an option
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div style={arrowStyle} />
      </div>
      {(errorMessage || supportingText) && (
        <div style={helperTextStyle}>{errorMessage || supportingText}</div>
      )}
    </div>
  );
});
