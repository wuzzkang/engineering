import React from 'react';

export function TimelineRenderer({ node, onNodeClick }) {
  const data = node.data || {};
  const styles = node.styleOverrides || {};

  const headline = data.headline?.value || 'Timeline';
  const events = Array.isArray(data.eventsList?.items) ? data.eventsList.items : [];

  return (
    <section
      data-node-id={node.id}
      onClick={(e) => { if (onNodeClick) { e.stopPropagation(); onNodeClick(node.id); } }}
      style={{
        padding: '64px 32px',
        backgroundColor: styles.backgroundColor || 'var(--wk-semantic-color-surface-default, #FFFFFF)',
        borderRadius: '8px',
        margin: '16px 0',
        cursor: onNodeClick ? 'pointer' : 'default'
      }}
    >
      <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', margin: '0 0 40px 0', color: styles.textColor || 'var(--wk-semantic-color-text-primary, #0F172A)' }}>
        {headline}
      </h2>

      <div style={{ maxWidth: '600px', margin: '0 auto', borderLeft: '2px solid #E2E8F0', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {events.map((evt, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-31px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--wk-semantic-color-brand-primary, #2563EB)', border: '3px solid #FFF' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: '#0F172A' }}>
              {evt?.value || evt}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
