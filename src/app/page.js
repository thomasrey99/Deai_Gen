"use client";
import ExcelForm from '@/components/form';
import PdfReader from '@/components/inputPdf';
import { useState } from 'react';

const ExcelModifier = () => {
  const [form, setForm] = useState({
    area: "",
    typeOfIntervention: "",
    number: '',
    eventDate: '',
    callTime: "",
    direction: '',
    jurisdiction: "",
    interveningJustice: {
      justice: "",
      fiscal: "",
      secretariat: ""
    },
    modalitie: '',
    operator: '',
    intervener: '',
    review: '',
  });

  const [loading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-sans">
      <header className="w-full px-6 py-8 flex flex-col md:flex-row gap-4 items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 animate-pulse">
          DEAI GEN
        </h1>
        <PdfReader form={form} setForm={setForm} loading={loading} setIsLoading={setIsLoading} />
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pb-10">
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-lg ring-1 ring-white/10">
          <ExcelForm setForm={setForm} form={form} />
        </div>
      </main>
    </div>
  );
};

export default ExcelModifier;
