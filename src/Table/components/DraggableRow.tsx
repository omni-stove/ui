import type { ReactNode } from "react";
import { DataTable } from "react-native-paper";
import type { DragAnimationConfig } from "../animations/dragAnimations";
import type { DragPosition } from "../utils/dragUtils";
import { DragHandle } from "./DragHandle";

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
            disabled={!isDragEnabled}
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
