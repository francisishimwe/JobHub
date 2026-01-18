"use client";
import React from 'react';

export default function EditCV() {
  return (
    <div style={{ 
      padding: '100px 20px', 
      textAlign: 'center', 
      backgroundColor: '#ffffff', 
      minHeight: '80vh',
      fontFamily: 'sans-serif' 
    }}>
      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto', 
        padding: '40px', 
        borderRadius: '16px', 
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Your Original Deep Blue Color: #0038a8 */}
        <h1 style={{ color: '#0038a8', fontSize: '2.5rem', fontWeight: 'bold' }}>CV Builder</h1>
        
        <p style={{ color: '#475569', marginTop: '15px', fontSize: '1.1rem', lineHeight: '1.5' }}>
          We are currently upgrading this tool to help you build better CVs. 
          Please check back in a few hours!
        </p>

        <a href="/" style={{ 
          display: 'inline-block',
          marginTop: '30px', 
          backgroundColor: '#0038a8', 
          color: '#ffffff', 
          padding: '14px 28px', 
          borderRadius: '8px', 
          textDecoration: 'none', 
          fontWeight: '600',
          transition: 'background 0.2s'
        }}>
          Back to Job Listings
        </a>
      </div>
    </div>
  );
}