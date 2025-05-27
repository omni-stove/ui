import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Button,
  Modal,
  Portal,
  RadioButton,
  Text,
  useTheme,
} from "react-native-paper";
import { Grid, GridItem } from "../Grid";
import { TextField } from "../TextField";

/**
 * Props for the MonthYearPicker component.
 * @param {Date} [props.value] - The currently selected date (year and month). This makes the component controlled.
 * @param {Date} [props.defaultValue] - The default selected date for uncontrolled usage.
 * @param {(value: Date | undefined) => void} [props.onChange] - Callback function invoked when the year/month selection is confirmed.
 * @param {string} [props.label] - Label for the TextField that displays the selected year/month.
 * @param {string} [props.supportingText] - Supporting text displayed below the TextField.
 * @param {"outlined" | "filled"} [props.textFieldVariant="filled"] - Variant of the TextField.
 * @param {boolean} [props.isDisabled=false] - Whether the MonthYearPicker is disabled.
 * @param {string} [props.errorMessage] - Error message displayed below the TextField.
 * @param {boolean} [props.required=false] - Whether the field is required. Adds an asterisk to the label.
 * @param {number} [props.yearRange=30] - Number of years to show before current year.
 * @param {string} [props.locale="ja"] - Locale for formatting the display.
 * @param {string} [props.saveLabel] - Custom label for the save button.
 * @param {string} [props.cancelLabel] - Custom label for the cancel button.
 */
type Props = {
  /**
   * The currently selected date (year and month).
   */
  value?: Date;
  /**
   * The default selected date (year and month).
   */
  defaultValue?: Date;
  /**
   * Callback function called when the year/month is changed.
   */
  onChange?: (value: Date | undefined) => void;
  /**
   * Label for the text field.
   */
  label?: string;
  /**
   * Supporting text displayed below the text field.
   */
  supportingText?: string;
  /**
   * Variant of the text field.
   * @default 'filled'
   */
  textFieldVariant?: "outlined" | "filled";
  /**
   * Whether the picker is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Error message displayed below the text field.
   */
  errorMessage?: string;
  /**
   * Whether the field is required. Adds an asterisk to the label.
   * @default false
   */
  required?: boolean;
  /**
   * Number of years to show before current year.
   * @default 30
   */
  yearRange?: number;
  /**
   * Locale for formatting the display.
   * @default 'ja'
   */
  locale?: string;
  /**
   * The label for the save button.
   * @default 'OK'
   */
  saveLabel?: string;
  /**
   * The label for the cancel button.
   * @default 'キャンセル'
   */
  cancelLabel?: string;
};

/**
 * A MonthYearPicker component that allows users to select a year and month.
 * It uses a TextField to display the selected year/month and opens a custom modal for selection.
 *
 * @param {Props} props - The component's props.
 * @returns {JSX.Element} The MonthYearPicker component.
 */
export const MonthYearPicker = ({
  value: controlledValue,
  defaultValue,
  onChange,
  label,
  supportingText,
  textFieldVariant = "filled",
  isDisabled = false,
  errorMessage,
  required = false,
  yearRange = 30,
  locale = "ja",
  saveLabel = "OK",
  cancelLabel = "キャンセル",
}: Props) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<Date | undefined>(
    defaultValue,
  );
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>();

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const currentValue =
    controlledValue !== undefined ? controlledValue : internalValue;

  // Initialize selected year and month when modal opens
  useEffect(() => {
    if (open) {
      if (currentValue) {
        setSelectedYear(currentValue.getFullYear());
        setSelectedMonth(currentValue.getMonth() + 1); // Convert to 1-based month
      } else {
        const now = new Date();
        setSelectedYear(now.getFullYear());
        setSelectedMonth(now.getMonth() + 1);
      }
    }
  }, [open, currentValue]);

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedYear && selectedMonth) {
      const newValue = new Date(selectedYear, selectedMonth - 1, 1); // Convert to 0-based month
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }
    setOpen(false);
  }, [selectedYear, selectedMonth, controlledValue, onChange]);

  const getFormattedDate = () => {
    if (!currentValue) return "";

    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
      };
      return currentValue.toLocaleDateString(locale, options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  };

  const textFieldLabel = required ? `${label}*` : label;

  // Generate years array
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: yearRange + 1 },
    (_, i) => currentYear - i,
  );

  // Generate months array
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const styles = StyleSheet.create({
    modal: {
      backgroundColor: theme.colors.surface,
      margin: 20,
      borderRadius: 8,
      padding: 20,
      maxHeight: "70%",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    content: {
      flexDirection: "row",
      flex: 1,
    },
    column: {
      flex: 1,
      marginHorizontal: 8,
    },
    columnTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 12,
      textAlign: "center",
    },
    yearList: {
      maxHeight: 200,
    },
    monthList: {
      maxHeight: 200,
    },
    monthGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    monthButton: {
      width: "30%",
      marginBottom: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    monthButtonSelected: {
      backgroundColor: theme.colors.primaryContainer,
      borderColor: theme.colors.primary,
    },
    monthButtonText: {
      textAlign: "center",
      paddingVertical: 12,
    },
    monthButtonTextSelected: {
      color: theme.colors.onPrimaryContainer,
      fontWeight: "bold",
    },
    actions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 20,
      gap: 8,
    },
  });

  return (
    <View>
      <TouchableOpacity
        onPress={() => !isDisabled && setOpen(true)}
        activeOpacity={isDisabled ? 1 : 0.7}
        disabled={isDisabled}
      >
        <View pointerEvents="none">
          <TextField
            startAdornment={{ type: "icon", value: "calendar" }}
            label={textFieldLabel}
            value={getFormattedDate()}
            variant={textFieldVariant}
            readOnly
            disabled={isDisabled}
            errorMessage={errorMessage}
            supportingText={supportingText}
          />
        </View>
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={open}
          onDismiss={onDismiss}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.title}>年月を選択</Text>

          <Grid spacing="comfortable" style={{ flex: 1 }}>
            {/* Year Column */}
            <GridItem span={6}>
              <Text style={styles.columnTitle}>年</Text>
              <ScrollView
                style={styles.yearList}
                showsVerticalScrollIndicator={false}
              >
                <RadioButton.Group
                  onValueChange={(value) => setSelectedYear(Number(value))}
                  value={selectedYear?.toString() || ""}
                >
                  {years.map((year) => (
                    <RadioButton.Item
                      key={year}
                      label={`${year}年`}
                      value={year.toString()}
                    />
                  ))}
                </RadioButton.Group>
              </ScrollView>
            </GridItem>

            {/* Month Column */}
            <GridItem span={6}>
              <Text style={styles.columnTitle}>月</Text>
              <ScrollView
                style={styles.monthList}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.monthGrid}>
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.monthButton,
                        selectedMonth === month && styles.monthButtonSelected,
                      ]}
                      onPress={() => setSelectedMonth(month)}
                    >
                      <Text
                        style={[
                          styles.monthButtonText,
                          selectedMonth === month &&
                            styles.monthButtonTextSelected,
                        ]}
                      >
                        {month}月
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </GridItem>
          </Grid>

          <View style={styles.actions}>
            <Button mode="text" onPress={onDismiss}>
              {cancelLabel}
            </Button>
            <Button
              mode="contained"
              onPress={handleConfirm}
              disabled={!selectedYear || !selectedMonth}
            >
              {saveLabel}
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};
