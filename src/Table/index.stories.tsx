import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { View } from "react-native";
import { createColumnHelper } from "@tanstack/react-table";
import { Text } from "react-native-paper";
import { Table } from "./index";
import type {
  DataWithId,
  RowDragEndParams,
  EnhancedSortingState,
  EnhancedVisibilityState,
} from "./types";
import type { PaginationState, ColumnDef } from "@tanstack/react-table";

// サンプルデータの型定義
type User = DataWithId & {
  name: string;
  email: string;
  age: number;
  department: string;
  createdAt: string;
};

// サンプルデータ
const sampleUsers: User[] = [
  {
    id: "1",
    name: "田中太郎",
    email: "tanaka@example.com",
    age: 28,
    department: "開発部",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "佐藤花子",
    email: "sato@example.com",
    age: 32,
    department: "デザイン部",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "鈴木一郎",
    email: "suzuki@example.com",
    age: 25,
    department: "営業部",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "高橋美咲",
    email: "takahashi@example.com",
    age: 29,
    department: "開発部",
    createdAt: "2024-04-05",
  },
  {
    id: "5",
    name: "山田健太",
    email: "yamada@example.com",
    age: 35,
    department: "マーケティング部",
    createdAt: "2024-05-12",
  },
  {
    id: "6",
    name: "中村由美",
    email: "nakamura@example.com",
    age: 27,
    department: "人事部",
    createdAt: "2024-06-18",
  },
  {
    id: "7",
    name: "小林大輔",
    email: "kobayashi@example.com",
    age: 31,
    department: "開発部",
    createdAt: "2024-07-22",
  },
  {
    id: "8",
    name: "加藤麻衣",
    email: "kato@example.com",
    age: 26,
    department: "デザイン部",
    createdAt: "2024-08-14",
  },
  {
    id: "9",
    name: "渡辺翔太",
    email: "watanabe@example.com",
    age: 33,
    department: "営業部",
    createdAt: "2024-09-03",
  },
  {
    id: "10",
    name: "松本愛",
    email: "matsumoto@example.com",
    age: 24,
    department: "マーケティング部",
    createdAt: "2024-10-07",
  },
] satisfies (DataWithId & User)[];

// カラム定義
const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("name", {
    header: "名前",
    cell: (info) => <Text>{info.getValue()}</Text>,
    id: "name",
  }),
  columnHelper.accessor("email", {
    header: "メールアドレス",
    cell: (info) => <Text>{info.getValue()}</Text>,
    id: "email",
  }),
  columnHelper.accessor("age", {
    header: "年齢",
    cell: (info) => <Text>{info.getValue()}</Text>,
    id: "age",
  }),
  columnHelper.accessor("department", {
    header: "部署",
    cell: (info) => <Text>{info.getValue()}</Text>,
    id: "department",
  }),
  columnHelper.accessor("createdAt", {
    header: "作成日",
    cell: (info) => <Text>{info.getValue()}</Text>,
    id: "createdAt",
  }),
] as ColumnDef<User, unknown>[];

const meta: Meta<typeof Table> = {
  component: Table,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Table>;

// デフォルト（基本的なテーブル）
export const Default: Story = {
  render: () => {
    const [sorting, setSorting] = useState<EnhancedSortingState<User>>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    });

    return (
      <Table
        data={sampleUsers}
        columns={columns}
        sorting={sorting}
        pagination={pagination}
        onSortingChange={setSorting}
        onPaginationChange={setPagination}
        enableSorting={true}
        enablePagination={true}
        striped={true}
      />
    );
  },
};

// 空のデータ
export const Empty: Story = {
  render: () => {
    const [sorting, setSorting] = useState<EnhancedSortingState<User>>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    });

    return (
      <Table
        data={[]}
        columns={columns}
        sorting={sorting}
        pagination={pagination}
        onSortingChange={setSorting}
        onPaginationChange={setPagination}
        enableSorting={true}
        enablePagination={true}
        striped={true}
      />
    );
  },
};

