# PRP: Add Budget Header and Progress Bar Components

## Overview

Implement two reusable React components (BudgetHeader and ProgressBar) adapted from Next.js patterns to React Router v7, with Zustand state management integration following separation of concerns principles.

## Context & Research Findings

### Current Codebase State

- **Framework**: React Router v7 in SPA mode (`ssr: false`)
- **Styling**: TailwindCSS v4 with Vite plugin
- **State Management**: React Query for data fetching, no global state management
- **Assets**: All required SVG assets exist in `public/image/` and `public/icon/`:
  - `/image/readr-header.svg` (92x28)
  - `/icon/share-header.svg` (20x20)
  - `/image/progress-box.svg`
  - `/image/not-finished-progress-box.svg`
  - `/image/eye.svg` (72x28)
- **Component Structure**: No existing components directory, need to create structure

### Key Architecture Patterns Identified

1. **React Router v7 Static Assets**: Assets in `public/` directory are served at root path in development and production
2. **Component Architecture**: Focus on separation of concerns with custom hooks for logic extraction
3. **Zustand Integration**: Lightweight state management for component state coordination

### Technical Adaptations Required

#### Next.js to React Router v7 Migrations:

1. **Image Handling**: Replace `next/image` with standard `<img>` tags
2. **Asset Paths**: Use direct paths (`/image/file.svg`) instead of import-based assets
3. **Button Components**: Replace shadcn/ui Button with custom implementation or standard button elements
4. **State Management**: Integrate Zustand for shared component state

## Implementation Blueprint

### Phase 1: Setup and Dependencies

```bash
# Install required dependencies
pnpm add zustand
pnpm add -D @types/react
```

### Phase 2: Project Structure Creation

```
app/
├── components/
│   ├── ui/
│   │   ├── BudgetHeader/
│   │   │   ├── index.ts
│   │   │   ├── BudgetHeader.tsx
│   │   │   └── BudgetHeader.types.ts
│   │   └── ProgressBar/
│   │       ├── index.ts
│   │       ├── ProgressBar.tsx
│   │       └── ProgressBar.types.ts
├── stores/
│   └── uiStore.ts
└── hooks/
    └── useProgressState.ts
```

### Phase 3: Component Implementation Strategy

#### BudgetHeader Component

**Adaptations from Next.js example:**

- Replace `next/image` with `<img>` tags and proper alt text
- Remove shadcn Button dependency, use semantic button elements
- Add click handlers for logo and share functionality
- Integrate with Zustand for header state (if needed)

**Core Implementation:**

```tsx
// Pseudocode Structure
interface BudgetHeaderProps {
  onLogoClick?: () => void;
  onShareClick?: () => void;
  className?: string;
}

const BudgetHeader = ({
  onLogoClick,
  onShareClick,
  className,
}: BudgetHeaderProps) => {
  return (
    <header
      className={`sticky flex justify-between border-t-[12px] border-t-[#3E51FF] px-3 pt-2 ${className}`}
    >
      <button
        onClick={onLogoClick}
        className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <img
          src="/image/readr-header.svg"
          height={28}
          width={92}
          alt="Readr logo"
        />
      </button>
      <button
        onClick={onShareClick}
        className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <img
          src="/icon/share-header.svg"
          height={20}
          width={20}
          alt="Share this page"
        />
      </button>
    </header>
  );
};
```

#### ProgressBar Component

**Adaptations from Next.js example:**

- Replace `next/image` with `<img>` tags
- Enhance TypeScript interfaces for better type safety
- Extract progress calculation logic to custom hook
- Add Zustand integration for progress state management

**Core Implementation:**

```tsx
// Pseudocode Structure
interface ProgressBarProps {
  isFinished?: boolean;
  count?: number;
  width?: number;
  height?: number;
  gap?: number;
  className?: string;
  labels?: string[];
}

const ProgressBar = ({
  isFinished = true,
  count = 3,
  width = 165,
  height = 48,
  gap = 16,
  className = "",
  labels = [],
}: ProgressBarProps) => {
  const { totalHeight, baseZIndex } = useProgressCalculations({
    height,
    gap,
    count,
  });
  const progressBoxSrc = isFinished
    ? "/image/progress-box.svg"
    : "/image/not-finished-progress-box.svg";

  return (
    <section
      className={`relative ${className}`}
      style={{ height: totalHeight }}
    >
      {/* Eye icon positioned absolutely */}
      <img
        src="/image/eye.svg"
        alt="Status indicator"
        height={28}
        width={72}
        className="absolute -top-[14px] -right-[38px] z-[99]"
      />

      {/* Progress boxes with labels */}
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: index * (height - gap),
            zIndex: baseZIndex - index * 10,
          }}
        >
          <img
            src={progressBoxSrc}
            height={height}
            width={width}
            alt={`Progress step ${index + 1}`}
          />
          {/* Label overlay logic */}
        </div>
      ))}
    </section>
  );
};
```

### Phase 4: State Management Integration

#### Zustand Store Setup

```tsx
// stores/uiStore.ts - Pseudocode
interface UIState {
  headerState: {
    isShareModalOpen: boolean;
  };
  progressState: {
    currentStep: number;
    isComplete: boolean;
  };
  actions: {
    toggleShareModal: () => void;
    updateProgressStep: (step: number) => void;
    markProgressComplete: () => void;
  };
}

