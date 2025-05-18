'use client';

import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import ModalAlert from '../modalAlert';
import { jurisdictions } from '../../../public/data/jurisdictions';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfReader = ({
  form,
  setForm,
  setIsLoading,
  fileInputRef,
  pdfURL,
  setPdfURL,
  dataObject,
  setDataObject,
}) => {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      try {
        const fileURL = URL.createObjectURL(file);
        setPdfURL(fileURL);

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const typedArray = new Uint8Array(e.target.result);
            const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const lines = {};
              content.items.forEach((item) => {
                const y = Math.floor(item.transform[5]);
                if (!lines[y]) lines[y] = [];
                lines[y].push(item.str);
              });
              const sorted = Object.keys(lines).sort((a, b) => b - a);
              fullText += sorted.map((y) => lines[y].join(' ')).join('\n') + '\n';
            }

            setDataObject(fullText);
          } catch {
            ModalAlert('error', 'Error al procesar el PDF');
            fileInputRef.current && (fileInputRef.current.value = '');
            setPdfURL(null);
            setDataObject(null);
          }
        };

        reader.readAsArrayBuffer(file);
      } catch {
        ModalAlert('error', 'Error al procesar el archivo');
        fileInputRef.current && (fileInputRef.current.value = '');
        setPdfURL(null);
        setDataObject(null);
      }
    } else {
      ModalAlert('error', 'Por favor, carga un archivo PDF');
      fileInputRef.current && (fileInputRef.current.value = '');
      setPdfURL(null);
      setDataObject(null);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setForm({
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

      const res = await fetch(process.env.NEXT_PUBLIC_EXTRACT_DATA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: dataObject }),
      });

      const data = await res.json();
      if (!data?.response) throw new Error('Respuesta vacía del servidor');

      const parsed =
        typeof data.response === 'string'
          ? JSON.parse(data.response)
          : data.response;

      if (parsed?.message) {
        ModalAlert('error', parsed.message);
        fileInputRef.current && (fileInputRef.current.value = '');
        setPdfURL(null);
        setDataObject(null);
        setIsLoading(false);
        return false;
      }

      const validJurisdiction =
        jurisdictions.find(
          (j) => j.toLowerCase() === (parsed.jurisdiction || '').toLowerCase()
        ) || '';

      setForm({
        ...form,
        number: parsed.number || '',
        eventDate: parsed.eventDate || '',
        callTime: parsed.callTime || '',
        direction: parsed.direction || '',
        jurisdiction: validJurisdiction,
        review: parsed.review || '',
      });

      ModalAlert('success', 'Datos cargados con éxito');
    } catch (error) {
      console.error('Error al extraer datos:', error);
      ModalAlert('error', 'Error inesperado al procesar el archivo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-4 p-4 rounded-lg bg-white/5 shadow ring-1 ring-white/10 backdrop-blur-md">
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="px-4 py-2 text-white bg-black/40 border border-gray-600 rounded-md shadow hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={handleSubmit}
        disabled={!dataObject}
        className={`px-6 py-2 rounded-md shadow transition ${
          !dataObject
            ? 'bg-gray-500 cursor-not-allowed opacity-50 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        Extraer
      </button>
      {pdfURL && (
        <a
          href={pdfURL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow transition"
        >
          Ver PDF
        </a>
      )}
    </div>
  );
};

export default PdfReader;
