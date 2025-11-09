# Padding & Margin Consistency Audit Report

## Current Spacing Analysis

### Section Padding Patterns Found:

#### Hero Sections:
- **Home Hero**: `py-12 md:py-16 lg:py-20`
- **Hero with Breadcrumb**: Variable sizes:
  - Small: `py-8 md:py-10` 
  - Medium: `py-10 md:py-12 lg:py-14`
  - Large: `py-12 md:py-16 lg:py-20`

#### Main Content Sections:
- **Contact Page**: `py-16 md:py-20 lg:py-24 bg-gray-50`
- **Categories Page**: `py-16 md:py-20 lg:py-24 bg-gray-50`
- **About Page**: `py-16 md:py-20 lg:py-24 bg-gray-50`
- **Category Pages**: `py-16 md:py-20 lg:py-24 bg-white`
- **Categories Section (Home)**: `py-8 md:py-12 lg:py-16 bg-white`

#### Container Patterns:
- **Standard**: `container mx-auto px-4 md:px-6 max-w-7xl`
- **Categories Section**: `mx-auto px-2 sm:px-4 md:px-6 max-w-6xl`
- **Hero Section**: `container mx-auto px-4 md:px-6 max-w-6xl`

#### Section Headers:
- **Standard margin**: `mb-8 md:mb-12`
- **Categories bottom margin**: `mb-12 md:mb-16`

### Inconsistencies Found:

1. **Container max-width variance**:
   - Most pages: `max-w-7xl`
   - Hero sections: `max-w-6xl`
   - Categories section: `max-w-6xl`

2. **Horizontal padding variance**:
   - Standard: `px-4 md:px-6`
   - Categories section: `px-2 sm:px-4 md:px-6`

3. **Section vertical padding variance**:
   - Main sections: `py-16 md:py-20 lg:py-24`
   - Categories section (home): `py-8 md:py-12 lg:py-16`

4. **Section header bottom margin variance**:
   - Standard: `mb-8 md:mb-12`
   - Categories special case: `mb-12 md:mb-16`

## Recommended Standardization

### Spacing Tokens:
```css
/* Section Padding */
--section-padding-sm: py-8 md:py-12 lg:py-16
--section-padding-md: py-12 md:py-16 lg:py-20
--section-padding-lg: py-16 md:py-20 lg:py-24

/* Container */
--container-standard: container mx-auto px-4 md:px-6 max-w-7xl
--container-narrow: container mx-auto px-4 md:px-6 max-w-6xl

/* Section Headers */
--header-margin: mb-8 md:mb-12

/* Grid Gaps */
--gap-sm: gap-4 md:gap-6
--gap-md: gap-6 md:gap-8 
--gap-lg: gap-8 lg:gap-12
```

### Proposed Usage:
- **Hero sections**: Use `--container-narrow` and size-appropriate padding
- **Main content sections**: Use `--container-standard` and `--section-padding-lg`  
- **Special sections** (like categories on home): Use `--section-padding-sm`
- **All section headers**: Use `--header-margin`

## Action Items:
1. Standardize container max-width to 7xl for content sections, 6xl for hero
2. Standardize horizontal padding to px-4 md:px-6 (remove responsive sm: step)
3. Ensure consistent section vertical padding based on content importance
4. Standardize section header margins
