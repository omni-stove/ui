import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import type { z } from "zod";

/**
 * Represents the sorting state for the table, using type-safe keys of the data type `T`.
 * Each object in the array defines a column to sort by and the sort direction.
 * @template T - The type of the data in the table, must include an `id`.
 */
export type EnhancedSortingState<T extends DataWithId> = {
  id: keyof T;
  desc: boolean;
}[];

/**
 * Represents the column filter state for the table, using type-safe keys of the data type `T`.
 * Each object in the array defines a column to filter and the filter value.
 * @template T - The type of the data in the table, must include an `id`.
 */
export type EnhancedColumnFiltersState<T extends DataWithId> = {
  id: keyof T;
  value: unknown;
}[];

/**
 * Represents the column visibility state for the table, using type-safe keys of the data type `T`.
 * It's a partial record where keys are column IDs (keys of `T`) and values are booleans indicating visibility.
 * @template T - The type of the data in the table, must include an `id`.
 */
export type EnhancedVisibilityState<T extends DataWithId> = Partial<
  Record<keyof T, boolean>
>;

/**
 * Converts `@tanstack/react-table`'s `SortingState` to the type-safe `EnhancedSortingState`.
 * @template T - The type of the data in the table.
 * @param {SortingState} sorting - The sorting state from `@tanstack/react-table`.
 * @returns {EnhancedSortingState<T>} The type-safe sorting state.
 */
export const convertToEnhancedSorting = <T extends DataWithId>(
  sorting: SortingState,
): EnhancedSortingState<T> => {
  return sorting as EnhancedSortingState<T>;
};

/**
 * Converts the type-safe `EnhancedSortingState` back to `@tanstack/react-table`'s `SortingState`.
 * @template T - The type of the data in the table.
 * @param {EnhancedSortingState<T>} sorting - The type-safe sorting state.
 * @returns {SortingState} The sorting state compatible with `@tanstack/react-table`.
 */
export const convertFromEnhancedSorting = <T extends DataWithId>(
  sorting: EnhancedSortingState<T>,
): SortingState => {
  return sorting as SortingState;
};

/**
 * Converts `@tanstack/react-table`'s `ColumnFiltersState` to the type-safe `EnhancedColumnFiltersState`.
 * @template T - The type of the data in the table.
 * @param {ColumnFiltersState} filters - The column filter state from `@tanstack/react-table`.
 * @returns {EnhancedColumnFiltersState<T>} The type-safe column filter state.
 */
export const convertToEnhancedColumnFilters = <T extends DataWithId>(
  filters: ColumnFiltersState,
): EnhancedColumnFiltersState<T> => {
  return filters as EnhancedColumnFiltersState<T>;
};

/**
 * Converts the type-safe `EnhancedColumnFiltersState` back to `@tanstack/react-table`'s `ColumnFiltersState`.
 * @template T - The type of the data in the table.
 * @param {EnhancedColumnFiltersState<T>} filters - The type-safe column filter state.
 * @returns {ColumnFiltersState} The column filter state compatible with `@tanstack/react-table`.
 */
export const convertFromEnhancedColumnFilters = <T extends DataWithId>(
  filters: EnhancedColumnFiltersState<T>,
): ColumnFiltersState => {
  return filters as ColumnFiltersState;
};

/**
 * Converts `@tanstack/react-table`'s `VisibilityState` to the type-safe `EnhancedVisibilityState`.
 * @template T - The type of the data in the table.
 * @param {VisibilityState} visibility - The column visibility state from `@tanstack/react-table`.
 * @returns {EnhancedVisibilityState<T>} The type-safe column visibility state.
 */
export const convertToEnhancedVisibility = <T extends DataWithId>(
  visibility: VisibilityState,
): EnhancedVisibilityState<T> => {
  return visibility as EnhancedVisibilityState<T>;
};

