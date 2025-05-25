import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import type { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton as Component } from ".";
import { Typography } from "../Typography";
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
    size: "small",
    widthType: "default",
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
          <Typography variant="labelSmall">{variant}</Typography>
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
    const button = canvas.getByRole("button");
    expect(button).toBeTruthy();
  },
};

export const ToggledStates: Story = {
  args: {
    ...commonArgs,
    icon: "check",
    size: "medium",
  },
  render: (args) => (
    <View style={styles.variantContainer}>
      {variants.map((variant) => (
        <View
          key={`${variant}-toggle`}
          style={{ flexDirection: "column", alignItems: "center", margin: 8 }}
        >
          <Typography variant="labelSmall">{variant}</Typography>
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
              <Typography variant="labelSmall">Off</Typography>
            </View>
            <View style={styles.variantCell}>
              <Component
                {...args}
                variant={variant}
                selected={true}
                accessibilityLabel={`${variant} icon button selected`}
              />
              <Typography variant="labelSmall">On</Typography>
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
    gap: 24,
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
  },
  gridCell: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 140,
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
