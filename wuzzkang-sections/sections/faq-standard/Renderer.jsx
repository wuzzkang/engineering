import React, { useState } from 'react';

export function FaqStandardRenderer({ node, onNodeClick }) {
  const data = node.data || {};
  const styles = node.styleOverrides || {};

  const title = data.title?.value || 'Pertanyaan Umum';
  const rawItems = Array.isArray(data.items?.items) ? data.items.items : [];

  // Group pairs of items into Q & A objects
  const faqPairs = [];
  for (let i = 0; i < rawItems.length; i += 2) {
    faqPairs.push({
      q: rawItems[i]?.value || rawItems[i] || 'Question?',
      a: rawItems[i + 1]?.value || rawItems[i + 1] || 'Answer text.'
    });
  }

  const [openIdx, setOpenIdx] = useState(0);

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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', margin: '0 0 40px 0', color: styles.textColor || 'var(--wk-semantic-color-text-primary, #0F172A)' }}>
          {title}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqPairs.map((pair, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#FAFAFA'
                }}
              >
                <div
                  onClick={(e) => { e.stopPropagation(); setOpenIdx(isOpen ? -1 : idx); }}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: '#1E293B',
                    cursor: 'pointer'
                  }}
                >
                  <span>{pair.q}</span>
                  <span style={{ fontSize: '1.2rem' }}>{isOpen ? '−' : '+'}</span>
                </div>

                {isOpen && (
                  <div style={{ padding: '0 20px 16px 20px', color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {pair.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
