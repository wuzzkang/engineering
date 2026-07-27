# WuzzKang V2 — RichText Format Specification (Portable Text Standard)

> **Scope:** Definition of structured rich text content representation across Builder Property Panel, PageDocument storage, and LP Renderers.
> **Standard:** Portable Text Specification v1.0 (open standard by Sanity.io).

---

## 1. Why Portable Text?

1. **Framework-Agnostic**: Pure JSON structure readable by React, Vue, HTML string serializers, or plain text indexers.
2. **Schema-Extendable**: Allows custom inline annotations (e.g. brand links, tooltip triggers, highlight tokens) without breaking standard block parsers.
3. **No HTML Injection**: Prevents raw HTML storage in DB; rendering engine explicitly controls node compilation.

---

## 2. Portable Text Structure Definition

A RichText `FieldValue` stores an array of block objects:

```json
{
  "$type": "richtext",
  "value": [
    {
      "_type": "block",
      "_key": "b1a2c3d4",
      "style": "h2",
      "children": [
        {
          "_type": "span",
          "_key": "s1a2",
          "text": "Solusi Modular untuk ",
          "marks": []
        },
        {
          "_type": "span",
          "_key": "s2b3",
          "text": "Bisnis Digital Anda",
          "marks": ["strong", "brand-highlight"]
        }
      ],
      "markDefs": [
        {
          "_key": "brand-highlight",
          "_type": "highlightToken",
          "colorToken": "semantic.color.brand.primary"
        }
      ]
    }
  ]
}
```

---

## 3. Supported Block Styles

- `normal` (Paragraph text)
- `h1`, `h2`, `h3`, `h4` (Headings)
- `blockquote` (Blockquote quote)
- `bullet` (Unordered list item)
- `number` (Ordered list item)

---

## 4. Supported Decorators & Marks

- `strong` (Bold)
- `em` (Italic)
- `code` (Monospace inline code)
- `underline`
- `strike-through`
- `link` (Hyperlink annotation with `href` and `openInNewTab`)
- `highlightToken` (Token-based color highlight for brand accent text)

---

## 5. Renderer Contract & Serialization

In React contexts (Builder & LP), Portable Text array is rendered using `@portabletext/react` with custom components for WuzzKang token resolution:

```jsx
import { PortableText } from '@portabletext/react';

const components = {
  marks: {
    highlightToken: ({ value, children }) => (
      <span style={{ color: `var(--wk-${value.colorToken.replace(/\./g, '-')})` }}>
        {children}
      </span>
    ),
  },
};

export const RichTextRenderer = ({ value }) => (
  <PortableText value={value} components={components} />
);
```
