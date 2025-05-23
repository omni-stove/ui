import {
  type ComponentProps,
  type ComponentRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, Text, View } from "react-native"; // findNodeHandle を削除
import { Icon, Menu, TouchableRipple } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { useTheme } from "../../hooks";

type Size = "xs" | "s" | "m" | "l" | "xl";
type Variant = "filled" | "outlined" | "elevated" | "tonal";
type Action = ComponentProps<typeof Menu.Item>;

type Props = {
  size?: Size;
  variant?: Variant;
  onPress: () => void;
  actions: Action[];
  label?: string;
  icon?: IconSource;
};

export const SplitButton = forwardRef<ComponentRef<typeof View>, Props>(
  ({ actions, onPress, label, icon, size = "m", variant = "filled" }, ref) => {
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    const rotation = useRef(new Animated.Value(0)).current;
    // anchorRef と menuPosition を削除

    useEffect(() => {
      Animated.timing(rotation, {
        toValue: visible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [visible, rotation]);

    const rotateInterpolate = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
    });

    const sizeStyles = {
      xs: {
        height: 32,
        paddingLeft: 12,
        paddingRight: 14,
        fontSize: 14,
        iconSize: 20,
        iconLabelGap: 4,
        labelDropdownGap: 10,
        dropdownSize: 22,
        dropdownPaddingLeft: 12,
        dropdownPaddingRight: 14,
        dropdownWidth: 22 + 13 + 13,
      },
      s: {
        height: 40,
        paddingLeft: 16,
        paddingRight: 14,
        fontSize: 16,
        iconSize: 20,
        iconLabelGap: 8,
        labelDropdownGap: 12,
        dropdownSize: 22,
        dropdownPaddingLeft: 12,
        dropdownPaddingRight: 14,
        dropdownWidth: 22 + 13 + 13,
      },
      m: {
        height: 56,
        paddingLeft: 24,
        paddingRight: 17,
        fontSize: 18,
        iconSize: 24,
        iconLabelGap: 8,
        labelDropdownGap: 13,
        dropdownSize: 26,
        dropdownPaddingLeft: 13,
        dropdownPaddingRight: 17,
        dropdownWidth: 26 + 15 + 15,
      },
      l: {
        height: 96,
        paddingLeft: 48,
        paddingRight: 32,
        fontSize: 24,
        iconSize: 32,
        iconLabelGap: 12,
        labelDropdownGap: 48,
        dropdownSize: 38,
        dropdownPaddingLeft: 26,
        dropdownPaddingRight: 32,
        dropdownWidth: 38 + 29 + 29,
      },
      xl: {
        height: 136,
        paddingLeft: 64,
        paddingRight: 49,
        fontSize: 32,
        iconSize: 40,
        iconLabelGap: 16,
        labelDropdownGap: 64,
        dropdownSize: 50,
        dropdownPaddingLeft: 37,
        dropdownPaddingRight: 49,
        dropdownWidth: 50 + 43 + 43,
      },
    };

    type VariantStyle = {
      backgroundColor: string;
      borderWidth: number;
      borderColor: string;
      textColor: string;
      dropdownBg: string;
      dropdownText: string;
      elevation?: number;
    };
    const variantStyles: Record<Variant, VariantStyle> = {
      filled: {
        backgroundColor: theme.colors.primary,
        borderWidth: 0,
        borderColor: "transparent",
        textColor: theme.colors.onPrimary,
        dropdownBg: theme.colors.primary,
        dropdownText: theme.colors.onPrimary,
      },
      outlined: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        textColor: theme.colors.onSurfaceVariant,
        dropdownBg: "transparent",
        dropdownText: theme.colors.onSurfaceVariant,
      },
      elevated: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderWidth: 0,
        borderColor: "transparent",
        textColor: theme.colors.primary,
        dropdownBg: theme.colors.surfaceContainerLow,
        dropdownText: theme.colors.primary,
        elevation: 2,
      },
      tonal: {
        backgroundColor: theme.colors.secondaryContainer,
        borderWidth: 0,
        borderColor: "transparent",
        textColor: theme.colors.onSecondaryContainer,
        dropdownBg: theme.colors.secondaryContainer,
        dropdownText: theme.colors.onSecondaryContainer,
      },
    };
    const vStyle = variantStyles[variant];

    // handleDropdownPress を削除

    return (
      <View ref={ref} style={{ flexDirection: "row", alignItems: "center" }}>
        {/* メインボタン */}
        <TouchableRipple
          onPress={onPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderTopLeftRadius: sizeStyles[size].height / 2,
            borderBottomLeftRadius: sizeStyles[size].height / 2,
            height: sizeStyles[size].height,
            paddingLeft: sizeStyles[size].paddingLeft,
            paddingRight: sizeStyles[size].paddingRight,
            backgroundColor: vStyle.backgroundColor,
            borderWidth: vStyle.borderWidth,
            borderColor: vStyle.borderColor,
            ...(vStyle.elevation && { elevation: vStyle.elevation }),
          }}
          rippleColor={theme.colors.onPrimaryContainer}
          borderless={true}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {icon && (
              <View style={{ marginRight: sizeStyles[size].iconLabelGap }}>
                <Icon
                  source={icon}
                  size={sizeStyles[size].iconSize}
                  color={vStyle.textColor}
                />
              </View>
            )}
            {label && (
              <Text
                style={{
                  color: vStyle.textColor,
                  fontSize: sizeStyles[size].fontSize,
                }}
              >
                {label}
              </Text>
            )}
          </View>
        </TouchableRipple>
        {/* ダミーアンカーを削除 */}
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <TouchableRipple
              // ref={anchorRef} を削除
              onPress={() => setVisible(true)} // handleDropdownPress から元に戻す
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderTopRightRadius: visible
                  ? Math.min(
                      sizeStyles[size].dropdownWidth,
                      sizeStyles[size].height,
                    ) / 2
                  : sizeStyles[size].height / 2,
                borderBottomRightRadius: visible
                  ? Math.min(
                      sizeStyles[size].dropdownWidth,
                      sizeStyles[size].height,
                    ) / 2
                  : sizeStyles[size].height / 2,
                borderBottomLeftRadius: visible
                  ? Math.min(
                      sizeStyles[size].dropdownWidth,
                      sizeStyles[size].height,
                    ) / 2
                  : 0,
                borderTopLeftRadius: visible
                  ? Math.min(
                      sizeStyles[size].dropdownWidth,
                      sizeStyles[size].height,
                    ) / 2
                  : 0,
                backgroundColor: vStyle.dropdownBg,
                borderWidth: vStyle.borderWidth,
                borderColor: vStyle.borderColor,
                height: sizeStyles[size].height,
                width: sizeStyles[size].dropdownWidth,
                marginLeft: 1,
                ...(vStyle.elevation && { elevation: vStyle.elevation }),
                paddingLeft: 0,
                paddingRight: 0,
              }}
              rippleColor={theme.colors.onPrimaryContainer}
              borderless={true}
            >
              <Animated.View
                style={{ transform: [{ rotate: rotateInterpolate }] }}
              >
                <Icon
                  source="chevron-down"
                  color={vStyle.dropdownText}
                  size={sizeStyles[size].iconSize}
                />
              </Animated.View>
            </TouchableRipple>
          }
          style={{ marginLeft: -sizeStyles[size].dropdownWidth }} // Menu の style を元に戻す
        >
          {actions.map((action) => (
            <Menu.Item
              key={String(action.title)}
              onPress={(e) => {
                action.onPress?.(e);
                setVisible(false);
              }}
              title={action.title}
            />
          ))}
        </Menu>
      </View>
    );
  },
);