// ローディング状態
export const Loading: Story = {
  render: () => {
    const [sorting, setSorting] = useState<EnhancedSortingState<User>>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    });

    return (
      <Table
        data={sampleUsers}
        columns={columns}
        sorting={sorting}
        pagination={pagination}
        onSortingChange={setSorting}
        onPaginationChange={setPagination}
        enableSorting={true}
        enablePagination={true}
        striped={true}
        loading={true}
      />
    );
  },
};

// 全機能付き
export const AllFeatures: Story = {
  render: () => {
    const [sorting, setSorting] = useState<EnhancedSortingState<User>>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    });
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [columnVisibility, setColumnVisibility] = useState<
      EnhancedVisibilityState<User>
    >({});
    const [filteredData, setFilteredData] = useState(sampleUsers);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setFilteredData(sampleUsers);
        return;
      }

      const filtered = sampleUsers.filter((user) =>
        Object.values(user).some((value) =>
          String(value).toLowerCase().includes(query.toLowerCase()),
        ),
      );
      setFilteredData(filtered);
      setPagination({ ...pagination, pageIndex: 0 });
    };

    const visibleColumns = Object.entries(columnVisibility)
      .filter(([, visible]) => visible)
      .map(([columnId]) => columnId);

    const hiddenColumns = Object.entries(columnVisibility)
      .filter(([, visible]) => !visible)
      .map(([columnId]) => columnId);

    return (
      <View>
        <Text style={{ marginBottom: 8 }}>
          検索クエリ: "{searchQuery}" | 結果: {filteredData.length}件
        </Text>
        <Text style={{ marginBottom: 8 }}>
          選択された行: {Array.from(selectedIds).join(", ") || "なし"}
        </Text>
        <Text style={{ marginBottom: 8 }}>
          表示中のカラム:{" "}
          {visibleColumns.length > 0 ? visibleColumns.join(", ") : "全て"}
        </Text>
        <Text style={{ marginBottom: 16 }}>
          非表示のカラム:{" "}
          {hiddenColumns.length > 0 ? hiddenColumns.join(", ") : "なし"}
        </Text>
        <Table
          data={filteredData}
          columns={columns}
          sorting={sorting}
          pagination={pagination}
          selectedIds={selectedIds}
          columnVisibility={columnVisibility}
          onSortingChange={setSorting}
          onPaginationChange={setPagination}
          onSelectionChange={setSelectedIds}
          onColumnVisibilityChange={setColumnVisibility}
          onSearch={handleSearch}
          globalFilterPlaceholder="名前、メール、部署で検索..."
          enableSorting={true}
          enablePagination={true}
          enableRowSelection={true}
          striped={true}
        />
      </View>
    );
  },
};

// DnD機能付き
export const WithDragAndDrop: Story = {
  render: () => {
    const [data, setData] = useState(sampleUsers);
    const [sorting, setSorting] = useState<EnhancedSortingState<User>>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    });

    const handleRowDragEnd = ({
      draggedId,
      targetId,
      position,
    }: RowDragEndParams) => {
      const draggedIndex = data.findIndex((item) => item.id === draggedId);
      const targetIndex = data.findIndex((item) => item.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const newData = [...data];
      const [draggedItem] = newData.splice(draggedIndex, 1);

      const insertIndex = position === "before" ? targetIndex : targetIndex + 1;
      newData.splice(insertIndex, 0, draggedItem);

      setData(newData);
    };

    return (
      <View>
        <Text style={{ marginBottom: 16, fontWeight: "bold" }}>
          行をドラッグして並び替えができます
        </Text>
        <Table
          data={data}
          columns={columns}
          sorting={sorting}
          pagination={pagination}
          onSortingChange={setSorting}
          onPaginationChange={setPagination}
          enableSorting={true}
          enablePagination={true}
          enableRowDrag={true}
          onRowDragEnd={handleRowDragEnd}
          striped={true}
        />
      </View>
    );
  },
};
