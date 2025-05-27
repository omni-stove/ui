# MonthYearPicker Modal Overflow Issue

## 問題の概要

MonthYearPickerコンポーネントで、画面幅が狭くなり年月選択が縦に積まれた時に、モーダルの内容が画面からはみ出してしまう問題。

## 発生条件

- 画面幅が狭い（モバイル端末など）
- Gridシステムにより年と月の選択が縦に積まれる
- 月選択のグリッドボタン（3x4）が表示される際

## 現在の対策と問題点

### 試行した対策

1. **モーダル高さ制限**: `maxHeight: "70%"` → 効果不十分
2. **ScrollView高さ制限**: `maxHeight: 200px` → 効果不十分
3. **年・月両方にScrollView追加** → 根本解決に至らず

### 問題の原因

- モーダル内のコンテンツ（タイトル + Grid + アクションボタン）の合計高さが画面高さを超える
- 特に月選択の3x4グリッドが縦積み時に大きなスペースを占有
- Gridシステムの縦積み時の高さ計算が適切でない可能性

## 提案する解決策

### 短期的解決策

1. **月選択UIの変更**
   - 3x4グリッドから縦スクロールリストに変更
   - RadioButtonGroupを使用して年選択と統一

2. **モーダル全体のScrollView化**
   - Grid全体をScrollViewで囲む
   - 固定高さではなく、利用可能な高さに応じて動的調整

### 長期的解決策

1. **BottomSheetの採用**
   - Modalの代わりにBottomSheetを使用
   - より自然なモバイルUX

2. **レスポンシブ設計の改善**
   - 画面サイズに応じたレイアウト切り替え
   - 小画面では異なるUI構成を採用

## 技術的詳細

### 関連ファイル

- `src/MonthYearPicker/index.tsx`
- `src/Grid/index.tsx`
- `src/Grid/GridItem.tsx`

### 現在のスタイル設定

```typescript
modal: {
  backgroundColor: theme.colors.surface,
  margin: 20,
  borderRadius: 8,
  padding: 20,
  maxHeight: "70%", // 現在の制限
},
yearList: {
  maxHeight: 200, // 現在の制限
},
monthList: {
  maxHeight: 200, // 現在の制限
},
```

## 優先度

**High** - モバイル端末での基本的な使用に支障をきたす

## 担当者

未定

## 関連Issue

なし

## 更新履歴

- 2025/05/27: 初回作成
