"use client"
import ExcelForm from '@/components/form';
import PdfReader from '@/components/inputPdf';
const ExcelModifier = () => {


  return (
    <div className="flex flex-col items-center justify-center p-4 w-full min-h-screen">
      <div className='p-4 w-5/7 flex items-center justify-between'>
        <h1 className='font-bold text-4xl'>DEAI GEN</h1>
        <PdfReader />
      </div>
      <ExcelForm />
    </div>
  );
};

export default ExcelModifier;
