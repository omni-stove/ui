import { useCallback, useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Icon } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { useTheme } from "../hooks";
import { Typography } from "../Typography";

/**
 * Props for the Switch component.
 * @param {boolean} props.selected - The current state of the switch (true for on, false for off).
 * @param {() => void} props.onPress - Callback function invoked when the switch is pressed or its state changes.
 * @param {boolean} [props.fluid] - (Not currently implemented) Intended for a fluid animation style.
 * @param {IconSource} [props.switchOnIcon="check"] - Icon to display when the switch is in the "on" state. Defaults to "check".
 * @param {IconSource} [props.switchOffIcon] - Icon to display when the switch is in the "off" state.
 * @param {boolean} [props.disabled] - Whether the switch is disabled.
 * @param {string} [props.label] - Optional label text to display to the right of the switch.
 */
type SwitchProps = {
  selected: boolean;
  onPress: () => void;
  fluid?: boolean;
  switchOnIcon?: IconSource;
  switchOffIcon?: IconSource;
  disabled?: boolean;
  label?: string;
};

/**
 * A custom Switch component with Material Design 3 styling and animations.
 * It supports gestures for toggling and displays icons for on/off states.
 * The component uses `react-native-gesture-handler` for pan gesture detection
 * and `Animated` API for smooth transitions.
 *
 * @param {SwitchProps} props - The component's props.
 * @returns {JSX.Element} The Switch component.
 */
