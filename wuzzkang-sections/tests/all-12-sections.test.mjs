import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DocumentInterpreter } from '../packages/renderer-core/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sectionsDir = path.resolve(__dirname, '../sections');

const ALL_12_SECTION_IDS = [
  'hero-basic',
  'header-nav',
  'about-standard',
  'features-grid',
  'faq-standard',
  'pricing-table',
  'gallery-grid',
  'testimonials',
  'timeline',
  'cta-centered',
  'contact-form',
  'footer-standard'
];

const mockDesignSystem = {
  id: 'default-light',
  name: 'Default Light',
  primitives: {
    color: { blue: { 600: '#2563EB' }, neutral: { 50: '#FAFAFA', 900: '#171717' } }
  },
  semantic: {
    color: {
      background: { primary: '{primitives.color.neutral.50}' },
      text: { primary: '{primitives.color.neutral.900}' },
      brand: { primary: '{primitives.color.blue.600}' }
    }
  }
};

test('1. All 12 section.json definitions exist and have valid structure', () => {
  for (const sectionId of ALL_12_SECTION_IDS) {
    const jsonPath = path.join(sectionsDir, sectionId, 'section.json');
    assert.ok(fs.existsSync(jsonPath), `Missing section.json for ${sectionId}`);

    const def = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    assert.equal(def.id, sectionId);
    assert.ok(def.displayName, `Missing displayName for ${sectionId}`);
    assert.ok(Array.isArray(def.schema), `Missing schema array for ${sectionId}`);
    assert.ok(def.defaults, `Missing defaults for ${sectionId}`);
    assert.ok(def.capabilities, `Missing capabilities for ${sectionId}`);
  }
});

test('2. DocumentInterpreter — Resolves document containing all 12 sections < 10ms', () => {
  const nodes = ALL_12_SECTION_IDS.map((sectionId, idx) => ({
    id: `node-${idx}-${sectionId}`,
    typeId: sectionId,
    order: idx,
    parentId: null,
    data: {},
    styleOverrides: {
      backgroundColor: { $token: 'semantic.color.background.primary' }
    },
    visibility: { desktop: true, tablet: true, mobile: true },
    locked: false
  }));

  const fullDocument = {
    $schema: "https://wuzzkang.com/schemas/page-document.schema.json",
    $version: "1.0.0",
    id: "12121212-1212-1212-1212-121212121212",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    meta: { title: "Full 12 Sections Page", description: "All 12 sections test", slug: "all-12", lang: "id", status: "draft" },
    designSystemId: "default-light",
    nodes,
    formatVersion: 1,
    checksum: "checksum12"
  };

  const start = performance.now();
  const resolvedTree = DocumentInterpreter.interpret(fullDocument, mockDesignSystem);
  const end = performance.now();
  const duration = end - start;

  console.log(`⏱️ Interpreted Document with ALL 12 Sections in ${duration.toFixed(2)}ms`);
  assert.equal(resolvedTree.nodes.length, 12);
  assert.ok(duration < 10, `Duration exceeded 10ms: ${duration}ms`);
});
