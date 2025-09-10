# PRP: Create BudgetsPanel Component for Modular Budget List UI

## Overview

Extract and modularize the existing budget list UI from `app/all-budgets/index.tsx` into a reusable `BudgetsPanel` component. This component will compose existing sub-components (title, progress, filtering, sorting, list) with flexible controlled/uncontrolled patterns using Zustand as the single source of truth.

## Context & Research Findings

### Current Implementation State

From `app/all-budgets/index.tsx` (lines 33-83), the existing structure includes:

```tsx
// Title section with magnifier eye
<p className="w-full text-center font-bold text-xl mb-3">{content.title}</p>
<div className="relative w-full h-0.5 bg-black mb-3">
  <img src="/image/magnifier-eye.svg" height={63} width={55} alt="magnifier eye logo" className="absolute bg-red -top-[31.5px] z-10" />
  <div className="absolute h-[63px] w-[55px] bg-[#F6F6F6] -top-[31.5px]" />
</div>

// Progress section
<div className="border-b-[2px] border-black flex items-center justify-center mb-5">
  <div className="border-[2px] px-2.5 py-1 border-black border-b-0 rounded-t-md bg-[#E9808E] text-[#f6f6f6] font-bold text-[16px]">
    {content.progressToggle}
  </div>
</div>
<section className="flex justify-center w-full font-bold text-lg text-[#3E51FF] mb-2">
  <p>最新進度</p>
</section>
<div className="w-full h-fit flex justify-center items-center mb-5">
  <ProgressBar className="w-[165px]" labels={content.progressLabels} />
</div>

// Filtering and Sorting
<div className="w-full h-0.5 bg-black" />
<BudgetsSelector />
<div className="w-full h-0.5 bg-black" />
<SortToolbar selectedValue={selectedSort} onChange={setSelectedSort} />
<div className="w-full h-0.5 bg-black" />

// List rendering
<div className="space-y-3">
  {sortBudgetsByOption(data?.budgets ?? [], selectedSort).map((budget) => (
    <section key={budget.id}>
      <p>{budget.projectName}</p>
    </section>
  ))}
</div>
```

### Existing Components Analysis

#### Zustand Store (`app/stores/budget-selector.tsx`)

```typescript
interface BudgetSelectState {
  selectedValue: string; // Filter value (default: "all")
  searchedValue: string; // Search value (default: "")
  visible: boolean; // Visibility toggle (default: true)
  selectedSort: string; // Sort value (default: "projectName-asc")
  setSelectedSort: (value: string) => void;
  // ... other actions
}
```

#### SortToolbar Component (`app/components/sort-toolbar.tsx`)

```typescript
interface SortToolbarProps {
  selectedValue: string;
  onChange: (value: string) => void;
}
// Exports sortBudgetsByOption(budgets: Budget[], selectedValue: string): Budget[]
```

#### Other Components

- **BudgetHeader**: Simple header with logo and share button (no props needed)
- **ProgressBar**: `ProgressBarProps` with optional `isFinished`, `count`, `width`, `height`, `gap`, `className`, `labels`
- **BudgetsSelector**: `BudgetsSelectorProps` with optional `onSelectionChange`, `className`

### Component Patterns Established

- Use `React.FC<Props>` with TypeScript interfaces
- Optional props with sensible defaults
- Proper event handler typing: `(value: string) => void`
- Consistent styling with TailwindCSS classes

## Implementation Blueprint

### Phase 1: Component Interface Definition

```typescript
// app/components/budgets-panel/index.tsx
import type { Budget } from "~/graphql/graphql";

type SortValue = string; // "projectName-asc", "budgetAmount-desc", etc.

interface BudgetsPanelProps {
  // Required data
  budgets: Budget[];

  // Loading states
  isLoading?: boolean;
  isError?: boolean;

  // Content customization
  title?: string; // Default: content.title from page-content.ts
  progressToggle?: string; // Default: content.progressToggle
  progressLabels?: string[]; // Default: content.progressLabels
  showProgress?: boolean; // Default: true

  // Styling
  className?: string;

  // Sort control (controlled vs uncontrolled)
  sortValue?: SortValue; // If provided, component runs in controlled mode
  onSortChange?: (value: SortValue) => void;

  // List rendering customization
  renderItem?: (budget: Budget, index: number) => React.ReactNode;

  // Event handlers
  onItemClick?: (budget: Budget) => void;

  // Component visibility toggles
  showHeader?: boolean; // Default: true
  showFilters?: boolean; // Default: true
  showSort?: boolean; // Default: true
}
```

