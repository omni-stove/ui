import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Typography as Component } from ".";
import type { Material3Colors } from "../hooks/types";

// Extract PaperTextVariant type locally if not exported from component
type PaperTextVariant = ComponentProps<typeof Component>["variant"];

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [
    (Story) => (
      <ScrollView contentContainerStyle={styles.container}>
        <Story />
      </ScrollView>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Component>;

const defaultArgs: Story["args"] = {
  children: "Hello Typography",
};

export const Default: Story = {
  args: defaultArgs,
  render: (args) => <Component {...args} />,
};

const textVariants: PaperTextVariant[] = [
  "displayLarge",
  "displayMedium",
  "displaySmall",
  "headlineLarge",
  "headlineMedium",
  "headlineSmall",
  "titleLarge",
  "titleMedium",
  "titleSmall",
  "labelLarge",
  "labelMedium",
  "labelSmall",
  "bodyLarge",
  "bodyMedium",
  "bodySmall",
];

const colorKeys = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "surface",
  "onSurface",
  "surfaceVariant",
  "onSurfaceVariant",
  "surfaceDim",
  "surfaceBright",
  "surfaceContainerLowest",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "surfaceTint",
  "primaryFixed",
  "primaryFixedDim",
  "onPrimaryFixed",
  "onPrimaryFixedVariant",
  "secondaryFixed",
  "secondaryFixedDim",
  "onSecondaryFixed",
  "onSecondaryFixedVariant",
  "tertiaryFixed",
  "tertiaryFixedDim",
  "onTertiaryFixed",
  "onTertiaryFixedVariant",
  "outline",
  "outlineVariant",
  "shadow",
  "scrim",
  "inverseSurface",
  "inverseOnSurface",
  "inversePrimary",
  "background",
  "onBackground",
] as const satisfies ReadonlyArray<keyof Material3Colors>;

export const AllVariants: Story = {
  render: () => (
    <View>
      {textVariants.map((variant) => (
        <Component key={variant} variant={variant}>
          {`Variant: ${variant}`}
        </Component>
      ))}
    </View>
  ),
};

export const AllColors: Story = {
  render: () => (
    <View>
      {colorKeys.map((colorKey) => (
        <Component key={colorKey} color={colorKey}>
          {`Color: ${colorKey}`}
        </Component>
      ))}
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  storyItem: {
    marginBottom: 8,
  },
});
