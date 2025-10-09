# PRP: Add Global Footer Component

## Overview

Add a global footer component to the application with responsive design for mobile and desktop layouts. The footer will display project attribution information and important links, ensuring consistent branding and navigation across all pages.

## Feature Requirements

- Create a reusable Footer component with responsive design
- Integrate footer globally in the application layout
- Implement distinct mobile and desktop layouts with different spacing and typography
- Include project attribution text and external navigation links
- Ensure footer appears at the bottom of all pages consistently

## Current Implementation Analysis

### Existing Global Layout Structure

The application uses React Router v7 with a centralized layout pattern:

**File: `app/root.tsx`**

- Contains `Layout` component that wraps all pages
- Currently has `QueryClientProvider` wrapper
- Global structure: `<html>` → `<head>` → `<body>` → `{children}` → scripts
- No footer component exists yet

### Existing Component Patterns

**File: `app/components/budget-header.tsx`**

- Example of a global component used across pages
- Uses Tailwind CSS for styling
- Implements responsive design with mobile-first approach
- Uses custom `Image` component for static assets

**File: `app/components/image.tsx`**

- Utility component for handling static assets
- Automatically prefixes paths with `STATIC_ASSETS_PREFIX` from config
- Used consistently across the codebase

### Current Styling System

**File: `app/app.css`**

- TailwindCSS v4 with `@import "tailwindcss"`
- DaisyUI plugin: `@plugin "daisyui"`
- Custom theme with `--background: #f6f6f6`
- Inter font family configured

**Color Palette from Feature Requirements:**

- Text color: `#959595` (gray text)
- Link color: `#37C6FF` (cyan blue)

### Responsive Design Patterns

Current components use Tailwind responsive prefixes:

- Mobile-first approach (no prefix)
- `md:` prefix for desktop breakpoints
- Common pattern: `className="mobile-styles md:desktop-styles"`

## Implementation Plan

### Phase 1: Component Creation

1. Create `app/components/footer.tsx` with responsive layout
2. Implement mobile layout (default):
   - Height: `176px`
   - Padding: `p-10` (40px all sides)
   - Layout: `flex flex-col`
   - Font size: `12px` (text-xs)
3. Implement desktop layout (`md:` breakpoint):
   - Height: `128px`
   - Layout: `flex flex-col mx-auto`
   - Font size: `14px` (text-sm)

### Phase 2: Content Implementation

1. Add attribution text (same for mobile and desktop):
   - "此計畫由弗里德里希諾曼自由基金會（FNF）及公民監督國會聯盟支持。立法院資料串接由歐噴有限公司（OpenFun）協力。"
   - Style: `color: #959595`

2. Add navigation links separated by `|`:
   - Links: "開放資料" and "開放原始碼"
   - Style: `color: #37C6FF`
   - Target: `target="_blank"` (open in new tab)
   - Accessibility: `rel="noopener noreferrer"`
   - Placeholder URLs until final destinations are provided

### Phase 3: Global Integration

1. Import Footer component in `app/root.tsx`
2. Add Footer inside the Layout component's `<body>` tag
3. Position after `{children}` and before `<ReactQueryDevtools />`

### Phase 4: Verification

1. Test footer appearance on all existing routes:
   - `/` (home)
   - `/all-budgets`
   - `/visualization`
   - `/collaboration`
   - `/budget/:id`
2. Verify responsive behavior at different screen sizes
3. Test link behavior (new tab opening)
4. Run validation gates

## Technical Implementation Details

### Footer Component Structure

```typescript
// app/components/footer.tsx

const Footer = () => {
  return (
    <footer className="bg-background flex h-[176px] flex-col justify-center gap-3 p-10 md:mx-auto md:h-32 md:gap-4">
      {/* Attribution Text */}
      <p className="text-center text-xs text-[#959595] md:text-sm">
        此計畫由弗里德里希諾曼自由基金會（FNF）及公民監督國會聯盟支持。立法院資料串接由歐噴有限公司（OpenFun）協力。
      </p>

      {/* Links */}
      <div className="flex items-center justify-center gap-2 text-xs text-[#37C6FF] md:text-sm">
        <a
          href="https://data.gov.tw"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          開放資料
        </a>
        <span className="text-[#959595]">|</span>
        <a
          href="https://github.com/readr-media/congress-budget"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          開放原始碼
        </a>
      </div>
    </footer>
  );
};

export default Footer;
```

### Root Layout Integration

```typescript
// app/root.tsx - Updated Layout function

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <Footer /> {/* Add footer here */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

## Key Considerations

### Design Specifications

**Mobile Layout (default):**

- Container: `h-[176px] p-10 flex flex-col`
- Text: `text-xs` (12px), `color: #959595`
- Links: `text-xs` (12px), `color: #37C6FF`
- Spacing: `gap-3` between text and links

**Desktop Layout (md: breakpoint):**

- Container: `md:h-32 md:mx-auto`
- Text: `md:text-sm` (14px), `color: #959595`
- Links: `md:text-sm` (14px), `color: #37C6FF`
- Spacing: `md:gap-4` between text and links

### Accessibility

- Use semantic `<footer>` HTML element
- Include proper `rel="noopener noreferrer"` for external links
- Ensure sufficient color contrast for text
- Add hover states for interactive elements
- Center alignment for better readability

### Link Placeholders

Since final URLs are not yet determined, use reasonable defaults:

- **開放資料**: `https://data.gov.tw` (Taiwan Open Data Platform)
- **開放原始碼**: `https://github.com/readr-media/congress-budget` (placeholder GitHub URL)

