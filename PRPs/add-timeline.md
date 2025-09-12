# PRP: Add daisyUI Timeline Component

## Overview
Replace the existing custom timeline component with daisyUI's vertical timeline (right-side only) implementation to maintain consistency with modern UI component libraries while preserving existing functionality.

## Feature Requirements
- Install daisyUI and integrate with existing TailwindCSS v4 setup
- Replace current timeline component with daisyUI vertical timeline (right side only)
- Maintain existing Timeline and TimelineItem interfaces
- Preserve all current functionality without affecting other components
- Keep the same data structure and props API

## Current Implementation Analysis

### Existing Files
- `app/components/timeline/Timeline.tsx` - Main timeline container component
- `app/components/timeline/TimelineItem.tsx` - Individual timeline item component  
- `app/budget-detail/index.tsx` - Usage example with mock data

### Current Timeline Structure
```typescript
// Current TimelineItemData interface
export type TimelineItemData = {
  id: string | number;
  date: string;
  title: string;
  description: string;
};

// Current Timeline props
type TimelineProps = {
  items: TimelineItemData[];
};
```

### Current Styling System
- TailwindCSS v4 with Vite plugin (`@tailwindcss/vite`: `^4.1.4`)
- Configured in `vite.config.ts` with `tailwindcss()` plugin
- Main CSS file: `app/app.css` with `@import "tailwindcss"`
- Custom theme variables and Inter font configured

## DaisyUI Integration Research

### Installation Requirements
Based on daisyUI documentation (https://daisyui.com/docs/install/react/):

1. Install daisyUI: `pnpm add daisyui@latest`
2. Update CSS file to include daisyUI plugin: `@plugin "daisyui"`

### DaisyUI Timeline Structure
From https://daisyui.com/components/timeline/:

```html
<ul class="timeline timeline-vertical">
  <li>
    <div class="timeline-middle">
      <svg>...</svg>
    </div>
    <div class="timeline-end timeline-box">Content</div>
    <hr />
  </li>
</ul>
```

Key classes:
- `timeline`: Base container
- `timeline-vertical`: Vertical layout
- `timeline-middle`: Icon/marker position  
- `timeline-end`: Right-side content placement
- `timeline-box`: Content box styling

## Implementation Plan

### Phase 1: Environment Setup
1. Install daisyUI dependency
2. Update CSS configuration to include daisyUI plugin
3. Verify build and typecheck still work

### Phase 2: Component Migration
1. Update `Timeline.tsx` to use daisyUI structure
   - Change from `<ol>` to `<ul class="timeline timeline-vertical">`
   - Remove custom border styling
   
2. Update `TimelineItem.tsx` to use daisyUI classes
   - Convert to `<li>` structure with timeline classes
   - Replace custom dot/marker with `timeline-middle`
   - Use `timeline-end timeline-box` for content area
   - Maintain existing button and styling within content box

### Phase 3: Verification
1. Test with existing mock data in `budget-detail/index.tsx`
2. Ensure visual parity with current design
3. Run validation gates

## Technical Implementation Details

### New Timeline Component Structure
```typescript
// Timeline.tsx - Updated structure
export const Timeline = ({ items }: TimelineProps) => {
  return (
    <ul className="timeline timeline-vertical">
      {items.map((item, index) => (
        <TimelineItem key={item.id} {...item} isLast={index === items.length - 1} />
      ))}
    </ul>
  );
};
```

### New TimelineItem Component Structure  
```typescript
// TimelineItem.tsx - Updated with daisyUI classes
export const TimelineItem = ({ date, title, description, isLast = false }: TimelineItemProps) => {
  return (
    <li>
      <div className="timeline-middle">
        <div className="h-3 w-3 rounded-full bg-gray-900"></div>
      </div>
      <div className="timeline-end timeline-box rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="min-w-0 text-gray-900">
            <div className="text-xl font-bold leading-7 md:text-2xl md:leading-8">
              <time className="mr-2 align-middle text-inherit font-inherit leading-inherit">{date}</time>
              <span className="align-middle">{title}</span>
            </div>
            {description && (
              <p className="mt-2 text-sm text-gray-600 md:text-base">{description}</p>
            )}
          </div>
          <button className="ml-4 shrink-0 rounded-full border border-gray-400 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200">
            看版本變更
          </button>
        </div>
      </div>
      {!isLast && <hr />}
    </li>
  );
};
```

## Key Considerations

### API Compatibility
- Maintain exact same `TimelineItemData` interface
- Keep same `TimelineProps` structure
- Preserve `isLast` prop functionality for conditional styling

### Visual Consistency  
- Preserve current color scheme (gray-900, gray-200, etc.)
- Maintain custom button styling and Chinese text
- Keep existing spacing, typography, and shadows
- Ensure responsive design (md: breakpoints) continues to work

### Integration Safety
- No changes to other components or global styles
- DaisyUI plugin added safely without affecting existing TailwindCSS setup
- Preserve existing custom utilities (line-clamp-8, etc.)

## Error Handling & Edge Cases
- Empty timeline items array
- Missing description fields
- Long title/description text overflow
- Responsive behavior on mobile devices

## Validation Gates

### Syntax/Style Validation
```bash
pnpm typecheck
pnpm lint:check
pnpm format:check
```

### Build Verification  
```bash
pnpm build
```

### Development Server Test
```bash
pnpm dev
# Navigate to /budget-detail route and verify timeline renders correctly
```

## Success Criteria
- [ ] daisyUI successfully installed and configured
- [ ] Timeline component renders using daisyUI classes
- [ ] Existing functionality preserved (button, descriptions, dates)  
- [ ] Visual appearance matches or improves current design
- [ ] No TypeScript errors or build failures
- [ ] No impact on other components or pages
- [ ] Responsive design maintained
- [ ] All existing props and interfaces unchanged

## Files to Modify
1. `package.json` - Add daisyUI dependency
2. `app/app.css` - Add daisyUI plugin  
3. `app/components/timeline/Timeline.tsx` - Update to use daisyUI structure
4. `app/components/timeline/TimelineItem.tsx` - Update to use daisyUI classes

## Files to Reference (No Changes)
- `app/budget-detail/index.tsx` - Test usage location
- `vite.config.ts` - Existing TailwindCSS configuration
- `package.json` - Existing scripts and TailwindCSS setup

## Documentation URLs for Implementation
- daisyUI Installation: https://daisyui.com/docs/install/react/
- daisyUI Timeline Components: https://daisyui.com/components/timeline/
- daisyUI Configuration: https://daisyui.com/docs/config/
- daisyUI Colors: https://daisyui.com/docs/colors/

## Implementation Priority
**High Priority** - This is a straightforward component replacement with clear requirements and minimal risk of breaking changes.

---
**PRP Confidence Score: 9/10**

This PRP provides comprehensive context for one-pass implementation success. All necessary research has been completed, existing patterns identified, and integration approach clearly defined. The only minor uncertainty is potential minor visual adjustments that may be needed once daisyUI styles are applied, but the structure and approach are solid.