import React from 'react';

export function PricingTableRenderer({ node, onNodeClick }) {
  const data = node.data || {};
  const styles = node.styleOverrides || {};

  const headline = data.headline?.value || 'Paket Harga';
  const subheadline = data.subheadline?.value || '';
  const plans = Array.isArray(data.plansList?.items) ? data.plansList.items : [];

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        {plans.map((plan, idx) => {
          const isFeatured = idx === 1;
          const textVal = plan?.value || plan;

          return (
            <div
              key={idx}
              style={{
                padding: '32px 24px',
                backgroundColor: 'var(--wk-semantic-color-surface-default, #FFFFFF)',
                borderRadius: '12px',
                border: isFeatured ? '2px solid var(--wk-semantic-color-brand-primary, #2563EB)' : '1px solid #E2E8F0',
                boxShadow: isFeatured ? '0 10px 25px -5px rgba(37, 99, 235, 0.15)' : '0 1px 3px 0 rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {isFeatured && (
                <span style={{ position: 'absolute', top: '-12px', right: '24px', backgroundColor: '#2563EB', color: '#FFF', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '10px' }}>
                  POPULER
                </span>
              )}

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 12px 0', color: '#0F172A' }}>
                  {textVal}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', fontSize: '0.9rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li>✓ Unlimited Projects</li>
                  <li>✓ Custom Domain Support</li>
                  <li>✓ 24/7 Priority Support</li>
                </ul>
              </div>

              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: isFeatured ? '#2563EB' : '#F1F5F9',
                  color: isFeatured ? '#FFFFFF' : '#1E293B'
                }}
              >
                Pilih Paket
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
