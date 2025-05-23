import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks";

export const ThemeColors = () => {
  const theme = useTheme();
  const colors = Object.entries(theme.colors).map(([name, color]) => ({
    name,
    color,
  }));

  return (
    <ScrollView
      style={[
        styles.scrollViewContainer,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <View style={styles.container}>
        {colors.map(({ name, color }) => {
          const isStringColor = typeof color === "string";
          const displayColor = isStringColor ? color : "#cccccc"; // Default color for non-string values
          const colorValueText = isStringColor ? color : JSON.stringify(color);
          return (
            <View key={name} style={styles.colorRow}>
              <View
                style={[
                  styles.colorPreview,
                  {
                    backgroundColor: displayColor,
                    borderColor: theme.colors.outline,
                  },
                ]}
              />
              <Text
                style={[styles.colorName, { color: theme.colors.onSurface }]}
              >
                {name}
              </Text>
              <Text
                style={[styles.colorValue, { color: theme.colors.onSurface }]}
              >
                {colorValueText}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
  },
  colorName: {
    flex: 1,
    fontSize: 16,
  },
  colorValue: {
    fontSize: 16,
  },
});
