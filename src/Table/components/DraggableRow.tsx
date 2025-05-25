import type { ReactNode } from "react";
import { DataTable } from "react-native-paper";
import type { DragAnimationConfig } from "../animations/dragAnimations";
import type { DragPosition } from "../utils/dragUtils";
import { DragHandle } from "./DragHandle";

/**
 * Props for the DraggableRow component.
 * @param {ReactNode} children - The content of the row (typically `DataTable.Cell` components).
 * @param {string} rowId - A unique identifier for the row.
 * @param {boolean} isDragging - Whether this specific row is currently being dragged.
 * @param {boolean} isDragEnabled - Whether dragging is enabled for this row.
 * @param {DragAnimationConfig} animationConfig - Shared values for controlling drag animations.
 * @param {(id: string, position: DragPosition) => void} onDragStart - Callback invoked when dragging of this row starts.
 * @param {(position: DragPosition) => void} onDragUpdate - Callback invoked when the drag position updates.
 * @param {() => void} onDragEnd - Callback invoked when dragging of this row ends.
 * @param {object} [style] - Custom style for the `DataTable.Row`.
 * @param {boolean} [showDragHandle=true] - Whether to display the drag handle.
 * @param {string} [testID] - Test ID for the row.
 */
type DraggableRowProps = {
  children: ReactNode;
  rowId: string;
  isDragging: boolean;
  isDragEnabled: boolean;
  animationConfig: DragAnimationConfig;
  onDragStart: (id: string, position: DragPosition) => void;
  onDragUpdate: (position: DragPosition) => void;
  onDragEnd: () => void;
  style?: object;
  showDragHandle?: boolean;
  testID?: string;
};

/**
 * A component that wraps a `DataTable.Row` to make it draggable.
 * It includes a `DragHandle` if `isDragEnabled` and `showDragHandle` are true.
 * If dragging is not enabled, it renders a standard `DataTable.Row`.
 *
 * @param {DraggableRowProps} props - The component's props.
 * @returns {JSX.Element} The DraggableRow component.
 * @see {@link DragHandle}
 * @see {@link DataTable.Row}
 */
export const DraggableRow = ({
  children,
  rowId,
  isDragging,
  isDragEnabled,
  animationConfig,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  style,
  showDragHandle = true,
  testID,
}: DraggableRowProps) => {
  if (!isDragEnabled) {
    // ドラッグが無効な場合は通常の行を表示
    return (
      <DataTable.Row style={style} testID={testID}>
        {children}
      </DataTable.Row>
    );
  }

  return (
    <DataTable.Row style={style} testID={testID}>
      {showDragHandle && (
        <DataTable.Cell style={{ flex: 0.3, justifyContent: "center" }}>
          <DragHandle
            size="small"
            disabled={!isDragEnabled} // Should be !isDragEnabled to match parent logic
            testID={`${testID}-drag-handle`}
            rowId={rowId}
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
            onDragEnd={onDragEnd}
            isDragging={isDragging}
            animationConfig={animationConfig}
          />
        </DataTable.Cell>
      )}
      {children}
    </DataTable.Row>
  );
};

DraggableRow.displayName = "DraggableRow";