/**
 * Converts the type-safe `EnhancedVisibilityState` back to `@tanstack/react-table`'s `VisibilityState`.
 * @template T - The type of the data in the table.
 * @param {EnhancedVisibilityState<T>} visibility - The type-safe column visibility state.
 * @returns {VisibilityState} The column visibility state compatible with `@tanstack/react-table`.
 */
export const convertFromEnhancedVisibility = <T extends DataWithId>(
  visibility: EnhancedVisibilityState<T>,
): VisibilityState => {
  return visibility as VisibilityState;
};

/**
 * Configuration for CSV export functionality.
 * @template T - The type of the data in the table.
 * @param {boolean} enabled - Whether CSV export is enabled.
 * @param {string} [filename] - The desired filename for the exported CSV (without extension).
 * @param {z.ZodSchema<T>} schema - Zod schema for data validation before export.
 * @param {object[]} [columns] - Optional array to define specific columns for export, their headers, and formatters.
 * @param {keyof T} columns.key - The key of the data field to export.
 * @param {string} columns.header - The header text for this column in the CSV.
 * @param {(value: unknown) => string} [columns.formatter] - Optional function to format the value for CSV output.
 * @param {number} [maxRows] - Maximum number of rows to export.
 */
export type CsvExportConfig<T extends DataWithId> = {
  enabled: boolean;
  filename?: string;
  schema: z.ZodSchema<T>;
  columns?: {
    key: keyof T;
    header: string;
    formatter?: (value: unknown) => string;
  }[];
  maxRows?: number;
};

/**
 * Configuration for drag and drop functionality within the table.
 * @param {boolean} [enableRowDrag] - Whether row dragging is enabled.
 * @param {boolean} [enableColumnDrag] - Whether column dragging is enabled.
 * @param {boolean} [autoDisableOnSort] - Whether to automatically disable dragging when sorting is active.
 * @param {boolean} [autoDisableOnFilter] - Whether to automatically disable dragging when filtering is active.
 */
export type DragDropConfig = {
  enableRowDrag?: boolean;
  enableColumnDrag?: boolean;
  autoDisableOnSort?: boolean;
  autoDisableOnFilter?: boolean;
};

/**
 * Parameters passed to the `onRowDragEnd` callback.
 * @param {string} draggedId - The ID of the row that was dragged.
 * @param {string} targetId - The ID of the row over which the dragged row was dropped.
 * @param {"before" | "after"} position - The position relative to the target row where the dragged row was dropped.
 */
export type RowDragEndParams = {
  draggedId: string;
  targetId: string;
  position: "before" | "after";
};

/**
 * Parameters passed to the `onColumnDragEnd` callback.
 * @param {string} draggedColumnId - The ID of the column that was dragged.
 * @param {string} targetColumnId - The ID of the column over which the dragged column was dropped.
 * @param {"before" | "after"} position - The position relative to the target column where the dragged column was dropped.
 */
export type ColumnDragEndParams = {
  draggedColumnId: string;
  targetColumnId: string;
  position: "before" | "after";
};

/**
 * Parameters for the CSV export function.
 * @param {SortingState} sorting - The current sorting state of the table.
 * @param {ColumnFiltersState} filters - The current column filter state of the table.
 * @param {Set<string>} [selectedIds] - A set of IDs of the currently selected rows.
 * @param {"all" | "filtered" | "selected"} exportType - Specifies which set of data to export.
 */
export type CsvExportParams = {
  sorting: SortingState;
  filters: ColumnFiltersState;
  selectedIds?: Set<string>;
  exportType: "all" | "filtered" | "selected";
};

/**
 * Represents a generic ID type, can be a string or a number.
 */
type Id = string | number;

/**
 * Base type for data used in the `Table` component, requiring an `id` property.
 * @param {Id} id - A unique identifier for the data item.
 */
export type DataWithId = { id: Id };

