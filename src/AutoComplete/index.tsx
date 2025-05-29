import {
  type ComponentProps,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  ScrollView,
  type TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Portal } from "react-native-paper";
import { BottomSheet, type BottomSheetRef } from "../BottomSheet";
import { Chip } from "../Chip";
import { Menu } from "../Menu";
import { Modal } from "../Modal";
import { TextField } from "../TextField";
import { TouchableRipple } from "../TouchableRipple";
import { Typography } from "../Typography";

/**
 * Represents a single option in the AutoComplete component.
 * @param {string} label - The text to display for the option.
 * @param {string} value - The actual value of the option.
 */
type AutoCompleteOption = {
  label: string;
  value: string;
};

/**
 * Defines the rendering mode for the AutoComplete component.
 * - `dropdown`: Shows options in a dropdown menu (suitable for web/desktop).
 * - `bottomSheet`: Shows options in a bottom sheet (suitable for mobile).
 * - `modal`: Shows options in a modal dialog.
 * - `auto`: Automatically chooses between dropdown and bottomSheet based on screen size.
 */
type RenderMode = "dropdown" | "bottomSheet" | "modal" | "auto";

/**
 * Props for the AutoComplete component.
 * @param {AutoCompleteOption[]} props.options - An array of options to display in the autocomplete.
 * @param {string[]} props.value - The currently selected values (array for multiple selection).
 * @param {(values: string[]) => void} props.onChange - Callback function invoked when selection changes.
 * @param {(input: string) => void} [props.onInputChange] - Callback function invoked when input text changes.
 * @param {RenderMode} [props.renderMode="auto"] - The rendering mode for the options display.
 * @param {string} [props.placeholder] - Placeholder text for the input field.
 * @param {string} [props.label] - Label for the TextField.
 * @param {ComponentProps<typeof TextField>["variant"]} [props.variant="filled"] - The variant of the TextField.
 * @param {(options: AutoCompleteOption[], input: string) => AutoCompleteOption[]} [props.filterFunction] - Custom filter function for options.
 * @param {number} [props.maxSelections] - Maximum number of selections allowed.
 * @param {boolean} [props.disabled=false] - Whether the AutoComplete is disabled.
 * @param {string} [props.errorMessage] - Error message to display below the TextField.
 * @param {string} [props.supportingText] - Supporting text to display below the TextField.
 * @param {string} [props.searchPlaceholder] - Placeholder text for the search field in bottom sheet/modal.
 */
type Props = {
  options: AutoCompleteOption[];
  value: string[];
  onChange: (values: string[]) => void;
  onInputChange?: (input: string) => void;
  renderMode?: RenderMode;
  placeholder?: string;
  label?: string;
  variant?: ComponentProps<typeof TextField>["variant"];
  filterFunction?: (
    options: AutoCompleteOption[],
    input: string,
  ) => AutoCompleteOption[];
  maxSelections?: number;
  disabled?: boolean;
  errorMessage?: string;
  supportingText?: string;
  searchPlaceholder?: string;
};

const Options = ({
  filteredOptions,
  handleSelectOption,
}: {
  filteredOptions: AutoCompleteOption[];
  handleSelectOption: (optionValue: string) => void;
}) => {
  return (
    <ScrollView style={{ maxHeight: 200 }}>
      {filteredOptions.map((option) => (
        <TouchableRipple
          key={option.value}
          onPress={() => handleSelectOption(option.value)}
          style={{ paddingVertical: 12, paddingHorizontal: 16 }}
        >
          <Typography variant="bodyLarge">{option.label}</Typography>
        </TouchableRipple>
      ))}
      {filteredOptions.length === 0 && (
        <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
          <Typography variant="bodyMedium" style={{ opacity: 0.6 }}>
            該当する項目がありません
          </Typography>
        </View>
      )}
    </ScrollView>
  );
};

const SelectedChips = ({
  selectedOptions,
  onRemove,
  disabled = false,
}: {
  selectedOptions: AutoCompleteOption[];
  onRemove: (optionValue: string) => void;
  disabled?: boolean;
}) => {
  if (selectedOptions.length === 0) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 12,
        bottom: 0,
        left: 16,
        right: 48,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 4,
        zIndex: 1,
        pointerEvents: "none",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {selectedOptions.map((option) => (
        <View key={option.value} style={{ pointerEvents: "auto" }}>
          <Chip
            variant="input"
            trailingIcon="close"
            onTrailingIconPress={() => onRemove(option.value)}
            isDisabled={disabled}
          >
            {option.label}
          </Chip>
        </View>
      ))}
    </View>
  );
};

