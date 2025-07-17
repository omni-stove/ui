import { forwardRef } from "react";
import type { TextInput as RNTextInput } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import type { Props } from "./types";

/**
 * A customizable TextField component based on `react-native-paper`'s `TextInput`.
 * It supports features like error messages, supporting text, character counter,
 * start/end adornments (icons or text), and different visual variants.
 *
 * @param {Props} props - The component's props.
 * @param {React.Ref<RNTextInput>} ref - Ref to be forwarded to the underlying `react-native-paper` TextInput component.
 * @returns {JSX.Element} The TextField component.
 * @see {@link https://callstack.github.io/react-native-paper/docs/components/TextInput/|React Native Paper TextInput}
 * @see {@link HelperText}
 */
export const TextField = forwardRef<RNTextInput, Props>(
  (
    {
      label,
      errorMessage,
      multiline = false,
      maxLines,
      variant = "filled",
      startAdornment,
      endAdornment,
      required = false,
      onChangeText,
      supportingText,
      value,
      disabled,
      readOnly,
      secureTextEntry,
      keyboardType,
      autoCapitalize,
      autoCorrect,
      returnKeyType,
      maxLength,
      onSubmitEditing,
      onFocus,
      onBlur,
      onPress,
    },
    ref,
  ) => {
    const hasError = !!errorMessage;
    const showHelperText =
      hasError || !!supportingText || (!!maxLength && value !== undefined);

    const paperVariant = variant === "filled" ? "flat" : variant;

    const textFieldLabel = required && label ? `${label}*` : label;

    // multiline時の高さ調整
    const getContentStyle = () => {
      if (multiline) {
        return {
          minHeight: 120,
          textAlignVertical: "top" as const,
        };
      }
      return undefined;
    };

    // variantに関係なく高さを統一
    const getOuterStyle = () => {
      return {
        minHeight: multiline ? undefined : 56, // single lineの最小高さを統一
      };
    };

    return (
      <>
        <TextInput
          ref={ref}
          label={textFieldLabel}
          mode={paperVariant}
          multiline={multiline}
          numberOfLines={multiline ? maxLines : undefined}
          contentStyle={getContentStyle()}
          style={getOuterStyle()}
          left={
            startAdornment &&
            (startAdornment.type === "icon" ? (
              <TextInput.Icon icon={startAdornment.value} />
            ) : (
              <TextInput.Affix text={startAdornment.value} />
            ))
          }
          right={
            endAdornment &&
            (endAdornment.type === "icon" ? (
              <TextInput.Icon icon={endAdornment.value} />
            ) : (
              <TextInput.Affix text={endAdornment.value} />
            ))
          }
          error={hasError}
          onChangeText={onChangeText}
          value={value}
          disabled={disabled}
          editable={readOnly === undefined ? undefined : !readOnly}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={onFocus}
          onBlur={onBlur}
          onPress={onPress}
        />
        {showHelperText && (
          <HelperText
            type={hasError ? "error" : "info"}
            visible={showHelperText}
            style={
              maxLength && value !== undefined && !hasError
                ? { textAlign: "right" }
                : undefined
            }
          >
            {hasError
              ? errorMessage
              : maxLength && value !== undefined
                ? `${value.length} / ${maxLength}`
                : supportingText}
          </HelperText>
        )}
      </>
    );
  },
);
