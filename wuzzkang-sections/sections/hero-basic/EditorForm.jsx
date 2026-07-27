import React from 'react';

/**
 * hero-basic Section Property Editor Form Component
 *
 * @param {Object} props
 * @param {Object} props.node - The active Node being edited.
 * @param {Function} props.onChange - Callback (nodeId, updatedData) => void.
 * @param {Function} [props.onRequestAI] - Callback to trigger AI generation.
 */
export function HeroBasicEditorForm({ node, onChange, onRequestAI }) {
  const data = node?.data || {};

  const handleFieldChange = (key, type, val) => {
    const updatedData = {
      ...data,
      [key]: { $type: type, value: val }
    };
    onChange(node.id, updatedData);
  };

  const handleUrlChange = (key, href) => {
    const updatedData = {
      ...data,
      [key]: { $type: 'url', href, label: data[key]?.label || '' }
    };
    onChange(node.id, updatedData);
  };

  return (
    <div className="wk-editor-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Hero Settings</h4>
        {onRequestAI && (
          <button
            type="button"
            onClick={() => onRequestAI(node.id)}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              backgroundColor: '#4F46E5',
              color: '#FFF',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ✨ Generate AI
          </button>
        )}
      </div>

      {/* Headline Field */}
      <div>
        <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}>
          Headline *
        </label>
        <input
          type="text"
          value={data.headline?.value || ''}
          onChange={(e) => handleFieldChange('headline', 'text', e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
        />
      </div>

      {/* Subheadline Field */}
      <div>
        <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}>
          Subheadline
        </label>
        <textarea
          rows={3}
          value={data.subheadline?.value || ''}
          onChange={(e) => handleFieldChange('subheadline', 'text', e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
        />
      </div>

      {/* CTA Button Label */}
      <div>
        <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}>
          CTA Label
        </label>
        <input
          type="text"
          value={data.ctaLabel?.value || ''}
          onChange={(e) => handleFieldChange('ctaLabel', 'text', e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
        />
      </div>

      {/* CTA Button Link */}
      <div>
        <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}>
          CTA Link URL
        </label>
        <input
          type="url"
          value={data.ctaUrl?.href || ''}
          onChange={(e) => handleUrlChange('ctaUrl', e.target.value)}
          placeholder="https://..."
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
        />
      </div>

      {/* Background Overlay Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="checkbox"
          id={`overlay-${node.id}`}
          checked={data.backgroundOverlay?.value !== false}
          onChange={(e) => handleFieldChange('backgroundOverlay', 'boolean', e.target.checked)}
        />
        <label htmlFor={`overlay-${node.id}`} style={{ fontSize: '12px', cursor: 'pointer' }}>
          Enable Dark Background Overlay
        </label>
      </div>
    </div>
  );
}
