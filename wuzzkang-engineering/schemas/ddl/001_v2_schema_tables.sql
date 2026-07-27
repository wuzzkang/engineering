-- WuzzKang V2 Database Schema Migration DDL Draft
-- File: 001_v2_schema_tables.sql

BEGIN;

-- 1. Section Categories Table
CREATE TABLE IF NOT EXISTS section_categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Section Types Table (Data Contract Registry)
CREATE TABLE IF NOT EXISTS section_types (
  id VARCHAR(100) PRIMARY KEY,
  namespace VARCHAR(100) NOT NULL DEFAULT 'wuzzkang.core',
  schema_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  display_name VARCHAR(200) NOT NULL,
  description TEXT,
  category_id VARCHAR(100) REFERENCES section_categories(id),
  tags TEXT[] DEFAULT '{}',
  schema JSONB NOT NULL,
  defaults JSONB NOT NULL DEFAULT '{}'::jsonb,
  style_constraints JSONB DEFAULT '{}'::jsonb,
  capabilities JSONB NOT NULL DEFAULT '{"supportsAIGeneration": true, "supportsAnimation": true, "supportsChildren": false, "responsiveBehavior": "fluid"}'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'draft', 'active', 'deprecated', 'archived'
  author_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_section_types_category ON section_types(category_id);
CREATE INDEX IF NOT EXISTS idx_section_types_status ON section_types(status);

-- 3. Design Systems Table
CREATE TABLE IF NOT EXISTS design_systems (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  primitives JSONB NOT NULL,
  semantic JSONB NOT NULL,
  dark_mode JSONB DEFAULT '{}'::jsonb,
  user_overrides JSONB DEFAULT '{}'::jsonb,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Project Page Documents V2 Table
CREATE TABLE IF NOT EXISTS project_documents_v2 (
  project_id UUID PRIMARY KEY, -- Links 1:1 to existing projects table
  document_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  design_system_id VARCHAR(100) REFERENCES design_systems(id),
  document_json JSONB NOT NULL, -- Conforms to page-document.schema.json
  format_version INTEGER NOT NULL DEFAULT 1,
  checksum VARCHAR(64) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_docs_status ON project_documents_v2(status);

COMMIT;
