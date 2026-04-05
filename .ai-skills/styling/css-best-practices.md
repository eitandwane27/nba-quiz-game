---
name: css-best-practices
description: "CSS review & best practices for maintainable, performant stylesheets"
risk: safe
source: custom
---

# CSS Best Practices

> Guidelines for writing clean, maintainable, and performant CSS.

---

## 1. Code Organization

### File Structure
```
styles/
├── base/           # Reset, typography, base elements
├── components/     # Component-specific styles
├── layout/         # Grid, containers, layouts
├── utilities/      # Helper classes
└── variables/      # CSS variables, tokens
```

### Naming Conventions
- **BEM (Block Element Modifier)**: `.block__element--modifier`
- **Utility classes**: `.u-margin-top-small`, `.u-text-center`
- **Component classes**: `.c-button`, `.c-card`
- **Layout classes**: `.l-grid`, `.l-container`

---

## 2. Selector Best Practices

### DO ✅
```css
/* Specific, reusable classes */
.button--primary { }
.card__header { }

/* Low specificity */
.nav-link { }

/* Semantic naming */
.error-message { }
.success-banner { }
```

### DON'T ❌
```css
/* Overly specific selectors */
div.header nav ul li a { }

/* IDs for styling */
#main-button { }

/* Non-semantic names */
.red-text { }
.big-box { }
```

---

## 3. CSS Variables (Custom Properties)

### Good Structure
```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-error: #ef4444;
  
  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  
  /* Typography */
  --font-family-base: system-ui, sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.5;
  
  /* Breakpoints (for container queries) */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
}
```

---

## 4. Performance Optimization

### Minimize Repaints/Reflows
```css
/* ✅ Use transform instead of top/left */
.animate {
  transform: translateX(100px);
}

/* ❌ Avoid */
.animate {
  left: 100px;
}

/* ✅ Use opacity for fades */
.fade {
  opacity: 0;
  transition: opacity 0.3s;
}
```

### Critical CSS
- Inline critical above-the-fold CSS
- Defer non-critical styles
- Use `content-visibility: auto` for off-screen content

### Will-Change Property
```css
/* Only when needed, remove after animation */
.moving-element {
  will-change: transform;
}
```

---

## 5. Responsive Design

### Mobile-First Approach
```css
/* Base (mobile) styles */
.container {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

### Container Queries (Modern)
```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

---

## 6. Accessibility

### Focus States
```css
/* ✅ Clear focus indicators */
.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ❌ Never remove outlines without replacement */
button:focus {
  outline: none; /* DON'T DO THIS */
}
```

### Color Contrast
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18px+)
- Use tools like WebAIM Contrast Checker

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Modern Layout

### Flexbox
```css
.flex-container {
  display: flex;
  gap: 1rem; /* Use gap instead of margins */
  flex-wrap: wrap;
}
```

### Grid
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}
```

### Logical Properties (i18n friendly)
```css
/* ✅ Use logical properties */
.element {
  margin-block-start: 1rem;
  padding-inline: 2rem;
}

/* Instead of */
.element {
  margin-top: 1rem;
  padding-left: 2rem;
  padding-right: 2rem;
}
```

---

## 8. Common Anti-Patterns to Avoid

### ❌ Magic Numbers
```css
/* Bad */
.element {
  margin-top: 37px; /* Why 37? */
}

/* Good */
.element {
  margin-top: var(--space-lg);
}
```

### ❌ !important Overuse
```css
/* Only use for utilities or overriding third-party CSS */
.u-hidden {
  display: none !important;
}
```

### ❌ Absolute Units for Typography
```css
/* Bad */
p {
  font-size: 14px;
}

/* Good */
p {
  font-size: 0.875rem; /* Scales with user preferences */
}
```

---

## 9. Code Review Checklist

When reviewing CSS:

- [ ] Are classes semantic and meaningful?
- [ ] Is specificity kept low?
- [ ] Are CSS variables used for repeated values?
- [ ] Is mobile-first approach followed?
- [ ] Are focus states visible?
- [ ] Is `rem` used instead of `px` for font sizes?
- [ ] Are there any unnecessary `!important` declarations?
- [ ] Is the cascade utilized properly?
- [ ] Are animations performant (using transform/opacity)?
- [ ] Is reduced motion respected?

---

## 10. Modern CSS Features to Use

### `:is()` and `:where()` (Grouping)
```css
/* Instead of repeating selectors */
:is(h1, h2, h3) {
  line-height: 1.2;
}
```

### `:has()` (Parent selector)
```css
/* Style parent based on children */
.card:has(img) {
  display: grid;
  grid-template-columns: 1fr 2fr;
}
```

### `clamp()` (Responsive values)
```css
h1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

---

## When to Use This Skill

- Reviewing CSS in pull requests
- Refactoring legacy stylesheets
- Setting up new project CSS architecture
- Optimizing performance
- Ensuring accessibility compliance
- Teaching CSS best practices

---

**Remember:** Good CSS is maintainable, performant, and accessible. Prioritize clarity over cleverness.
