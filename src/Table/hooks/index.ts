import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useTheme } from "../../hooks";
import {
  convertFromEnhancedColumnFilters,
  convertFromEnhancedSorting,
  convertFromEnhancedVisibility,
  convertToEnhancedColumnFilters,
  convertToEnhancedSorting,
  convertToEnhancedVisibility,
} from "../types";
import type { DataWithId, EnhancedDataTableProps } from "../types";

/**
 * Custom hook for managing the state and logic of the `Table` component.
 * It integrates `@tanstack/react-table` with the features and props of the `EnhancedDataTableProps`.
 * This includes handling sorting, pagination, column filters, row selection, column visibility,
 * and global filtering (search). It also manages local UI state for search visibility
 * and column visibility menu.
 *
 * @template T - The type of the data for each row, extending `DataWithId`.
 * @param {EnhancedDataTableProps<T>} props - The props passed to the `Table` component.
 * @returns {object} An object containing:
 *  - `searchValue`: Current value of the search input.
 *  - `setSearchValue`: Function to update the search value.
 *  - `searchVisible`: Boolean indicating if the search input is visible.
 *  - `setSearchVisible`: Function to toggle search input visibility.
 *  - `columnVisibilityMenuVisible`: Boolean indicating if the column visibility menu is open.
 *  - `setColumnVisibilityMenuVisible`: Function to toggle column visibility menu.
 *  - `theme`: The current theme object from `useTheme`.
 *  - `table`: The table instance from `useReactTable`.
 *  - `enableSorting`: Boolean indicating if sorting is enabled.
 *  - `enableFiltering`: Boolean indicating if column filtering is enabled.
 *  - `enablePagination`: Boolean indicating if pagination is enabled.
 *  - `enableRowSelection`: Boolean indicating if row selection is enabled.
 *  - `enableRowDrag`: Boolean indicating if row dragging is enabled.
 *  - `enableColumnDrag`: Boolean indicating if column dragging is enabled.
 * @see {@link Table}
 * @see {@link EnhancedDataTableProps}
 * @see {@link https://tanstack.com/table/v8|TanStack Table v8}
 */
export const useTable = <T extends DataWithId>(
  props: EnhancedDataTableProps<T>,
) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [columnVisibilityMenuVisible, setColumnVisibilityMenuVisible] =
    useState(false);

  const theme = useTheme();

  const {
    data,
    columns,
    sorting = [],
    pagination = { pageIndex: 0, pageSize: 10 },
    columnFilters = [],
    selectedIds = new Set(),
    columnVisibility = {},
    globalFilter = "",
    onSortingChange,
    onPaginationChange,
    onColumnFiltersChange,
    onSelectionChange,
    onColumnVisibilityChange,
    onGlobalFilterChange,
    onRowDragEnd,
    onColumnDragEnd,
    totalCount,
  } = props;

  // ハンドラの有無で機能を有効化
  const enableSorting = !!onSortingChange;
  const enableFiltering = !!onColumnFiltersChange;
  const enablePagination = !!onPaginationChange;
  const enableRowSelection = !!onSelectionChange;
  const enableRowDrag = !!onRowDragEnd;
  const enableColumnDrag = !!onColumnDragEnd;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: convertFromEnhancedSorting(sorting),
      pagination,
      columnFilters: convertFromEnhancedColumnFilters(columnFilters),
      columnVisibility: convertFromEnhancedVisibility(columnVisibility),
      globalFilter,
      rowSelection: Array.from(selectedIds).reduce(
        (acc, id) => {
          acc[id] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    },
    onSortingChange: onSortingChange
      ? (updater) => {
          const currentSorting = convertFromEnhancedSorting(sorting);
          const newSorting =
            typeof updater === "function" ? updater(currentSorting) : updater;
          onSortingChange(convertToEnhancedSorting<T>(newSorting));
        }
      : undefined,
    onPaginationChange: onPaginationChange
      ? (updater) => {
          const newPagination =
            typeof updater === "function" ? updater(pagination) : updater;
          onPaginationChange(newPagination);
        }
      : undefined,
    onColumnFiltersChange: onColumnFiltersChange
      ? (updater) => {
          const currentFilters =
            convertFromEnhancedColumnFilters(columnFilters);
          const newFilters =
            typeof updater === "function" ? updater(currentFilters) : updater;
          onColumnFiltersChange(convertToEnhancedColumnFilters<T>(newFilters));
        }
      : undefined,
    onColumnVisibilityChange: onColumnVisibilityChange
      ? (updater) => {
          const currentVisibility =
            convertFromEnhancedVisibility(columnVisibility);
          const newVisibility =
            typeof updater === "function"
              ? updater(currentVisibility)
              : updater;
          onColumnVisibilityChange(
            convertToEnhancedVisibility<T>(newVisibility),
          );
        }
      : undefined,
    onGlobalFilterChange: onGlobalFilterChange
      ? (updater) => {
          const newFilter =
            typeof updater === "function" ? updater(globalFilter) : updater;
          onGlobalFilterChange(newFilter);
        }
      : undefined,
    onRowSelectionChange: (updater) => {
      if (onSelectionChange) {
        const newSelection =
          typeof updater === "function"
            ? updater(
                Array.from(selectedIds).reduce(
                  (acc, id) => {
                    acc[id] = true;
                    return acc;
                  },
                  {} as Record<string, boolean>,
                ),
              )
            : updater;

        const newSelectedIds = new Set(
          Object.entries(newSelection)
            .filter(([, selected]) => selected)
            .map(([id]) => id),
        );
        onSelectionChange(newSelectedIds);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    enableSorting,
    enableFilters: enableFiltering,
    enableRowSelection,
    manualPagination: !!totalCount,
    pageCount: totalCount
      ? Math.ceil(totalCount / pagination.pageSize)
      : undefined,
  });

  return {
    searchValue,
    setSearchValue,
    searchVisible,
    setSearchVisible,
    columnVisibilityMenuVisible,
    setColumnVisibilityMenuVisible,
    theme,
    table,
    enableSorting,
    enableFiltering,
    enablePagination,
    enableRowSelection,
    enableRowDrag,
    enableColumnDrag,
  };
};
