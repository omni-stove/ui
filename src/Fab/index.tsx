import { useCallback, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { FAB as Fab, Text, useTheme } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { Icon } from "../Icon";

type Action = {
  icon?: IconSource;
  label: string;
  onPress: () => void;
};

type Props = {
  color: "primary" | "secondary" | "tertiary";
  size?: "medium" | "large";
  icon: IconSource;
  actions?: Action[];
  onPress?: () => void;
};

export const FAB = ({ icon, actions, onPress, color = "primary" }: Props) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const onPressFab = useCallback(() => {
    if (actions) {
      toggleOpen();
    }
    onPress?.();
  }, [toggleOpen, actions]);

  const getColorSet = () => {
    switch (color) {
      case "secondary":
        return {
          container: theme.colors.secondary,
          content: theme.colors.onSecondary,
          actionContainer: theme.colors.secondaryContainer,
          onActionContainer: theme.colors.onSecondaryContainer,
        };
      case "tertiary":
        return {
          container: theme.colors.tertiary,
          content: theme.colors.onTertiary,
          actionContainer: theme.colors.tertiaryContainer,
          onActionContainer: theme.colors.onTertiaryContainer,
        };
      default:
        return {
          container: theme.colors.primary,
          content: theme.colors.onPrimary,
          actionContainer: theme.colors.primaryContainer,
          onActionContainer: theme.colors.onPrimaryContainer,
        };
    }
  };

  const colorSet = getColorSet();

  return (
    <View style={style.wrapper}>
      {actions && open && (
        <View style={style.actions}>
          {actions.map((action, index) => (
            <Pressable
              key={index}
              onPress={() => {
                action.onPress();
                toggleOpen();
              }}
              style={{
                ...style.action,
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
          ))}
        </View>
      )}
      {open && (
        <Fab
          icon={"close"}
          style={[style.closeFab, { backgroundColor: colorSet.container }]}
          onPress={toggleOpen}
          color={colorSet.content}
        />
      )}
      {!open && (
        <Fab
          icon={icon}
          style={[style.fab, { backgroundColor: colorSet.container }]}
          onPress={onPressFab}
          color={colorSet.content}
        />
      )}
    </View>
  );
};

const style = StyleSheet.create({
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
  closeFab: {
    borderRadius: 28,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fab: {
    borderRadius: 28,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