### Phase 2: Core Component Structure

```typescript
// Following React Hooks Rules - all hooks at top level
const BudgetsPanel: React.FC<BudgetsPanelProps> = ({
  budgets,
  isLoading = false,
  isError = false,
  title,
  progressToggle,
  progressLabels,
  showProgress = true,
  className = "",
  sortValue, // undefined = uncontrolled mode
  onSortChange,
  renderItem,
  onItemClick,
  showHeader = true,
  showFilters = true,
  showSort = true,
}) => {
  // All hooks called unconditionally at top level
  const zustandSort = useStore(useBudgetSelectStore, (s) => s.selectedSort);
  const setZustandSort = useStore(useBudgetSelectStore, (s) => s.setSelectedSort);

  // Determine controlled vs uncontrolled mode
  const isControlled = sortValue !== undefined && onSortChange !== undefined;
  const currentSort = isControlled ? sortValue : zustandSort;
  const handleSortChange = isControlled ? onSortChange : setZustandSort;

  // Memoized sorted data
  const sortedBudgets = useMemo(() => {
    return sortBudgetsByOption(budgets, currentSort);
  }, [budgets, currentSort]);

  // Default content (import from existing page-content.ts)
  const defaultTitle = title ?? content.title;
  const defaultProgressToggle = progressToggle ?? content.progressToggle;
  const defaultProgressLabels = progressLabels ?? content.progressLabels;

  // Default item renderer
  const defaultRenderItem = (budget: Budget, index: number) => (
    <section
      key={budget.id}
      onClick={() => onItemClick?.(budget)}
      className={onItemClick ? "cursor-pointer" : ""}
    >
      <p>{budget.projectName}</p>
    </section>
  );

  const itemRenderer = renderItem ?? defaultRenderItem;

  // Early returns after all hooks
  if (isLoading) return <div>loading</div>;
  if (isError) return <div>Error loading budgets</div>;

  return (
    <div className={className}>
      {/* Header Section */}
      {showHeader && (
        <>
          <p className="w-full text-center font-bold text-xl mb-3">
            {defaultTitle}
          </p>
          <div className="relative w-full h-0.5 bg-black mb-3">
            <img
              src="/image/magnifier-eye.svg"
              height={63}
              width={55}
              alt="magnifier eye logo"
              className="absolute bg-red -top-[31.5px] z-10"
            />
            <div className="absolute h-[63px] w-[55px] bg-[#F6F6F6] -top-[31.5px]" />
          </div>
        </>
      )}

      {/* Progress Section */}
      {showProgress && (
        <>
          <div className="border-b-[2px] border-black flex items-center justify-center mb-5">
            <div className="border-[2px] px-2.5 py-1 border-black border-b-0 rounded-t-md bg-[#E9808E] text-[#f6f6f6] font-bold text-[16px]">
              {defaultProgressToggle}
            </div>
          </div>
          <section className="flex justify-center w-full font-bold text-lg text-[#3E51FF] mb-2">
            <p>最新進度</p>
          </section>
          <div className="w-full h-fit flex justify-center items-center mb-5">
            <ProgressBar className="w-[165px]" labels={defaultProgressLabels} />
          </div>
        </>
      )}

      {/* Filters Section */}
      {showFilters && (
        <>
          <div className="w-full h-0.5 bg-black" />
          <BudgetsSelector />
          <div className="w-full h-0.5 bg-black" />
        </>
      )}

      {/* Sort Section */}
      {showSort && (
        <>
          <SortToolbar
            selectedValue={currentSort}
            onChange={handleSortChange}
          />
          <div className="w-full h-0.5 bg-black" />
        </>
      )}

      {/* List Section */}
      <div className="space-y-3">
        {sortedBudgets.map((budget, index) => itemRenderer(budget, index))}
      </div>
    </div>
  );
};
```

### Phase 3: File Structure Setup

```
app/components/budgets-panel/
├── index.ts          // Export statement
└── budgets-panel.tsx // Main component
```

