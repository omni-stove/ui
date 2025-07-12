# Omni Stove UI Components MCP Server

このプロジェクトには、React Native UIコンポーネントライブラリ用のMCP (Model Context Protocol) Serverが含まれています。

## 概要

MCP Serverを使用することで、AIアシスタント（Claude Desktopなど）から直接コンポーネントの詳細情報を取得できます。

## 提供機能

### 1. `list_components`
- 利用可能な全コンポーネント（52個）の一覧を取得

### 2. `get_component_details`
- 特定のコンポーネントの詳細情報（Props、型、JSDoc）を取得
- 例: `get_component_details componentName: Button`

### 3. `get_component_source`
- 特定のコンポーネントのソースコードを取得
- 例: `get_component_source componentName: Button`

### 4. `analyze_props`
- 特定のコンポーネントのPropsを詳細に分析
- 例: `analyze_props componentName: Button`

## セットアップ

### 1. 依存関係のインストール
```bash
cd mcp-server
npm install
```

### 2. MCP Client設定

#### Option A: NPMパッケージとして使用（推奨）

Claude DesktopやClineの設定ファイルに以下を追加：

```json
{
  "mcpServers": {
    "omni-stove-ui-components": {
      "command": "npx",
      "args": [
        "@omni-stove/ui-mcp-server"
      ]
    }
  }
}
```

#### Option B: ローカル開発版を使用

Claude Desktopの設定ファイル（通常 `~/Library/Application Support/Claude/claude_desktop_config.json`）に以下を追加：

```json
{
  "mcpServers": {
    "omni-stove-ui-components": {
      "command": "npx",
      "args": [
        "tsx",
        "/path/to/your/project/mcp-server/index.ts"
      ],
      "cwd": "/path/to/your/project"
    }
  }
}
```

**注意**: `/path/to/your/project` を実際のプロジェクトパスに置き換えてください。

### 3. Claude Desktopの再起動

設定を反映するためにClaude Desktopを再起動してください。

## 使用例

Claude Desktopで以下のようにコンポーネント情報を取得できます：

```
コンポーネント一覧を教えて
→ list_components ツールが実行され、52個のコンポーネント一覧が表示

Buttonコンポーネントの詳細を教えて
→ get_component_details ツールが実行され、Propsや型情報が表示

Buttonコンポーネントのソースコードを見せて
→ get_component_source ツールが実行され、完全なソースコードが表示
```

## 技術仕様

- **TypeScript AST解析**: ts-morphを使用してコンポーネントを解析
- **JSDoc抽出**: コンポーネントとPropsの説明を自動抽出
- **型情報**: Props の型、オプション性、デフォルト値を解析
- **MCP Protocol**: Model Context Protocol v1.0に準拠

## トラブルシューティング

### コンポーネントが見つからない場合
- コンポーネント名が正確であることを確認
- `src/ComponentName/index.tsx` の形式でファイルが存在することを確認

### パスエラーが発生する場合
- 設定ファイルのパスが正しいことを確認
- プロジェクトルートディレクトリに `tsconfig.json` が存在することを確認

### 権限エラーが発生する場合
```bash
chmod +x mcp-server/index.ts
```

## ファイル構成

```
mcp-server/
├── index.ts              # MCP Server メインファイル
├── package.json          # 依存関係とスクリプト
├── README.md             # 詳細なドキュメント
└── claude-desktop-config.json  # 設定例
```

## 開発者向け

MCP Serverの機能を拡張したい場合は、`mcp-server/index.ts` を編集してください。新しいツールの追加や既存機能の改善が可能です。
