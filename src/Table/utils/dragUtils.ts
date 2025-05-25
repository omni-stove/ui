/**
 * Represents a 2D position (x, y coordinates).
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 */
export type DragPosition = {
  x: number;
  y: number;
};

/**
 * Represents a droppable area in the table.
 * @param {string} id - A unique identifier for the drop zone (typically the ID of the target row/column).
 * @param {"before" | "after"} position - Indicates if the drop zone is before or after the target element.
 * @param {object} bounds - The screen coordinates and dimensions of the drop zone.
 * @param {number} bounds.top - The top y-coordinate.
 * @param {number} bounds.bottom - The bottom y-coordinate.
 * @param {number} bounds.left - The left x-coordinate.
 * @param {number} bounds.right - The right x-coordinate.
 */
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
 * Checks if a given screen position is within the bounds of a drop zone.
 * @param {DragPosition} position - The current drag position (x, y).
 * @param {DropZone} dropZone - The drop zone to check against.
 * @returns {boolean} True if the position is inside the drop zone, false otherwise.
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
 * Finds the closest drop zone to a given screen position from a list of available drop zones.
 * If the position is directly inside a drop zone, that zone is returned immediately.
 * Otherwise, it calculates the distance to the center of each zone and returns the nearest one.
 *
 * @param {DragPosition} position - The current drag position (x, y).
 * @param {DropZone[]} dropZones - An array of available drop zones.
 * @returns {DropZone | null} The closest drop zone, or null if no drop zones are provided.
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
 * Moves an item within an array from a specified index to another.
 * Returns a new array with the item moved, without modifying the original array.
 *
 * @template T - The type of items in the array.
 * @param {T[]} array - The original array.
 * @param {number} fromIndex - The index of the item to move.
 * @param {number} toIndex - The index to move the item to.
 * @returns {T[]} A new array with the item moved.
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
 * Triggers haptic feedback.
 * (Placeholder: Actual implementation depends on a haptic feedback library like `expo-haptics`).
 *
 * @param {"light" | "medium" | "heavy"} [type="medium"] - The intensity of the haptic feedback.
 */
export const triggerHapticFeedback = async (
  type: "light" | "medium" | "heavy" = "medium",
) => {
  // TODO: expo-hapticsを追加した際に実装
  console.log(`Haptic feedback: ${type}`);
};

/**
 * Calculates the z-index for a draggable element.
 * Returns a higher z-index if the element is currently being dragged.
 *
 * @param {boolean} isDragging - Whether the element is currently being dragged.
 * @returns {number} The calculated z-index.
 */
export const getDragZIndex = (isDragging: boolean): number => {
  return isDragging ? 1000 : 1;
};

/**
 * Calculates the screen bounds for a drop zone relative to a target element.
 * The drop zone can be positioned "before" or "after" the element,
 * and can be oriented "horizontal" (for columns) or "vertical" (for rows).
 *
 * @param {object} elementLayout - The layout of the target element ({ x, y, width, height }).
 * @param {"before" | "after"} position - Whether the drop zone is before or after the element.
 * @param {"horizontal" | "vertical"} [orientation="vertical"] - The orientation of the drop zone.
 * @returns {DropZone["bounds"]} The calculated bounds of the drop zone.
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
