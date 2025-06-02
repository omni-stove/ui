import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { useState } from "react";
import { Grid, GridItem } from "../Grid";
import { TextField as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    label: "Label",
    supportingText: "This is a supporting text.",
    errorMessage: "",
    multiline: false,
    maxLines: 4,
    variant: "filled",
    startAdornment: undefined,
    endAdornment: undefined,
    required: false,
    readOnly: false,
    disabled: false,
    maxLength: undefined,
  },
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["filled", "outlined"],
    },
    maxLength: {
      control: { type: "number" },
    },
    startAdornment: {
      control: { type: "object" },
    },
    endAdornment: {
      control: { type: "object" },
    },
    value: { control: false },
    onChangeText: { action: "onChangeText" },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Grid>
      <GridItem span={6}>
        <Component
          variant="filled"
          label="Filled TextField"
        />
      </GridItem>
      <GridItem span={6}>
        <Component
          variant="outlined"
          label="Outlined TextField"
        />
      </GridItem>
    </Grid>
  ),
};

export const WithError: Story = {
  render: () => (
    <Grid>
      <GridItem span={6}>
        <Component
          variant="filled"
          label="Filled with error"
          errorMessage="This field has an error."
        />
      </GridItem>
      <GridItem span={6}>
        <Component
          variant="outlined"
          label="Outlined with error"
          errorMessage="This field has an error."
        />
      </GridItem>
    </Grid>
  ),
};

export const Multiline: Story = {
  render: () => (
    <Grid>
      <GridItem span={6}>
        <Component
          variant="filled"
          label="Filled multiline"
          multiline={true}
          maxLines={5}
        />
      </GridItem>
      <GridItem span={6}>
        <Component
          variant="outlined"
          label="Outlined multiline"
          multiline={true}
          maxLines={5}
        />
      </GridItem>
    </Grid>
  ),
};

export const WithAdornments: Story = {
  render: () => (
    <Grid>
      <GridItem span={6}>
        <Component
          variant="filled"
          label="Filled adornments"
          startAdornment={{ type: "icon", value: "currency-usd" }}
          endAdornment={{ type: "label", value: "kg" }}
        />
      </GridItem>
      <GridItem span={6}>
        <Component
          variant="outlined"
          label="Outlined adornments"
          startAdornment={{ type: "icon", value: "currency-usd" }}
          endAdornment={{ type: "label", value: "kg" }}
        />
      </GridItem>
    </Grid>
  ),
};

export const WithMaxLength: Story = {
  args: {
    label: "Field with MaxLength",
    maxLength: 10,
  },
  render: function Render(args) {
    const [val, setVal] = useState("");
    return (
      <Component
        {...args}
        value={val}
        onChangeText={(text) => {
          setVal(text);
          args.onChangeText?.(text);
        }}
      />
    );
  },
};

export const Behavior: Story = {
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas.getByText("Label")).toBeTruthy();
  },
};
