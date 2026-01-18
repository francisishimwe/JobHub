"use client";
import React, { useState, useEffect } from 'react';
import Script from 'next/script';

export default function EditCV() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleDownload = () => {
    const pdfTool = (window as any).html2pdf;
    if (!pdfTool) {
      alert("Loading PDF tools... please wait a second.");
      return;
    }
    const element = document.getElementById('cv-content');
    pdfTool().from(element).save('RwandaJobHub_CV.pdf');
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto p-8 text-center">
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        strategy="lazyOnload"
      />
      <div id="cv-content" className="bg-white p-6 shadow-md rounded-lg mb-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-blue-700">CV BUILDER READY</h1>
        <p className="text-gray-600 mt-2">The build is green and your site is live at RwandaJobHub!</p>
      </div>
      <button 
        onClick={handleDownload}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all"
      >
        TEST DOWNLOAD PDF
      </button>
    </div>
  );
}