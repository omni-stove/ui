# EnhancedDataTable 設計書

TanStack Table + React Native Paper DataTable を組み合わせた高機能テーブルコンポーネント

## 基本コンセプト

**完全制御型（Controlled Component）のテーブルコンポーネント**
- コンポーネント内部ではデータを持たない
- 全ての状態管理は呼び出し側で行う
- UIロジックのみに集中した設計

## アーキテクチャ

```
EnhancedDataTable
├── TanStack Table (データ操作ロジック)
└── React Native Paper DataTable (UI表示)
```

## 必要な依存関係

```json
{
  "dependencies": {
    "@tanstack/react-table": "^8.x.x",
    "papaparse": "^5.4.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/papaparse": "^5.3.14"
  }
}
```

## Props設計

```typescript
type EnhancedDataTableProps<T extends { id: string }> = {
  // データ
  data: T[]
  columns: ColumnDef<T>[]
  
  // 状態（呼び出し側で管理）
  sorting?: SortingState
  pagination?: PaginationState
  columnFilters?: ColumnFiltersState
  selectedIds?: Set<string>
  columnVisibility?: ColumnVisibilityState
  globalFilter?: string
  
  // 状態変更ハンドラ
  onSortingChange?: (sorting: SortingState) => void
  onPaginationChange?: (pagination: PaginationState) => void
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  onSelectionChange?: (selectedIds: Set<string>) => void
  onColumnVisibilityChange?: (visibility: ColumnVisibilityState) => void
  onGlobalFilterChange?: (value: string) => void
  
  // DnDハンドラ
  onRowDragEnd?: (params: {
    draggedId: string
    targetId: string
    position: 'before' | 'after'
  }) => void
  onColumnDragEnd?: (params: {
    draggedColumnId: string
    targetColumnId: string
    position: 'before' | 'after'
  }) => void
  
  // CSVエクスポート
  csvExport?: CsvExportConfig<T>
  onCsvExport?: (params: {
    sorting: SortingState
    filters: ColumnFiltersState
    selectedIds?: Set<string>
    exportType: 'all' | 'filtered' | 'selected'
  }) => Promise<T[]>
  
  // UI状態
  loading?: boolean
  totalCount?: number
  
  // 機能設定
  enableSorting?: boolean
  enableFiltering?: boolean
  enablePagination?: boolean
  enableRowSelection?: boolean
  enableColumnDrag?: boolean
  enableRowDrag?: boolean
  
  // 見た目設定
  striped?: boolean  // デフォルト true
  globalFilterPlaceholder?: string
  
  // DnD設定
  dragDrop?: {
    enableRowDrag?: boolean
    enableColumnDrag?: boolean
    autoDisableOnSort?: boolean
    autoDisableOnFilter?: boolean
  }
}

type CsvExportConfig<T> = {
  enabled: boolean
  filename?: string
  schema: z.ZodSchema<T>
  columns?: {
    key: keyof T
    header: string
    formatter?: (value: any) => string
  }[]
  maxRows?: number
}
```

## 主要機能

### 1. ソート制御

- ハンドラベースの完全制御
- クライアント/サーバーサイド両対応

```typescript
const handleSortingChange = (newSorting: SortingState) => {
  setSorting(newSorting)
  // API再リクエスト or クライアントソート
}
```

### 2. ページネーション制御

- 全ページでの操作対応
- 状態は呼び出し側で管理

```typescript
const handlePaginationChange = (newPagination: PaginationState) => {
  setPagination(newPagination)
  // 新しいページのデータを取得
}
```

### 3. 行選択（IDベース）

- `Set<string>` でIDを管理
- ページ変更・ソート後も選択状態保持
- 包含/除外モード対応

```typescript
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
const [selectionMode, setSelectionMode] = useState<'include' | 'exclude'>('include')
const [selectAll, setSelectAll] = useState(false)
```

### 4. DnD機能

#### 有効化条件
- ソートなし && フィルタなし
- 検索なし

#### 行DnD
- ドラッグ先IDベースの順序変更
- 相対位置計算不要

```typescript
const handleRowDragEnd = (params: {
  draggedId: string
  targetId: string
  position: 'before' | 'after'
}) => {
  // draggedId を targetId の前/後に移動
  await moveItem(params.draggedId, params.targetId, params.position)
}
```

#### 列DnD
- 列順序の変更
- 設定の永続化

### 5. CSVエクスポート

- papaparse + zod の組み合わせ
- 型安全なデータ変換
- 全データ/フィルタ結果/選択データの出力

