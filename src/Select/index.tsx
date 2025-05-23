import {
  type ComponentProps,
  type ForwardedRef,
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Pressable, type TextInput, View } from "react-native";
import { Text } from "react-native-paper"; // react-native-paperのTextをインポート
import { Menu } from "../Menu";
import { TextField } from "../TextField";

type Option = {
  label: string;
  value: string;
};

type Props<T extends string | number> = {
  options: Option[];
  onChange: (value: T) => void;
  value: T;
  variant?: ComponentProps<typeof TextField>["variant"];
  label?: string;
};

export const Select = forwardRef(function Select<T extends string | number>(
  props: Props<T>,
  ref: ForwardedRef<TextInput>,
) {
  const { options, onChange, value, variant = "filled", label } = props;
  const [visible, setVisible] = useState(false);
  const [menuWidth, setMenuWidth] = useState(0); // メニューの幅を保持するstate
  const anchorRef = useRef<View>(null); // anchorとなるViewのrefに戻す

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (selectedValue: T) => {
    onChange(selectedValue);
    closeMenu();
  };

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? "";

  useLayoutEffect(() => {
    if (anchorRef.current) {
      // Platform.OS !== 'web' の条件を削除
      anchorRef.current.measure((_x, _y, width) => {
        setMenuWidth(width);
      });
    }
  }, []); // visibleが変わったとき（Menuが開かれるとき）に幅を再計算

  // handleLayout関数を削除

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      contentStyle={{ width: menuWidth }} // メニューの幅を指定
      anchor={
        <Pressable onPress={openMenu} ref={anchorRef} style={{ width: "100%" }}>
          <View pointerEvents="none" style={{ width: "100%" }}>
            <TextField
              ref={ref} // 通常のrefをTextFieldに渡す
              label={label}
              variant={variant}
              value={selectedLabel}
              readOnly
            />
          </View>
        </Pressable>
      }
    >
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => handleSelect(option.value as T)}
          style={{ width: "100%", paddingVertical: 12, paddingHorizontal: 16 }} // スタイルを調整
        >
          <Text>{option.label}</Text>
        </Pressable>
      ))}
    </Menu>
  );
});