These can be easily updated later when final destinations are provided.

### Integration Safety

- Footer added inside `<QueryClientProvider>` to maintain React context
- Positioned after `{children}` to appear at bottom of all pages
- No impact on existing routing or page components
- Uses same background color as body (`bg-background`)

## Error Handling & Edge Cases

- **Long text overflow**: Text uses `text-center` and container has fixed height
- **Link accessibility**: External links properly tagged with security attributes
- **Responsive breakpoints**: Mobile-first approach ensures proper rendering on all devices
- **Missing translations**: All text is in Traditional Chinese as per project standards

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
# Navigate to multiple routes (/, /all-budgets, /visualization, etc.) and verify footer appears consistently
# Test responsive behavior by resizing browser window
# Verify links open in new tabs
```

## Success Criteria

- [ ] Footer component created in `app/components/footer.tsx`
- [ ] Footer integrated into global layout in `app/root.tsx`
- [ ] Mobile layout matches specifications (176px height, 12px text, p-10)
- [ ] Desktop layout matches specifications (128px height, 14px text, centered)
- [ ] Attribution text displays correctly with gray color (#959595)
- [ ] Links display with cyan color (#37C6FF) and separator
- [ ] Links open in new tabs with proper security attributes
- [ ] Footer appears consistently on all routes
- [ ] Responsive design works correctly at mobile and desktop breakpoints
- [ ] No TypeScript errors or build failures
- [ ] No impact on existing pages or components
- [ ] Passes all linting and formatting checks

## Files to Create

1. `app/components/footer.tsx` - New footer component

## Files to Modify

1. `app/root.tsx` - Add Footer import and integration in Layout component

## Files to Reference (No Changes)

- `app/components/budget-header.tsx` - Reference for component structure pattern
- `app/components/image.tsx` - Reference for asset handling (not needed for footer)
- `app/app.css` - Reference for color and theme variables
- `app/routes/home.tsx` - Test location for footer verification

## Implementation Task Checklist

Execute tasks in this order:

1. **Create Footer Component**
   - [ ] Create `app/components/footer.tsx`
   - [ ] Implement responsive container with proper heights
   - [ ] Add attribution text with correct styling
   - [ ] Add links with separator and correct colors
   - [ ] Add hover states and accessibility attributes

2. **Integrate Footer Globally**
   - [ ] Import Footer in `app/root.tsx`
   - [ ] Add Footer component inside Layout function
   - [ ] Position after `{children}` in body

3. **Verify Implementation**
   - [ ] Run typecheck to ensure no TypeScript errors
   - [ ] Run linter to check code quality
   - [ ] Test on multiple routes
   - [ ] Verify responsive behavior
   - [ ] Test link functionality

4. **Build and Final Checks**
   - [ ] Run production build
   - [ ] Verify no build errors or warnings
   - [ ] Format code with Prettier

## Design Rationale

### Why Footer in Layout?

Placing the footer in `root.tsx` Layout ensures:

- Consistent appearance across all routes
- Single source of truth for footer content
- Automatic inclusion on new routes
- Follows same pattern as global providers

### Why These Specific Styles?

- **Fixed heights**: Ensures visual consistency
- **Centered text**: Improves readability and aesthetics
- **Gray color for text**: De-emphasizes footer content (common pattern)
- **Cyan links**: Provides visual distinction and matches potential brand colors
- **Mobile-first responsive**: Aligns with modern web development best practices

### Why Placeholder URLs?

Placeholder URLs are included to:

- Enable immediate development and testing
- Provide reasonable defaults based on context
- Allow easy replacement when final URLs are determined
- Maintain link functionality for UX testing

## Documentation URLs for Implementation

- **React Router v7 Layout**: https://reactrouter.com/start/framework/routing
- **TailwindCSS Responsive Design**: https://tailwindcss.com/docs/responsive-design
- **TailwindCSS Flexbox**: https://tailwindcss.com/docs/flex
- **TailwindCSS Typography**: https://tailwindcss.com/docs/font-size
- **TailwindCSS Custom Colors**: https://tailwindcss.com/docs/customizing-colors
- **HTML Footer Element**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer
- **Link Security Best Practices**: https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types#noopener

## Implementation Priority

**High Priority** - This is a straightforward component addition with clear requirements, minimal dependencies, and no risk of breaking existing functionality. The implementation follows established patterns in the codebase and requires only new code (no modifications to existing components).

---

## Additional Notes

### Future Enhancements

After initial implementation, consider:

1. Adding social media icons/links
2. Including newsletter signup
3. Adding copyright year dynamically
4. Implementing dark mode support
5. Adding footer navigation sections for larger sites

### Maintenance Considerations

- Update URLs when final destinations are confirmed
- Consider internationalization if English version is needed
- Monitor link health (broken link checking)
- Update attribution text if partnerships change

---

**PRP Confidence Score: 9.5/10**

This PRP provides comprehensive context for one-pass implementation success. All necessary research has been completed, existing patterns identified, clear component structure defined, and integration approach specified. The implementation is straightforward with minimal risk:

- ✅ Clear component structure and styling specifications
- ✅ Established patterns to follow (budget-header example)
- ✅ Simple global integration point (root.tsx Layout)
- ✅ Well-defined responsive design requirements
- ✅ Comprehensive validation gates
- ✅ No complex state management needed
- ✅ No API or data dependencies

The only minor uncertainty (0.5 points deducted) is the placeholder URLs, which will need to be updated once final destinations are provided, but this doesn't affect the core implementation.
