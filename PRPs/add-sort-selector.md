# PRP: Add Sort Selector Component for Budget Listings

## Overview

Implement a reusable sort selector component using react-select v5 to enable users to sort budget data lists by various criteria (project name, budget amount, year) with ascending/descending options. The component will integrate into `app/all-budgets/index.tsx` and follow existing patterns in the codebase.

## Context & Research Findings

### Current Codebase State

- **Framework**: React Router v7 in SPA mode (`ssr: false`)
- **Styling**: TailwindCSS v4 with Vite plugin
- **State Management**: React Query for data fetching, Zustand for component state (`budget-selector` store exists)
- **react-select**: Version `^5.10.2` already installed and used in `app/components/budgets-selector.tsx`
- **TypeScript**: Full type safety with generated GraphQL types

### Existing GraphQL Data Structure

From `app/graphql/graphql.ts`, the Budget type includes:

```typescript
export type Budget = {
  __typename?: "Budget";
  budgetAmount?: Maybe<Scalars["Int"]["output"]>;
  id: Scalars["ID"]["output"];
  projectName?: Maybe<Scalars["String"]["output"]>;
  projectDescription?: Maybe<Scalars["String"]["output"]>;
  year?: Maybe<Scalars["Int"]["output"]>;
  majorCategory?: Maybe<Scalars["String"]["output"]>;
  mediumCategory?: Maybe<Scalars["String"]["output"]>;
  minorCategory?: Maybe<Scalars["String"]["output"]>;
  // ... other fields
};
```

### Target Integration Point

File: `app/all-budgets/index.tsx`

- Current structure: Uses React Query to fetch budgets data
- Renders simple list: `{data?.budgets?.map((budget) => <section key={budget.id}><p>{budget.projectName}</p></section>)}`
- Already imports `BudgetsSelector` component (filtering dropdown)
- Placement: Should be added near line 50, in the toolbar area between `BudgetsSelector` and the data list

### Existing react-select Patterns

From `app/components/budgets-selector.tsx`:

```typescript
import Select, { components } from "react-select";

// Custom dropdown indicator pattern already established
const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src="/icon/dropdown-container.svg" alt="dropdown" width="10" height="8" />
    </components.DropdownIndicator>
  );
};

// Styling pattern established
styles={{
  control: (styles) => ({ ...styles, border: "2px solid black" }),
  indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
}}
```

### Existing useMemo Pattern

From `app/hooks/useProgressState.ts`:

```typescript
const totalHeight = useMemo(() => {
  // Calculate total height: first box height + (remaining boxes * overlap height)
  return height + (height - gap) * (count - 1);
}, [height, gap, count]);
```

## Implementation Blueprint

### Phase 1: TypeScript Types and Sort Options Definition

```typescript
// Define in the component file or shared types
type SortOption {
  value: string; // "projectName-asc", "budgetAmount-desc", etc.
  label: string; // "專案名稱 (A-Z)", "預算金額 (高到低)", etc.
  field: keyof Pick<Budget, "projectName" | "budgetAmount" | "year">;
  direction: "asc" | "desc";
}

const sortOptions: SortOption[] = [
  {
    value: "projectName-asc",
    label: "專案名稱 (A-Z)",
    field: "projectName",
    direction: "asc",
  },
  {
    value: "projectName-desc",
    label: "專案名稱 (Z-A)",
    field: "projectName",
    direction: "desc",
  },
  {
    value: "budgetAmount-desc",
    label: "預算金額 (高到低)",
    field: "budgetAmount",
    direction: "desc",
  },
  {
    value: "budgetAmount-asc",
    label: "預算金額 (低到高)",
    field: "budgetAmount",
    direction: "asc",
  },
  {
    value: "year-desc",
    label: "年度 (新到舊)",
    field: "year",
    direction: "desc",
  },
  {
    value: "year-asc",
    label: "年度 (舊到新)",
    field: "year",
    direction: "asc",
  },
];
```

### Phase 2: Sort Logic Implementation with useMemo

