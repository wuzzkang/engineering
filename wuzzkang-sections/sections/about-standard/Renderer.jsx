import React from 'react';

export function AboutStandardRenderer({ node, onNodeClick }) {
  const data = node.data || {};
  const styles = node.styleOverrides || {};

  const headline = data.headline?.value || 'Tentang Kami';
  const bodyText = typeof data.bodyText?.value === 'string' ? data.bodyText.value : 'Deskripsi perusahaan...';
  const aboutImg = data.aboutImage?.src;
  const stats = Array.isArray(data.statsList?.items) ? data.statsList.items : [];

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
      <div style={{ display: 'grid', gridTemplateColumns: aboutImg ? '1fr 1fr' : '1fr', gap: '48px', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 16px 0', color: styles.textColor || 'var(--wk-semantic-color-text-primary, #0F172A)' }}>
            {headline}
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--wk-semantic-color-text-secondary, #475569)', margin: '0 0 24px 0' }}>
            {bodyText}
          </p>

          {stats.length > 0 && (
            <div style={{ display: 'flex', gap: '24px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--wk-semantic-color-brand-primary, #2563EB)' }}>
                    {stat?.value || stat}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {aboutImg && (
          <div>
            <img src={aboutImg} alt={headline} style={{ width: '100%', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
          </div>
        )}
      </div>
    </section>
  );
}
