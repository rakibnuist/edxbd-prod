'use client';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Page not found</h1>
        <p style={{ color: '#64748b' }}>The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}


