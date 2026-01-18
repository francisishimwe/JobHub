"use client";
import React, { useState, useEffect } from 'react';

export default function EditCV() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#0056b3' }}>CV BUILDER READY</h1>
      <p>If you see this, the build worked!</p>
      <button 
        onClick={async () => {
          const html2pdf = (await import('html2pdf.js' as any)).default;
          html2pdf().from(document.body).save();
        }}
        style={{ background: 'orange', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
      >
        TEST DOWNLOAD
      </button>
    </div>
  );
}