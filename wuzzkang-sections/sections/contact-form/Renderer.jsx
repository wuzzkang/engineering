import React, { useState } from 'react';

export function ContactFormRenderer({ node, onNodeClick }) {
  const data = node.data || {};
  const styles = node.styleOverrides || {};

  const headline = data.headline?.value || 'Hubungi Kami';
  const subheadline = data.subheadline?.value || '';
  const submitText = data.submitButtonText?.value || 'Kirim Pesan';

  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 12px 0', color: styles.textColor || 'var(--wk-semantic-color-text-primary, #0F172A)' }}>
            {headline}
          </h2>
          {subheadline && <p style={{ fontSize: '1rem', color: '#64748B', margin: 0 }}>{subheadline}</p>}
        </div>

        {submitted ? (
          <div style={{ padding: '24px', backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px', color: '#166534', textAlign: 'center', fontWeight: 600 }}>
            ✓ Terima kasih! Pesan Anda telah terkirim.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px', color: '#334155' }}>Nama Lengkap</label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px', color: '#334155' }}>Alamat Email</label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px', color: '#334155' }}>Pesan Anda</label>
              <textarea
                rows={4}
                required
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: styles.buttonColor || 'var(--wk-semantic-color-brand-primary, #2563EB)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {submitText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
