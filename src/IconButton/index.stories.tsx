import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconButton as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    icon: { control: "text" },
    variant: {
      control: "select",
      options: ["filled", "tonal", "outlined", "standard"],
    },
    shape: {
      control: "select",
      options: ["round", "square"],
    },
    disabled: { control: "boolean" },
    selected: { control: "boolean" },
    onPress: { action: "pressed" },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const sizes: ComponentProps<typeof Component>["size"][] = [
  "extra-small",
  "small",
  "medium",
  "large",
  "extra-large",
];
const widthTypes: ComponentProps<typeof Component>["widthType"][] = [
  "default",
  "narrow",
  "wide",
];

const commonArgs: Partial<ComponentProps<typeof Component>> = {
  icon: "pencil",
  variant: "filled",
  shape: "round",
  onPress: () => console.log("IconButton pressed"),
};

export const AllSizesAndWidths: Story = {
  args: commonArgs,
  render: (args) => (
    <View style={styles.gridContainer}>
      {sizes.map((size) => (
        <View key={size} style={styles.gridRow}>
          {widthTypes.map((widthType) => (
            <View key={widthType} style={styles.gridCell}>
              <Component
                {...args}
                size={size}
                widthType={widthType}
                accessibilityLabel={`${size} ${widthType} icon button`}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  ),
};

const variants: ComponentProps<typeof Component>["variant"][] = [
  "filled",
  "tonal",
  "outlined",
  "standard",
];

export const AllVariants: Story = {
  args: {
    ...commonArgs,
    size: "small", // Use a representative size
    widthType: "default", // Use a representative width type
    shape: "round",
  },
  render: (args) => (
    <View style={styles.variantContainer}>
      {variants.map((variant) => (
        <View key={variant} style={styles.variantCell}>
          <Component
            {...args}
            variant={variant}
            accessibilityLabel={`${variant} icon button`}
          />
          <Text style={styles.variantLabel}>{variant}</Text>
        </View>
      ))}
    </View>
  ),
};

export const Behavior: Story = {
  args: {
    ...commonArgs,
    icon: "heart",
    size: "medium",
    widthType: "default",
  },
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    // Example: Test if the button is pressable
    const button = canvas.getByRole("button");
    expect(button).toBeTruthy();
    // More specific tests can be added here
  },
};

export const ToggledStates: Story = {
  args: {
    ...commonArgs,
    icon: "check", // Using 'check' to better visualize toggled state
    size: "medium",
    // shape is now determined by the component based on 'selected' state for toggles
  },
  render: (args) => (
    <View style={styles.variantContainer}>
      {variants.map((variant) => (
        <View
          key={`${variant}-toggle`}
          style={{ flexDirection: "column", alignItems: "center", margin: 8 }}
        >
          <Text style={styles.variantLabel}>{variant}</Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
          >
            <View style={styles.variantCell}>
              <Component
                {...args}
                variant={variant}
                selected={false}
                accessibilityLabel={`${variant} icon button unselected`}
              />
              <Text style={styles.variantLabel}>Off</Text>
            </View>
            <View style={styles.variantCell}>
              <Component
                {...args}
                variant={variant}
                selected={true}
                accessibilityLabel={`${variant} icon button selected`}
              />
              <Text style={styles.variantLabel}>On</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  ),
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "column",
    gap: 24, // Gap between rows of sizes
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24, // Gap between width types for the same size
    flexWrap: "wrap", // Allow wrapping if too many items
  },
  gridCell: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 140, // Ensure enough space for largest button in a row
    minHeight: 140,
  },
  variantContainer: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  variantCell: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100,
  },
  variantLabel: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
  },
});
