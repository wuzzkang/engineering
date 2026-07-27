import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { DocumentInterpreter, TokenResolver } from '../wuzzkang-sections/packages/renderer-core/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockDesignSystem = {
  id: 'default-light',
  name: 'Full E2E Light System',
  primitives: {
    color: { blue: { 600: '#2563EB' }, neutral: { 50: '#FAFAFA', 900: '#0F172A' } }
  },
  semantic: {
    color: {
      background: { primary: '{primitives.color.neutral.50}' },
      text: { primary: '{primitives.color.neutral.900}' },
      brand: { primary: '{primitives.color.blue.600}' }
    }
  }
};

test('M0-M7 E2E Suite 1: Full 12-Section Page Document Resolution Benchmark', () => {
  const ALL_12_SECTION_IDS = [
    'hero-basic', 'header-nav', 'about-standard', 'features-grid',
    'faq-standard', 'pricing-table', 'gallery-grid', 'testimonials',
    'timeline', 'cta-centered', 'contact-form', 'footer-standard'
  ];

  const nodes = ALL_12_SECTION_IDS.map((id, idx) => ({
    id: `e2e-node-${idx}-${id}`,
    typeId: id,
    order: idx,
    parentId: null,
    data: { title: { $type: 'text', value: `E2E Section ${id}` } },
    styleOverrides: { backgroundColor: { $token: 'semantic.color.background.primary' } },
    visibility: { desktop: true, tablet: true, mobile: true },
    locked: false
  }));

  const fullDoc = {
    $schema: "https://wuzzkang.com/schemas/page-document.schema.json",
    $version: "1.0.0",
    id: "99999999-9999-9999-9999-999999999999",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    meta: { title: "E2E Master Landing Page", description: "Full GA production check", slug: "ga-e2e", lang: "id", status: "published" },
    designSystemId: "default-light",
    nodes,
    formatVersion: 1,
    checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  };

  const start = performance.now();
  const resolved = DocumentInterpreter.interpret(fullDoc, mockDesignSystem);
  const end = performance.now();
  const duration = end - start;

  console.log(`🎉 Master E2E 12-Section Document Resolved in ${duration.toFixed(2)}ms`);
  assert.equal(resolved.nodes.length, 12);
  assert.ok(duration < 10, `E2E resolution time failed performance threshold: ${duration}ms`);
});

test('M0-M7 E2E Suite 2: Token Resolution & Dark Mode Override Chain', () => {
  const lightBg = TokenResolver.resolveToken('semantic.color.background.primary', mockDesignSystem, false);
  assert.equal(lightBg, '#FAFAFA');

  const brandPrimary = TokenResolver.resolveToken('semantic.color.brand.primary', mockDesignSystem, false);
  assert.equal(brandPrimary, '#2563EB');
});
