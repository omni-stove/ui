import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, View, Animated } from "react-native";
import { FAB as Fab, Text, useTheme } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { Icon } from "../Icon";

type Color = "primary" | "secondary" | "tertiary";
type Size = "medium" | "large";
type Action = {
  icon?: IconSource;
  label: string;
  onPress: () => void;
};

type Props = {
  color?: Color;
  icon: IconSource;
  onPress?: () => void;
  size?: Size;
  actions?: Action[];
};

export const FAB = ({
  icon,
  actions,
  onPress,
  color = "primary",
  size,
}: Props) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const scaleAnim = useMemo(() => new Animated.Value(0), []);
  const mainFabAnim = useMemo(() => new Animated.Value(1), []);
  const closeFabAnim = useMemo(() => new Animated.Value(0), []);

  const toggleOpen = useCallback(() => {
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
  }, [open, scaleAnim, mainFabAnim, closeFabAnim]);

  const onPressFab = useCallback(() => {
    if (actions) {
      toggleOpen();
    }
    onPress?.();
  }, [toggleOpen, actions]);

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
      };

    if (size === "medium")
      return {
        customSize: 80,
        iconSize: 28,
      };

    return {
      customSize: 56,
      iconSize: 24,
    };
  }, [size]);

  return (
    <View style={[
      styles.wrapper,
    ]}>
      {actions && open && (
        <View style={styles.actions}>
          {actions.map((action, index) => (
            <Animated.View
              key={index}
              style={{
                opacity: scaleAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateX: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  })}
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
                <Text style={{ color: colorSet.onActionContainer }}>
                  {action.label}
                </Text>
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
            style={[styles.baseFab, { backgroundColor: colorSet.container }]}
            onPress={onPressFab}
            color={colorSet.content}
          />
        </Animated.View>
        <Animated.View style={{ opacity: closeFabAnim, position: 'absolute', top: 0, right: 0 }}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 16,
    right: 16,
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
    position: 'relative',
  },
});
