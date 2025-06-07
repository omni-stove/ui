import { forwardRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";

type Props = {
  /**
   * Color of the loading indicator. If not provided, uses theme primary color
   */
  color?: string;
  /**
   * Whether the loading indicator is visible
   * @default true
   */
  visible?: boolean;
  /**
   * Height of the indicator track
   * @default 4
   */
  height?: number;
  /**
   * Whether to show the background track
   * @default true
   */
  showTrack?: boolean;
};

// Material Design 3 standard easing
const STANDARD_EASING = Easing.bezier(0.4, 0.0, 0.2, 1);

export const LinearLoadingIndicator = forwardRef<View, Props>((props, ref) => {
  const { color, visible = true, height = 4, showTrack = true } = props;

  const theme = useTheme();
  const indicatorColor = color || theme.colors.primary;

  // Animation values for indeterminate progress
  const position = useSharedValue(0);
  const scale = useSharedValue(0.08);

  useEffect(() => {
    if (visible) {
      // Position animation - bar moves across the track
      position.value = withRepeat(
        withSequence(
          withTiming(1, {
            duration: 1500,
            easing: STANDARD_EASING,
          }),
          withTiming(0, {
            duration: 0,
          }),
        ),
        -1,
        false,
      );

      // Scale animation - bar grows and shrinks
      scale.value = withRepeat(
        withSequence(
          withTiming(0.5, {
            duration: 750,
            easing: STANDARD_EASING,
          }),
          withTiming(0.08, {
            duration: 750,
            easing: STANDARD_EASING,
          }),
        ),
        -1,
        false,
      );
    }
  }, [visible, position, scale]);

  const animatedBarStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      position.value,
      [0, 1],
      [-100, 100],
      "extend",
    );

    return {
      transform: [{ translateX: `${translateX}%` }, { scaleX: scale.value }],
      opacity: withTiming(visible ? 1 : 0, { duration: 200 }),
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(visible ? 1 : 0, { duration: 200 }),
  }));

  if (!visible) return null;

  return (
    <Animated.View
      ref={ref}
      style={[styles.container, { height }, animatedContainerStyle]}
    >
      {showTrack && (
        <View
          style={[
            styles.track,
            {
              backgroundColor: theme.colors.surfaceVariant,
              height,
            },
          ]}
        />
      )}
      <Animated.View
        style={[
          styles.bar,
          {
            backgroundColor: indicatorColor,
            height,
          },
          animatedBarStyle,
        ]}
      />
    </Animated.View>
  );
});

LinearLoadingIndicator.displayName = "LinearLoadingIndicator";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  track: {
    position: "absolute",
    width: "100%",
    opacity: 0.38,
    borderRadius: 2,
  },
  bar: {
    position: "absolute",
    width: "100%",
    borderRadius: 2,
  },
});
