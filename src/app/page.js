"use client";

import { useState, useRef, useEffect } from 'react';
import ExcelForm from '@/components/form';
import PdfReader from '@/components/inputPdf';

const ExcelModifier = () => {
  const fileInputRef = useRef(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [dataObject, setDataObject] = useState(null);
  const [form, setForm] = useState({
    area: '',
    typeOfIntervention: '',
    number: '',
    eventDate: '',
    callTime: '',
    direction: '',
    jurisdiction: '',
    interveningJustice: {
      justice: '',
      fiscal: '',
      secretariat: '',
    },
    modalitie: '',
    operator: '',
    intervener: '',
    review: '',
  });

  useEffect(() => {
    console.log(form);
  }, [form]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-sans">
      <header className="w-full px-6 py-8 flex flex-col md:flex-row gap-4 items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 animate-pulse">
          DEAI GEN
        </h1>
        <PdfReader
          form={form}
          setForm={setForm}
          setIsLoading={setIsLoading}
          fileInputRef={fileInputRef}
          pdfURL={pdfURL}
          setPdfURL={setPdfURL}
          dataObject={dataObject}
          setDataObject={setDataObject}
        />
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pb-10">
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-lg ring-1 ring-white/10">
          <ExcelForm
            form={form}
            setForm={setForm}
            loading={loading}
            fileInputRef={fileInputRef}
            setPdfURL={setPdfURL}
            setDataObject={setDataObject}
            setIsLoading={setIsLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default ExcelModifier;