/**
 * Props for the `Table` component.
 * This is an enhanced version of DataTable props, integrating features from `@tanstack/react-table`.
 *
 * @template T - The type of the data for each row, must extend `DataWithId`.
 * @param {T[]} data - The array of data to display in the table.
 * @param {ColumnDef<T, unknown>[]} columns - Column definitions for the table, using `@tanstack/react-table`'s `ColumnDef` type.
 * @param {EnhancedSortingState<T>} [sorting] - Controlled sorting state.
 * @param {PaginationState} [pagination] - Controlled pagination state.
 * @param {EnhancedColumnFiltersState<T>} [columnFilters] - Controlled column filter state.
 * @param {Set<string>} [selectedIds] - Controlled set of selected row IDs.
 * @param {EnhancedVisibilityState<T>} [columnVisibility] - Controlled column visibility state.
 * @param {string} [globalFilter] - Controlled global filter (search) string.
 * @param {(sorting: EnhancedSortingState<T>) => void} [onSortingChange] - Callback for when sorting state changes.
 * @param {(pagination: PaginationState) => void} [onPaginationChange] - Callback for when pagination state changes.
 * @param {(filters: EnhancedColumnFiltersState<T>) => void} [onColumnFiltersChange] - Callback for when column filter state changes.
 * @param {(selectedIds: Set<string>) => void} [onSelectionChange] - Callback for when row selection changes.
 * @param {(visibility: EnhancedVisibilityState<T>) => void} [onColumnVisibilityChange] - Callback for when column visibility changes.
 * @param {(value: string) => void} [onGlobalFilterChange] - Callback for when the global filter string changes.
 * @param {(value: string) => void} [onSearch] - Callback specifically for the search input submission.
 * @param {(params: RowDragEndParams) => void} [onRowDragEnd] - Callback for when a row drag operation ends.
 * @param {(params: ColumnDragEndParams) => void} [onColumnDragEnd] - Callback for when a column drag operation ends.
 * @param {CsvExportConfig<T>} [csvExport] - Configuration for CSV export functionality.
 * @param {(params: CsvExportParams) => Promise<T[]>} [onCsvExport] - Callback to handle the actual CSV export process.
 * @param {boolean} [loading=false] - Whether the table is in a loading state.
 * @param {number} [totalCount] - Total number of items in the dataset (for manual pagination).
 * @param {boolean} [striped=true] - Whether to apply striped styling to rows.
 * @param {string} [globalFilterPlaceholder="検索..."] - Placeholder text for the global search input.
 * @param {DragDropConfig} [dragDrop] - Configuration for drag and drop functionality.
 */
export type EnhancedDataTableProps<T extends DataWithId> = {
  // データ
  data: T[];
  columns: ColumnDef<T, unknown>[];

  // 状態（呼び出し側で管理）
  sorting?: EnhancedSortingState<T>;
  pagination?: PaginationState;
  columnFilters?: EnhancedColumnFiltersState<T>;
  selectedIds?: Set<string>;
  columnVisibility?: EnhancedVisibilityState<T>;
  globalFilter?: string;

  // 状態変更ハンドラ
  onSortingChange?: (sorting: EnhancedSortingState<T>) => void;
  onPaginationChange?: (pagination: PaginationState) => void;
  onColumnFiltersChange?: (filters: EnhancedColumnFiltersState<T>) => void;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  onColumnVisibilityChange?: (visibility: EnhancedVisibilityState<T>) => void;
  onGlobalFilterChange?: (value: string) => void;
  onSearch?: (value: string) => void;

  // DnDハンドラ
  onRowDragEnd?: (params: RowDragEndParams) => void;
  onColumnDragEnd?: (params: ColumnDragEndParams) => void;

  // CSVエクスポート
  csvExport?: CsvExportConfig<T>;
  onCsvExport?: (params: CsvExportParams) => Promise<T[]>;

  // UI状態
  loading?: boolean;
  totalCount?: number;

  // 見た目設定
  striped?: boolean; // デフォルト true
  globalFilterPlaceholder?: string;

  // DnD設定
  dragDrop?: DragDropConfig;
};
