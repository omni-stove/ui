import { ScrollView, StyleSheet, View } from "react-native";
import { Typography } from "../Typography";
import { useTheme } from "../hooks";

/**
 * A component that displays a list of all colors defined in the current theme.
 * For each color, it shows a preview swatch, the color's name (key in the theme object),
 * and its string value (e.g., hex code).
 * This is primarily a utility component for development and debugging purposes
 * to visualize the active theme's color palette.
 *
 * @returns {JSX.Element} A ScrollView containing the list of theme colors.
 */
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
          const displayColor = isStringColor ? color : "#cccccc";
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
              <Typography
                variant="bodyLarge"
                color="onSurface"
                style={styles.colorNameTypography}
              >
                {name}
              </Typography>
              <Typography variant="bodyLarge" color="onSurface">
                {colorValueText}
              </Typography>
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
    // flex: 1, // Moved to colorNameTypography
    // fontSize: 16, // Handled by Typography variant
  },
  colorNameTypography: {
    flex: 1,
  },
  colorValue: {
    // fontSize: 16, // Handled by Typography variant
  },
});
