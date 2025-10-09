# PRP: Add Home Page Design and Implementation

## Overview

重新設計並實作應用程式首頁，包含標題、banner 圖片、描述內容和四個導航按鈕，並新增協作區路由。頁面需要支援響應式設計，在桌面和行動裝置上提供良好的使用體驗。

## Context & Research Findings

### Current Codebase State

- **Framework**: React Router v7 in SPA mode (`ssr: false`)
- **Styling**: TailwindCSS v4 + DaisyUI plugin
- **State Management**: Zustand v5.0.8 (已安裝且有完整的 `uiStore.ts`)
- **Package Manager**: pnpm
- **TypeScript**: 嚴格模式，避免使用 `any` 型別
- **Image Handling**: 
  - 自定義 `Image` 組件位於 `app/components/image.tsx`
  - 使用 `STATIC_ASSETS_PREFIX = "/project/3/congress-budget-watch"` (from `app/constants/config.ts`)
  - 圖片資源存放在 `public/image/` 和 `public/icon/`

### Existing Route Structure

From `app/routes.ts`:

```typescript
export default [
  index("routes/home.tsx"),                                  // "/" - Home page
  route("/all-budgets", "all-budgets/index.tsx"),           // 歷年預算
  route("/visualization", "visualization/index.tsx"),        // 視覺化專區
  route("/budget/:id", "budget-detail/index.tsx"),
  route("/visualization/legislator/:id", "visualization/legislator/index.tsx"),
] satisfies RouteConfig;
```

### Current Home Page (`routes/home.tsx`)

當前實作非常簡單，只有基本的 header 和一個連結：

```tsx
export default function Home() {
  return (
    <>
      <BudgetHeader />
      <NavLink to="/all-budgets">All Budgets</NavLink>
    </>
  );
}
```

**需要完全重構為功能完整的 landing page。**

### Design Patterns Identified

#### Button Styling Patterns

從 `app/visualization/index.tsx` 發現的按鈕樣式模式：

```tsx
// Active state
className="rounded px-2.5 transition-colors bg-[#3E51FF] text-white"

// Inactive state
className="rounded px-2.5 transition-colors border border-gray-300 bg-white text-gray-800"
```

從 Feature 需求中的按鈕樣式：

```css
/* Mobile version */
border: 3px solid #E9808E
bg-white
onSelected: bg-[#E9808E]
```

**專案主題色**:
- 主色（藍）: `#3E51FF`
- 次色（粉紅）: `#E9808E`
- 背景色: `#F6F6F6` (from `app/app.css`)

#### Responsive Layout Patterns

從 `app/all-budgets/index.tsx` 發現的響應式模式：

```tsx
// Desktop: max-width with auto margin
<div className="md:max-w-[720px] lg:max-w-[960px] p-5 md:mx-auto md:p-0 md:pt-8">
  {/* Content */}
</div>

// Mobile-first with md: breakpoint
<div className="flex flex-col gap-y-3 md:flex-row md:gap-x-6">
```

#### Image Component Pattern

From `app/components/image.tsx`:

```tsx
const Image = ({ src, ...props }: { src: string; alt: string; className?: string }) => {
  return <img src={STATIC_ASSETS_PREFIX + src} {...props} />;
};
```

### Assets Verification

確認所需資源已存在：
- ✅ `public/image/homepage-banner.svg` - Banner 圖片（已確認存在）
- ✅ `public/image/readr-header.svg` - Header logo (已用於 BudgetHeader)
- ✅ `public/icon/share-header.svg` - Share icon (已用於 BudgetHeader)

## Feature Requirements Analysis

根據 `FEATs/add-home-page.md` 的需求：

### 1. Content Requirements

- **標題**: "中央政府總預算案審查監督平台"
- **Banner**: 使用 `public/image/homepage-banner.svg`
- **描述文字**: "收錄歷年及最新中央政府預算審議情形，包含立委提案刪減和凍結的緣由和金額，便於搜尋及比較，更能即時追蹤最新審議進度。還可透過視覺化方式瀏覽，一目暸然。除了已數位化的資料，此平台也透過群眾協力（crowdsourcing）辨識提案掃描檔，歡迎至協作區加入合作行列。"

