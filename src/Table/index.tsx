import { forwardRef, type Ref, useMemo } from "react";
import { flexRender, type ColumnDef } from "@tanstack/react-table";
import { DataTable, Searchbar, Menu } from "react-native-paper";
import { View } from "react-native";
import { Checkbox } from "../Checkbox";
import { IconButton } from "../IconButton";
import type { EnhancedDataTableProps, DataWithId } from "./types";
import { useTable } from "./hooks";
import { createTableStyles } from "./styles";
import { useDragDrop } from "./hooks/useDragDrop";
import { DraggableRow } from "./components/DraggableRow";

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

      // ドラッグハンドル列を追加
      if (enableRowDrag) {
        const dragColumn: ColumnDef<T, unknown> = {
          id: "_drag",
          header: () => null, // ヘッダーは空
          cell: () => null, // セルは空（DraggableRowで処理）
          size: 40,
        };
        newColumns = [dragColumn, ...newColumns];
      }

      // 選択列を追加
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

    // DnD機能
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
                  // 選択列は除外
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
                          : { flex: 1 }, // 通常の列もflex:1を指定して均等に配置
                    ]} // チェックボックス列とドラッグハンドル列の幅と中央揃え
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
                      header.column.id !== "_select" && // チェックボックス列はソート不可
                      header.column.id !== "_drag" // ドラッグハンドル列もソート不可
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
                onDragStart={(id, position) => startDrag(id, "row", position)}
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
                          : { flex: 1 }, // 通常の列もflex:1を指定
                    ]} // チェックボックス列とドラッグハンドル列の幅と中央揃え
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
                      // label prop は削除して、Checkboxコンポーネントが自身のサイズで中央揃えされるようにする
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
                  style={{ flexShrink: 1, paddingHorizontal: 16 }} // flex: 1 を削除し、flexShrink: 1 を追加
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
