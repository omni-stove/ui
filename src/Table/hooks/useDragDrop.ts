import { useCallback, useMemo, useRef, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import type { DragAnimationConfig } from "../animations/dragAnimations";
import {
  animateDropZoneHighlight,
  endDragAnimation,
  startDragAnimation,
  updateDragPosition,
} from "../animations/dragAnimations";
import type {
  ColumnDragEndParams,
  DragDropConfig,
  RowDragEndParams,
} from "../types";
import type { DragPosition, DropZone } from "../utils/dragUtils";
import {
  findClosestDropZone,
  moveArrayItem,
  triggerHapticFeedback,
} from "../utils/dragUtils";

/**
 * Represents the current state of a drag and drop operation.
 * @param {boolean} isDragging - Whether an item is currently being dragged.
 * @param {string | null} draggedId - The ID of the item being dragged.
 * @param {"row" | "column" | null} draggedType - The type of the item being dragged.
 * @param {DragPosition} dragPosition - The current screen coordinates of the dragged item.
 * @param {DropZone | null} activeDropZone - The drop zone currently under the dragged item.
 */
export type DragState = {
  isDragging: boolean;
  draggedId: string | null;
  draggedType: "row" | "column" | null;
  dragPosition: DragPosition;
  activeDropZone: DropZone | null;
};

/**
 * Props for the `useDragDrop` hook.
 * @param {DragDropConfig} [config] - Configuration options for drag and drop behavior (not currently used).
 * @param {(params: RowDragEndParams) => void} [onRowDragEnd] - Callback invoked when a row drag operation ends.
 * @param {(params: ColumnDragEndParams) => void} [onColumnDragEnd] - Callback invoked when a column drag operation ends.
 * @param {boolean} [enableRowDrag=false] - Whether row dragging is enabled.
 * @param {boolean} [enableColumnDrag=false] - Whether column dragging is enabled.
 * @param {boolean} [autoDisableOnSort=true] - Whether to automatically disable dragging when sorting is active.
 * @param {boolean} [autoDisableOnFilter=true] - Whether to automatically disable dragging when filtering is active.
 * @param {boolean} [isSorting=false] - Whether sorting is currently active on the table.
 * @param {boolean} [isFiltering=false] - Whether filtering is currently active on the table.
 */
export type UseDragDropProps = {
  config?: DragDropConfig;
  onRowDragEnd?: (params: RowDragEndParams) => void;
  onColumnDragEnd?: (params: ColumnDragEndParams) => void;
  enableRowDrag?: boolean;
  enableColumnDrag?: boolean;
  autoDisableOnSort?: boolean;
  autoDisableOnFilter?: boolean;
  isSorting?: boolean;
  isFiltering?: boolean;
};

/**
 * Custom hook to manage drag and drop functionality for table rows and columns.
 * It handles the drag state, animations, drop zone detection, and haptic feedback.
 *
 * @param {UseDragDropProps} props - Props to configure the drag and drop behavior.
 * @returns {object} An object containing:
 *  - `dragState`: The current state of the drag operation.
 *  - `isRowDragEnabled`: Boolean indicating if row dragging is currently enabled (considering sorting/filtering).
 *  - `isColumnDragEnabled`: Boolean indicating if column dragging is currently enabled.
 *  - `animationConfig`: Shared values for drag animations.
 *  - `dropZoneOpacity`: Shared value for drop zone highlight opacity.
 *  - `startDrag`: Function to initiate a drag operation.
 *  - `updateDrag`: Function to update the position during a drag.
 *  - `endDrag`: Function to end a drag operation and trigger callbacks.
 *  - `registerDropZone`: Function to register a potential drop zone.
 *  - `unregisterDropZone`: Function to unregister a drop zone.
 *  - `clearDropZones`: Function to clear all registered drop zones.
 *  - `moveItem`: Utility function to move an item within an array.
 */
export const useDragDrop = ({
  onRowDragEnd,
  onColumnDragEnd,
  enableRowDrag = false,
  enableColumnDrag = false,
  autoDisableOnSort = true,
  autoDisableOnFilter = true,
  isSorting = false,
  isFiltering = false,
}: UseDragDropProps) => {
  // ドラッグ状態
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    draggedType: null,
    dragPosition: { x: 0, y: 0 },
    activeDropZone: null,
  });

  // ドロップゾーンの参照
  const dropZonesRef = useRef<DropZone[]>([]);

  // アニメーション用の共有値
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const zIndex = useSharedValue(1);

  const animationConfig: DragAnimationConfig = useMemo(
    () => ({
      scale,
      opacity,
      translateX,
      translateY,
      zIndex,
    }),
    [scale, opacity, translateX, translateY, zIndex],
  );

  // ドロップゾーンハイライト用の共有値
  const dropZoneOpacity = useSharedValue(0);

  // 機能が有効かどうかをチェック
  const isRowDragEnabled =
    enableRowDrag &&
    (!autoDisableOnSort || !isSorting) &&
    (!autoDisableOnFilter || !isFiltering);

  const isColumnDragEnabled =
    enableColumnDrag &&
    (!autoDisableOnSort || !isSorting) &&
    (!autoDisableOnFilter || !isFiltering);

  // ドラッグ開始
  const startDrag = useCallback(
    (id: string, type: "row" | "column", position: DragPosition) => {
      if (type === "row" && !isRowDragEnabled) return;
      if (type === "column" && !isColumnDragEnabled) return;

      setDragState({
        isDragging: true,
        draggedId: id,
        draggedType: type,
        dragPosition: position,
        activeDropZone: null,
      });

      // ドラッグ開始アニメーション
      startDragAnimation(animationConfig, () => {
        triggerHapticFeedback("light");
      });
    },
    [isRowDragEnabled, isColumnDragEnabled, animationConfig],
  );

  // ドラッグ中の位置更新
  const updateDrag = useCallback(
    (position: DragPosition) => {
      if (!dragState.isDragging) return;

      // 位置を更新
      setDragState((prev) => ({
        ...prev,
        dragPosition: position,
      }));

      // アニメーション更新
      updateDragPosition(animationConfig, position.x, position.y);

      // 最も近いドロップゾーンを検索
      const closestDropZone = findClosestDropZone(
        position,
        dropZonesRef.current,
      );

      if (closestDropZone !== dragState.activeDropZone) {
        setDragState((prev) => ({
          ...prev,
          activeDropZone: closestDropZone,
        }));

        // ドロップゾーンハイライトのアニメーション
        animateDropZoneHighlight(dropZoneOpacity, !!closestDropZone);

        if (closestDropZone) {
          triggerHapticFeedback("light");
        }
      }
    },
    [
      dragState.isDragging,
      dragState.activeDropZone,
      animationConfig,
      dropZoneOpacity,
    ],
  );

  // ドラッグ終了
  const endDrag = useCallback(() => {
    if (!dragState.isDragging || !dragState.draggedId) return;

    const { draggedId, draggedType, activeDropZone } = dragState;

    // ドラッグ終了アニメーション
    endDragAnimation(animationConfig, () => {
      // アニメーション完了後にコールバックを実行
      if (activeDropZone) {
        if (draggedType === "row" && onRowDragEnd) {
          onRowDragEnd({
            draggedId,
            targetId: activeDropZone.id,
            position: activeDropZone.position,
          });
        } else if (draggedType === "column" && onColumnDragEnd) {
          onColumnDragEnd({
            draggedColumnId: draggedId,
            targetColumnId: activeDropZone.id,
            position: activeDropZone.position,
          });
        }
        triggerHapticFeedback("medium");
      }
    });

    // ドロップゾーンハイライトを非表示
    animateDropZoneHighlight(dropZoneOpacity, false);

    // 状態をリセット
    setDragState({
      isDragging: false,
      draggedId: null,
      draggedType: null,
      dragPosition: { x: 0, y: 0 },
      activeDropZone: null,
    });
  }, [
    dragState,
    animationConfig,
    onRowDragEnd,
    onColumnDragEnd,
    dropZoneOpacity,
  ]);

  // ドロップゾーンを登録
  const registerDropZone = useCallback((dropZone: DropZone) => {
    dropZonesRef.current = [...dropZonesRef.current, dropZone];
  }, []);

  // ドロップゾーンを削除
  const unregisterDropZone = useCallback((id: string) => {
    dropZonesRef.current = dropZonesRef.current.filter(
      (zone) => zone.id !== id,
    );
  }, []);

  // ドロップゾーンをクリア
  const clearDropZones = useCallback(() => {
    dropZonesRef.current = [];
  }, []);

  // 配列の要素を移動するヘルパー
  const moveItem = useCallback(
    <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
      return moveArrayItem(array, fromIndex, toIndex);
    },
    [],
  );

  return {
    // 状態
    dragState,
    isRowDragEnabled,
    isColumnDragEnabled,
    animationConfig,
    dropZoneOpacity,

    // アクション
    startDrag,
    updateDrag,
    endDrag,
    registerDropZone,
    unregisterDropZone,
    clearDropZones,
    moveItem,
  };
};
