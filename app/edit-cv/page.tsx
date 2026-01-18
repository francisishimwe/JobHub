"use client";
import React, { useState, useEffect } from 'react';

export default function EditCV() {
  const [formData, setFormData] = useState({
    fullName: 'ISHIMWE Francis',
    fatherName: 'HARINDINTWARI Salomon',
    motherName: 'NYIRABAHINDI Immaculee',
    address: 'Nyamirambo-Rwezamenyo',
    experience: 'Three (3) years as a teacher of Entrepreneurship at Saint Joseph Integrated Technical College (SJITC).',
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const downloadPDF = async () => {
    if (typeof window === "undefined") return;
    try {
      // THE FIX: We use a dynamic import with 'any' to bypass the build error
      const html2pdf = (await import('html2pdf.js' as any)).default;
      const element = document.getElementById('cv-content');
      
      if (element) {
        const opt = {
          margin: 0.5,
          filename: `${formData.fullName}_CV.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Error: PDF tool is not ready. Please refresh.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: FORM */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-8 border-[#0056b3]">
          <h1 className="text-2xl font-bold text-[#0056b3] mb-6 uppercase">RwandaJobHub CV Editor</h1>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Teaching Experience</label>
              <textarea name="experience" value={formData.experience} onChange={handleChange} className="w-full p-2 border rounded h-32 focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <button onClick={downloadPDF} className="w-full bg-[#ff9800] hover:bg-[#e68a00] text-white font-black py-4 rounded-lg shadow-md transition-all uppercase tracking-widest">
              Download Branded PDF
            </button>
          </div>
        </div>

        {/* RIGHT: PREVIEW */}
        <div id="cv-content" className="bg-white p-10 shadow-2xl border border-gray-100 min-h-[700px]">
          <div className="flex justify-between items-center border-b-4 border-[#0056b3] pb-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase leading-none">{formData.fullName}</h2>
              <p className="text-[#0056b3] font-bold text-xs mt-1">PROFESSIONAL CANDIDATE</p>
            </div>
            <div className="text-right">
              <p className="text-[#0056b3] font-black text-xl leading-none">RwandaJobHub</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">www.rwandajobhub.rw</p>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-[#0056b3] font-black text-sm border-b border-orange-200 pb-1 mb-3 uppercase">Identity</h3>
              <div className="text-sm space-y-1">
                <p><strong>Father:</strong> {formData.fatherName}</p>
                <p><strong>Mother:</strong> {formData.motherName}</p>
                <p><strong>Location:</strong> {formData.address}</p>
              </div>
            </section>

            <section>
              <h3 className="text-[#0056b3] font-black text-sm border-b border-orange-200 pb-1 mb-3 uppercase">Experience</h3>
              <p className="text-sm text-gray-700 italic leading-relaxed">
                {formData.experience}
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}