import test from 'node:test';
import assert from 'node:assert/strict';
import { DocumentInterpreter, TokenResolver } from '../packages/renderer-core/index.js';
import { BRIDGE_MESSAGE_TYPES } from '../packages/types/index.js';

const mockDesignSystem = {
  id: 'default-light',
  name: 'Default Light Theme',
  primitives: {
    color: {
      blue: { 600: '#2563EB' },
      neutral: { 50: '#FAFAFA', 900: '#171717' }
    }
  },
  semantic: {
    color: {
      background: { primary: '{primitives.color.neutral.50}' },
      text: { primary: '{primitives.color.neutral.900}' },
      brand: { primary: '{primitives.color.blue.600}' }
    }
  }
};

const mockPageDocument = {
  $schema: "https://wuzzkang.com/schemas/page-document.schema.json",
  $version: "1.0.0",
  id: "11111111-1111-1111-1111-111111111111",
  createdAt: "2026-07-27T10:00:00Z",
  updatedAt: "2026-07-27T10:00:00Z",
  meta: {
    title: "POC Test Page",
    description: "Testing preview bridge fidelity",
    slug: "poc-test",
    lang: "id",
    status: "draft"
  },
  designSystemId: "default-light",
  nodes: [
    {
      id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      typeId: "hero-basic",
      order: 0,
      parentId: null,
      data: {
        headline: { $type: "text", value: "Initial Headline" }
      },
      styleOverrides: {
        backgroundColor: { $token: "semantic.color.background.primary" }
      },
      visibility: { desktop: true, tablet: true, mobile: true },
      locked: false,
      label: "Hero"
    }
  ],
  formatVersion: 1,
  checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
};

test('1. Bridge Message Invariants — Message types correctly defined', () => {
  assert.equal(BRIDGE_MESSAGE_TYPES.INIT, 'INIT');
  assert.equal(BRIDGE_MESSAGE_TYPES.UPDATE_NODES, 'UPDATE_NODES');
  assert.equal(BRIDGE_MESSAGE_TYPES.NODE_CLICKED, 'NODE_CLICKED');
});

test('2. DocumentInterpreter — Interprets hero-basic node in preview context', () => {
  const resolved = DocumentInterpreter.interpret(mockPageDocument, mockDesignSystem);
  assert.equal(resolved.nodes.length, 1);
  assert.equal(resolved.nodes[0].data.headline.value, 'Initial Headline');
  assert.equal(resolved.nodes[0].styleOverrides.backgroundColor, '#FAFAFA');
});

test('3. AC-M2.4 Benchmark — Live node update processing latency < 50ms', () => {
  const updatedNodes = [
    {
      ...mockPageDocument.nodes[0],
      data: {
        headline: { $type: "text", value: "Updated Live Headline Text" }
      }
    }
  ];

  const updatedDoc = { ...mockPageDocument, nodes: updatedNodes };

  const start = performance.now();
  const resolved = DocumentInterpreter.interpret(updatedDoc, mockDesignSystem);
  const end = performance.now();
  const duration = end - start;

  console.log(`⏱️ Preview Update Latency: ${duration.toFixed(2)}ms`);
  assert.equal(resolved.nodes[0].data.headline.value, 'Updated Live Headline Text');
  assert.ok(duration < 50, `Update latency exceeded 50ms: ${duration}ms`);
});
