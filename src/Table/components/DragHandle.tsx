import { StyleSheet, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle } from "react-native-reanimated";
import { Icon } from "react-native-paper";
import { useTheme } from "../../hooks";
import type { DragPosition } from "../utils/dragUtils";
import type { DragAnimationConfig } from "../animations/dragAnimations";

type DragHandleProps = {
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onPress?: () => void;
  testID?: string;
  // ドラッグ関連のプロパティを追加
  rowId?: string;
  onDragStart?: (id: string, position: DragPosition) => void;
  onDragUpdate?: (position: DragPosition) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  animationConfig?: DragAnimationConfig;
};

export const DragHandle = ({
  size = "medium",
  disabled = false,
  onPress,
  testID,
  rowId,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  isDragging = false,
  animationConfig,
}: DragHandleProps) => {
  const theme = useTheme();

  const iconSize = size === "small" ? 16 : size === "large" ? 28 : 20;
  const containerSize = size === "small" ? 32 : size === "large" ? 48 : 40;

  // アニメーションスタイル
  const animatedStyle = useAnimatedStyle(() => {
    if (!animationConfig || !isDragging) {
      return {};
    }
    return {
      transform: [
        { translateX: animationConfig.translateX.value },
        { translateY: animationConfig.translateY.value },
        { scale: animationConfig.scale.value },
      ],
      opacity: animationConfig.opacity.value,
      zIndex: animationConfig.zIndex.value,
    };
  });

  // ドラッグジェスチャーを作成
  const panGesture = Gesture.Pan()
    .onStart((event) => {
      if (disabled || !rowId || !onDragStart) return;

      const position: DragPosition = {
        x: event.absoluteX,
        y: event.absoluteY,
      };

      runOnJS(onDragStart)(rowId, position);
    })
    .onUpdate((event) => {
      if (disabled || !isDragging || !onDragUpdate) return;

      const position: DragPosition = {
        x: event.absoluteX,
        y: event.absoluteY,
      };

      runOnJS(onDragUpdate)(position);
    })
    .onEnd(() => {
      if (disabled || !isDragging || !onDragEnd) return;
      runOnJS(onDragEnd)();
    })
    .onFinalize(() => {
      if (disabled || !isDragging || !onDragEnd) return;
      runOnJS(onDragEnd)();
    })
    .enabled(!disabled && !!rowId && !!onDragStart);

  const styles = StyleSheet.create({
    container: {
      width: containerSize,
      height: containerSize,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      opacity: disabled ? 0.3 : 1,
      backgroundColor: isDragging ? `${theme.colors.primary}20` : "transparent",
    },
    icon: {
      color: disabled ? theme.colors.onSurfaceVariant : theme.colors.onSurface,
    },
  });

  const handleContent = (
    <Animated.View style={[styles.container, animatedStyle]} testID={testID}>
      <Icon
        source="drag-horizontal-variant"
        size={iconSize}
        color={styles.icon.color}
      />
    </Animated.View>
  );

  // ドラッグ機能が有効な場合はGestureDetectorでラップ
  if (!disabled && rowId && onDragStart) {
    return (
      <GestureDetector gesture={panGesture}>{handleContent}</GestureDetector>
    );
  }

  // ドラッグ機能が無効でonPressがある場合はTouchableOpacityでラップ
  if (onPress && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {handleContent}
      </TouchableOpacity>
    );
  }

  // それ以外は通常のビューを返す
  return handleContent;
};

DragHandle.displayName = "DragHandle";
