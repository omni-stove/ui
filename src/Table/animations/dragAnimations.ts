import {
  type SharedValue,
  runOnJS,
  withSpring,
  withTiming,
} from "react-native-reanimated";

/**
 * Configuration object for drag animations, containing shared values for animated properties.
 * These shared values are manipulated by the animation functions to create visual effects.
 *
 * @param {SharedValue<number>} scale - Shared value for the scale of the dragged item.
 * @param {SharedValue<number>} opacity - Shared value for the opacity of the dragged item.
 * @param {SharedValue<number>} translateX - Shared value for the horizontal translation of the dragged item.
 * @param {SharedValue<number>} translateY - Shared value for the vertical translation of the dragged item.
 * @param {SharedValue<number>} zIndex - Shared value for the z-index of the dragged item.
 */
export type DragAnimationConfig = {
  scale: SharedValue<number>;
  opacity: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  zIndex: SharedValue<number>;
};

/**
 * Animation for the start of a drag operation.
 * Scales up the item, slightly reduces opacity, and increases z-index.
 * This function is a worklet and runs on the UI thread.
 *
 * @param {DragAnimationConfig} config - The shared value configuration for the animation.
 * @param {() => void} [onComplete] - Optional callback executed on the JS thread after the animation setup.
 */
export const startDragAnimation = (
  config: DragAnimationConfig,
  onComplete?: () => void,
) => {
  "worklet";

  config.scale.value = withSpring(1.05, {
    damping: 15,
    stiffness: 150,
  });

  config.opacity.value = withTiming(0.9, {
    duration: 150,
  });

  config.zIndex.value = 1000;

  if (onComplete) {
    runOnJS(onComplete)();
  }
};

/**
 * Updates the position of the dragged item during a drag operation.
 * This function is a worklet and runs on the UI thread.
 *
 * @param {DragAnimationConfig} config - The shared value configuration for the animation.
 * @param {number} x - The new target x-coordinate for the translation.
 * @param {number} y - The new target y-coordinate for the translation.
 */
export const updateDragPosition = (
  config: DragAnimationConfig,
  x: number,
  y: number,
) => {
  "worklet";

  config.translateX.value = x;
  config.translateY.value = y;
};

/**
 * Animation for the end of a drag operation.
 * Resets scale, opacity, translation, and z-index to their default states.
 * This function is a worklet and runs on the UI thread.
 *
 * @param {DragAnimationConfig} config - The shared value configuration for the animation.
 * @param {() => void} [onComplete] - Optional callback executed on the JS thread after the animation completes.
 */
export const endDragAnimation = (
  config: DragAnimationConfig,
  onComplete?: () => void,
) => {
  "worklet";

  config.scale.value = withSpring(1, {
    damping: 15,
    stiffness: 150,
  });

  config.opacity.value = withTiming(1, {
    duration: 150,
  });

  config.translateX.value = withSpring(0, {
    damping: 20,
    stiffness: 200,
  });

  config.translateY.value = withSpring(
    0,
    {
      damping: 20,
      stiffness: 200,
    },
    () => {
      config.zIndex.value = 1;
      if (onComplete) {
        runOnJS(onComplete)();
      }
    },
  );
};

/**
 * Animates the opacity of a drop zone highlight.
 * Used to indicate whether a drop zone is active.
 * This function is a worklet and runs on the UI thread.
 *
 * @param {SharedValue<number>} opacity - The shared value for the drop zone's opacity.
 * @param {boolean} isActive - Whether the drop zone should be highlighted (active).
 */
export const animateDropZoneHighlight = (
  opacity: SharedValue<number>,
  isActive: boolean,
) => {
  "worklet";

  opacity.value = withTiming(isActive ? 0.3 : 0, {
    duration: 200,
  });
};

/**
 * Animation for inserting a new row into the table.
 * Animates the row's height from 0 to a target height (e.g., 60).
 * This function is a worklet and runs on the UI thread.
 *
 * @param {SharedValue<number>} height - The shared value for the row's height.
 * @param {() => void} [onComplete] - Optional callback executed on the JS thread after the animation completes.
 */
export const animateRowInsertion = (
  height: SharedValue<number>,
  onComplete?: () => void,
) => {
  "worklet";

  height.value = 0;
  height.value = withSpring(
    60, // Default row height, consider making this configurable
    {
      damping: 15,
      stiffness: 150,
    },
    () => {
      if (onComplete) {
        runOnJS(onComplete)();
      }
    },
  );
};

/**
 * Animation for deleting a row from the table.
 * Animates the row's opacity and height to 0.
 * This function is a worklet and runs on the UI thread.
 *
 * @param {SharedValue<number>} height - The shared value for the row's height.
 * @param {SharedValue<number>} opacity - The shared value for the row's opacity.
 * @param {() => void} [onComplete] - Optional callback executed on the JS thread after the animation completes.
 */
export const animateRowDeletion = (
  height: SharedValue<number>,
  opacity: SharedValue<number>,
  onComplete?: () => void,
) => {
  "worklet";

  opacity.value = withTiming(0, {
    duration: 200,
  });

  height.value = withTiming(
    0,
    {
      duration: 300,
    },
    () => {
      if (onComplete) {
        runOnJS(onComplete)();
      }
    },
  );
};

/**
 * Animation for resizing a column.
 * Animates the column's width to a target width.
 * This function is a worklet and runs on the UI thread.
 *
 * @param {SharedValue<number>} width - The shared value for the column's width.
 * @param {number} targetWidth - The target width for the column.
 * @param {() => void} [onComplete] - Optional callback executed on the JS thread after the animation completes.
 */
export const animateColumnResize = (
  width: SharedValue<number>,
  targetWidth: number,
  onComplete?: () => void,
) => {
  "worklet";

  width.value = withSpring(
    targetWidth,
    {
      damping: 20,
      stiffness: 200,
    },
    () => {
      if (onComplete) {
        runOnJS(onComplete)();
      }
    },
  );
};

/**
 * Creates a continuous pulsing animation for a placeholder element's opacity.
 * Animates opacity between 0.3 and 0.7 repeatedly.
 * This function is a worklet and runs on the UI thread.
 *
 * @param {SharedValue<number>} opacity - The shared value for the placeholder's opacity.
 */
export const animatePlaceholderPulse = (opacity: SharedValue<number>) => {
  "worklet";

  const pulseAnimation = () => {
    opacity.value = withTiming(
      0.3,
      {
        duration: 800,
      },
      () => {
        opacity.value = withTiming(
          0.7,
          {
            duration: 800,
          },
          pulseAnimation, // Recursive call to loop the animation
        );
      },
    );
  };

  pulseAnimation();
};
