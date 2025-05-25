import {
  type SharedValue,
  runOnJS,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export type DragAnimationConfig = {
  scale: SharedValue<number>;
  opacity: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  zIndex: SharedValue<number>;
};

/**
 * ドラッグ開始時のアニメーション
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
 * ドラッグ中の位置更新アニメーション
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
 * ドラッグ終了時のアニメーション
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
 * ドロップゾーンハイライトのアニメーション
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
 * 行の挿入アニメーション
 */
export const animateRowInsertion = (
  height: SharedValue<number>,
  onComplete?: () => void,
) => {
  "worklet";

  height.value = 0;
  height.value = withSpring(
    60,
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
 * 行の削除アニメーション
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
 * 列の幅変更アニメーション
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
 * プレースホルダーのパルスアニメーション
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
          pulseAnimation,
        );
      },
    );
  };

  pulseAnimation();
};
