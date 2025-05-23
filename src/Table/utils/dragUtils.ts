export type DragPosition = {
  x: number;
  y: number;
};

export type DropZone = {
  id: string;
  position: "before" | "after";
  bounds: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
};

/**
 * 指定された座標がドロップゾーン内にあるかチェック
 */
export const isInDropZone = (
  position: DragPosition,
  dropZone: DropZone,
): boolean => {
  const { x, y } = position;
  const { bounds } = dropZone;

  return (
    x >= bounds.left &&
    x <= bounds.right &&
    y >= bounds.top &&
    y <= bounds.bottom
  );
};

/**
 * 最も近いドロップゾーンを見つける
 */
export const findClosestDropZone = (
  position: DragPosition,
  dropZones: DropZone[],
): DropZone | null => {
  let closestZone: DropZone | null = null;
  let minDistance = Number.POSITIVE_INFINITY;

  for (const zone of dropZones) {
    if (isInDropZone(position, zone)) {
      return zone;
    }

    // ドロップゾーンの中心点との距離を計算
    const centerX = (zone.bounds.left + zone.bounds.right) / 2;
    const centerY = (zone.bounds.top + zone.bounds.bottom) / 2;
    const distance = Math.sqrt(
      (position.x - centerX) ** 2 + (position.y - centerY) ** 2,
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestZone = zone;
    }
  }

  return closestZone;
};

/**
 * 配列内の要素を移動
 */
export const moveArrayItem = <T>(
  array: T[],
  fromIndex: number,
  toIndex: number,
): T[] => {
  const newArray = [...array];
  const [movedItem] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, movedItem);
  return newArray;
};

/**
 * ハプティックフィードバックを実行（プレースホルダー）
 */
export const triggerHapticFeedback = async (
  type: "light" | "medium" | "heavy" = "medium",
) => {
  // TODO: expo-hapticsを追加した際に実装
  console.log(`Haptic feedback: ${type}`);
};

/**
 * ドラッグ中の要素のZ-indexを計算
 */
export const getDragZIndex = (isDragging: boolean): number => {
  return isDragging ? 1000 : 1;
};

/**
 * ドロップゾーンの境界を計算
 */
export const calculateDropZoneBounds = (
  elementLayout: { x: number; y: number; width: number; height: number },
  position: "before" | "after",
  orientation: "horizontal" | "vertical" = "vertical",
): DropZone["bounds"] => {
  const { x, y, width, height } = elementLayout;
  const dropZoneThickness = 4; // ドロップゾーンの厚さ

  if (orientation === "vertical") {
    // 行のドラッグ用（縦方向）
    if (position === "before") {
      return {
        top: y - dropZoneThickness,
        bottom: y + dropZoneThickness,
        left: x,
        right: x + width,
      };
    }
    return {
      top: y + height - dropZoneThickness,
      bottom: y + height + dropZoneThickness,
      left: x,
      right: x + width,
    };
  }
  // 列のドラッグ用（横方向）
  if (position === "before") {
    return {
      top: y,
      bottom: y + height,
      left: x - dropZoneThickness,
      right: x + dropZoneThickness,
    };
  }
  return {
    top: y,
    bottom: y + height,
    left: x + width - dropZoneThickness,
    right: x + width + dropZoneThickness,
  };
};
