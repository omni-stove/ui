import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useTheme } from "../../../hooks";
import {
  convertFromEnhancedSorting,
  convertFromEnhancedColumnFilters,
  convertFromEnhancedVisibility,
  convertToEnhancedSorting,
  convertToEnhancedColumnFilters,
  convertToEnhancedVisibility,
} from "../types";
import type { EnhancedDataTableProps, DataWithId } from "../types";

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
