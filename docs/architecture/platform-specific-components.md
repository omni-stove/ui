# プラットフォーム固有コンポーネントのアーキテクチャ

## 背景と課題

現在のomni-stove-uiライブラリは、React NativeとWeb向けに異なる実装を提供していますが、いくつかの課題に直面しています。

### 現在の課題

1. **バンドル時の複雑性**
   - react-native-builder-bobを使用したバンドル時に、プラットフォーム固有のファイル（`.web.tsx`）の扱いが不明確
   - ビルド設定の複雑化により、メンテナンスコストが増大

2. **フレームワーク依存**
   - 現在の構成では、React Native環境に強く依存
   - Next.js、Remix、Viteなど、React Native以外のフレームワークでの利用が困難

3. **カスタマイズの制限**
   - npmパッケージとして配布する場合、ユーザーがコンポーネントをカスタマイズしにくい
   - バージョン管理による破壊的変更のリスク

## shadcn/ui方式の採用

これらの課題を解決するため、shadcn/uiが採用している「コピー&ペースト」アプローチへの移行を提案します。

### shadcn/ui方式の利点

1. **完全なコントロール**
   - ユーザーが自分のプロジェクトにコンポーネントをコピーし、自由にカスタマイズ可能
   - 依存関係の更新による予期しない破壊的変更を回避

2. **フレームワーク非依存**
   - React Native、Next.js、Remix、Viteなど、あらゆるReactベースのフレームワークで利用可能
   - プラットフォーム固有の実装を明確に分離

3. **最適化の向上**
   - 必要なコンポーネントのみをプロジェクトに含める
   - Tree Shakingが効果的に機能し、バンドルサイズを最小化

4. **透明性**
   - コンポーネントの実装が完全に可視化される
   - デバッグやカスタマイズが容易

## 提案するアーキテクチャ

### ファイル命名規則

プラットフォーム固有の実装を明確に分離するため、以下の命名規則を採用します：

```
ComponentName/
├── index.tsx          # Web（デフォルト）実装
├── index.native.tsx   # React Native実装
├── index.stories.tsx  # Storybook
└── README.md         # コンポーネントドキュメント
```

#### 理由
- `index.tsx`をWebのデフォルトとすることで、React Native以外の環境での利用を簡素化
- `.native.tsx`拡張子により、React Native固有の実装を明確に識別
- Metroバンドラーは自動的に適切なファイルを選択

### CLIツールによる配布

コンポーネントの配布にはCLIツールを使用します：

```bash
# コンポーネントをプロジェクトにコピー
npx @omni-stove/ui add button select

# React Native版を指定してコピー
npx @omni-stove/ui add button --platform native
```

### コンポーネントのメタデータ

各コンポーネントには、依存関係と設定を定義するメタデータファイルを含めます：

```json
{
  "name": "Select",
  "dependencies": {
    "web": ["react"],
    "native": ["react-native", "react-native-paper"]
  },
  "files": {
    "web": ["index.tsx"],
    "native": ["index.native.tsx"]
  }
}
```

## 実装ガイドライン

### 1. プラットフォーム固有コードの分離

Web版とReact Native版で異なる実装が必要な場合：

```tsx
// index.tsx (Web版)
export const Select = forwardRef<HTMLSelectElement, Props>(
  (props, ref) => {
    // HTML select要素を使用
    return <select ref={ref} {...props} />;
  }
);

// index.native.tsx (React Native版)
export const Select = forwardRef<TextInput, Props>(
  (props, ref) => {
    // React Nativeコンポーネントを使用
    return <Menu anchor={<TextField />}>...</Menu>;
  }
);
```

### 2. 共通インターフェースの維持

両プラットフォームで同じPropsインターフェースを維持：

```tsx
type Props<T extends string | number> = {
  options: Option[];
  onChange: (value: T) => void;
  value: T;
  label?: string;
  errorMessage?: string;
  disabled?: boolean;
};
```

### 3. スタイリングの考慮

- Web版: CSS-in-JSまたはTailwind CSSを使用
- React Native版: StyleSheetまたはテーマシステムを使用

## 移行計画

### フェーズ1: 基盤整備
1. CLIツールの開発
2. コンポーネントメタデータの定義
3. ドキュメントサイトの構築

### フェーズ2: コンポーネント移行
1. 新規コンポーネントから新しい構造を採用
2. 既存コンポーネントを段階的に移行
3. 各コンポーネントにREADMEを追加

### フェーズ3: 配布開始
1. CLIツールのリリース
2. ドキュメントサイトの公開
3. 移行ガイドの提供

### 破壊的変更の最小化

- 既存のnpmパッケージは当面維持
- 新しい配布方法と並行して提供
- 段階的な移行パスを提供

## まとめ

shadcn/ui方式への移行により、以下の利点が期待できます：

1. **開発者体験の向上**: カスタマイズが容易になり、デバッグも簡単に
2. **パフォーマンスの最適化**: 必要なコンポーネントのみを含めることでバンドルサイズを削減
3. **メンテナンス性の向上**: プラットフォーム固有のコードが明確に分離
4. **エコシステムの拡大**: React Native以外のフレームワークでも利用可能に

この移行により、omni-stove-uiはより柔軟で強力なコンポーネントライブラリとして進化します。