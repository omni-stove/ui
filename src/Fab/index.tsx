import type { Ref } from "react";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { FAB as Fab } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../Icon";
import { Typography } from "../Typography";
import { useTheme } from "../hooks";

/**
 * Defines the color palette for the FAB and its actions.
 * - `primary`: Uses the primary color scheme.
 * - `secondary`: Uses the secondary color scheme.
 * - `tertiary`: Uses the tertiary color scheme.
 */
type Color = "primary" | "secondary" | "tertiary";

/**
 * Defines the size of the main FAB.
 * - `medium`: A medium-sized FAB.
 * - `large`: A large-sized FAB.
 * (If not specified, a default small size is used)
 */
type Size = "medium" | "large";

/**
 * Represents a single action item in the FAB's speed dial.
 * @param {IconSource} [icon] - The icon to display for the action.
 * @param {string} label - The text label for the action.
 * @param {() => void} onPress - Function to call when the action is pressed.
 */
type Action = {
  icon?: IconSource;
  label: string;
  onPress: () => void;
};

/**
 * Props for the FAB (Floating Action Button) component.
 * @param {Color} [props.color="primary"] - The color scheme for the FAB and its actions.
 * @param {IconSource} props.icon - The icon for the main FAB.
 * @param {() => void} [props.onPress] - Function to call when the main FAB is pressed (if no actions are provided or if actions are closed).
 * @param {Size} [props.size] - The size of the main FAB. Defaults to a small size if not "medium" or "large".
 * @param {Action[]} [props.actions] - An array of action items to display in a speed dial when the FAB is pressed.
 * @param {string} [props.label] - Optional label for the main FAB (typically used for extended FABs).
 */
type Props = {
  color?: Color;
  icon: IconSource;
  onPress?: () => void;
  size?: Size;
  actions?: Action[];
  label?: string;
};

/**
 * A customizable Floating Action Button (FAB) component.
 * It can function as a simple FAB or as a speed dial, revealing multiple actions when pressed.
 * The component uses `react-native-paper`'s `FAB` and incorporates animations for opening/closing the speed dial.
 *
 * @param {Props} props - The component's props.
 * @param {Ref<View>} ref - Ref for the outer View container.
 * @returns {JSX.Element} The FAB component.
 * @see {@link https://callstack.github.io/react-native-paper/docs/components/FAB/|React Native Paper FAB}
 */
export const FAB = forwardRef(
  (
    { icon, actions, onPress, color = "primary", size, label }: Props,
    ref: Ref<View>,
  ) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [open, setOpen] = useState(false);
    const scaleAnim = useMemo(() => new Animated.Value(0), []);
    const mainFabAnim = useMemo(() => new Animated.Value(1), []);
    const closeFabAnim = useMemo(() => new Animated.Value(0), []);

    const toggleOpen = useCallback(() => {
      if (!actions || actions.length === 0) {
        return;
      }
      setOpen((prev) => !prev);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: open ? 0 : 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(mainFabAnim, {
          toValue: open ? 1 : 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(closeFabAnim, {
          toValue: open ? 0 : 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }, [actions, open, scaleAnim, mainFabAnim, closeFabAnim]);

    const onPressFab = useCallback(() => {
      if (actions && actions.length > 0) {
        toggleOpen();
      } else {
        onPress?.();
      }
    }, [toggleOpen, actions, onPress]);

    const colorSet = useMemo(() => {
      if (color === "secondary") {
        return {
          container: theme.colors.secondary,
          content: theme.colors.onSecondary,
          actionContainer: theme.colors.secondaryContainer,
          onActionContainer: theme.colors.onSecondaryContainer,
        };
      }
      if (color === "tertiary") {
        return {
          container: theme.colors.tertiary,
          content: theme.colors.onTertiary,
          actionContainer: theme.colors.tertiaryContainer,
          onActionContainer: theme.colors.onTertiaryContainer,
        };
      }

      return {
        container: theme.colors.primary,
        content: theme.colors.onPrimary,
        actionContainer: theme.colors.primaryContainer,
        onActionContainer: theme.colors.onPrimaryContainer,
      };
    }, [color, theme]);

    const fabSizeStyle = useMemo(() => {
      if (size === "large")
        return {
          customSize: 96,
          iconSize: 36,
          labelFontSize: 24,
        };

      if (size === "medium")
        return {
          customSize: 80,
          iconSize: 28,
          labelFontSize: 22,
        };

      return {
        customSize: 56,
        iconSize: 24,
        labelFontSize: 16,
      };
    }, [size]);

    const wrapperStyle = useMemo(
      () => ({
        ...styles.wrapper,
        bottom: Math.max(16, insets.bottom + 16),
        right: Math.max(16, insets.right + 16),
      }),
      [insets],
    );

    return (
      <View ref={ref} style={[styles.fullScreen]} pointerEvents="box-none">
        <View style={[wrapperStyle]}>
          {actions && open && (
            <View style={styles.actions}>
              {actions.map((action, index) => (
                <Animated.View
                  key={`${action.label}-${index}`}
                  style={{
                    opacity: scaleAnim,
                    transform: [
                      { scale: scaleAnim },
                      {
                        translateX: scaleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <Pressable
                    onPress={() => {
                      action.onPress();
                      toggleOpen();
                    }}
                    style={{
                      ...styles.action,
                      backgroundColor: colorSet.actionContainer,
                    }}
                  >
                    <Icon
                      source={action.icon}
                      size={24}
                      color={colorSet.onActionContainer}
                    />
                    <Typography
                      color={
                        colorSet.onActionContainer as keyof ReturnType<
                          typeof useTheme
                        >["colors"]
                      }
                    >
                      {action.label}
                    </Typography>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          )}
          <View style={styles.fabContainer}>
            <Animated.View style={{ opacity: mainFabAnim }}>
              <Fab
                icon={icon}
                customSize={fabSizeStyle.customSize}
                style={[
                  styles.baseFab,
                  { backgroundColor: colorSet.container },
                ]}
                onPress={onPressFab}
                color={colorSet.content}
                label={label}
              />
            </Animated.View>
            {actions && actions.length > 0 && (
              <Animated.View
                style={{
                  opacity: closeFabAnim,
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              >
                <Fab
                  icon="close"
                  customSize={56}
                  style={[
                    styles.baseFab,
                    { backgroundColor: colorSet.container },
                    styles.circularFab,
                  ]}
                  onPress={toggleOpen}
                  color={colorSet.content}
                />
              </Animated.View>
            )}
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  wrapper: {
    position: "absolute",
    alignItems: "flex-end",
  },
  actions: {
    marginBottom: 8,
    gap: 4,
    alignItems: "flex-end",
  },
  action: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    paddingHorizontal: 24,
    gap: 8,
    height: 56,
    elevation: 0,
    shadowColor: undefined,
    shadowOffset: undefined,
    shadowOpacity: undefined,
    shadowRadius: undefined,
  },
  baseFab: {
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  circularFab: {
    borderRadius: 999,
  },
  fabContainer: {
    position: "relative",
  },
});
