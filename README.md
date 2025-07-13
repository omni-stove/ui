![picture of storybook](https://github.com/user-attachments/assets/cf98766d-8b90-44ab-b718-94ab16e63205)

# getting started

```sh
npx create-expo-app --template expo-template-storybook AwesomeStorybook
```

or

```sh
yarn create expo-app --template expo-template-storybook AwesomeStorybook
```

# app

```sh
yarn start
```

# RN Storybook (ondevice)

In this template you can now run `yarn storybook` to start ondevice storybook or `yarn start` to start your expo app.
This works via env variables and expo constants.

```sh
# either
yarn storybook

# ios
yarn storybook:ios

# android
yarn storybook:android
```

If you add new stories on the native (ondevice version) you either need to have the watcher running or run the stories loader

To update the stories one time

```sh
yarn storybook-generate
```

# Web

Start react native web storybook:

```
yarn storybook:web
```

build react native web storybook:

```sh
yarn build-storybook
```
# omni-stove-ui

## CLI Usage

This package includes a CLI tool that provides additional functionality:

### MCP Server

Start the Model Context Protocol (MCP) server for AI-assisted component analysis:

```sh
npx @omni-stove/ui --mcp
```

This starts an MCP server that allows AI assistants (like Claude Desktop) to analyze and understand the component library structure.

### Extract Components

Extract the source components to a local directory:

```sh
npx @omni-stove/ui --extract ./my-components
```

This copies all components from the `src` directory to your specified location, useful for customization or reference.
