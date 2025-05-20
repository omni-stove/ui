import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { NavigationRail as Component, NavigationRailItem } from '.'; // NavigationRailItem をインポート
import { getCanvas } from "../libs/storybook";
import { expect } from "@storybook/test";
import { View } from 'react-native'; // View is used by other stories, keep for now or check all usages.
// useState and other specific imports for ModalVariant's previous render are removed if no longer needed globally.
// import { useState } from 'react';
// import { Button } from '../Button';
// import { IconButton, useTheme } from 'react-native-paper';
// import { MD3Theme } from 'react-native-paper';

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    selectedItemKey: { control: 'text' },
    fabIcon: { control: 'text' },
    fabLabel: { control: 'text' },
    initialStatus: { control: 'radio', options: ['collapsed', 'expanded'] },
    variant: { control: 'radio', options: ['standard', 'modal'] },
    initialModalOpen: { control: 'boolean', description: 'Initial open state for modal variant' },
    onDismiss: { action: 'dismissed' }, // For modal variant
    onMenuPress: { action: 'menuPressed' }, // For modal variant (when internal menu button closes modal)
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const defaultItems: NavigationRailItem[] = [
  { key: 'home', icon: 'home', label: 'Home', onPress: action('onPress-home') },
  { key: 'favorites', icon: 'heart', label: 'Favorites', onPress: action('onPress-favorites'), badge: { label: '3', size: 'large' } },
  { key: 'recent', icon: 'history', label: 'Recent', onPress: action('onPress-recent') },
  { key: 'settings', icon: 'cog', label: 'Settings', onPress: action('onPress-settings'), badge: { label: 'New', size: 'large'} },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    selectedItemKey: 'home',
    onMenuPress: action('onMenuPress'),
    fabIcon: 'pencil',
    fabLabel: 'Create',
    onFabPress: action('onFabPress'),
  },
  render: (args) =>
    <Component {...args} />
};

export const Collapsed: Story = {
  args: {
    ...Default.args,
    initialStatus: 'collapsed',
  },
  render: (args) =>
    <Component {...args} /> // Render with new initialStatus
};

export const ExpandedWithFab: Story = {
  args: {
    items: defaultItems,
    selectedItemKey: 'favorites',
    onMenuPress: action('onMenuPress'),
    fabIcon: 'plus',
    fabLabel: 'Add Item',
    onFabPress: action('onFabPress'),
    initialStatus: 'expanded',
  },
  render: (args) =>
    <Component {...args} /> // Render with new initialStatus
};

export const NoFab: Story = {
  args: {
    items: defaultItems,
    selectedItemKey: 'recent',
    onMenuPress: action('onMenuPress'),
    // fabIcon, fabLabel, onFabPress を指定しない
  },
  render: (args) =>
    <Component {...args} />
};


export const Behavior: Story = {
  args: { // Behavior ストーリーにも args を設定
    items: defaultItems,
    selectedItemKey: 'home',
    onMenuPress: action('onMenuPress'),
    fabIcon: 'pencil',
    fabLabel: 'Create',
    onFabPress: action('onFabPress'),
  },
  render: (args) =>
    <Component {...args} />
  ,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
    // ここにインタラクションのテストを追加できる
    // 例: canvas.getByText('Favorites').click();
    // expect(action('onPress-favorites')).toHaveBeenCalled();
  },
};

export const ModalVariant: Story = {
  args: {
    // Explicitly define args for ModalVariant
    items: defaultItems,
    selectedItemKey: 'home',
    fabIcon: 'pencil', // Optional: show FAB in modal rail
    fabLabel: 'Create',  // Optional
    onFabPress: action('onFabPress-modal'), // Optional
    variant: 'modal',
    initialModalOpen: false, // Default to closed for the story
    // onDismiss action is defined in argTypes
    // onMenuPress action is defined in argTypes
  },
  render: (args) => <Component {...args} />,
};