### Phase 4: Integration Pattern Examples

```typescript
// 1. Uncontrolled mode (default - uses Zustand store)
<BudgetsPanel budgets={data?.budgets ?? []} />

// 2. Controlled mode (parent manages sort)
const [sort, setSort] = useState<string>("budgetAmount-desc");
<BudgetsPanel
  budgets={data?.budgets ?? []}
  sortValue={sort}
  onSortChange={setSort}
/>

// 3. Custom rendering with click handlers
<BudgetsPanel
  budgets={data?.budgets ?? []}
  renderItem={(budget) => (
    <section className="border p-4 rounded hover:bg-gray-50">
      <h4 className="font-semibold">{budget.projectName ?? "（未命名）"}</h4>
      <div className="text-sm text-blue-700">
        預算金額：{typeof budget.budgetAmount === "number"
          ? `NT$ ${budget.budgetAmount.toLocaleString()}`
          : "未設定"}
      </div>
    </section>
  )}
  onItemClick={(budget) => navigate(`/budget/${budget.id}`)}
/>

// 4. Minimal configuration (headers/progress hidden)
<BudgetsPanel
  budgets={data?.budgets ?? []}
  showHeader={false}
  showProgress={false}
  className="mt-4"
/>
```

## Critical Implementation Details

### React Hooks Rules Compliance

- **All hooks called unconditionally** at component top level
- **No hooks inside conditions, loops, or nested functions**
- **Early returns only after all hooks** are called
- Reference: https://react.dev/reference/rules/rules-of-hooks

### TypeScript Integration

- **Import Budget type**: `import type { Budget } from "~/graphql/graphql";`
- **Reuse existing interfaces**: Import `SortToolbarProps` patterns
- **Proper generic typing**: Use existing patterns from `sort-toolbar.tsx`
- **Event handler types**: Follow `(value: string) => void` pattern

### State Management Patterns

```typescript
// Controlled vs Uncontrolled Detection
const isControlled = sortValue !== undefined && onSortChange !== undefined;

// State Selection Logic
const currentSort = isControlled ? sortValue : zustandSort;
const handleSortChange = isControlled ? onSortChange : setZustandSort;

// Memoized Performance
const sortedBudgets = useMemo(() => {
  return sortBudgetsByOption(budgets, currentSort);
}, [budgets, currentSort]);
```

### Component Composition Strategy

- **Reuse existing components**: No modifications to `SortToolbar`, `ProgressBar`, `BudgetsSelector`
- **Import from existing paths**: Leverage established import patterns
- **Maintain styling consistency**: Copy exact CSS classes from current implementation
- **Preserve functionality**: No changes to sort logic, filtering, or interactions

## Validation Gates

### Pre-Implementation Checklist

```bash
# Verify all dependencies exist
ls app/components/sort-toolbar.tsx
ls app/components/progress-bar.tsx
ls app/components/budgets-selector.tsx
ls app/stores/budget-selector.tsx

# Ensure development server runs
pnpm dev

# TypeScript compilation check
pnpm typecheck
```

### Implementation Validation Steps

```bash
# 1. TypeScript compilation (must pass)
pnpm typecheck

# 2. Build verification (must succeed)
pnpm build

# 3. Development server check (must start without errors)
pnpm dev

# 4. Import validation - check all imports resolve
grep -r "import.*budgets-panel" app/
```

### Functional Testing Checklist

1. **Visual Regression Testing**:
   - Component renders identical to current `all-budgets` page
   - All sections (title, progress, filters, sort, list) appear correctly
   - Styling matches exactly (colors, spacing, layout)

2. **Controlled Mode Testing**:

   ```typescript
   // Test controlled sort
   const [sort, setSort] = useState("budgetAmount-desc");
   // Verify sort changes update parent state
   // Verify list reorders correctly
   ```

3. **Uncontrolled Mode Testing**:

   ```typescript
   // Test default Zustand integration
   // Verify sort changes update Zustand store
   // Verify state persists across component remounts
   ```

4. **Customization Testing**:
   - Test custom `renderItem` function
   - Test `onItemClick` handlers
   - Test visibility toggles (`showProgress`, `showFilters`, etc.)
   - Test custom content props

5. **Integration Testing**:
   - Replace existing `all-budgets` implementation
   - Verify no functionality regressions
   - Verify Zustand store integration maintains state

