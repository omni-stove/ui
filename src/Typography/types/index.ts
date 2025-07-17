import type { ReactNode } from "react";
import type { TextProps } from "react-aria-components";

/**
 * Defines the typographic scale variants based on Material Design 3.
 */
type Variant =
  | "displayLarge"
  | "displayMedium"
  | "displaySmall"
  | "headlineLarge"
  | "headlineMedium"
  | "headlineSmall"
  | "titleLarge"
  | "titleMedium"
  | "titleSmall"
  | "bodyLarge"
  | "bodyMedium"
  | "bodySmall"
  | "labelLarge"
  | "labelMedium"
  | "labelSmall";

/**
 * Defines the available color keys from the Material Design 3 color system.
 */
type ColorKey =
  | "background"
  | "errorContainer"
  | "error"
  | "inverseOnSurface"
  | "inversePrimary"
  | "inverseSurface"
  | "onBackground"
  | "onErrorContainer"
  | "onError"
  | "onPrimaryContainer"
  | "onPrimaryFixedVariant"
  | "onPrimaryFixed"
  | "onPrimary"
  | "onSecondaryContainer"
  | "onSecondaryFixedVariant"
  | "onSecondaryFixed"
  | "onSecondary"
  | "onSurfaceVariant"
  | "onSurface"
  | "onTertiaryContainer"
  | "onTertiaryFixedVariant"
  | "onTertiaryFixed"
  | "onTertiary"
  | "outlineVariant"
  | "outline"
  | "primaryContainer"
  | "primaryFixedDim"
  | "primaryFixed"
  | "primary"
  | "scrim"
  | "secondaryContainer"
  | "secondaryFixedDim"
  | "secondaryFixed"
  | "secondary"
  | "shadow"
  | "surfaceBright"
  | "surfaceContainerHigh"
  | "surfaceContainerHighest"
  | "surfaceContainerLow"
  | "surfaceContainerLowest"
  | "surfaceContainer"
  | "surfaceDim"
  | "surfaceTint"
  | "surfaceVariant"
  | "surface"
  | "tertiaryContainer"
  | "tertiaryFixedDim"
  | "tertiaryFixed"
  | "tertiary";

export type Props = {
  /**
   * The text variant.
   * Uses the variant from the react-native-paper Text component.
   * @default 'bodyMedium'
   * @see https://callstack.github.io/react-native-paper/docs/components/Text/
   */
  variant?: Variant;
  /**
   * The text color.
   * Specifies a color defined in ExtendedTheme.
   * @default 'onSurface'
   */
  color?: ColorKey;
  /**
   * The content to display.
   */
  children: ReactNode;
  /** The slot attribute for react-aria-components compatibility. */
  slot?: TextProps["slot"];
};

/**
 * A component for displaying text.
 * This component extends the react-native-paper Text component,
 * allowing color specification from ExtendedTheme.
 *
 * @param {Props} props - The component's props.
 * @param {Variant} [props.variant='bodyMedium'] - The variant of the react-native-paper Text component.
 * @param {keyof ColorKey} [props.color='onSurface'] - The color defined in ExtendedTheme.
 * @param {ReactNode} props.children - The child elements to render.
 * @returns {ComponentProps<typeof PaperText>} Returns the PaperText component.
 */
