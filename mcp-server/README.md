# RN-UI Components MCP Server

React Native UI Component Library用のMCP (Model Context Protocol) Serverです。

## 機能

このMCP Serverは以下の機能を提供します：

### 1. `list_components`
- 利用可能な全コンポーネントの一覧を取得
- パラメータ: なし

### 2. `get_component_details`
- 特定のコンポーネントの詳細情報を取得（Props、型、JSDoc）
- パラメータ: `componentName` (string)

### 3. `get_component_source`
- 特定のコンポーネントのソースコードを取得
- パラメータ: `componentName` (string)

### 4. `analyze_props`
- 特定のコンポーネントのPropsを詳細に分析
- パラメータ: `componentName` (string)

## インストール

```bash
cd mcp-server
npm install
```

## 使用方法

### 直接実行
```bash
cd mcp-server
npm start
```

### MCP Client設定

MCP Clientの設定ファイル（例：Claude Desktop）に以下を追加：

```json
{
  "mcpServers": {
    "rn-ui-components": {
      "command": "node",
      "args": ["/path/to/your/project/mcp-server/index.ts"],
      "cwd": "/path/to/your/project"
    }
  }
}
```

または、tsxを使用する場合：

```json
{
  "mcpServers": {
    "rn-ui-components": {
      "command": "npx",
      "args": ["tsx", "/path/to/your/project/mcp-server/index.ts"],
      "cwd": "/path/to/your/project"
    }
  }
}
```

## 使用例

### コンポーネント一覧の取得
```
list_components
```

### Buttonコンポーネントの詳細取得
```
get_component_details
componentName: Button
```

### Buttonコンポーネントのソースコード取得
```
get_component_source
componentName: Button
```

### ButtonコンポーネントのProps分析
```
analyze_props
componentName: Button
```

## 対応コンポーネント

このMCP Serverは `src/` ディレクトリ内の全てのコンポーネントを自動的に検出します。
各コンポーネントは以下の構造を持つ必要があります：

```
src/
  ComponentName/
    index.tsx
    index.stories.tsx (optional)
```

## 技術仕様

- **TypeScript**: ts-morphを使用してTypeScript ASTを解析
- **JSDoc**: コンポーネントとPropsの説明を自動抽出
- **型情報**: Props の型、オプション性、デフォルト値を解析
- **MCP Protocol**: Model Context Protocol v1.0に準拠

## トラブルシューティング

### TypeScript設定エラー
プロジェクトルートに `tsconfig.json` が存在することを確認してください。

### コンポーネントが見つからない
- コンポーネント名が正確であることを確認
- `src/ComponentName/index.tsx` の形式でファイルが存在することを確認

### 権限エラー
```bash
chmod +x mcp-server/index.ts
