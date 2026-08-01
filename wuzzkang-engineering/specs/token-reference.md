# WuzzKang V2 — Token Reference & Resolution Specification

> **Scope:** Formal specification of token syntax, resolution algorithm, and CSS variable output in WuzzKang V2 Design System.

---

## 1. Token Reference Syntax

Design System tokens are referenced inside `styleOverrides` or Section props using token reference objects:

```json
{
  "$token": "semantic.color.text.primary",
  "fallback": "#0F172A"
}
```

### Direct Token Strings in Token Architecture
Inside `design-system.json`, token aliases use curly brace notation:
```json
{
  "semantic": {
    "color": {
      "text": {
        "primary": "{primitives.color.neutral.900}"
      }
    }
  }
}
```

---

## 2. Three-Tier Hierarchy Constraints

1. **Primitives**: Raw hardcoded values (`#3B82F6`, `1rem`, `16px`).
   - Primitives MUST NOT reference other tokens.
   - Section components MUST NOT reference primitives directly.
2. **Semantic Tokens**: Intent-based aliases (`semantic.color.brand.primary`).
   - Semantic tokens MUST reference primitives or other semantic tokens.
   - Section components SHOULD reference semantic tokens.
3. **Dark Mode Overrides**: Overrides applied to semantic tokens when `mode === "dark"`.

---

## 3. Resolution Algorithm

Function signature:
```typescript
function resolveToken(
  tokenRef: string,
  designSystem: DesignSystem,
  isDarkMode: boolean = false
): string
```

### Steps:
1. Parse `tokenRef` path (e.g. `semantic.color.text.primary`).
2. If `isDarkMode === true` and `designSystem.darkMode` contains override for this path:
   - Use the override target string.
3. Otherwise, lookup target value in `designSystem.semantic` or `designSystem.primitives`.
4. If target value is curly-braced alias `{primitives.color.neutral.900}`:
   - Recursively call `resolveToken("primitives.color.neutral.900", designSystem)`.
5. Maintain a `visitedTokens: Set<string>` to detect circular references.
   - If `visitedTokens.has(tokenRef)`, throw `CircularTokenReferenceError`.
6. If resolution fails and a `fallback` string is supplied in the reference object, return `fallback`.
7. Otherwise, return default system fallback (e.g. `transparent` or `#000000`).

---

## 4. CSS Custom Property Generation Strategy

For published sites and preview rendering, resolved tokens are exported to CSS root variables:

```css
:root {
  --wk-primitives-color-blue-600: #3b82f6;
  --wk-semantic-color-brand-primary: var(--wk-primitives-color-blue-600);
  --wk-semantic-color-text-primary: #0f172a;
}

[data-theme="dark"] {
  --wk-semantic-color-text-primary: #f8fafc;
}
```

Section styles reference CSS variables directly:
`color: var(--wk-semantic-color-text-primary);`