/**
 * An AutoComplete component that allows users to search and select multiple options.
 * It supports different rendering modes (dropdown, bottom sheet, modal) and automatically
 * adapts to screen size when using "auto" mode.
 *
 * @param {Props} props - The component's props.
 * @param {AutoCompleteOption[]} props.options - An array of options to display.
 * @param {string[]} props.value - The currently selected values.
 * @param {(values: string[]) => void} props.onChange - Callback when selection changes.
 * @param {(input: string) => void} [props.onInputChange] - Callback when input changes.
 * @param {RenderMode} [props.renderMode="auto"] - The rendering mode.
 * @param {string} [props.placeholder] - Placeholder for the input field.
 * @param {string} [props.label] - Label for the TextField.
 * @param {ComponentProps<typeof TextField>["variant"]} [props.variant="filled"] - TextField variant.
 * @param {(options: AutoCompleteOption[], input: string) => AutoCompleteOption[]} [props.filterFunction] - Custom filter function.
 * @param {number} [props.maxSelections] - Maximum selections allowed.
 * @param {boolean} [props.disabled=false] - Whether disabled.
 * @param {string} [props.errorMessage] - Error message.
 * @param {string} [props.supportingText] - Supporting text.
 * @param {string} [props.searchPlaceholder] - Search placeholder for bottom sheet/modal.
 * @param {ForwardedRef<TextInput>} ref - Ref to be forwarded to the underlying TextField component.
 * @returns {JSX.Element} The AutoComplete component.
 * @see {@link TextField}
 * @see {@link BottomSheet}
 * @see {@link Modal}
 * @see {@link Menu}
 * @see {@link Chip}
 */
