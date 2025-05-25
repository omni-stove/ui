import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import type { z } from "zod";

// 型安全なソート状態（Tのキーを使用）
export type EnhancedSortingState<T extends DataWithId> = {
  id: keyof T;
  desc: boolean;
}[];

// 型安全な列フィルタ状態（Tのキーを使用）
export type EnhancedColumnFiltersState<T extends DataWithId> = {
  id: keyof T;
  value: unknown;
}[];

// 型安全な列表示状態（Tのキーを使用）
export type EnhancedVisibilityState<T extends DataWithId> = Partial<
  Record<keyof T, boolean>
>;

// 型変換ユーティリティ
export const convertToEnhancedSorting = <T extends DataWithId>(
  sorting: SortingState,
): EnhancedSortingState<T> => {
  return sorting as EnhancedSortingState<T>;
};

export const convertFromEnhancedSorting = <T extends DataWithId>(
  sorting: EnhancedSortingState<T>,
): SortingState => {
  return sorting as SortingState;
};

export const convertToEnhancedColumnFilters = <T extends DataWithId>(
  filters: ColumnFiltersState,
): EnhancedColumnFiltersState<T> => {
  return filters as EnhancedColumnFiltersState<T>;
};

export const convertFromEnhancedColumnFilters = <T extends DataWithId>(
  filters: EnhancedColumnFiltersState<T>,
): ColumnFiltersState => {
  return filters as ColumnFiltersState;
};

export const convertToEnhancedVisibility = <T extends DataWithId>(
  visibility: VisibilityState,
): EnhancedVisibilityState<T> => {
  return visibility as EnhancedVisibilityState<T>;
};

export const convertFromEnhancedVisibility = <T extends DataWithId>(
  visibility: EnhancedVisibilityState<T>,
): VisibilityState => {
  return visibility as VisibilityState;
};

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

export type DragDropConfig = {
  enableRowDrag?: boolean;
  enableColumnDrag?: boolean;
  autoDisableOnSort?: boolean;
  autoDisableOnFilter?: boolean;
};

export type RowDragEndParams = {
  draggedId: string;
  targetId: string;
  position: "before" | "after";
};

export type ColumnDragEndParams = {
  draggedColumnId: string;
  targetColumnId: string;
  position: "before" | "after";
};

export type CsvExportParams = {
  sorting: SortingState;
  filters: ColumnFiltersState;
  selectedIds?: Set<string>;
  exportType: "all" | "filtered" | "selected";
};

type Id = string | number;
export type DataWithId = { id: Id };

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
