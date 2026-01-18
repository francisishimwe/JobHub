"use client";
import React, { useState, useEffect } from 'react';
import Script from 'next/script';

export default function EditCV() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleDownload = () => {
    // Look for the library on the global window object
    const pdfTool = (window as any).html2pdf;
    
    if (!pdfTool) {
      alert("Loading PDF tools... wait 2 seconds and try again!");
      return;
    }

    const element = document.body;
    pdfTool().from(element).save('RwandaJobHub_CV.pdf');
  };

  if (!mounted) return null;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        strategy="beforeInteractive" 
      />
      <h1 style={{ color: '#0056b3' }}>CV BUILDER READY</h1>
      <button 
        onClick={handleDownload}
        style={{ background: 'orange', color: 'white', padding: '15px 30px', border: 'none', cursor: 'pointer', fontSize: '18px' }}
      >
        TEST DOWNLOAD
      </button>
    </div>
  );
}