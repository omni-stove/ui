import { useCallback, useMemo } from "react";
import { FlatList, View } from "react-native";
import { Checkbox } from "../Checkbox";

/**
 * Represents a single item in the CheckboxList.
 * @param {string} id - A unique identifier for the checkbox item.
 * @param {string} label - The text label to display next to the checkbox.
 * @param {boolean} [disabled=false] - Whether this specific checkbox item is disabled.
 */
type CheckboxItem = {
  id: string;
  label: string;
  disabled?: boolean;
};

/**
 * Props for the CheckboxList component.
 * @param {string} props.parent - The label for the parent checkbox.
 * @param {CheckboxItem[]} props.items - An array of checkbox items to display under the parent.
 * @param {string[]} [props.checkedKeys=[]] - An array of IDs of the currently checked items.
 * @param {(checkedKeys: string[]) => void} props.onChangeChecks - Callback function invoked when the selection changes. It receives an array of the new checked item IDs.
 * @param {boolean} [props.disabled=false] - Whether the entire CheckboxList (parent and all children) is disabled.
 * @param {string} [props.testID] - Test ID for the CheckboxList component and its sub-components.
 */
type Props = {
  parent: string;
  items: CheckboxItem[];
  checkedKeys?: string[];
  onChangeChecks: (checkedKeys: string[]) => void;
  disabled?: boolean;
  testID?: string;
};

/**
 * A CheckboxList component that displays a parent checkbox and a list of child checkboxes.
 * The parent checkbox reflects the state of its children (unchecked, checked, or indeterminate).
 * Selecting the parent checkbox toggles the selection of all enabled child items.
 *
 * @param {Props} props - The component's props.
 * @returns {JSX.Element} The CheckboxList component.
 * @see {@link Checkbox}
 */
export const CheckboxList = ({
  parent,
  items,
  checkedKeys = [],
  onChangeChecks,
  disabled = false,
  testID,
}: Props) => {
  // 親の状態を計算
  const parentState = useMemo(() => {
    const checkedChildren = items.filter(
      (item) => checkedKeys.includes(item.id) && !item.disabled,
    );
    const enabledItems = items.filter((item) => !item.disabled);

    if (checkedChildren.length === 0) return false;
    if (checkedChildren.length === enabledItems.length) return true;
    return "indeterminate";
  }, [items, checkedKeys]);

  // 親チェックボックスのハンドラ
  const handleParentChange = useCallback(() => {
    if (disabled) return;

    const enabledItems = items.filter((item) => !item.disabled);
    const enabledItemIds = enabledItems.map((item) => item.id);

    if (parentState === true) {
      // 全選択状態 → 全解除
      const newCheckedKeys = checkedKeys.filter(
        (key) => !enabledItemIds.includes(key),
      );
      onChangeChecks(newCheckedKeys);
    } else {
      // 未選択 or 部分選択 → 全選択
      const newCheckedKeys = [
        ...checkedKeys.filter((key) => !enabledItemIds.includes(key)),
        ...enabledItemIds,
      ];
      onChangeChecks(newCheckedKeys);
    }
  }, [disabled, items, parentState, checkedKeys, onChangeChecks]);

  // 子チェックボックスのハンドラ
  const handleChildChange = useCallback(
    (itemId: string) => {
      if (disabled) return;

      const isCurrentlyChecked = checkedKeys.includes(itemId);

      if (isCurrentlyChecked) {
        // チェック解除
        const newCheckedKeys = checkedKeys.filter((key) => key !== itemId);
        onChangeChecks(newCheckedKeys);
      } else {
        // チェック
        const newCheckedKeys = [...checkedKeys, itemId];
        onChangeChecks(newCheckedKeys);
      }
    },
    [disabled, checkedKeys, onChangeChecks],
  );

  // FlatListのrenderItem（子アイテムのみ）
  const renderItem = useCallback(
    ({ item }: { item: CheckboxItem }) => {
      return (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 4,
            paddingLeft: 48, // 子アイテムのインデント
          }}
        >
          <Checkbox
            label={item.label}
            checked={checkedKeys.includes(item.id)}
            onChangeCheck={() => handleChildChange(item.id)}
            disabled={disabled || item.disabled}
            testID={testID ? `${testID}-${item.id}` : undefined}
          />
        </View>
      );
    },
    [checkedKeys, handleChildChange, disabled, testID],
  );

  const keyExtractor = useCallback((item: CheckboxItem) => item.id, []);

  return (
    <View>
      {/* 親チェックボックス */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <Checkbox
          label={parent}
          checked={parentState}
          onChangeCheck={handleParentChange}
          disabled={disabled}
          testID={testID ? `${testID}-parent` : undefined}
        />
      </View>

      {/* 子アイテムのFlatList */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
        testID={testID ? `${testID}-list` : undefined}
      />
    </View>
  );
};

CheckboxList.displayName = "CheckboxList";