const useUIStore = create<UIState>((set) => ({
  // State implementation
}));
```

#### Custom Hooks for Logic Separation

```tsx
// hooks/useProgressState.ts - Pseudocode
const useProgressCalculations = ({ height, gap, count }) => {
  const totalHeight = useMemo(
    () => height + (height - gap) * (count - 1),
    [height, gap, count]
  );
  const baseZIndex = 90;

  return { totalHeight, baseZIndex };
};
```

### Phase 5: Homepage Integration

#### Integration with Existing Welcome Component

- Import and use both components in the welcome page
- Connect with existing GraphQL data for progress state
- Ensure responsive design compatibility

## Critical Implementation Details

### Image Optimization & Accessibility

- Use semantic HTML with proper alt attributes
- Implement proper focus management for buttons
- Ensure responsive image sizing with CSS

### Performance Considerations

- Lazy load images only if component is not immediately visible
- Use CSS transforms instead of re-rendering for animations
- Memoize expensive calculations in progress bar

### Error Handling Strategy

- Graceful fallbacks for missing SVG assets
- TypeScript strict mode compliance
- Console warnings for development debugging

## Validation Gates

### Pre-Implementation Checklist

```bash
# Ensure development server runs correctly
pnpm dev

# Verify all required assets exist
ls -la public/image/*.svg public/icon/*.svg

# TypeScript compilation
pnpm typecheck
```

### Post-Implementation Validation

```bash
# TypeScript type checking
pnpm typecheck

# Build verification
pnpm build

# Development server verification
pnpm dev

# Component accessibility testing (manual)
# 1. Tab navigation should work through buttons
# 2. Screen readers should announce image alt text
# 3. Focus indicators should be visible
```

### Component Testing Strategy

1. **Visual Verification**: Components render with correct styling and assets
2. **Interaction Testing**: Button clicks trigger expected behavior
3. **Responsive Testing**: Components adapt correctly to different screen sizes
4. **State Management**: Zustand store updates propagate correctly
5. **Integration Testing**: Components work correctly within homepage context

## Documentation Requirements

### Component Documentation

Each component should include:

- TypeScript interfaces with JSDoc comments
- Usage examples in component files
- Props documentation with default values
- Accessibility considerations

### State Management Documentation

- Zustand store structure and usage patterns
- Custom hooks and their purposes
- State flow diagrams (if complex)

## Expected Deliverables

1. **Components**:
   - `app/components/ui/BudgetHeader/` - Complete header component with TypeScript
   - `app/components/ui/ProgressBar/` - Complete progress bar component with TypeScript

2. **State Management**:
   - `app/stores/uiStore.ts` - Zustand store for component state
   - `app/hooks/useProgressState.ts` - Custom hooks for progress calculations

3. **Integration**:
   - Updated `app/welcome/welcome.tsx` to use both components
   - Proper TypeScript types for all new code

4. **Configuration**:
   - Updated `package.json` with Zustand dependency
   - Proper export patterns for component reusability

## Success Criteria

- ✅ Both components render correctly without errors
- ✅ All SVG assets load properly from public directory
- ✅ TypeScript compilation passes without warnings
- ✅ Components integrate seamlessly with homepage
- ✅ Zustand state management works correctly
- ✅ Responsive design works on mobile and desktop
- ✅ Accessibility guidelines followed (keyboard navigation, alt text)
- ✅ Code follows React Router v7 and modern React patterns

## Risk Mitigation

### Potential Issues & Solutions

1. **Missing Assets**: Verified all required SVGs exist in public directory
2. **CSS Conflicts**: Use scoped classes and CSS modules if needed
3. **State Management Complexity**: Keep Zustand store simple and focused
4. **Browser Compatibility**: Test in multiple browsers, use standard CSS properties
5. **Performance Issues**: Implement proper memoization and avoid unnecessary re-renders

## Reference Documentation

### Key Resources

- **Zustand Documentation**: https://github.com/pmndrs/zustand
- **React Router v7 Documentation**: https://reactrouter.com/
- **TailwindCSS v4**: https://tailwindcss.com/docs
- **React 19 Patterns**: Modern React development practices
- **Architecture Guide**: https://dev.to/neetigyachahar/architecture-guide-building-scalable-react-or-react-native-apps-with-zustand-react-query-1nn4

### Implementation Sequence

1. **Setup Phase** (10 min)
   - Install Zustand dependency
   - Create component directory structure

2. **BudgetHeader Implementation** (20 min)
   - Create component with proper TypeScript types
   - Implement click handlers and accessibility

3. **ProgressBar Implementation** (30 min)
   - Create component with complex positioning logic
   - Extract calculations to custom hooks
   - Implement proper label rendering

4. **State Management** (15 min)
   - Create Zustand store for UI state
   - Implement custom hooks for calculations

5. **Integration & Testing** (15 min)
   - Integrate components into homepage
   - Verify all functionality works correctly
   - Run validation gates

**Total Estimated Time**: ~90 minutes for complete implementation

## Confidence Score: 9/10

This PRP provides comprehensive context, clear implementation patterns, executable validation gates, and addresses all critical technical considerations for successful one-pass implementation. The only potential complexity is the ProgressBar positioning logic, but the pseudocode and existing assets provide sufficient guidance.
