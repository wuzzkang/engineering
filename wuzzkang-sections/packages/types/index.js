/**
 * @wuzzkang/types — Core constants and interfaces for WuzzKang V2
 */

export const FIELD_TYPES = Object.freeze([
  'text',
  'richtext',
  'number',
  'boolean',
  'image',
  'url',
  'color',
  'select',
  'list',
  'noderef'
]);

export const DEVICE_MODES = Object.freeze(['desktop', 'tablet', 'mobile']);

export const DOCUMENT_STATUSES = Object.freeze(['draft', 'published', 'archived']);

export const BRIDGE_MESSAGE_TYPES = Object.freeze({
  INIT: 'INIT',
  UPDATE_NODES: 'UPDATE_NODES',
  UPDATE_DESIGN_SYSTEM: 'UPDATE_DESIGN_SYSTEM',
  SELECT_NODE: 'SELECT_NODE',
  RESIZE_DEVICE: 'RESIZE_DEVICE',
  RENDERER_READY: 'RENDERER_READY',
  NODE_CLICKED: 'NODE_CLICKED',
  SCROLL_TO_NODE: 'SCROLL_TO_NODE'
});

export { V2_STARTER_PRESETS } from './v2Presets.js';
