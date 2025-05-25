import { StyleSheet } from "react-native";
import type { ExtendedTheme } from "../../hooks/types";

/**
 * Creates a StyleSheet object containing styles for the `Table` component and its sub-components.
 * The styles are generated based on the provided theme.
 *
 * @param {ExtendedTheme} theme - The extended theme object containing Material 3 colors and other theme properties.
 * @returns {StyleSheet.NamedStyles<any>} A StyleSheet object with various styles for the table.
 * @see {@link Table}
 * @see {@link ExtendedTheme}
 */
export const createTableStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
    },
    stripedRow: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    selectedRow: {
      backgroundColor: theme.colors.secondaryContainer,
    },
    paginationFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerCheckboxContainer: {
      marginTop: -6,
      overflow: "visible",
    },
    footerCheckboxContainer: {
      minWidth: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.surface,
      opacity: 0.7,
      justifyContent: "center",
      alignItems: "center",
    },
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    tableHeaderContainer: {
      position: "relative",
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 8,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    menuItemText: {
      marginLeft: 8,
      flex: 1,
    },
  });
