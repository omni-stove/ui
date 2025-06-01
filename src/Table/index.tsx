import { type ColumnDef, flexRender } from "@tanstack/react-table";
import type { Ref } from "react";
import { forwardRef, useMemo } from "react";
import { View } from "react-native";
import { DataTable, Menu, Searchbar } from "react-native-paper";
import { Checkbox } from "../Checkbox";
import { IconButton } from "../IconButton";
import { DraggableRow } from "./components/DraggableRow";
import { useTable } from "./hooks";
import { useDragDrop } from "./hooks/useDragDrop";
import { createTableStyles } from "./styles";
import type { DataWithId, EnhancedDataTableProps } from "./types";
import type { DragPosition } from "./utils/dragUtils";

/**
 * An enhanced DataTable component built on top of `@tanstack/react-table` and `react-native-paper`.
 * It supports features like sorting, global filtering (search), column visibility toggling,
 * pagination, row selection, and row drag-and-drop.
 *
 * @template T - The type of the data for each row, which must extend `DataWithId` (i.e., include an `id` property).
 * @param {EnhancedDataTableProps<T>} props - The component's props.
 * @param {Ref<View>} ref - Ref for the main container View.
 * @returns {JSX.Element} The Table component.
 * @see {@link https://tanstack.com/table/v8|TanStack Table v8}
 * @see {@link https://callstack.github.io/react-native-paper/docs/components/DataTable/|React Native Paper DataTable}
 * @see {@link EnhancedDataTableProps}
 * @see {@link DraggableRow}
 * @see {@link Checkbox}
 */