export const Switch = ({
  selected,
  onPress,
  switchOnIcon = "check",
  switchOffIcon,
  disabled,
  label,
}: SwitchProps) => {
  const theme = useTheme();
  const position = useState(new Animated.Value(selected ? 10 : -10))[0];
  const handleHeight = useState(new Animated.Value(selected ? 24 : 16))[0];
  const handleWidth = useState(new Animated.Value(selected ? 24 : 16))[0];
  const [active, setActive] = useState(selected);
  const [isPressed, setIsPressed] = useState(false);

  const onSwitchPress = useCallback(() => {
    onPress != null ? onPress() : null;
  }, [onPress]);

  const callbackFunction = useCallback(() => {
    onSwitchPress();
    setIsPressed(false);
  }, [onSwitchPress]);

  const pan = Gesture.Pan()
    .activateAfterLongPress(100)
    .onTouchesUp(() => setIsPressed(false))
    .runOnJS(true)
    .hitSlop(disabled ? -30 : 0)
    .onStart(() => {
      setIsPressed(true);
      Animated.timing(handleHeight, {
        toValue: 28,
        duration: 160,
        useNativeDriver: false,
      }).start();
      Animated.timing(handleWidth, {
        toValue: 28,
        duration: 160,
        useNativeDriver: false,
      }).start();
    })
    .onChange(() => {})
    .onEnd((event) => {
      setIsPressed(false);
      position.stopAnimation((currentPositionValue) => {
        const finalPosition = currentPositionValue + event.translationX / 10;
        if (finalPosition > 0) {
          Animated.timing(position, {
            toValue: 10,
            duration: 250,
            useNativeDriver: false,
          }).start();
          Animated.timing(handleHeight, {
            toValue: 24,
            duration: 160,
            useNativeDriver: false,
          }).start();
          Animated.timing(handleWidth, {
            toValue: 24,
            duration: 160,
            useNativeDriver: false,
          }).start(({ finished }) => {
            if (finished && !active) {
              callbackFunction();
            }
          });
        } else {
          Animated.timing(position, {
            toValue: -10,
            duration: 250,
            useNativeDriver: false,
          }).start();
          Animated.timing(handleHeight, {
            toValue: 16,
            duration: 160,
            useNativeDriver: false,
          }).start();
          Animated.timing(handleWidth, {
            toValue: 16,
            duration: 160,
            useNativeDriver: false,
          }).start(({ finished }) => {
            if (finished && active) {
              callbackFunction();
            }
          });
        }
      });
    });

  const styles = StyleSheet.create({
    handleStyle: {
      marginVertical: "auto",
      minHeight: switchOffIcon ? 24 : 16,
      minWidth: switchOffIcon ? 24 : 16,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    trackStyle: {
      alignItems: "center",
      borderWidth: 2,
      borderRadius: 16,
      justifyContent: "center",
      height: 32,
      width: 52,
    },
    handleOutlineStyle: {
      height: 40,
      width: 40,
      borderRadius: 20,
      position: "absolute",
      alignItems: "center",
      opacity: 0.18,
      justifyContent: "center",
    },
    iconOnStyle: {
      overflow: "hidden",
    },
    iconOffStyle: {
      position: "absolute",
      overflow: "hidden",
    },
    stateOuter: {
      justifyContent: "center",
      height: 32,
      width: 52,
      alignItems: "center",
      position: "absolute",
    },
  });

  const getHandleAnimatedStyle = () => ({
    ...styles.handleStyle,
    transform: [{ translateX: position }],
    height: handleHeight,
    width: handleWidth,
    backgroundColor: position.interpolate({
      inputRange: [-10, 10],
      outputRange: [theme.colors.outline, theme.colors.onPrimary],
    }),
    opacity: disabled ? (active ? 1 : 0.36) : 1,
  });

  const getTrackAnimatedStyle = () => ({
    ...styles.trackStyle,
    backgroundColor: position.interpolate({
      inputRange: [-10, 10],
      outputRange: [theme.colors.surfaceVariant, theme.colors.primary],
    }),
    borderColor: position.interpolate({
      inputRange: [-10, 10],
      outputRange: [theme.colors.outline, theme.colors.primary],
    }),
    opacity: disabled ? 0.12 : 1,
  });

  const getHandleOutlineAnimatedStyle = () => ({
    ...styles.handleOutlineStyle,
    transform: [{ translateX: position }],
    backgroundColor: !isPressed
      ? "transparent"
      : position.interpolate({
          inputRange: [-10, 10],
          outputRange: [theme.colors.onSurface, theme.colors.primary],
        }),
  });

  const getIconOnAnimatedStyle = () => ({
    ...styles.iconOnStyle,
    opacity: position.interpolate({
      inputRange: [0, 10],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    transform: [
      {
        scale: position.interpolate({
          inputRange: [0, 10],
          outputRange: [0, 1],
          extrapolate: "clamp",
        }),
      },
      {
        rotate: position.interpolate({
          inputRange: [0, 10],
          outputRange: ["-90deg", "0deg"],
          extrapolate: "clamp",
        }),
      },
    ],
  });

  const getIconOffAnimatedStyle = () => ({
    ...styles.iconOffStyle,
    opacity: position.interpolate({
      inputRange: [-10, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    }),
    transform: [
      {
        scale: position.interpolate({
          inputRange: [-10, 0],
          outputRange: [1, 0],
          extrapolate: "clamp",
        }),
      },
      {
        rotate: position.interpolate({
          inputRange: [-10, 0],
          outputRange: ["-90deg", "0deg"],
          extrapolate: "clamp",
        }),
      },
    ],
  });

  const changeSwitch = useCallback(
    (withCallback: boolean) => {
      if (active) {
        Animated.timing(handleHeight, {
          toValue: 16,
          duration: 100,
          useNativeDriver: false,
        }).start();
        Animated.timing(handleWidth, {
          toValue: 16,
          duration: 100,
          useNativeDriver: false,
        }).start();
        Animated.timing(position, {
          toValue: -10,
          duration: 250,
          useNativeDriver: false,
        }).start(
          withCallback
            ? (finished) => {
                if (finished) {
                  callbackFunction();
                }
              }
            : undefined,
        );
        setActive(false);
      } else {
        Animated.timing(handleHeight, {
          toValue: 24,
          duration: 100,
          useNativeDriver: false,
        }).start();
        Animated.timing(handleWidth, {
          toValue: 24,
          duration: 100,
          useNativeDriver: false,
        }).start();
        Animated.timing(position, {
          toValue: 10,
          duration: 250,
          useNativeDriver: false,
        }).start(
          withCallback
            ? (finished) => {
                if (finished) {
                  callbackFunction();
                }
              }
            : undefined,
        );
        setActive(true);
      }
    },
    [active, handleHeight, handleWidth, position, callbackFunction],
  );

  const init = useCallback(() => {
    if (active !== selected) {
      changeSwitch(false);
    }
    Animated.timing(handleHeight, {
      toValue: selected ? 24 : 16,
      duration: 100,
      useNativeDriver: false,
    }).start();
    Animated.timing(handleWidth, {
      toValue: selected ? 24 : 16,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [selected, handleHeight, handleWidth, active, changeSwitch]);

  useEffect(() => {
    init();
  }, [init]);
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        setIsPressed(true);
        changeSwitch(true);
      }}
      style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
    >
      <View style={{ borderRadius: 20 }}>
        <View pointerEvents="none" style={styles.stateOuter}>
          <Animated.View style={getHandleOutlineAnimatedStyle()} key={3} />
        </View>
        <Animated.View style={getTrackAnimatedStyle()} key={1}>
          <GestureHandlerRootView>
            <GestureDetector gesture={pan}>
              <Pressable
                disabled={disabled}
                style={{
                  justifyContent: "center",
                  height: 32,
                  width: 52,
                  alignItems: "center",
                }}
                onLongPress={() => {
                  Animated.timing(handleHeight, {
                    toValue: 28,
                    duration: 100,
                    useNativeDriver: false,
                  }).start();
                  Animated.timing(handleWidth, {
                    toValue: 28,
                    duration: 100,
                    useNativeDriver: false,
                  }).start();
                }}
                onPress={() => {
                  setIsPressed(true);
                  changeSwitch(true);
                }}
              />
            </GestureDetector>
          </GestureHandlerRootView>
        </Animated.View>
        <View pointerEvents="none" style={styles.stateOuter}>
          <Animated.View style={getHandleAnimatedStyle()} key={2}>
            {switchOnIcon ? (
              <Animated.View key={10} style={getIconOnAnimatedStyle()}>
                <Icon
                  source={switchOnIcon}
                  size={16}
                  color={
                    disabled
                      ? theme.colors.onSurface
                      : theme.colors.onPrimaryContainer
                  }
                />
              </Animated.View>
            ) : null}
            {switchOffIcon ? (
              <Animated.View key={9} style={getIconOffAnimatedStyle()}>
                <Icon
                  source={switchOffIcon}
                  size={16}
                  color={theme.colors.surface}
                />
              </Animated.View>
            ) : null}
          </Animated.View>
        </View>
      </View>
      {label && (
        <Typography
          variant="bodyMedium"
          color="onSurface"
          style={{ opacity: disabled ? 0.38 : 1 }}
        >
          {label}
        </Typography>
      )}
    </Pressable>
  );
};
