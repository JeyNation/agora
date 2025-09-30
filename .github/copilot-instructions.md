# Copilot Instructions for Agora Project

## Project Structure
The project follows a specific organization pattern. Here's the structure and purpose of each directory:

```
src/
├── app/                    # Next.js App Router directory
│   ├── api/               # API routes
│   └── constants/         # App-level constants
│       ├── layout.constants.ts
│       ├── navigation.constants.ts
│       ├── navigation.items.tsx
│       └── searchbar.constants.ts
│
├── components/            # React components
│   ├── common/           # Shared/reusable components
│   └── layout/           # Layout components
│       ├── browser/      # Desktop-specific components
│       └── mobile/       # Mobile-specific components
│
├── lib/                  # Core utilities and functions
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and external services
│   └── utils/           # Utility functions
│
└── styles/              # Styling and theme
    ├── components/      # Component-specific styles
    ├── layout/         # Layout-specific styles
    └── theme/          # Theme configuration
```

## Code Organization Rules

### Components
1. All components should be in the `components` directory
2. Common/shared components go in `components/common/`
3. Layout components are split between:
   - `layout/browser/` for desktop-specific components
   - `layout/mobile/` for mobile-specific components

### Styles
1. Component styles should be in `styles/components/`
2. Layout styles should be in `styles/layout/`
3. Theme and global styles go in `styles/theme/`
4. Each style file should export constants or functions that return style objects

### Constants
1. Keep constants in the `app/constants/` directory
2. Group constants by feature (e.g., layout, navigation, searchbar)
3. Use descriptive names for constant files (e.g., `navigation.constants.ts`)

### Naming Conventions
1. Component files: PascalCase (e.g., `SearchBar.tsx`)
2. Style files: kebab-case (e.g., `search-bar.ts`)
3. Constant files: camelCase (e.g., `navigationConstants.ts`)
4. Utility files: camelCase (e.g., `formatDate.ts`)

### Import Rules
1. Use relative imports for components and styles
2. Group imports in the following order:
   ```typescript
   // React and external libraries
   import React from 'react';
   import { SomeComponent } from '@mui/material';
   
   // Local components and styles
   import MyComponent from './MyComponent';
   import { myStyles } from '../../styles/components/my-styles';
   
   // Constants and utilities
   import { SOME_CONSTANT } from '../../app/constants';
   ```

### Style Organization
1. Component styles should be grouped by component
2. Use TypeScript for style definitions
3. Follow MUI's styling patterns and theme usage
4. Keep responsive styles with their components
5. Use MUI's `sx` prop for styles when possible
6. Place the styles in the centralized style files within `styles/components/` or `styles/layout/` as appropriate

### Component Structure
1. Use "use client" directive for client components
2. Include TypeScript interfaces/types
3. Use function components with arrow syntax
4. Export components as default when they're the main export

### Mobile-First Development
1. Build responsive layouts using MUI's breakpoints
2. Use separate components for significantly different mobile/desktop UIs
3. Keep shared logic in common components or hooks

### Best Practices
1. Use TypeScript for all files
2. Implement proper error boundaries
3. Follow React's hooks rules
4. Keep components focused and single-responsibility
5. Use constants instead of hard-coded values

### Implementation & Testing
1. Fix any TypeScript errors or ESLint warnings before committing
2. Test the changes in both development and production modes
3. Verify changes work across different browsers and screen sizes
4. Run unit tests if available for the affected components

## Git Conventions
1. Commits should be atomic and focused
2. Use conventional commit messages:
   - feat: new features
   - fix: bug fixes
   - refactor: code changes that neither fix bugs nor add features
   - style: changes that don't affect code meaning
   - docs: documentation only changes

## Component Example
```tsx
"use client";

import React from 'react';
import { Typography } from '@mui/material';
import { myStyles } from '../../styles/components/my-styles';
import { SOME_CONSTANT } from '../../app/constants';

interface MyComponentProps {
  title: string;
  children: React.ReactNode;
}

export default function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div style={myStyles.container}>
      <Typography variant="h1">{title}</Typography>
      {children}
    </div>
  );
}
```
