'use client';

import { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { jurisdictions } from '../../../public/data/jurisdictions';
import { Modalities } from '../../../public/data/modalities';
import { interveningJustices } from '../../../public/data/justice';
import ModalAlert from '../modalAlert';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfReader = ({ form, setForm, loading, setIsLoading }) => {
  const [dataObject, setDataObject] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      try {
        const fileURL = URL.createObjectURL(file);
        setPdfURL(fileURL);

        const reader = new FileReader();
        reader.onload = async (e) => {
          const typedArray = new Uint8Array(e.target.result);
          const loadingTask = pdfjsLib.getDocument({ data: typedArray });
          const pdf = await loadingTask.promise;

          let fullText = '';
          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const content = await page.getTextContent();

            const lines = {};
            content.items.forEach((item) => {
              const y = Math.floor(item.transform[5]);
              if (!lines[y]) lines[y] = [];
              lines[y].push(item.str);
            });

            const sortedY = Object.keys(lines).sort((a, b) => b - a);
            const pageText = sortedY.map((y) => lines[y].join(' ')).join('\n');
            fullText += pageText + '\n';
          }

          setDataObject(fullText);
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        ModalAlert("error al procesar el archivo")
        throw new Error('Error al procesar el archivo:', error);
      }
    } else {
      ModalAlert("error", "Por favor, carga un archivo PDF")
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const res = await fetch('/api/extraer-datos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: dataObject }),
      });

      const data = await res.json();

      let parsed;
      try {
        parsed = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
      } catch (e) {
        ModalAlert("error", "No se pudo interpretar la respuesta del servidor.");
        setIsLoading(false);
        return;
      }

      if (parsed.message) {
        ModalAlert("error", parsed.message);
        setIsLoading(false);
        return;
      }

      const validJurisdiction = jurisdictions.find(j =>
        j.toLowerCase() === (parsed.jurisdiction || '').toLowerCase()
      ) || '';

      const validModalitie = Modalities.find(m =>
        m.modalitie.toLowerCase() === (parsed.modalitie || '').toLowerCase()
      )?.modalitie || '';

      const matchingJustice = interveningJustices.find(j =>
        j.justice.toLowerCase() === (parsed?.interveningJustice?.justice || '').toLowerCase()
      ) || { justice: '', fiscal: '', secretariat: '' };

      setForm({
        ...form,
        number: parsed.number || '',
        eventDate: parsed.eventDate || '',
        callTime: parsed.callTime || '',
        direction: parsed.direction || '',
        jurisdiction: validJurisdiction,
        modalitie: validModalitie,
        interveningJustice: matchingJustice,
        review: parsed.review || '',
      });

      ModalAlert("success", "Datos cargados con éxito");
      setIsLoading(false);
    } catch (error) {
      console.error('Error al enviar el prompt:', error);
      ModalAlert("error", "Error inesperado al procesar el archivo");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-4 p-4 rounded-lg bg-white/5 shadow ring-1 ring-white/10 backdrop-blur-m">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="px-4 py-2 text-white bg-black/40 border border-gray-600 rounded-md shadow hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={handleSubmit}
        className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow transition"
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