```typescript
const csvConfig: CsvExportConfig<User> = {
  enabled: true,
  filename: 'users_export.csv',
  schema: userSchema,
  columns: [
    { key: 'id', header: 'ユーザーID' },
    { key: 'name', header: '名前' },
    { 
      key: 'createdAt', 
      header: '作成日',
      formatter: (date: Date) => date.toLocaleDateString('ja-JP')
    }
  ],
  maxRows: 10000
}
```

### 6. 列表示制御

- 列の表示/非表示切り替え
- 設定の永続化対応

```typescript
const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({
  'name': true,
  'email': true,
  'createdAt': false
})
```

### 7. グローバル検索

- 全列対象の検索機能
- TanStack Table の標準機能使用

```typescript
const [globalFilter, setGlobalFilter] = useState('')

const table = useReactTable({
  globalFilterFn: 'includesString',
  state: { globalFilter },
  onGlobalFilterChange: setGlobalFilter
})
```

### 8. ゼブラストライプ

- デフォルト有効
- 視認性向上

```typescript
<DataTable.Row 
  style={[
    defaultRowStyle,
    striped && index % 2 === 1 && styles.stripedRow
  ]}
>
```

## データフロー

```
ユーザー操作
↓
ハンドラ実行
↓
呼び出し側で状態更新
↓
API再リクエスト（必要に応じて）
↓
新しいデータでテーブル再レンダリング
```

## 使用例

```typescript
const UserListScreen = () => {
  // 状態管理
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [columnVisibility, setColumnVisibility] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  
  // データ取得
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', sorting, pagination, globalFilter],
    queryFn: () => fetchUsers({ sorting, pagination, globalFilter })
  })
  
  // CSVエクスポート
  const handleCsvExport = async (params: any) => {
    if (params.exportType === 'selected' && params.selectedIds) {
      return await fetchUsersByIds(Array.from(params.selectedIds))
    }
    return await fetchUsers({
      sorting: params.sorting,
      filters: params.filters,
      limit: csvConfig.maxRows
    })
  }
  
  return (
    <EnhancedDataTable
      data={data?.items || []}
      columns={userColumns}
      loading={isLoading}
      totalCount={data?.totalCount}
      
      // 状態
      sorting={sorting}
      pagination={pagination}
      selectedIds={selectedIds}
      columnVisibility={columnVisibility}
      globalFilter={globalFilter}
      
      // ハンドラ
      onSortingChange={setSorting}
      onPaginationChange={setPagination}
      onSelectionChange={setSelectedIds}
      onColumnVisibilityChange={setColumnVisibility}
      onGlobalFilterChange={setGlobalFilter}
      
      // DnD
      onRowDragEnd={async (params) => {
        await moveItem(params.draggedId, params.targetId, params.position)
        refetch()
      }}
      
      // 機能設定
      enableSorting={true}
      enableRowSelection={true}
      enableRowDrag={true}
      striped={true}
      
      // CSVエクスポート
      csvExport={csvConfig}
      onCsvExport={handleCsvExport}
    />
  )
}
```

## コンポーネント構成

- **EnhancedDataTable**: メインコンポーネント
- **TableHeader**: ソート機能付きヘッダー
- **TableRow**: 行コンポーネント
- **TableCell**: セルコンポーネント
- **TablePagination**: ページネーション
- **SelectionCheckbox**: 選択チェックボックス
- **CsvExportButton**: CSVエクスポートボタン
- **ColumnVisibilityToggle**: 列表示切り替え
- **GlobalSearchBox**: グローバル検索ボックス

## 実装の次のステップ

1. **依存関係のインストール**
   ```bash
   npm install @tanstack/react-table papaparse zod
   npm install -D @types/papaparse
   ```

2. **EnhancedDataTableコンポーネントの実装**
   - `src/Table/index.tsx`
   - `src/Table/components/`
   - `src/Table/hooks/`
   - `src/Table/types.ts`

3. **Storybookでのサンプル作成**
   - `src/Table/index.stories.tsx`

4. **既存DataTableとの統合**
   - `src/index.ts` への追加

## メリット

- ✅ **再利用性**: どんなデータソースでも使用可能
- ✅ **パフォーマンス**: 仮想化・最適化対応
- ✅ **型安全性**: TypeScript完全対応
- ✅ **柔軟性**: 設定可能な機能ON/OFF
- ✅ **一貫性**: Material Design 3準拠
- ✅ **保守性**: 完全制御型で状態管理が明確