export const Table = forwardRef(
  <T extends DataWithId>(props: EnhancedDataTableProps<T>, ref: Ref<View>) => {
    const {
      columns: originalColumns,
      onSearch,
      onColumnVisibilityChange,
      globalFilterPlaceholder = "検索...",
      loading = false,
      striped = true,
      pagination = { pageIndex: 0, pageSize: 10 },
      totalCount,
      onRowDragEnd,
      onColumnDragEnd,
      sorting = [],
      columnFilters = [],
    } = props;

    const columns = useMemo(() => {
      const enableRowSelection = !!props.onSelectionChange;
      const enableRowDrag = !!onRowDragEnd;
      let newColumns = [...originalColumns];

      if (enableRowDrag) {
        const dragColumn: ColumnDef<T, unknown> = {
          id: "_drag",
          header: () => null,
          cell: () => null,
          size: 40,
        };
        newColumns = [dragColumn, ...newColumns];
      }

      if (enableRowSelection) {
        const selectionColumn: ColumnDef<T, unknown> = {
          id: "_select",
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllRowsSelected()
                  ? true
                  : table.getIsSomeRowsSelected()
                    ? "indeterminate"
                    : false
              }
              onChangeCheck={() => table.toggleAllRowsSelected()}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onChangeCheck={() => row.toggleSelected()}
              disabled={!row.getCanSelect()}
            />
          ),
          size: 50,
        };
        newColumns = [selectionColumn, ...newColumns];
      }

      return newColumns;
    }, [originalColumns, props.onSelectionChange, onRowDragEnd]);

    const {
      searchValue,
      setSearchValue,
      searchVisible,
      setSearchVisible,
      columnVisibilityMenuVisible,
      setColumnVisibilityMenuVisible,
      theme,
      table,
      enableSorting,
      enablePagination,
      enableRowSelection,
      enableRowDrag,
    } = useTable({ ...props, columns });

    const {
      dragState,
      isRowDragEnabled,
      animationConfig,
      startDrag,
      updateDrag,
      endDrag,
    } = useDragDrop({
      enableRowDrag,
      enableColumnDrag: !!onColumnDragEnd,
      onRowDragEnd,
      onColumnDragEnd,
      isSorting: sorting.length > 0,
      isFiltering: columnFilters.length > 0,
    });

    const styles = useMemo(() => createTableStyles(theme), [theme]);

    return (
      <View ref={ref} style={styles.container}>
        {/* アクションボタン（検索・カラム表示切り替え） */}
        {(onSearch || onColumnVisibilityChange) && (
          <View style={styles.actionButtonsContainer}>
            {/* 検索トグルボタン */}
            {onSearch && (
              <IconButton
                icon="magnify"
                size="small"
                variant="standard"
                onPress={() => setSearchVisible(!searchVisible)}
                accessibilityLabel="検索表示切り替え"
              />
            )}

            {/* カラム表示切り替えボタン */}
            {onColumnVisibilityChange && (
              <Menu
                visible={columnVisibilityMenuVisible}
                onDismiss={() => setColumnVisibilityMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="view-column"
                    size="small"
                    variant="standard"
                    onPress={() =>
                      setColumnVisibilityMenuVisible(
                        !columnVisibilityMenuVisible,
                      )
                    }
                    accessibilityLabel="カラム表示設定"
                  />
                }
              >
                {table.getAllLeafColumns().map((column) => {
                  if (column.id === "_select") return null;

                  const columnName =
                    typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id;

                  return (
                    <Menu.Item
                      key={column.id}
                      onPress={() => column.toggleVisibility()}
                      title={columnName}
                      leadingIcon={column.getIsVisible() ? "check" : ""}
                    />
                  );
                })}
              </Menu>
            )}
          </View>
        )}

        {/* 検索ボックス（トグル表示） */}
        {onSearch && searchVisible && (
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder={globalFilterPlaceholder}
              value={searchValue}
              onChangeText={setSearchValue}
              onSubmitEditing={() => onSearch(searchValue)}
            />
          </View>
        )}

        <View style={styles.tableHeaderContainer}>
          <DataTable>
            {/* ヘッダー */}
            <DataTable.Header>
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <DataTable.Title
                    key={header.id}
                    style={[
                      header.column.id === "_select"
                        ? { flex: 0.5, justifyContent: "center" }
                        : header.column.id === "_drag"
                          ? { flex: 0.3, justifyContent: "center" }
                          : { flex: 1 },
                    ]}
                    sortDirection={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : undefined
                    }
                    onPress={
                      enableSorting &&
                      header.column.getCanSort() &&
                      header.column.id !== "_select" &&
                      header.column.id !== "_drag"
                        ? () => header.column.toggleSorting()
                        : undefined
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </DataTable.Title>
                )),
              )}
            </DataTable.Header>

            {/* ボディ */}
            {table.getRowModel().rows.map((row, index) => (
              <DraggableRow
                key={row.id}
                rowId={row.id}
                isDragging={
                  dragState.isDragging && dragState.draggedId === row.id
                }
                isDragEnabled={isRowDragEnabled}
                animationConfig={animationConfig}
                onDragStart={(id: string, position: DragPosition) =>
                  startDrag(id, "row", position)
                }
                onDragUpdate={updateDrag}
                onDragEnd={endDrag}
                style={[
                  row.getIsSelected()
                    ? styles.selectedRow
                    : striped && index % 2 === 1 && styles.stripedRow,
                ]}
                showDragHandle={isRowDragEnabled}
                testID={`table-row-${row.id}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <DataTable.Cell
                    key={cell.id}
                    style={[
                      cell.column.id === "_select"
                        ? { flex: 0.5, justifyContent: "center" }
                        : cell.column.id === "_drag"
                          ? { flex: 0.3, justifyContent: "center" }
                          : { flex: 1 },
                    ]}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </DataTable.Cell>
                ))}
              </DraggableRow>
            ))}

            {/* ページネーション */}
            {enablePagination && (
              <View style={styles.paginationFooter}>
                {enableRowSelection && (
                  <View style={styles.footerCheckboxContainer}>
                    <Checkbox
                      checked={
                        table.getIsAllPageRowsSelected()
                          ? true
                          : table.getIsSomePageRowsSelected()
                            ? "indeterminate"
                            : false
                      }
                      onChangeCheck={() => table.toggleAllPageRowsSelected()}
                    />
                  </View>
                )}
                <DataTable.Pagination
                  page={pagination.pageIndex}
                  numberOfPages={
                    totalCount
                      ? Math.ceil(totalCount / pagination.pageSize)
                      : Math.ceil(
                          table.getFilteredRowModel().rows.length /
                            pagination.pageSize,
                        )
                  }
                  onPageChange={(page) => {
                    if (props.onPaginationChange) {
                      props.onPaginationChange({
                        ...pagination,
                        pageIndex: page,
                      });
                    }
                  }}
                  label={`${pagination.pageIndex * pagination.pageSize + 1}-${Math.min(
                    (pagination.pageIndex + 1) * pagination.pageSize,
                    totalCount || table.getFilteredRowModel().rows.length,
                  )} of ${totalCount || table.getFilteredRowModel().rows.length}`}
                  numberOfItemsPerPageList={[10, 20, 50]}
                  numberOfItemsPerPage={pagination.pageSize}
                  onItemsPerPageChange={(itemsPerPage) => {
                    if (props.onPaginationChange) {
                      props.onPaginationChange({
                        pageIndex: 0,
                        pageSize: itemsPerPage,
                      });
                    }
                  }}
                  selectPageDropdownLabel="Rows per page"
                  style={{ flexShrink: 1, paddingHorizontal: 16 }}
                />
              </View>
            )}
          </DataTable>
        </View>

        {/* ローディングオーバーレイ */}
        {loading && (
          <View style={styles.loadingOverlay}>
            {/* ActivityIndicatorを後で追加 */}
          </View>
        )}
      </View>
    );
  },
);
