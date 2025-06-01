#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Project, TypeFormatFlags } from "ts-morph";
import * as fs from "node:fs";
import * as path from "node:path";

const server = new Server(
  {
    name: "rn-ui-components",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Find the UI library root
function findUILibraryRoot(): string {
  // 1. Check for environment variable (explicit override)
  if (process.env.RN_UI_LIBRARY_PATH) {
    return process.env.RN_UI_LIBRARY_PATH;
  }

  // 2. Try to find in node_modules (most common case)
  const nodeModulesPath = path.join(
    process.cwd(),
    "node_modules",
    "@codynog",
    "rn-ui",
  );
  if (fs.existsSync(nodeModulesPath)) {
    return nodeModulesPath;
  }

  // 3. Development mode - if we're in the mcp-server directory
  let currentDir = process.cwd();
  if (path.basename(currentDir) === "mcp-server") {
    currentDir = path.dirname(currentDir);
    const srcPath = path.join(currentDir, "src");
    if (fs.existsSync(srcPath)) {
      return currentDir;
    }
  }

  // 4. Look for UI library structure in parent directories
  currentDir = process.cwd();
  while (currentDir !== path.dirname(currentDir)) {
    const srcPath = path.join(currentDir, "src");
    const packageJsonPath = path.join(currentDir, "package.json");

    if (fs.existsSync(srcPath) && fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf-8"),
        );
        if (
          packageJson.name === "@codynog/rn-ui" ||
          packageJson.name === "rn-ui"
        ) {
          return currentDir;
        }
      } catch (_error) {
        // Continue searching
      }
    }
    currentDir = path.dirname(currentDir);
  }

  // 5. Fallback to current working directory
  return process.cwd();
}

const uiLibraryRoot = findUILibraryRoot();

// TypeScript project setup
const project = new Project({
  tsConfigFilePath: path.join(uiLibraryRoot, "tsconfig.json"),
});

interface ComponentInfo {
  name: string;
  filePath: string;
  description?: string;
  props: PropInfo[];
  exports: string[];
}

interface PropInfo {
  name: string;
  type: string;
  optional: boolean;
  description?: string;
  defaultValue?: string;
}