## External Resources & Documentation

### React Patterns & Best Practices

- **React Hooks Rules**: https://react.dev/reference/rules/rules-of-hooks
- **Component Composition**: https://react.dev/learn/sharing-state-between-components
- **Controlled vs Uncontrolled**: https://react.dev/learn/sharing-state-between-components

### TypeScript Integration

- **React TypeScript Patterns**: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components
- **Component Props Typing**: Established patterns in existing codebase components

### Zustand Integration Patterns

- **Store Usage**: Follow existing `useBudgetSelectStore` patterns from `all-budgets/index.tsx`
- **State Selection**: Use `useStore(store, selector)` pattern consistently

## Expected Deliverables

1. **New Component Directory**:

   ```
   app/components/budgets-panel/
   ├── index.ts
   └── budgets-panel.tsx
   ```

2. **Updated `all-budgets/index.tsx`**:
   - Replace existing JSX structure with `<BudgetsPanel />` usage
   - Remove extracted code (title, progress, filters, sort sections)
   - Maintain imports for `BudgetHeader` (still used)
   - Pass `budgets` data as props

3. **No Breaking Changes**:
   - All existing components remain unchanged
   - Zustand store interface unchanged
   - All imports and dependencies preserved

4. **TypeScript Compliance**:
   - Proper interfaces for all props
   - Type-safe event handlers
   - Generic typing where appropriate

## Implementation Sequence & Time Estimates

1. **Component Structure Setup** (10 min)
   - Create directory and files
   - Set up basic component skeleton with proper imports

2. **Props Interface Implementation** (15 min)
   - Define comprehensive `BudgetsPanelProps` interface
   - Set up controlled/uncontrolled logic
   - Implement hooks following React rules

3. **JSX Structure Migration** (20 min)
   - Copy existing JSX structure from `all-budgets/index.tsx`
   - Add conditional rendering for sections
   - Implement default content handling

4. **Integration & Testing** (15 min)
   - Update `all-budgets/index.tsx` to use new component
   - Test controlled and uncontrolled modes
   - Verify all functionality works correctly

**Total Estimated Time**: ~60 minutes for complete implementation

## Risk Mitigation

### Potential Issues & Solutions

1. **React Hooks Rules Violations**: Follow strict hook calling pattern, no conditional hooks
2. **TypeScript Type Errors**: Reuse established patterns from existing components
3. **Zustand Integration Issues**: Copy exact patterns from current `all-budgets` implementation
4. **CSS/Layout Regressions**: Copy exact CSS classes, test visual appearance
5. **Performance Issues**: Use `useMemo` for expensive operations like sorting

### Implementation Safety Measures

- **Incremental approach**: Build component first, integrate second
- **Copy existing patterns**: Reuse proven code patterns throughout codebase
- **Comprehensive testing**: Verify both controlled and uncontrolled modes work
- **Visual verification**: Ensure no styling regressions occur

## Success Criteria

- ✅ `BudgetsPanel` component renders identically to current `all-budgets` page
- ✅ Both controlled and uncontrolled modes work correctly
- ✅ All existing functionality preserved (filtering, sorting, styling)
- ✅ TypeScript compilation passes without warnings or errors
- ✅ Zustand store integration works seamlessly in both modes
- ✅ Component composition follows established codebase patterns
- ✅ Custom rendering and event handlers work correctly
- ✅ Performance optimized with proper `useMemo` usage
- ✅ Component is reusable in other parts of application
- ✅ No breaking changes to existing code

## Confidence Score: 9/10

This PRP provides comprehensive guidance for successful one-pass implementation because:

**Strengths:**

- **Well-defined scope**: Extracting existing, working code rather than creating new functionality
- **Established patterns**: All sub-components and state management already work correctly
- **Clear implementation path**: Step-by-step extraction and composition process
- **Comprehensive examples**: Multiple usage patterns with actual code samples
- **Solid validation approach**: Both automated and manual testing strategies

**Minor Risk:**
The only complexity is ensuring React Hooks rules compliance during the controlled/uncontrolled logic implementation, but the provided patterns and examples mitigate this risk effectively.

The implementation leverages proven, existing code and follows established codebase patterns, making it highly likely to succeed in a single implementation pass.