```typescript
// In app/all-budgets/index.tsx
const [selectedSort, setSelectedSort] = useState<string>(sortOptions[0].value);

const sortedBudgets = useMemo(() => {
  if (!data?.budgets?.length) return [];
  const selected = sortOptions.find((o) => o.value === selectedSort);
  if (!selected) return data.budgets;

  return [...data.budgets].sort((a, b) => {
    const aValue = a[selected.field];
    const bValue = b[selected.field];

    // Handle numeric fields (budgetAmount, year)
    if (selected.field === "budgetAmount" || selected.field === "year") {
      const aNum = Number(aValue) || 0;
      const bNum = Number(bValue) || 0;
      return selected.direction === "asc" ? aNum - bNum : bNum - aNum;
    }

    // Handle string fields (projectName)
    const aStr = String(aValue ?? "").toLowerCase();
    const bStr = String(bValue ?? "").toLowerCase();
    return selected.direction === "asc"
      ? aStr.localeCompare(bStr, "zh-TW")
      : bStr.localeCompare(aStr, "zh-TW");
  });
}, [data?.budgets, selectedSort]);
```

### Phase 3: Sort Selector Component with react-select

```typescript
// Reuse existing DropdownIndicator from budgets-selector.tsx
const SortSelector: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">排序方式：</span>
      <Select
        inputId="budget-sort-select"
        classNamePrefix="budget-sort"
        options={sortOptions.map(o => ({ value: o.value, label: o.label }))}
        value={{
          value: selectedSort,
          label: sortOptions.find(o => o.value === selectedSort)?.label ?? sortOptions[0].label
        }}
        onChange={(opt) => setSelectedSort(opt?.value ?? sortOptions[0].value)}
        components={{ DropdownIndicator }}
        aria-label="選擇排序方式"
        styles={{
          control: (base) => ({ ...base, border: '2px solid black', boxShadow: 'none' }),
          indicatorSeparator: () => ({ display: 'none' }),
        }}
      />
    </div>
  );
};
```

### Phase 4: Integration into AllBudgets Component

Location: Replace line 53-57 in `app/all-budgets/index.tsx`

```typescript
// Add sort selector before the budget list
<div className="w-full h-0.5 bg-black" />
<div className="py-3">
  <SortSelector />
</div>
<div className="w-full h-0.5 bg-black" />

{/* Update budget list to use sorted data */}
{sortedBudgets?.map((budget) => (
  <section key={budget.id}>
    <p>{budget.projectName}</p>
  </section>
))}
```

## Critical Implementation Details

### TypeScript Integration

- Import `Budget` type from `~/graphql/graphql`
- Use proper generic typing for react-select: `Select<{ value: string; label: string }>`
- Leverage existing `DropdownIndicator` component from `budgets-selector.tsx`

### Performance Considerations

- Use `useMemo` for expensive sort operations
- Dependency array includes `[data?.budgets, selectedSort]`
- Sort only when necessary (data changes or sort selection changes)

### Accessibility & UX

- Proper ARIA labels for screen readers
- Clear visual hierarchy with existing styling patterns
- Keyboard navigation support (built into react-select)
- Chinese locale support with `localeCompare('zh-TW')`

### Error Handling Strategy

- Default to first sort option if selection is invalid
- Handle `null`/`undefined` values in budget fields safely
- Graceful fallback if no budgets data exists

## Validation Gates

### Pre-Implementation Checklist

```bash
# Ensure development server runs correctly
pnpm dev

# Verify react-select dependency exists
grep "react-select" package.json

# TypeScript compilation
pnpm typecheck

# Confirm target file exists and structure
cat app/all-budgets/index.tsx | head -20
```

### Post-Implementation Validation

```bash
# TypeScript type checking (must pass)
pnpm typecheck

# Build verification (must succeed)
pnpm build

# Development server verification (must start without errors)
pnpm dev

# Manual functional testing checklist:
# 1. Sort selector appears in the budgets list page
# 2. Dropdown opens and shows all sort options
# 3. Selecting different options reorders the list
# 4. Default sort option is applied on page load
# 5. Custom dropdown indicator appears correctly
# 6. Keyboard navigation works (Tab, Enter, Arrow keys)
# 7. Screen reader announces sort options correctly
```

### Component Testing Strategy

1. **Visual Verification**: Sort selector renders with consistent styling
2. **Functional Testing**: All sort options correctly reorder budget data
3. **Performance Testing**: No unnecessary re-renders during sort changes
4. **Accessibility Testing**: Keyboard navigation and screen reader compatibility
5. **Integration Testing**: Works seamlessly with existing BudgetsSelector filtering

## External Resources & Documentation

### react-select v5 Documentation

- **Main Documentation**: https://react-select.com/
- **TypeScript Guide**: https://react-select.com/typescript
- **Custom Components**: https://react-select.com/components
- **Styling Guide**: https://react-select.com/styles

### Referenced Stack Overflow Examples

- **TypeScript Typing**: https://stackoverflow.com/questions/57539176/how-to-use-react-select-types-when-creating-custom-components
- **Custom Indicators**: https://github.com/JedWatson/react-select/issues/3803
- **Component Examples**: https://hpcodes.medium.com/customizing-the-dropdown-components-in-react-select-677a4408a61f

### Best Practices for Chinese Localization

- Use `localeCompare('zh-TW')` for proper string sorting
- Consider Traditional Chinese character ordering
- Test with various Chinese project names for accuracy

## Expected Deliverables

1. **Modified File**: `app/all-budgets/index.tsx`
   - Added sort state management with `useState`
   - Integrated `useMemo` for performant sorting
   - Added sort selector component inline
   - Updated budget list to use `sortedBudgets`

2. **No New Files Required**:
   - Reuses existing `DropdownIndicator` from `budgets-selector.tsx`
   - Leverages existing react-select dependency
   - No additional state management needed

3. **TypeScript Enhancements**:
   - Proper type definitions for `SortOption` type
   - Type-safe sorting logic for Budget fields
   - Generic typing for react-select component

## Implementation Sequence & Time Estimates

1. **Type Definitions** (5 min)
   - Define `SortOption` type
   - Create `sortOptions` array with all sort configurations

2. **Sort Logic Implementation** (15 min)
   - Add state management for selected sort
   - Implement `useMemo` sorting logic with proper Chinese locale support
   - Handle null/undefined field values safely

3. **Component Integration** (10 min)
   - Add sort selector component inline in AllBudgets
   - Import and reuse existing DropdownIndicator
   - Apply consistent styling patterns

4. **Testing & Validation** (10 min)
   - Run TypeScript compilation
   - Manual testing of sort functionality
   - Accessibility testing with keyboard navigation

**Total Estimated Time**: ~40 minutes for complete implementation

## Success Criteria

- ✅ Sort selector renders correctly with all 6 sort options
- ✅ Budget list reorders immediately when sort option changes
- ✅ TypeScript compilation passes without warnings
- ✅ Consistent styling with existing components
- ✅ Proper Chinese locale string sorting (A-Z, Z-A)
- ✅ Numeric sorting works correctly (high-low, low-high, new-old, old-new)
- ✅ Keyboard accessibility and screen reader support
- ✅ Performance optimized with useMemo
- ✅ Error handling for edge cases (null values, empty data)

## Risk Mitigation

### Potential Issues & Solutions

1. **Type Errors**: Budget type is well-defined in GraphQL generated types
2. **Performance Issues**: useMemo prevents unnecessary re-sorts
3. **Chinese Sorting**: Using `localeCompare('zh-TW')` for proper locale support
4. **Empty Data**: Proper null checks and fallbacks implemented
5. **Style Conflicts**: Reusing proven patterns from existing components

## Confidence Score: 9/10

This PRP provides comprehensive context including:

- Detailed analysis of existing codebase patterns
- Complete TypeScript type definitions
- Proven react-select integration patterns from existing code
- Executable validation gates
- Clear implementation sequence
- Performance and accessibility considerations
- Specific locale handling for Chinese text

The only minor risk is ensuring Chinese character sorting works perfectly, but `localeCompare('zh-TW')` is the standard solution for this use case.