### 2. Navigation Buttons (4 buttons)

1. **歷年預算** → 連結到 `/all-budgets` (existing route)
2. **最新年度預算** → 連結到 `#` (placeholder, 未來功能)
3. **視覺化專區** → 連結到 `/visualization` (existing route)
4. **協作區** → 連結到新建的路由 `/collaboration`

### 3. Mobile Version Styling Requirements

```css
flex, flex-col, gap-y-9
button: 
  - border: 3px solid #E9808E
  - bg-white
  - onSelected: bg-[#E9808E]
```

### 4. Accessibility Requirements

- Semantic HTML (header, main, nav)
- Proper alt text for images
- Keyboard navigation support
- Focus indicators for interactive elements

## Implementation Blueprint

### Phase 1: Create Collaboration Route

#### 1.1 Create Collaboration Page Component

```tsx
// app/routes/collaboration.tsx - Pseudocode
import BudgetHeader from "~/components/budget-header";

export function meta() {
  return [
    { title: "協作區 - 國會預算監督平台" },
    { name: "description", content: "加入協作，一起辨識預算提案" },
  ];
}

export default function Collaboration() {
  return (
    <>
      <BudgetHeader />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">協作區</h1>
        <p className="text-gray-700">
          歡迎加入協作行列，協助辨識預算提案掃描檔。
        </p>
        {/* Future: Add crowdsourcing functionality */}
      </div>
    </>
  );
}
```

#### 1.2 Update Routes Configuration

```typescript
// app/routes.ts - Add new route
export default [
  index("routes/home.tsx"),
  route("/all-budgets", "all-budgets/index.tsx"),
  route("/visualization", "visualization/index.tsx"),
  route("/collaboration", "routes/collaboration.tsx"), // ⬅️ New route
  route("/budget/:id", "budget-detail/index.tsx"),
  route("/visualization/legislator/:id", "visualization/legislator/index.tsx"),
] satisfies RouteConfig;
```

### Phase 2: Implement Home Page Component

#### 2.1 Component Structure

```tsx
// app/routes/home.tsx - Complete Redesign

import { NavLink } from "react-router";
import BudgetHeader from "~/components/budget-header";
import Image from "~/components/image";

export function meta() {
  return [
    { title: "中央政府總預算案審查監督平台" },
    { 
      name: "description", 
      content: "收錄歷年及最新中央政府預算審議情形，包含立委提案刪減和凍結的緣由和金額，便於搜尋及比較，更能即時追蹤最新審議進度。" 
    },
  ];
}

interface NavigationButton {
  label: string;
  href: string;
  isExternal?: boolean;
}

const navigationButtons: NavigationButton[] = [
  { label: "歷年預算", href: "/all-budgets" },
  { label: "最新年度預算", href: "#" }, // Placeholder
  { label: "視覺化專區", href: "/visualization" },
  { label: "協作區", href: "/collaboration" },
];

export default function Home() {
  return (
    <>
      <BudgetHeader />
      
      <main className="min-h-screen bg-background p-5 md:p-8">
        <div className="mx-auto max-w-4xl">
          {/* Title Section */}
          <header className="mb-8 text-center md:mb-12">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
              中央政府總預算案審查監督平台
            </h1>
            
            {/* Banner Image */}
            <div className="mb-8 flex justify-center">
              <Image
                src="/image/homepage-banner.svg"
                alt="國會預算監督平台 Banner"
                className="h-auto w-full max-w-2xl"
              />
            </div>
            
            {/* Description */}
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
              收錄歷年及最新中央政府預算審議情形，包含立委提案刪減和凍結的緣由和金額，便於搜尋及比較，更能即時追蹤最新審議進度。還可透過視覺化方式瀏覽，一目暸然。除了已數位化的資料，此平台也透過群眾協力（crowdsourcing）辨識提案掃描檔，歡迎至協作區加入合作行列。
            </p>
          </header>
          
          {/* Navigation Buttons */}
          <nav 
            className="flex flex-col gap-y-9 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-4"
            aria-label="主要導航"
          >
            {navigationButtons.map((button) => (
              <NavLink
                key={button.label}
                to={button.href}
                className={({ isActive }) =>
                  `rounded-lg border-3 border-[#E9808E] px-6 py-4 text-center text-lg font-medium transition-colors
                  ${isActive 
                    ? "bg-[#E9808E] text-white" 
                    : "bg-white text-gray-800 hover:bg-[#E9808E] hover:text-white"
                  }
                  focus:outline-none focus:ring-2 focus:ring-[#E9808E] focus:ring-offset-2`
                }
              >
                {button.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </main>
    </>
  );
}
```

#### 2.2 TypeScript Interfaces

```typescript
// Types are inline in component for simplicity
interface NavigationButton {
  label: string;
  href: string;
  isExternal?: boolean; // For future external links
}
```

### Phase 3: Responsive Design Implementation

#### 3.1 Mobile-First Approach

```tsx
// Mobile (default): flex-col with vertical spacing
className="flex flex-col gap-y-9"

