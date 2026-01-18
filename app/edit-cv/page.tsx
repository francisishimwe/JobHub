// @ts-nocheck
"use client";
import React, { useState } from 'react';

const EditCV = () => {
  const [formData, setFormData] = useState({
    fullName: 'ISHIMWE Francis',
    fatherName: 'HARINDINTWARI Salomon',
    motherName: 'NYIRABAHINDI Immaculee',
    address: 'Nyamirambo-Rwezamenyo',
    experience: 'Three (3) years as a teacher of Entrepreneurship at SJITC.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const downloadPDF = async () => {
    try {
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('cv-content');
      if (element) {
        html2pdf().from(element).save();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CV Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-8 border-[#0056b3]">
          <h2 className="text-xl font-bold text-[#0056b3] mb-6 uppercase tracking-tight">CV Builder</h2>
          <div className="space-y-4">
            <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded" />
            <textarea name="experience" value={formData.experience} onChange={handleChange} className="w-full p-2 border rounded h-40" />
            <button onClick={downloadPDF} className="w-full bg-orange-500 text-white font-bold py-4 rounded uppercase shadow-md">
              Download PDF
            </button>
          </div>
        </div>

        {/* CV Preview */}
        <div id="cv-content" className="bg-white p-10 shadow-xl border border-gray-100 min-h-[700px]">
          <div className="border-b-4 border-[#0056b3] pb-4 mb-6">
            <h1 className="text-2xl font-black text-gray-900 uppercase leading-none">{formData.fullName}</h1>
            <p className="text-[#0056b3] font-bold text-[10px] mt-2 tracking-widest">RWANDAJOBHUB CANDIDATE</p>
          </div>
          <div className="space-y-4 text-sm">
            <p><strong>Father:</strong> {formData.fatherName}</p>
            <p><strong>Location:</strong> {formData.address}</p>
            <h3 className="font-bold text-[#0056b3] border-b uppercase mt-6 text-xs">Experience</h3>
            <p className="italic text-gray-700">{formData.experience}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditCV;