# Hero Section Components - Usage Guide

## 🚀 Super Reusable Hero Components

This system provides highly optimized, reusable hero components that ensure consistency and blazing-fast performance across your entire site.

## Components

### 1. `HeroSection` - Full-Featured Hero
The main hero component with all features and customization options.

### 2. `BasicHero` - Simple Hero  
Simplified wrapper for basic content pages without CTAs.

### 3. `Breadcrumb` - Standalone Breadcrumbs
Can be used independently anywhere in your app.

## Usage Examples

### Basic Hero (Recipes, Categories)
```tsx
import { BasicHero } from "@/components/basic-hero"

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Recipes" }
]

<BasicHero
  title="All Mini Recipes"
  description="Discover our complete collection of **perfectly portioned recipes** designed for 1-2 servings."
  breadcrumbs={breadcrumbs}
  size="medium" // small | medium | large
/>
```

### Full Hero with CTA (About, Contact)
```tsx
import { HeroSection } from "@/components/hero-section-with-breadcrumb"

<HeroSection
  title="About Chef Isabella"
  subtitle="Your Mini Recipe Expert"
  description="Passionate about creating perfectly portioned recipes..."
  breadcrumbs={breadcrumbs}
  cta={{
    text: "Read My Story",
    href: "#story",
    variant: "primary" // primary | secondary | outline
  }}
  size="large"
  backgroundClass="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50"
/>
```

### Advanced Hero with Custom Content
```tsx
<HeroSection
  title={<>
    Welcome to <span className="text-primary">Mini Recipe</span>
  </>}
  breadcrumbs={breadcrumbs}
  textAlign="left" // left | center
  size="small"
>
  <div className="custom-content">
    {/* Your custom JSX here */}
  </div>
</HeroSection>
```

## Props Reference

### HeroSection Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string \| ReactNode` | required | Hero title |
| `subtitle` | `string` | optional | Subtitle (styled in primary color) |
| `description` | `string \| ReactNode` | optional | Hero description |
| `breadcrumbs` | `BreadcrumbItem[]` | required | Breadcrumb navigation |
| `cta` | `CTAButton` | optional | Call-to-action button |
| `size` | `"small" \| "medium" \| "large"` | `"large"` | Hero size |
| `textAlign` | `"left" \| "center"` | `"center"` | Text alignment |
| `backgroundClass` | `string` | gradient | Background CSS classes |
| `children` | `ReactNode` | optional | Custom content |

### CTA Button Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Button text |
| `href` | `string` | required | Button link |
| `variant` | `"primary" \| "secondary" \| "outline"` | `"primary"` | Button style |
| `icon` | `ReactNode` | arrow down | Custom icon |

## Performance Benefits

✅ **Single Component** - One hero system for entire site
✅ **Automatic Optimization** - Next.js Link for internal URLs  
✅ **Consistent Markup** - Same HTML structure = faster rendering
✅ **Flexible Styling** - Easy customization without code duplication
✅ **SEO Optimized** - Proper heading hierarchy and breadcrumbs
✅ **Accessibility** - ARIA labels and semantic HTML

## Best Practices

1. **Use BasicHero** for simple content pages (recipes, categories)
2. **Use HeroSection with CTA** for marketing pages (about, contact)
3. **Keep breadcrumbs consistent** across related pages
4. **Use size="medium"** for most pages, "large" for landing pages
5. **Leverage the cta prop** instead of custom children for buttons

## Adding to New Pages

### Quick Setup
1. Define breadcrumbs array
2. Choose component (BasicHero vs HeroSection) 
3. Pass props from your config
4. Done! 🎉

```tsx
const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "New Page" }
]

<BasicHero
  title={pageConfig.title}
  description={pageConfig.description}
  breadcrumbs={breadcrumbs}
/>
```

This system ensures your blog is **fast, consistent, and maintainable**!