// Desktop (md breakpoint): Grid layout
className="md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-4"
```

#### 3.2 Button Responsive Behavior

```tsx
// Mobile: Full width buttons with vertical stacking
// Desktop: 2x2 grid (md breakpoint) → 4 columns (lg breakpoint)

<nav className="flex flex-col gap-y-9 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-4">
  {/* Buttons */}
</nav>
```

### Phase 4: Styling and Theme Consistency

#### 4.1 Color Palette

```css
/* Primary Colors */
--primary-blue: #3E51FF
--primary-pink: #E9808E
--background: #F6F6F6
--text-gray: #868686

/* Button States */
Default: bg-white, border-[#E9808E]
Hover: bg-[#E9808E], text-white
Active/Selected: bg-[#E9808E], text-white
Focus: ring-[#E9808E]
```

#### 4.2 Typography

```css
/* Font: Inter (already loaded in root.tsx) */
Title: text-3xl md:text-4xl font-bold
Description: text-base md:text-lg leading-relaxed
Buttons: text-lg font-medium
```

### Phase 5: Accessibility Implementation

#### 5.1 Semantic HTML

```tsx
<main>           // Main content area
  <header>       // Title and banner section
    <h1>         // Main heading
    <p>          // Description
  </header>
  <nav aria-label="主要導航">  // Navigation section with label
    <NavLink>    // Accessible links with keyboard support
  </nav>
</main>
```

#### 5.2 Keyboard Navigation

- All buttons are focusable via Tab key
- Focus indicators using `focus:ring-2` and `focus:ring-offset-2`
- NavLink provides built-in keyboard support

#### 5.3 Screen Reader Support

- Proper alt text for banner image
- `aria-label` on navigation section
- Semantic HTML structure for logical reading order

## Critical Implementation Details

### NavLink Active State Handling

React Router's `NavLink` provides `isActive` prop in render function:

```tsx
<NavLink
  to="/path"
  className={({ isActive }) => 
    isActive ? "active-styles" : "default-styles"
  }
>
```

**Important**: The home route (`/`) will match all paths starting with `/`. Need to handle this:

```tsx
// Option 1: Use exact matching (NavLink has `end` prop)
<NavLink to="/" end className={...}>

// Option 2: Exclude home page from active state styling
// (Preferred for this use case since home is landing page)
```

### Image Optimization

- SVG images are already optimized (vector format)
- Use appropriate `width` and `height` attributes for layout stability
- Lazy loading not needed (above the fold content)

### Performance Considerations

- No state management needed (static content)
- No data fetching required
- Images preload on page load (critical content)
- Minimal JavaScript for NavLink functionality

### Error Handling

```tsx
// Image fallback handling
<Image
  src="/image/homepage-banner.svg"
  alt="國會預算監督平台 Banner"
  onError={(e) => {
    console.error("Failed to load banner image");
    // Fallback: hide image or show placeholder
  }}
/>
```

## Implementation Tasks (Sequential Order)

### Task 1: Create Collaboration Route (15 min)

1. Create `app/routes/collaboration.tsx` with basic page structure
2. Add meta tags for SEO
3. Include `BudgetHeader` component
4. Add placeholder content with proper styling

### Task 2: Update Routes Configuration (5 min)

1. Edit `app/routes.ts`
2. Add collaboration route to exports array
3. Verify route order (index route should be first)

### Task 3: Redesign Home Page Component (30 min)

1. Backup current `app/routes/home.tsx` (optional)
2. Implement new home page structure:
   - Add proper TypeScript interfaces
   - Implement responsive layout structure
   - Add title, banner, description sections
   - Create navigation buttons array
3. Update meta tags for SEO

### Task 4: Implement Navigation Buttons (20 min)

1. Create `navigationButtons` data array
2. Map buttons with proper NavLink components
3. Implement active state styling
4. Add accessibility attributes
5. Test keyboard navigation

### Task 5: Responsive Design Testing (15 min)

1. Test mobile layout (< 768px)
2. Test tablet layout (768px - 1024px)
3. Test desktop layout (> 1024px)
4. Verify button spacing and sizing
5. Test image scaling on different screens

### Task 6: Accessibility Validation (10 min)

1. Tab through all interactive elements
2. Verify focus indicators are visible
3. Test with screen reader (if available)
4. Verify semantic HTML structure
5. Check color contrast ratios

### Task 7: Cross-browser Testing (10 min)

1. Test in Chrome/Edge
2. Test in Firefox
3. Test in Safari (if available)
4. Verify SVG rendering
5. Check button interactions

**Total Estimated Time**: ~105 minutes (1.75 hours)

## Validation Gates (Must Pass)

```bash
# 1. TypeScript compilation check
pnpm typecheck
# Expected: No errors, all types valid

# 2. Development server verification
pnpm dev
# Expected: Server starts without errors

# 3. Build verification
pnpm build
# Expected: Build succeeds, no warnings

# 4. Route verification (manual)
# Navigate to:
# - http://localhost:5173/ (home page)
# - http://localhost:5173/all-budgets (should work)
# - http://localhost:5173/visualization (should work)
# - http://localhost:5173/collaboration (new route, should work)

# 5. Asset verification
ls -la public/image/homepage-banner.svg
# Expected: File exists

# 6. Linting (if configured)
pnpm lint:check || echo "No linter configured"

# 7. Format check (if configured)
pnpm format:check || echo "No formatter configured"
```

### Manual Testing Checklist

#### Visual Testing
- [ ] Banner image loads correctly
- [ ] Title displays with correct font and size
- [ ] Description text is readable and properly formatted
- [ ] All 4 buttons are visible and properly styled
- [ ] Colors match design specifications (#E9808E for buttons)

#### Responsive Testing
- [ ] Mobile view (< 768px): Buttons stack vertically with gap-y-9
- [ ] Tablet view (768px-1024px): 2x2 grid layout
- [ ] Desktop view (> 1024px): 4-column layout
- [ ] Image scales appropriately on all screen sizes

#### Interaction Testing
- [ ] Clicking each button navigates to correct route
- [ ] Hover states work correctly (background changes to #E9808E)
- [ ] Focus indicators visible when tabbing through buttons
- [ ] NavLink active state highlights current page (if applicable)

#### Accessibility Testing
- [ ] Tab key navigates through all buttons in logical order
- [ ] Enter/Space key activates focused button
- [ ] Screen reader announces button labels correctly
- [ ] Image has descriptive alt text
- [ ] Color contrast meets WCAG AA standards (4.5:1 minimum)

#### Browser Compatibility
- [ ] Chrome: All features work correctly
- [ ] Firefox: All features work correctly
- [ ] Safari: All features work correctly
- [ ] Edge: All features work correctly

## Expected Deliverables

### 1. New Files Created

- `app/routes/collaboration.tsx` - Collaboration page component
  - Basic page structure with BudgetHeader
  - Placeholder content for future crowdsourcing features
  - Proper TypeScript types and meta tags

### 2. Modified Files

- `app/routes.ts` - Updated route configuration
  - Added `/collaboration` route
  
- `app/routes/home.tsx` - Completely redesigned home page
  - New layout with title, banner, description
  - 4 navigation buttons with responsive design
  - TypeScript interfaces for navigation data
  - Accessibility enhancements
  - Responsive design implementation

### 3. Documentation

- Updated this PRP with implementation notes (optional)
- Code comments in new components explaining key decisions

### 4. No Changes Required

- `app/components/image.tsx` - Use as-is
- `app/components/budget-header.tsx` - Use as-is
- `app/constants/config.ts` - Use as-is (STATIC_ASSETS_PREFIX)
- `public/image/homepage-banner.svg` - Already exists

## Success Criteria

- ✅ Home page displays correctly with all required content
- ✅ Banner image loads without errors
- ✅ All 4 navigation buttons work correctly
- ✅ Collaboration route is accessible and renders properly
- ✅ Responsive design works on mobile, tablet, and desktop
- ✅ Button styling matches specifications (border-3, #E9808E color)
- ✅ Hover and active states work correctly
- ✅ TypeScript compilation passes without errors
- ✅ Accessibility standards met (keyboard nav, focus indicators, semantic HTML)
- ✅ Code follows project conventions (Zustand patterns, TypeScript types)
- ✅ All routes navigate correctly without 404 errors
- ✅ Build process completes successfully

## Risk Mitigation

### Potential Issues & Solutions

#### 1. Image Not Loading

**Problem**: Banner image doesn't display
**Solution**: 
- Verify `STATIC_ASSETS_PREFIX` is correctly applied
- Check file path: `public/image/homepage-banner.svg` exists
- Test with direct path: `/project/3/congress-budget-watch/image/homepage-banner.svg`
- Add error handling with `onError` callback

#### 2. NavLink Active State Issues

**Problem**: Home route (`/`) always shows as active
**Solution**: 
- Add `end` prop to home NavLink: `<NavLink to="/" end>`
- Or design home page to not use active state highlighting

#### 3. Button Border Not Showing

**Problem**: `border-3` class doesn't exist in Tailwind
**Solution**: 
- Tailwind v4 uses `border-[3px]` for custom border width
- Update className: `border-[3px] border-[#E9808E]`

#### 4. Responsive Layout Breaking

**Problem**: Buttons not stacking correctly on mobile
**Solution**:
- Verify mobile-first approach: default `flex flex-col`
- Check breakpoint syntax: `md:grid` (not `grid md:grid-cols-2`)
- Use Chrome DevTools responsive mode for debugging

#### 5. Color Contrast Issues

**Problem**: Text not readable on colored backgrounds
**Solution**:
- White text on #E9808E background (active state)
- Gray/black text on white background (default state)
- Test with browser accessibility tools

#### 6. TypeScript Errors

**Problem**: Type errors in NavLink className function
**Solution**:
- Use proper type for className prop: `className={({ isActive }) => ...}`
- React Router types are already imported
- Check `isActive` is boolean type

## Reference Documentation

### Key Resources

1. **React Router v7 Documentation**
   - NavLink API: https://reactrouter.com/en/main/components/nav-link
   - Route Configuration: https://reactrouter.com/en/main/start/framework/routing
   - Meta Tags: https://reactrouter.com/en/main/route/meta

2. **TailwindCSS v4 Documentation**
   - Responsive Design: https://tailwindcss.com/docs/responsive-design
   - Flexbox: https://tailwindcss.com/docs/flex-direction
   - Grid: https://tailwindcss.com/docs/grid-template-columns
   - Border Width: https://tailwindcss.com/docs/border-width
   - Custom Colors: https://tailwindcss.com/docs/customizing-colors

3. **Accessibility Guidelines**
   - WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
   - Semantic HTML: https://developer.mozilla.org/en-US/docs/Glossary/Semantics
   - Keyboard Navigation: https://webaim.org/techniques/keyboard/

4. **Project Conventions**
   - Zustand Best Practices: Already established in `app/stores/uiStore.ts`
   - TypeScript Rules: Avoid `any`, use explicit types
   - Component Patterns: Follow existing patterns in `app/components/`

### Similar Implementations in Codebase

1. **Button Styling Pattern**: `app/visualization/index.tsx` (lines 32-51)
2. **Responsive Layout**: `app/all-budgets/index.tsx` (lines 59-60)
3. **Image Component Usage**: `app/all-budgets/index.tsx` (lines 76-80, 84-89)
4. **Route Meta Tags**: `app/routes/home.tsx` (lines 4-8)
5. **Navigation Pattern**: `app/components/budget-table.tsx` (lines 120-125)

## Code Quality Standards

### TypeScript Best Practices

1. **No `any` Type**: Use explicit types or `unknown` if type is truly unknown
2. **Interface Definitions**: Define interfaces for data structures
3. **Strict Mode**: Follow strict TypeScript configuration
4. **Type Inference**: Let TypeScript infer simple types, explicitly type complex ones

### React Best Practices

1. **Functional Components**: Use function declarations, not arrow functions for top-level components
2. **Semantic HTML**: Use proper HTML5 semantic elements
3. **Accessibility**: Include ARIA labels where appropriate
4. **Props Destructuring**: Destructure props in function parameters

### CSS/Tailwind Best Practices

1. **Mobile-First**: Default styles for mobile, use breakpoints for larger screens
2. **Consistent Spacing**: Use Tailwind spacing scale (gap-y-9, px-6, py-4)
3. **Color Variables**: Use project color palette (#3E51FF, #E9808E, #F6F6F6)
4. **Transitions**: Add `transition-colors` for smooth interactions

## Gotchas & Important Notes

### 1. STATIC_ASSETS_PREFIX

The project uses a custom prefix for static assets:

```typescript
// app/constants/config.ts
export const STATIC_ASSETS_PREFIX = "/project/3/congress-budget-watch";
```

**Always use the `Image` component** instead of plain `<img>` tags to ensure correct path handling.

### 2. Tailwind Border Width

Tailwind v4 custom border widths use array syntax:

```tsx
// ❌ Wrong
className="border-3"

// ✅ Correct
className="border-[3px]"
```

### 3. NavLink Active State

The home route `/` will match all paths starting with `/`. Solutions:

```tsx
// Solution 1: Use `end` prop
<NavLink to="/" end>Home</NavLink>

// Solution 2: Conditional styling
<NavLink 
  to="/" 
  className={({ isActive }) => 
    location.pathname === "/" && isActive ? "active" : "default"
  }
>
```

### 4. DaisyUI Plugin

The project uses DaisyUI (imported in `app.css`). Some utility classes might come from DaisyUI rather than pure Tailwind. Verify classes in Tailwind docs if unexpected behavior occurs.

### 5. React Router v7 Meta Function

Meta tags are defined using a function, not exported object:

```tsx
// ✅ Correct
export function meta() {
  return [
    { title: "Page Title" },
    { name: "description", content: "Description" },
  ];
}

// ❌ Wrong (Next.js pattern)
export const metadata = {
  title: "Page Title",
};
```

### 6. Image Alt Text Best Practices

- **Descriptive**: Describe what the image shows
- **Contextual**: Consider the image's purpose in the page
- **Concise**: Keep under 125 characters
- **Avoid "image of"**: Screen readers already announce it's an image

```tsx
// ✅ Good
<Image src="/image/homepage-banner.svg" alt="國會預算監督平台 Banner" />

// ❌ Not ideal
<Image src="/image/homepage-banner.svg" alt="banner image" />
```

## Post-Implementation Validation

### Automated Checks

```bash
# 1. Type checking
pnpm typecheck
# Expected: ✓ All types valid

# 2. Build check
pnpm build
# Expected: ✓ Build successful, assets copied

# 3. Linting (if configured)
pnpm lint:check
# Expected: ✓ No linting errors

# 4. Format check (if configured)
pnpm format:check
# Expected: ✓ All files formatted correctly
```

### Manual Verification Steps

#### Step 1: Visual Inspection (5 min)
1. Start dev server: `pnpm dev`
2. Open http://localhost:5173/
3. Verify all elements render correctly
4. Check console for errors

#### Step 2: Navigation Testing (5 min)
1. Click "歷年預算" → Should navigate to `/all-budgets`
2. Click "視覺化專區" → Should navigate to `/visualization`
3. Click "協作區" → Should navigate to `/collaboration`
4. Click "最新年度預算" → Should show placeholder (no navigation)
5. Use browser back button → Should work correctly

#### Step 3: Responsive Testing (10 min)
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Test iPhone SE (375px width) - Mobile layout
4. Test iPad (768px width) - Tablet layout
5. Test Desktop (1920px width) - Desktop layout
6. Verify button layout changes at breakpoints

#### Step 4: Accessibility Testing (10 min)
1. Tab through page (Tab key)
2. Verify focus indicators visible on all buttons
3. Activate button with Enter key
4. Test with screen reader (optional):
   - NVDA (Windows)
   - JAWS (Windows)
   - VoiceOver (Mac)
5. Check color contrast with browser tools

#### Step 5: Browser Compatibility (10 min)
1. Test in Chrome/Edge
2. Test in Firefox
3. Test in Safari (if available)
4. Verify identical behavior across browsers

### Final Checklist

- [ ] TypeScript compilation passes
- [ ] Development server runs without errors
- [ ] Production build succeeds
- [ ] All routes accessible
- [ ] Banner image loads correctly
- [ ] All 4 buttons visible and functional
- [ ] Mobile layout: vertical stack with gap-y-9
- [ ] Desktop layout: 2x2 or 4-column grid
- [ ] Button hover states work
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] No console errors or warnings
- [ ] Code follows project conventions
- [ ] Accessibility standards met

## Confidence Score: 8.5/10

### High Confidence Factors

✅ **Complete codebase understanding**: Analyzed routing, components, styling patterns
✅ **Asset verification**: Confirmed banner SVG exists in correct location
✅ **Clear requirements**: Feature spec provides specific content and styling
✅ **Established patterns**: Project has consistent patterns to follow
✅ **TypeScript setup**: Strong typing already in place
✅ **Validation strategy**: Comprehensive testing approach defined
✅ **Risk mitigation**: Identified potential issues with solutions

### Confidence Deductions (-1.5)

⚠️ **Custom border width** (-0.5): Need to verify `border-[3px]` syntax works in Tailwind v4
⚠️ **NavLink active state** (-0.5): Home route matching behavior needs testing
⚠️ **Collaboration page design** (-0.5): Minimal specification, using basic placeholder

### Risk Level: **LOW**

This is a straightforward implementation with well-defined requirements, existing patterns to follow, and comprehensive validation gates. The main complexity is ensuring responsive design works correctly and button styling matches specifications exactly.

## Notes for AI Agent

### Context Summary

You are implementing a landing page redesign for a React Router v7 application. The project uses:
- TypeScript (strict mode, no `any` types)
- TailwindCSS v4 + DaisyUI
- Zustand for state management (already configured)
- Custom Image component with STATIC_ASSETS_PREFIX

### Key Implementation Points

1. **Use Existing Components**: Don't recreate `BudgetHeader` or `Image` - import and use them
2. **Follow TypeScript Rules**: Define explicit types, avoid `any`
3. **Use Project Colors**: #3E51FF (blue), #E9808E (pink), #F6F6F6 (background)
4. **Mobile-First CSS**: Default styles for mobile, `md:` prefix for desktop
5. **Accessibility First**: Semantic HTML, keyboard support, focus indicators

### Testing Strategy

1. Run `pnpm typecheck` frequently during development
2. Test in browser at each major step
3. Use Chrome DevTools responsive mode for mobile testing
4. Tab through page to verify keyboard navigation
5. Check browser console for any errors

### Success Indicators

- Page loads without errors
- All buttons navigate correctly
- Responsive layout works on mobile and desktop
- No TypeScript errors
- Build succeeds

### If You Encounter Issues

1. **TypeScript errors**: Check interface definitions and import statements
2. **Image not loading**: Verify Image component import and file path
3. **Styling issues**: Check Tailwind v4 class syntax (use `border-[3px]` not `border-3`)
4. **Routing issues**: Verify routes.ts exports array syntax
5. **Build failures**: Run `pnpm typecheck` to identify type errors first

Good luck with the implementation! The codebase is well-structured and this should be a smooth process.
