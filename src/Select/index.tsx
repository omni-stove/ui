import {
  type ComponentProps,
  type ForwardedRef,
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Pressable, type TextInput, View } from "react-native";
import { Menu } from "../Menu";
import { TextField } from "../TextField";
import { Typography } from "../Typography";

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
 */
type Props<T extends string | number> = {
  options: Option[];
  onChange: (value: T) => void;
  value: T;
  variant?: ComponentProps<typeof TextField>["variant"];
  label?: string;
  errorMessage?: string;
  supportingText?: string;
};

/**
 * A Select component that mimics a dropdown/select input.
 * It uses a `TextField` to display the currently selected option's label
 * and a `Menu` component to show the list of available options when pressed.
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
 * @param {ForwardedRef<TextInput>} ref - Ref to be forwarded to the underlying TextField component.
 * @returns {JSX.Element} The Select component.
 * @see {@link TextField}
 * @see {@link Menu}
 */
export const Select = forwardRef(function Select<T extends string | number>(
  props: Props<T>,
  ref: ForwardedRef<TextInput>,
) {
  const {
    options,
    onChange,
    value,
    variant = "filled",
    label,
    errorMessage,
    supportingText,
  } = props;
  const [visible, setVisible] = useState(false);
  const [menuWidth, setMenuWidth] = useState(0);
  const anchorRef = useRef<View>(null);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (selectedValue: T) => {
    onChange(selectedValue);
    closeMenu();
  };

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? "";

  useLayoutEffect(() => {
    if (anchorRef.current) {
      anchorRef.current.measure((_x, _y, width) => {
        setMenuWidth(width);
      });
    }
  }, []);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      contentStyle={{ width: menuWidth }}
      anchor={
        <Pressable onPress={openMenu} ref={anchorRef} style={{ width: "100%" }}>
          <View pointerEvents="none" style={{ width: "100%" }}>
            <TextField
              ref={ref}
              label={label}
              variant={variant}
              value={selectedLabel}
              readOnly
              errorMessage={errorMessage}
              supportingText={supportingText}
            />
          </View>
        </Pressable>
      }
    >
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => handleSelect(option.value as T)}
          style={{ width: "100%", paddingVertical: 12, paddingHorizontal: 16 }}
        >
          <Typography variant="bodyLarge">{option.label}</Typography>
        </Pressable>
      ))}
    </Menu>
  );
});
