# PRP: Add Tailwind CSS Class Sorting with Prettier

## Overview
Implement automatic TailwindCSS class sorting using Prettier plugin to ensure consistent class ordering across the codebase, while setting up Prettier with ESLint integration to avoid conflicts.

## Context & Research Findings

### Current Codebase State
- **Framework**: React Router v7 in SPA mode (`ssr: false`)
- **Styling**: TailwindCSS v4 with Vite plugin (`@tailwindcss/vite: ^4.1.4`)
- **Package Manager**: pnpm (evidenced by `pnpm-lock.yaml`)
- **TailwindCSS Import**: `@import "tailwindcss"` in `app/app.css`
- **No Existing Formatters**: No Prettier or ESLint configuration detected
- **Current Class Patterns**: Mix of single-line and multi-line class strings, inconsistent ordering

### Code Patterns Identified

#### Multi-line Classes (Perfect Use Case for Prettier)
From `app/components/budget-header.tsx:4-6`:
```tsx
className="flex justify-between sticky border-t-[12px] border-t-[#3E51FF]
      pt-2 px-3
    "
```

#### Complex Class Combinations
From `app/components/budget-table.tsx`:
```tsx
className="w-full flex items-center justify-center bg-white border-b-2 font-bold"
className="grid grid-cols-4 grid-rows-auto justify-items-center text-center"
```

#### Inconsistent Class Ordering Examples
- Layout first: `"flex flex-col gap-y-3"`
- Mixed ordering: `"absolute inset-0 flex items-center justify-center"`
- Utilities mixed: `"text-white font-bold text-sm px-2 text-center"`

## Technical Requirements & Documentation

### Official Prettier Tailwind Plugin
- **Documentation**: https://tailwindcss.com/blog/automatic-class-sorting-with-prettier
- **Key Feature**: Follows Tailwind's CSS layer structure for sorting
- **No Customization**: Fixed sorting order (which ensures team consistency)
- **Compatible**: Works with custom Tailwind configurations

### ESLint Integration Best Practices (2025)
Based on modern development practices:
1. **Separate Execution**: Run `eslint --fix` and `prettier --write` as separate steps
2. **Use eslint-config-prettier**: Disables conflicting ESLint formatting rules
3. **Modern Flat Config**: Use `eslint.config.js` for new projects
4. **Performance**: Prettier runs faster than ESLint on large files

## Implementation Blueprint

### Phase 1: Install Dependencies
```bash
# Install Prettier and Tailwind plugin
pnpm add -D prettier prettier-plugin-tailwindcss

# Install ESLint and conflict prevention
pnpm add -D eslint eslint-config-prettier
```

### Phase 2: Configuration Files

#### Create `.prettierrc.json`
```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

#### Create `eslint.config.js` (Modern Flat Config)
```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier, // Must be last to override other configs
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    ignores: [
      'node_modules/',
      'build/',
      '.react-router/',
      'schema.graphql'
    ]
  }
]
```

#### Create `.prettierignore`
```
node_modules/
build/
.react-router/
schema.graphql
pnpm-lock.yaml
```

### Phase 3: Package.json Scripts
Add to existing scripts section:
```json
{
  "scripts": {
    "build": "react-router build",
    "dev": "react-router dev", 
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "react-router typegen && tsc",
    "codegen": "graphql-codegen",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint . --fix",
    "lint:check": "eslint ."
  }
}
```

### Phase 4: Test Class Sorting

#### Before (from actual codebase):
```tsx
className="flex justify-between sticky border-t-[12px] border-t-[#3E51FF]
      pt-2 px-3
    "
