import { StyleSheet, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Icon } from "react-native-paper";
import Animated, { runOnJS, useAnimatedStyle } from "react-native-reanimated";
import { useTheme } from "../../hooks";
import type { DragAnimationConfig } from "../animations/dragAnimations";
import type { DragPosition } from "../utils/dragUtils";

/**
 * Props for the DragHandle component.
 * @param {"small" | "medium" | "large"} [size="medium"] - The size of the drag handle, affecting icon and container size.
 * @param {boolean} [disabled=false] - Whether the drag handle is disabled.
 * @param {() => void} [onPress] - Optional press handler if the handle is not used for dragging (e.g., when dragging is disabled).
 * @param {string} [testID] - Test ID for the component.
 * @param {string} [rowId] - The ID of the row associated with this drag handle (required for drag operations).
 * @param {(id: string, position: DragPosition) => void} [onDragStart] - Callback invoked when dragging starts.
 * @param {(position: DragPosition) => void} [onDragUpdate] - Callback invoked when the drag position updates.
 * @param {() => void} [onDragEnd] - Callback invoked when dragging ends.
 * @param {boolean} [isDragging=false] - Whether the associated row is currently being dragged.
 * @param {DragAnimationConfig} [animationConfig] - Shared values for controlling drag animations.
 */
type DragHandleProps = {
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onPress?: () => void;
  testID?: string;
  rowId?: string;
  onDragStart?: (id: string, position: DragPosition) => void;
  onDragUpdate?: (position: DragPosition) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  animationConfig?: DragAnimationConfig;
};

/**
 * A DragHandle component used within table rows to initiate drag and drop operations.
 * It displays a drag icon and uses `react-native-gesture-handler` to detect pan gestures.
 * Applies animations during drag via `DragAnimationConfig`.
 * If drag functionality is disabled or not configured, it can act as a simple pressable icon.
 *
 * @param {DragHandleProps} props - The component's props.
 * @returns {JSX.Element} The DragHandle component.
 */
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

  if (!disabled && rowId && onDragStart) {
    return (
      <GestureDetector gesture={panGesture}>{handleContent}</GestureDetector>
    );
  }

  if (onPress && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {handleContent}
      </TouchableOpacity>
    );
  }

  return handleContent;
};

DragHandle.displayName = "DragHandle";
