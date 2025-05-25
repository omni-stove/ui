import type { ViewStyle } from "react-native";

/**
 * Defines the comprehensive set of color roles for a Material 3 theme.
 * These colors are dynamically generated based on a source color.
 *
 * @see {@link https://m3.material.io/styles/color/the-color-system/color-roles|Material Design 3 - Color roles}
 */
export type Material3Colors = {
  // Primary colors
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  // Secondary colors
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  // Tertiary colors
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  // Error colors
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  // Surface colors
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  surfaceTint: string;

  // Fixed colors (M3 extended) - These are variants of primary, secondary, and tertiary colors
  // typically used for specific states or emphasis, maintaining accessibility.
  primaryFixed: string;
  primaryFixedDim: string;
  onPrimaryFixed: string;
  onPrimaryFixedVariant: string;
  secondaryFixed: string;
  secondaryFixedDim: string;
  onSecondaryFixed: string;
  onSecondaryFixedVariant: string;
  tertiaryFixed: string;
  tertiaryFixedDim: string;
  onTertiaryFixed: string;
  onTertiaryFixedVariant: string;

  // Other colors
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;

  // Background (for compatibility with React Native Paper's base theme structure)
  background: string;
  onBackground: string;
};

/**
 * Represents the extended theme object used throughout the application.
 * It incorporates the full `Material3Colors` palette into the base
 * `react-native-paper` theme structure.
 *
 * @property {Material3Colors} colors - The complete set of Material 3 color roles.
 * @property {boolean} dark - Whether the theme is a dark theme.
 * @property {"adaptive" | "exact"} [mode] - The mode of the theme (from Paper).
 * @property {number} roundness - The roundness scale for components (from Paper).
 * @property {object} fonts - Font configurations (from Paper).
 * @property {object} animation - Animation configurations (from Paper).
 * @property {number} version - Theme version (from Paper).
 * @property {boolean} isV3 - Indicates if it's a Material Design 3 theme (from Paper).
 */
export type ExtendedTheme = {
  colors: Material3Colors;
  dark: boolean;
  mode?: "adaptive" | "exact";
  roundness: number;
  fonts: object; // Consider defining a more specific type if font structure is known
  animation: object; // Consider defining a more specific type if animation structure is known
  version: number;
  isV3: boolean;
};

// SideSheet Layout Types
/**
 * Represents the state of a single SideSheet instance.
 * Used by the `SideSheetLayoutContext` to manage layout adjustments.
 *
 * @param {boolean} isOpen - Whether the side sheet is currently open.
 * @param {number} width - The width of the side sheet.
 * @param {"left" | "right"} position - The position of the side sheet on the screen.
 * @param {"standard" | "modal"} variant - The display variant of the side sheet.
 */
export type SideSheetLayoutState = {
  isOpen: boolean;
  width: number;
  position: "left" | "right";
  variant: "standard" | "modal";
};

/**
 * Defines the shape of the context provided by `SideSheetLayoutProvider`.
 * This context allows components to interact with and respond to the state of SideSheets.
 *
 * @param {Map<string, SideSheetLayoutState>} sideSheets - A map of registered side sheets and their states.
 * @param {(id: string, state: SideSheetLayoutState) => void} registerSideSheet - Function to register a new side sheet.
 * @param {(id: string) => void} unregisterSideSheet - Function to unregister a side sheet.
 * @param {(id: string, state: Partial<SideSheetLayoutState>) => void} updateSideSheet - Function to update the state of an existing side sheet.
 * @param {() => ViewStyle} getMainContentStyle - Function that returns a style object for the main content area,
 *                                                adjusted for any open "standard" side sheets.
 */
export type SideSheetLayoutContextType = {
  sideSheets: Map<string, SideSheetLayoutState>;
  registerSideSheet: (id: string, state: SideSheetLayoutState) => void;
  unregisterSideSheet: (id: string) => void;
  updateSideSheet: (id: string, state: Partial<SideSheetLayoutState>) => void;
  getMainContentStyle: () => ViewStyle;
};
