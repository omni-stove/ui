import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { NavigationRail as Component, NavigationRailItem } from '.'; // NavigationRailItem をインポート
import { getCanvas } from "../libs/storybook";
import { expect } from "@storybook/test";
import { View } from 'react-native'; // View をインポートしてラッパーとして使用

const meta: Meta<typeof Component> = {
  component: Component,
  // title: 'UI/NavigationRail', // Removed as per feedback
  decorators: [
    // Storyを中央に配置したり、背景色をつけたりするためのDecorator
    (Story) => (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', padding: 20 }}>
        <View style={{ height: '80%', width: 260, backgroundColor: 'white' }}>
          {/* NavigationRailが縦長なので、ある程度の高さを持つコンテナでラップ */}
          <Story />
        </View>
      </View>
    ),
  ],
  argTypes: {
    // itemsの各プロパティをコントロールできるように設定も可能だけど、まずは基本的なものを
    selectedItemKey: { control: 'text' },
    fabIcon: { control: 'text' },
    fabLabel: { control: 'text' },
    initialStatus: { control: 'radio', options: ['collapsed', 'expanded'] },
    // layout: { control: 'radio', options: ['standard', 'modal'] }, // 将来的に
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