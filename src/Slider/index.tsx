import RNSlider from "@react-native-community/slider";
import { forwardRef, useCallback, useEffect, useState } from "react";
import {
  Animated,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../hooks";

/**
 * Defines the interaction mode of the slider.
 * - `continuous`: The value changes continuously as the user drags the thumb.
 * - `centered`: (Not yet implemented) The slider might have a centered origin or different interaction.
 */
type Mode = "continuous" | "centered";

/**
 * Defines the visual variant of the slider.
 * - `number`: A standard slider for selecting a single numeric value.
 * - `range`: (Not yet fully implemented for value handling) Intended for selecting a range of values. Currently behaves like 'number'.
 */
type Variant = "number" | "range";

/**
 * Props for the Slider component.
 */
type Props = {
  /** Optional label for the slider. */
  label?: string;
  /** The current value of the slider. Can be a single number or an array for range sliders. */
  value: number | number[];
  /** Callback function invoked when the slider value changes. */
  onChange: (value: number | number[]) => void;
  /** The minimum value of the slider. @default 0 */
  minValue?: number;
  /** The maximum value of the slider. @default 100 */
  maxValue?: number;
  /** The step increment of the slider. */
  step?: number;
  /** The interaction mode of the slider. @default "continuous" */
  mode?: Mode;
  /** The visual variant of the slider. */
  variant?: Variant;
  /** Whether the slider is disabled. */
  isDisabled?: boolean;
  /** The orientation of the slider. @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Custom style for the container */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing purposes */
  testID?: string;
};

/**
 * Custom thumb (the draggable part) for the Slider.
 * Its height changes when the user starts sliding.
 * @param {object} props - The component's props.
 * @param {boolean} props.isDisabled - Whether the slider is disabled.
 * @param {boolean} props.isSliding - Whether the user is currently dragging the thumb.
 * @returns {JSX.Element} The CustomThumb component.
 */
const CustomThumb = ({
  isDisabled,
  isSliding,
}: { isDisabled: boolean; isSliding: boolean }) => {
  const theme = useTheme();

  return (
    <View
      style={{
        width: 4,
        height: isSliding ? 40 : 30, // Change height during sliding - default 30px
        borderRadius: 2,
        backgroundColor: isDisabled
          ? theme.colors.onSurface
          : theme.colors.primary,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
      }}
    />
  );
};

/**
 * Component to display the current value of the slider above the thumb.
 * It appears when the user starts sliding and fades out when sliding stops.
 * @param {object} props - The component's props.
 * @param {number} props.value - The current value to display.
 * @param {boolean} props.visible - Whether the indicator should be visible.
 * @returns {JSX.Element} The ValueIndicator component.
 */
const ValueIndicator = ({
  value,
  visible,
}: {
  value: number;
  visible: boolean;
}) => {
  const theme = useTheme();
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  return (
    <Animated.View
      style={{
        backgroundColor: theme.colors.inverseSurface,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        opacity,
        marginBottom: 4,
      }}
    >
      <Text
        variant="bodySmall"
        style={{
          color: theme.colors.inverseOnSurface,
          fontWeight: "500",
        }}
      >
        {Math.round(value)}
      </Text>
    </Animated.View>
  );
};

/**
 * A Slider component that allows users to select a value from a continuous or stepped range.
 * It features a custom thumb and a value indicator that appears during sliding.
 * Based on `@react-native-community/slider`.
 *
 * Note: `range` variant and `centered` mode are not fully implemented yet.
 *
 * @param {Props} props - The component's props.
 * @param {React.Ref<View>} ref - Ref for the main container View.
 * @returns {JSX.Element} The Slider component.
 * @see {@link https://github.com/react-native-community/react-native-slider|@react-native-community/slider}
 */
export const Slider = forwardRef<View, Props>(
  (
    {
      label,
      value,
      onChange,
      minValue = 0,
      maxValue = 100,
      step = 1,
      // mode = "continuous", // TODO: Implement centered mode
      variant = "number",
      isDisabled = false,
      orientation = "horizontal",
      style,
      testID,
    },
    ref,
  ) => {
    const theme = useTheme();
    const [isSliding, setIsSliding] = useState(false);

    // Handle single value slider
    const handleSingleValueChange = useCallback(
      (newValue: number) => {
        if (variant === "number") {
          onChange(newValue);
        }
      },
      [onChange, variant],
    );

    const handleSlidingStart = useCallback(() => {
      setIsSliding(true);
    }, []);

    const handleSlidingComplete = useCallback(() => {
      setIsSliding(false);
    }, []);

    // Get slider colors based on M3 theme
    const getSliderColors = () => {
      if (isDisabled) {
        return {
          minimumTrackTintColor: theme.colors.onSurface,
          maximumTrackTintColor: theme.colors.surfaceVariant,
          thumbTintColor: "transparent", // Hide default thumb
        };
      }

      return {
        minimumTrackTintColor: theme.colors.primary,
        maximumTrackTintColor: theme.colors.surfaceVariant,
        thumbTintColor: "transparent", // Hide default thumb
      };
    };

    const colors = getSliderColors();

    // Calculate value for centered mode
    const getSliderValue = () => {
      if (Array.isArray(value)) {
        return value[0] || minValue;
      }
      return value;
    };

    const sliderValue = getSliderValue();

    const styles = StyleSheet.create({
      container: {
        opacity: isDisabled ? 0.38 : 1,
      },
      label: {
        marginBottom: 8,
        color: theme.colors.onSurface,
      },
      sliderContainer: {
        height: 60, // Increased height for value indicator
        justifyContent: "center",
        position: "relative",
      },
      slider: {
        height: 20, // Increased trail height to 20px for better visibility
        borderRadius: 10, // Add border radius to make it rounded
        ...(orientation === "vertical" && {
          width: 20,
          height: 200,
          borderRadius: 10,
        }),
      },
      thumbContainer: {
        position: "absolute",
        top: -14,
        left: 0,
        right: 26,
        height: 60,
        justifyContent: "center",
        pointerEvents: "none",
      },
    });

    // Calculate thumb position
    const thumbPosition =
      ((sliderValue - minValue) / (maxValue - minValue)) * 100;

    return (
      <View
        ref={ref}
        style={[styles.container, style]}
        testID={testID || "slider"}
      >
        {label && (
          <Text variant="bodyMedium" style={styles.label}>
            {label}
          </Text>
        )}
        <View style={styles.sliderContainer}>
          <RNSlider
            style={[
              styles.slider,
              {
                // Hide default thumb completely
                overflow: "hidden",
              },
            ]}
            value={sliderValue}
            minimumValue={minValue}
            maximumValue={maxValue}
            step={step}
            onValueChange={handleSingleValueChange}
            onSlidingStart={handleSlidingStart}
            onSlidingComplete={handleSlidingComplete}
            disabled={isDisabled}
            minimumTrackTintColor={colors.minimumTrackTintColor}
            maximumTrackTintColor={colors.maximumTrackTintColor}
            thumbTintColor="transparent"
            testID={testID ? `${testID}-slider` : "slider-input"}
          />

          {/* Custom Thumb */}
          <View style={styles.thumbContainer}>
            <View
              style={{
                position: "absolute",
                left: `${thumbPosition}%`,
                transform: [{ translateX: -2 }], // Center the thumb
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ValueIndicator value={sliderValue} visible={isSliding} />
                <CustomThumb isDisabled={isDisabled} isSliding={isSliding} />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  },
);

Slider.displayName = "Slider";
