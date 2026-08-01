# WuzzKang V2 — Preview Bridge Message Protocol Specification

> **Scope:** Inter-frame postMessage communication protocol between Builder Dashboard (host frame) and Sandboxed Preview Renderer (iframe).
> **Security:** Strict origin validation, structured payload tagging, no DOM or inline script execution across boundary.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│ Builder Dashboard (Host Window)                          │
│                                                         │
│  [Zustand State Store] ──► [PreviewBridgeClient]        │
└───────────────────────────────────┬─────────────────────┘
                                    │ postMessage
                                    ▼
┌───────────────────────────────────┴─────────────────────┐
│ Sandboxed iframe (Preview Renderer: localhost:3333)     │
│                                                         │
│  [BridgeListener] ──► [DocumentInterpreter]             │
│                            │                            │
│                            ▼                            │
│                  [RenderDispatcher]                     │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Message Format Invariant

Every message sent across `window.postMessage` MUST conform to this structure:

```typescript
interface PreviewBridgeMessage<T = unknown> {
  source: "wuzzkang-builder" | "wuzzkang-preview";
  version: "1.0";
  type: BridgeMessageType;
  payload: T;
  timestamp: number; // epoch ms
}
```

---

## 3. Host → Iframe Messages (Builder to Preview)

### 3.1 `INIT`
Sent by Host when the iframe fires `load` event. Initializes the Preview Renderer state.

```json
{
  "source": "wuzzkang-builder",
  "version": "1.0",
  "type": "INIT",
  "payload": {
    "document": { ... },
    "designSystem": { ... },
    "device": "desktop",
    "selectedNodeId": "a1b2c3d4-..."
  },
  "timestamp": 1785146400000
}
```

### 3.2 `UPDATE_NODES`
Sent by Host whenever node data or node tree ordering changes in Builder store.

```json
{
  "source": "wuzzkang-builder",
  "version": "1.0",
  "type": "UPDATE_NODES",
  "payload": {
    "nodes": [ ... ]
  },
  "timestamp": 1785146405000
}
```

### 3.3 `UPDATE_DESIGN_SYSTEM`
Sent by Host when user modifies theme colors, typography, or token overrides.

```json
{
  "source": "wuzzkang-builder",
  "version": "1.0",
  "type": "UPDATE_DESIGN_SYSTEM",
  "payload": {
    "designSystem": { ... }
  },
  "timestamp": 1785146410000
}
```

### 3.4 `SELECT_NODE`
Sent by Host when user clicks a section in the Section Tree panel.

```json
{
  "source": "wuzzkang-builder",
  "version": "1.0",
  "type": "SELECT_NODE",
  "payload": {
    "nodeId": "a1b2c3d4-..."
  },
  "timestamp": 1785146415000
}
```

### 3.5 `RESIZE_DEVICE`
Sent by Host when user toggles viewport mode (desktop, tablet, mobile).

```json
{
  "source": "wuzzkang-builder",
  "version": "1.0",
  "type": "RESIZE_DEVICE",
  "payload": {
    "device": "mobile",
    "width": 375
  },
  "timestamp": 1785146420000
}
```

---

## 4. Iframe → Host Messages (Preview to Builder)

### 4.1 `RENDERER_READY`
Sent by Iframe as soon as the bridge listener mounts and is ready to accept `INIT`.

```json
{
  "source": "wuzzkang-preview",
  "version": "1.0",
  "type": "RENDERER_READY",
  "payload": {
    "supportedSchemaVersion": "1.0.0"
  },
  "timestamp": 1785146399000
}
```

### 4.2 `NODE_CLICKED`
Sent by Iframe when user clicks directly on a section element inside preview canvas.

```json
{
  "source": "wuzzkang-preview",
  "version": "1.0",
  "type": "NODE_CLICKED",
  "payload": {
    "nodeId": "a1b2c3d4-...",
    "boundingClientRect": { "top": 120, "height": 450 }
  },
  "timestamp": 1785146425000
}
```

### 4.3 `SCROLL_TO_NODE`
Sent by Iframe to notify Host of viewport scroll position relative to active nodes.

```json
{
  "source": "wuzzkang-preview",
  "version": "1.0",
  "type": "SCROLL_TO_NODE",
  "payload": {
    "visibleNodeIds": ["a1b2c3d4-...", "b2c3d4e5-..."]
  },
  "timestamp": 1785146430000
}
```

---

## 5. Security & Origin Handshake

1. **Origin Verification**: Both Host and Iframe MUST verify `event.origin` matches allowed origins (`window.location.origin` or configured `PREVIEW_BASE_URL`).
2. **Sanitization**: Iframe MUST run `DocumentValidator` on `INIT` payload before passing to `DocumentInterpreter`.
3. **Sandbox Attributes**: The preview iframe MUST be declared with strict sandbox flags:
   `sandbox="allow-scripts allow-same-origin"` (disallowing `allow-modals`, `allow-popups`, `allow-forms`, etc.).
