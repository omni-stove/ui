# コンポーネントのプラットフォーム別構造への移行ガイド

このドキュメントは、既存のコンポーネントを以下の構造に移行するためのガイドです：

- `index.tsx` → Web用（HTMLベース）がデフォルト
- `index.native.tsx` → React Native用（既存の実装）

## 移行手順

### ケース1: 現在index.web.tsxがある場合

```bash
# 1. 現在のindex.tsxをindex.native.tsxにリネーム
mv src/ComponentName/index.tsx src/ComponentName/index.native.tsx

# 2. index.web.tsxの内容を新しいindex.tsxにコピー
cp src/ComponentName/index.web.tsx src/ComponentName/index.tsx

# 3. 不要になったindex.web.tsxを削除
rm src/ComponentName/index.web.tsx
```

### ケース2: 現在index.web.tsxがない場合

```bash
# 1. 現在のindex.tsxをindex.native.tsxにリネーム
mv src/ComponentName/index.tsx src/ComponentName/index.native.tsx

# 2. cody-uiを参考にWeb用実装を新しいindex.tsxとして作成
# 参考URL: https://github.com/codyogden/cody-ui
```

## Web用実装の指針

Web用コンポーネントを作成する際は以下を参考にしてください：

1. **cody-ui**: https://github.com/codynog/cody-ui
   - 対応するコンポーネントの実装パターンを参考
   - HTML要素ベースの実装を採用

2. **Material Design 3**
   - 既存のテーマシステム（`useTheme`）を活用
   - CSS-in-JSでスタイリング

3. **アクセシビリティ**
   - ネイティブHTML要素の使用を優先
   - 適切なARIA属性の実装

## 実行例（Selectコンポーネント）

### 移行前
```
src/Select/
├── index.tsx (React Native用)
├── index.web.tsx (Web用)
└── index.stories.tsx
```

### 移行後
```
src/Select/
├── index.tsx (Web用) ← デフォルト
├── index.native.tsx (React Native用)
└── index.stories.tsx
```

## 注意事項

- **順序を守る**: 必ずリネーム → コピー → 削除の順で実行
- **テスト**: 移行後は両プラットフォームでの動作確認を実施
- **型安全性**: 両実装で同じPropsインターフェースを維持

## 効果

この構造により、React Nativeのプラットフォーム解決メカニズムが機能し：
- Web環境では`index.tsx`が自動選択
- Native環境では`index.native.tsx`が自動選択

## Props共通化の指針

プラットフォーム固有の実装に移行する際は、以下の手順でPropsを共通化してください：

### types/index.tsでの共通化

1. **Native側を優先**: React Native用の既存Props定義を基準とする
2. **Web側の追加**: Web用で必要な追加のPropsがあれば統合する
3. **共通インターフェース**: `types/index.ts`で統一されたPropsを定義
4. **スタイル系Props除外**: `className`や`style`などのスタイル系Propsは渡さない

### 実装例

```typescript
// types/index.ts
export type Props = {
  // Native側のProps（優先）
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  // Web側で必要な追加Props（スタイル系除く）
  placeholder?: string;
};
```

### 移行手順でのProps統合

1. Native側のProps定義を確認
2. Web側で必要な追加Propsを特定（スタイル系を除く）
3. `types/index.ts`で統合されたPropsを作成
4. 両プラットフォームの実装で共通のPropsを使用

## 関連ドキュメント

- [プラットフォーム固有コンポーネント](./architecture/platform-specific-components.md)