export const AutoComplete = forwardRef<TextInput, Props>(
  (
    {
      options,
      value,
      onChange,
      onInputChange,
      renderMode = "auto",
      placeholder,
      label,
      variant = "filled",
      filterFunction,
      maxSelections,
      disabled = false,
      errorMessage,
      supportingText,
      searchPlaceholder = "検索...",
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [menuWidth, setMenuWidth] = useState(0);
    const anchorRef = useRef<View>(null);
    const bottomSheetRef = useRef<BottomSheetRef>(null);

    // Determine actual render mode based on screen size
    const screenWidth = Dimensions.get("window").width;
    const actualRenderMode = useMemo(() => {
      if (renderMode === "auto") {
        return screenWidth < 768 ? "bottomSheet" : "dropdown";
      }
      return renderMode;
    }, [renderMode, screenWidth]);

    // Default filter function
    const defaultFilterFunction = useCallback(
      (opts: AutoCompleteOption[], input: string) => {
        if (!input.trim()) return opts;
        return opts.filter((option) =>
          option.label.toLowerCase().includes(input.toLowerCase()),
        );
      },
      [],
    );

    // Filter options based on input and exclude already selected items
    const filteredOptions = useMemo(() => {
      const filterFn = filterFunction || defaultFilterFunction;
      const filtered = filterFn(options, inputValue);
      return filtered.filter((option) => !value.includes(option.value));
    }, [options, inputValue, value, filterFunction, defaultFilterFunction]);

    // Get selected options for display
    const selectedOptions = useMemo(() => {
      return options.filter((option) => value.includes(option.value));
    }, [options, value]);

    // Handle input change
    const handleInputChange = useCallback(
      (text: string) => {
        setInputValue(text);
        onInputChange?.(text);
      },
      [onInputChange],
    );

    // Handle option selection
    const handleSelectOption = useCallback(
      (optionValue: string) => {
        if (maxSelections && value.length >= maxSelections) {
          return;
        }
        const newValue = [...value, optionValue];
        onChange(newValue);
        setInputValue("");

        if (actualRenderMode === "dropdown") {
          setIsOpen(false);
        }
      },
      [value, onChange, maxSelections, actualRenderMode],
    );

    // Handle option removal
    const handleRemoveOption = useCallback(
      (optionValue: string) => {
        const newValue = value.filter((v) => v !== optionValue);
        onChange(newValue);
      },
      [value, onChange],
    );

    // Open picker
    const openPicker = useCallback(() => {
      if (disabled) return;

      // Don't open picker if maxSelections is reached
      if (maxSelections && value.length >= maxSelections) return;

      if (actualRenderMode === "bottomSheet") {
        bottomSheetRef.current?.open();
      } else {
        setIsOpen(true);
      }
    }, [disabled, actualRenderMode, maxSelections, value.length]);

    // Close picker
    const closePicker = useCallback(() => {
      if (actualRenderMode === "bottomSheet") {
        bottomSheetRef.current?.close();
      } else {
        setIsOpen(false);
      }
      setInputValue("");
    }, [actualRenderMode]);

    // Handle BottomSheet state changes
    const handleBottomSheetChange = useCallback((index: number) => {
      if (index === -1) {
        // BottomSheetが閉じられた時
        setInputValue("");
      }
    }, []);

    // Measure anchor for dropdown positioning
    useEffect(() => {
      if (anchorRef.current && actualRenderMode === "dropdown") {
        anchorRef.current.measure((_x, _y, width) => {
          setMenuWidth(width);
        });
      }
    }, [actualRenderMode]);

    // Render option list
    const renderOptionList = () => (
      <ScrollView style={{ maxHeight: 200 }}>
        {filteredOptions.map((option) => (
          <TouchableRipple
            key={option.value}
            onPress={() => handleSelectOption(option.value)}
            style={{ paddingVertical: 12, paddingHorizontal: 16 }}
          >
            <Typography variant="bodyLarge">{option.label}</Typography>
          </TouchableRipple>
        ))}
        {filteredOptions.length === 0 && (
          <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
            <Typography variant="bodyMedium" style={{ opacity: 0.6 }}>
              該当する項目がありません
            </Typography>
          </View>
        )}
      </ScrollView>
    );

    // Common trigger field component
    const TriggerField = () => (
      <View style={{ position: "relative" }}>
        <TouchableOpacity onPress={openPicker} disabled={disabled}>
          <View pointerEvents="none">
            <TextField
              ref={ref}
              label={selectedOptions.length > 0 ? "" : label}
              variant={variant}
              readOnly
              disabled={disabled}
              errorMessage={errorMessage}
              supportingText={
                supportingText ||
                (selectedOptions.length === 0 ? placeholder : undefined)
              }
              endAdornment={{ type: "icon", value: "chevron-down" }}
            />
          </View>
        </TouchableOpacity>

        {/* Selected chips overlaying the TextField */}
        <SelectedChips
          selectedOptions={selectedOptions}
          onRemove={handleRemoveOption}
          disabled={disabled}
        />
      </View>
    );

    return (
      <View style={{ position: "relative" }}>
        {/* Common trigger field for all modes */}
        {actualRenderMode === "dropdown" ? (
          <Menu
            visible={isOpen}
            onDismiss={closePicker}
            contentStyle={{ width: menuWidth, maxHeight: 300 }}
            anchor={
              <View ref={anchorRef} style={{ width: "100%" }}>
                <TriggerField />
              </View>
            }
          >
            <View style={{ padding: 8 }}>
              <TextField
                value={inputValue}
                onChangeText={handleInputChange}
                supportingText={inputValue ? undefined : searchPlaceholder}
                variant="outlined"
              />
            </View>
            <Options
              filteredOptions={filteredOptions}
              handleSelectOption={handleSelectOption}
            />
          </Menu>
        ) : (
          <TriggerField />
        )}
        {actualRenderMode === "bottomSheet" && (
          <Portal>
            <BottomSheet
              ref={bottomSheetRef}
              title="項目を選択"
              onChange={handleBottomSheetChange}
              content={
                <View style={{ flex: 1 }}>
                  <TextField
                    value={inputValue}
                    onChangeText={handleInputChange}
                    supportingText={inputValue ? undefined : searchPlaceholder}
                    variant="outlined"
                    style={{ marginBottom: 16 }}
                  />

                  {selectedOptions.length > 0 && (
                    <View style={{ marginBottom: 16 }}>
                      <Typography
                        variant="labelMedium"
                        style={{ marginBottom: 8 }}
                      >
                        選択済み
                      </Typography>
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        {selectedOptions.map((option) => (
                          <Chip
                            key={option.value}
                            variant="input"
                            trailingIcon="close"
                            onTrailingIconPress={() =>
                              handleRemoveOption(option.value)
                            }
                            isDisabled={disabled}
                          >
                            {option.label}
                          </Chip>
                        ))}
                      </View>
                    </View>
                  )}

                  <Typography variant="labelMedium" style={{ marginBottom: 8 }}>
                    候補
                  </Typography>
                  {renderOptionList()}
                </View>
              }
            />
          </Portal>
        )}
        {actualRenderMode === "modal" && (
          <Portal>
            <Modal visible={isOpen} onDismiss={closePicker}>
              <View style={{ maxHeight: 400 }}>
                <TextField
                  value={inputValue}
                  onChangeText={handleInputChange}
                  supportingText={inputValue ? undefined : searchPlaceholder}
                  variant="outlined"
                  style={{ marginBottom: 16 }}
                />

                {selectedOptions.length > 0 && (
                  <View style={{ marginBottom: 16 }}>
                    <Typography
                      variant="labelMedium"
                      style={{ marginBottom: 8 }}
                    >
                      選択済み
                    </Typography>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {selectedOptions.map((option) => (
                        <Chip
                          key={option.value}
                          variant="input"
                          trailingIcon="close"
                          onTrailingIconPress={() =>
                            handleRemoveOption(option.value)
                          }
                          isDisabled={disabled}
                        >
                          {option.label}
                        </Chip>
                      ))}
                    </View>
                  </View>
                )}

                <Typography variant="labelMedium" style={{ marginBottom: 8 }}>
                  候補
                </Typography>
                <Options
                  filteredOptions={filteredOptions}
                  handleSelectOption={handleSelectOption}
                />
              </View>
            </Modal>
          </Portal>
        )}
      </View>
    );
  },
);

AutoComplete.displayName = "AutoComplete";