```

#### After (expected result):
```tsx
className="sticky flex justify-between border-t-[12px] border-t-[#3E51FF] px-3 pt-2"
```

## Implementation Tasks (Sequential Order)

1. **Install Dependencies**
   - Install prettier and prettier-plugin-tailwindcss
   - Install eslint and eslint-config-prettier
   - Verify installation with `pnpm list`

2. **Create Configuration Files**
   - Create `.prettierrc.json` with Tailwind plugin
   - Create `eslint.config.js` with flat config format
   - Create `.prettierignore` to exclude build artifacts

3. **Update Package Scripts**
   - Add format and lint scripts to package.json
   - Ensure scripts use correct commands for project structure

4. **Test Configuration**
   - Run `pnpm format:check` to see current formatting issues
   - Run `pnpm format` on a sample file to verify class sorting
   - Run `pnpm lint:check` to ensure no ESLint conflicts

5. **Format Codebase**
   - Run `pnpm format` to format entire codebase
   - Review changes to ensure correct Tailwind class ordering
   - Verify no functional changes, only formatting

## Validation Gates (Must Pass)

```bash
# Verify Prettier works with Tailwind plugin
pnpm format:check
echo $? # Should be 0 for success, 1 for formatting needed

# Verify ESLint has no conflicts with Prettier
pnpm lint:check
echo $? # Should be 0 for no issues

# Test formatting on specific file
pnpm prettier --write app/components/budget-header.tsx

# Verify TypeScript compilation still works
pnpm typecheck

# Verify build process still works
pnpm build
```

## Expected Outcomes

### Consistency Benefits
1. **Automated Class Sorting**: All Tailwind classes automatically sorted by CSS layer
2. **Team Alignment**: No more debates about class ordering
3. **Reduced Diff Noise**: Consistent formatting reduces unnecessary diffs

### Development Workflow
1. **Editor Integration**: Works with VS Code, Cursor, WebStorm auto-formatting
2. **Pre-commit Hooks**: Can be integrated with husky/lint-staged later
3. **CI/CD Integration**: Format checking can be added to build pipeline

### Class Ordering Example
The plugin will sort classes following this order:
- Layout (flex, grid, block, etc.)
- Positioning (absolute, relative, etc.)  
- Sizing (w-, h-, etc.)
- Spacing (p-, m-, etc.)
- Typography (text-, font-, etc.)
- Background/Colors
- Borders
- Effects

## Gotchas & Important Notes

### Version Compatibility
- TailwindCSS v4 is fully supported by prettier-plugin-tailwindcss
- Plugin automatically detects Tailwind configuration
- Works with custom themes and custom utility classes

### ESLint Conflict Prevention
- `eslint-config-prettier` must be last in config array
- Avoid `eslint-plugin-prettier` (runs Prettier as ESLint rule)
- Prefer separate `prettier --write` execution for performance

### Editor Setup Considerations
- Configure "format on save" for immediate feedback
- Set up file associations for .tsx, .jsx files
- Consider workspace-specific settings for team consistency

## Risk Assessment & Mitigation

### Low Risk Items
- Plugin is officially maintained by Tailwind team
- Non-breaking changes (only formatting)
- Easy rollback if needed

### Potential Issues
- Large initial diff when formatting entire codebase
- Team adjustment period for new class ordering
- Need to ensure all team members have proper editor setup

### Mitigation Strategies
- Format codebase in separate commit with clear message
- Document new workflow in team guidelines
- Provide editor setup instructions

## Quality Checklist
- [x] All necessary context included
- [x] Validation gates are executable 
- [x] References existing patterns from codebase
- [x] Clear implementation path with sequential tasks
- [x] Error handling and gotchas documented
- [x] Modern best practices (2025) incorporated
- [x] Compatible with existing TailwindCSS v4 setup

## Confidence Score: 9/10

**High confidence** for one-pass implementation success due to:
- Comprehensive codebase analysis showing exact current state
- Official documentation and best practices research
- Clear validation steps with executable commands
- Modern tooling compatibility verified
- Sequential task breakdown with specific file examples
- Risk mitigation strategies identified

**Deducted 1 point** for potential team workflow adjustment period, but technical implementation is straightforward.