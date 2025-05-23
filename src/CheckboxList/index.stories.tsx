import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import type { ComponentProps } from "react";
import { useState } from "react";
import { View } from "react-native";
import { CheckboxList as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const mealOptions = [
  { id: "pickles", label: "Pickles" },
  { id: "tomato", label: "Tomato" },
  { id: "lettuce", label: "Lettuce" },
  { id: "cheese", label: "Cheese" },
];

const WithState = (
  args: Omit<
    ComponentProps<typeof Component>,
    "checkedKeys" | "onChangeChecks"
  >,
) => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>(["tomato"]);

  return (
    <Component
      {...args}
      checkedKeys={checkedKeys}
      onChangeChecks={setCheckedKeys}
    />
  );
};

export const Default: Story = {
  render: () => <WithState parent="Additions" items={mealOptions} />,
};

export const AllSelected: Story = {
  render: () => {
    const [checkedKeys, setCheckedKeys] = useState<string[]>([
      "pickles",
      "tomato",
      "lettuce",
      "cheese",
    ]);

    return (
      <Component
        parent="Additions"
        items={mealOptions}
        checkedKeys={checkedKeys}
        onChangeChecks={setCheckedKeys}
      />
    );
  },
};

export const NoneSelected: Story = {
  render: () => {
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

    return (
      <Component
        parent="Additions"
        items={mealOptions}
        checkedKeys={checkedKeys}
        onChangeChecks={setCheckedKeys}
      />
    );
  },
};

export const WithDisabledItems: Story = {
  render: () => {
    const [checkedKeys, setCheckedKeys] = useState<string[]>(["tomato"]);

    const itemsWithDisabled = [
      { id: "pickles", label: "Pickles", disabled: true },
      { id: "tomato", label: "Tomato" },
      { id: "lettuce", label: "Lettuce" },
      { id: "cheese", label: "Cheese", disabled: true },
    ];

    return (
      <Component
        parent="Additions"
        items={itemsWithDisabled}
        checkedKeys={checkedKeys}
        onChangeChecks={setCheckedKeys}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [checkedKeys, setCheckedKeys] = useState<string[]>([
      "tomato",
      "lettuce",
    ]);

    return (
      <Component
        parent="Additions"
        items={mealOptions}
        checkedKeys={checkedKeys}
        onChangeChecks={setCheckedKeys}
        disabled={true}
      />
    );
  },
};

export const MultipleGroups: Story = {
  render: () => {
    const [additionsChecked, setAdditionsChecked] = useState<string[]>([
      "tomato",
    ]);
    const [drinksChecked, setDrinksChecked] = useState<string[]>(["coke"]);

    const drinkOptions = [
      { id: "coke", label: "Coke" },
      { id: "sprite", label: "Sprite" },
      { id: "water", label: "Water" },
    ];

    return (
      <View style={{ gap: 16 }}>
        <Component
          parent="Additions"
          items={mealOptions}
          checkedKeys={additionsChecked}
          onChangeChecks={setAdditionsChecked}
        />
        <Component
          parent="Drinks"
          items={drinkOptions}
          checkedKeys={drinksChecked}
          onChangeChecks={setDrinksChecked}
        />
      </View>
    );
  },
};

export const Behavior: Story = {
  render: () => <WithState parent="Additions" items={mealOptions} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};
