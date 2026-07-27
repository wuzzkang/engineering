import React from 'react';

export function FeaturesGridRenderer({ node, onNodeClick }) {
  const data = node.data || {};
  const styles = node.styleOverrides || {};

  const headline = data.headline?.value || 'Fitur Utama';
  const subheadline = data.subheadline?.value || '';
  const features = Array.isArray(data.featuresList?.items) ? data.featuresList.items : [];

  return (
    <section
      data-node-id={node.id}
      onClick={(e) => { if (onNodeClick) { e.stopPropagation(); onNodeClick(node.id); } }}
      style={{
        padding: '64px 32px',
        backgroundColor: styles.backgroundColor || 'var(--wk-semantic-color-background-primary, #FAFAFA)',
        borderRadius: '8px',
        margin: '16px 0',
        cursor: onNodeClick ? 'pointer' : 'default'
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 12px 0', color: styles.textColor || 'var(--wk-semantic-color-text-primary, #0F172A)' }}>
          {headline}
        </h2>
        {subheadline && (
          <p style={{ fontSize: '1.1rem', color: 'var(--wk-semantic-color-text-secondary, #475569)', margin: 0 }}>
            {subheadline}
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {features.map((feat, idx) => (
          <div
            key={idx}
            style={{
              padding: '24px',
              backgroundColor: 'var(--wk-semantic-color-surface-default, #FFFFFF)',
              borderRadius: '8px',
              border: '1px solid var(--wk-semantic-color-border-default, #E2E8F0)',
              boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>⚡</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 8px 0', color: '#0F172A' }}>
              {feat?.value || feat}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              Optimasi bawaan untuk stabilitas jangka panjang dan kompatibilitas sistem.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
