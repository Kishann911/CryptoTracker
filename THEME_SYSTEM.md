# Theme System Documentation

This document explains how the theme system works in the CryptoTracker application.

## Overview

The theme system allows users to switch between light and dark modes. It automatically detects the user's system preference and saves their choice in localStorage for persistence across sessions.

## Implementation Details

### Theme Context

The theme system is implemented using React Context API. The `ThemeContext` provides:

- `theme`: Current theme ("light" or "dark")
- `toggleTheme`: Function to switch between themes

### CSS Variables

The theme uses CSS variables defined in `globals.css`:

- Light theme colors (default)
- Dark theme colors (`.dark` class)

All components should use these CSS variables instead of hardcoded colors to ensure proper theme switching.

### Theme Persistence

The user's theme preference is stored in localStorage with the key "theme". On initial load, the system:

1. Checks localStorage for a saved theme preference
2. If not found, checks the system preference using `prefers-color-scheme`
3. Applies the appropriate theme class to the document root

## Usage in Components

To use the theme system in your components:

```typescript
import { useTheme } from "@/context/ThemeContext";

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="bg-background text-foreground">
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

## Available CSS Variables

The following CSS variables are available for theming:

- `--background`: Page background color
- `--foreground`: Primary text color
- `--card`: Card background color
- `--card-foreground`: Card text color
- `--popover`: Popover background color
- `--popover-foreground`: Popover text color
- `--primary`: Primary color (buttons, links, highlights)
- `--primary-foreground`: Primary text color
- `--secondary`: Secondary color
- `--secondary-foreground`: Secondary text color
- `--muted`: Muted background color
- `--muted-foreground`: Muted text color
- `--accent`: Accent color
- `--accent-foreground`: Accent text color
- `--destructive`: Destructive action color (delete, error)
- `--destructive-foreground`: Destructive text color
- `--border`: Border color
- `--input`: Input field border color
- `--ring`: Focus ring color

## Adding New Themes

To add a new theme:

1. Add a new CSS class in `globals.css` with the theme name
2. Define all the CSS variables for the new theme
3. Update the `ThemeContext` to include the new theme option
4. Modify the `ThemeToggle` component to cycle through the new theme

## Best Practices

1. Always use CSS variables for colors instead of hardcoded values
2. Test components in both light and dark modes
3. Ensure sufficient contrast for accessibility
4. Save user preferences in localStorage
5. Respect system preferences by default