// Get all component directories
function getComponentDirectories(): string[] {
  const srcPath = path.join(uiLibraryRoot, "src");

  if (!fs.existsSync(srcPath)) {
    return [];
  }

  const entries = fs.readdirSync(srcPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .filter((name) => {
      // Check if directory has index.tsx
      const indexPath = path.join(srcPath, name, "index.tsx");
      return fs.existsSync(indexPath);
    });
}

// Analyze a single component file
function analyzeComponent(componentName: string): ComponentInfo | null {
  const filePath = path.join(uiLibraryRoot, "src", componentName, "index.tsx");

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const sourceFile =
    project.getSourceFile(filePath) || project.addSourceFileAtPath(filePath);

  const componentInfo: ComponentInfo = {
    name: componentName,
    filePath,
    props: [],
    exports: [],
  };

  // Get JSDoc description from the main component function
  const exportedDeclarations = sourceFile.getExportedDeclarations();

  for (const [exportName, declarations] of exportedDeclarations) {
    componentInfo.exports.push(exportName);

    // Look for the main component (usually matches the directory name)
    if (
      exportName === componentName ||
      exportName.toLowerCase() === componentName.toLowerCase()
    ) {
      for (const declaration of declarations) {
        // Get JSDoc comments
        if (
          "getJsDocs" in declaration &&
          typeof declaration.getJsDocs === "function"
        ) {
          const jsDocComments = declaration.getJsDocs();
          if (jsDocComments.length > 0) {
            const comment = jsDocComments[0];
            const description = comment.getDescription().trim();
            if (description) {
              componentInfo.description = description;
            }
          }
        }
      }
    }
  }

  // Find Props type definitions
  const typeAliases = sourceFile.getTypeAliases();
  const interfaces = sourceFile.getInterfaces();

  // Look for Props, BaseProps, or similar type definitions
  const propsTypes = [...typeAliases, ...interfaces].filter((type) => {
    const name = type.getName();
    return name.includes("Props") || name.includes("Type");
  });

  for (const propsType of propsTypes) {
    const typeSymbol = propsType.getSymbol();
    if (!typeSymbol) continue;

    const type = propsType.getType();
    const properties = type.getProperties();

    for (const property of properties) {
      const propName = property.getName();
      const propType = property.getTypeAtLocation(propsType);

      const propInfo: PropInfo = {
        name: propName,
        type: propType.getText(propsType, TypeFormatFlags.InTypeAlias),
        optional: property.isOptional(),
      };

      // Get JSDoc for the property
      const valueDeclaration = property.getValueDeclaration();
      if (
        valueDeclaration &&
        "getJsDocs" in valueDeclaration &&
        typeof valueDeclaration.getJsDocs === "function"
      ) {
        const jsDocComments = valueDeclaration.getJsDocs();
        if (jsDocComments.length > 0) {
          const comment = jsDocComments[0];
          const description = comment.getDescription().trim();
          if (description) {
            propInfo.description = description;
          }
        }
      }

      componentInfo.props.push(propInfo);
    }
  }

  return componentInfo;
}

// Get component source code
function getComponentSource(componentName: string): string | null {
  const filePath = path.join(uiLibraryRoot, "src", componentName, "index.tsx");

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, "utf-8");
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_components",
        description: "List all available React Native UI components",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_component_details",
        description:
          "Get detailed information about a specific component including props, types, and JSDoc",
        inputSchema: {
          type: "object",
          properties: {
            componentName: {
              type: "string",
              description: "Name of the component to analyze",
            },
          },
          required: ["componentName"],
        },
      },
      {
        name: "get_component_source",
        description: "Get the source code of a specific component",
        inputSchema: {
          type: "object",
          properties: {
            componentName: {
              type: "string",
              description: "Name of the component to get source code for",
            },
          },
          required: ["componentName"],
        },
      },
      {
        name: "analyze_props",
        description: "Analyze props of a specific component in detail",
        inputSchema: {
          type: "object",
          properties: {
            componentName: {
              type: "string",
              description: "Name of the component to analyze props for",
            },
          },
          required: ["componentName"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_components": {
        const components = getComponentDirectories();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  components,
                  total: components.length,
                  description:
                    "Available React Native UI components in this library",
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case "get_component_details": {
        const { componentName } = args as { componentName: string };
        const componentInfo = analyzeComponent(componentName);

        if (!componentInfo) {
          return {
            content: [
              {
                type: "text",
                text: `Component "${componentName}" not found`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(componentInfo, null, 2),
            },
          ],
        };
      }

      case "get_component_source": {
        const { componentName } = args as { componentName: string };
        const source = getComponentSource(componentName);

        if (!source) {
          return {
            content: [
              {
                type: "text",
                text: `Component "${componentName}" not found`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: source,
            },
          ],
        };
      }

      case "analyze_props": {
        const { componentName } = args as { componentName: string };
        const componentInfo = analyzeComponent(componentName);

        if (!componentInfo) {
          return {
            content: [
              {
                type: "text",
                text: `Component "${componentName}" not found`,
              },
            ],
          };
        }

        const propsAnalysis = {
          componentName,
          totalProps: componentInfo.props.length,
          requiredProps: componentInfo.props.filter((p) => !p.optional),
          optionalProps: componentInfo.props.filter((p) => p.optional),
          propsWithDefaults: componentInfo.props.filter((p) => p.defaultValue),
          propsWithDescriptions: componentInfo.props.filter(
            (p) => p.description,
          ),
          detailedProps: componentInfo.props,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(propsAnalysis, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("RN-UI Components MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
