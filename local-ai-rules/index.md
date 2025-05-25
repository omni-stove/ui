# Repository Overview

- React Native UI Component Library
  - Developed using Expo ([`package.json:27`](package.json:27))
  - Utilizes React Native Paper ([`package.json:34`](package.json:34)) for UI components
- Adheres to M3 (Material Design 3) design principles
  - Applies themes using `@pchmn/expo-material3-theme` ([`package.json:22`](package.json:22))
- Implements Storybook ([`package.json:11`](package.json:11)) for component cataloging and testing
- Uses Plop ([`package.json:17`](package.json:17)) for efficient generation of component boilerplates
- Employs Biome ([`package.json:18`](package.json:18)) for code linting and formatting

## JSDoc Rules for React Components

- Provide a general description of the component's purpose.
- Document each prop using `@param`.
  - Include the prop's type in curly braces (e.g., `{string}`).
  - Provide a clear description of the prop.
  - Indicate if a prop is optional using square brackets around the name (e.g., `[props.optionalProp]`).
- Use `@returns` to describe what the component renders or returns, if applicable (though often components primarily render JSX).
- If the component is a direct re-export from React Native Paper, state this clearly and link to the official React Native Paper documentation for that component.
  - Example: `/** @see https://callstack.github.io/react-native-paper/docs/components/Button/ */`

### Example

```typescript
/**
 * A brief description of what the component does.
 *
 * @param {object} props - The component's props.
 * @param {string} props.requiredProp - Description of a required prop.
 * @param {number} [props.optionalProp] - Description of an optional prop.
 * @param {() => void} [props.onClick] - Function to call on click.
 * @returns {JSX.Element | null} A description of what is rendered.
 */
```

## Component Documentation Links

For components directly re-exported from React Native Paper, refer to their official documentation.
For custom components developed in this repository, specific documentation or Storybook links should be provided here if not covered by JSDoc.

- **ActivityIndicator**: [React Native Paper ActivityIndicator](https://callstack.github.io/react-native-paper/docs/components/ActivityIndicator/)