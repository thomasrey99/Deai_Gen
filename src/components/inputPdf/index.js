'use client';

import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfReader = () => {
  const [dataObject, setDataObject] = useState(null);

  const parseTextToObject = (text) => {
    const lines = text.split('\n');
    const result = {};

    lines.forEach((line) => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length > 0) {
        const cleanedKey = key.trim().toLowerCase().replace(/\s+/g, '_');
        const value = rest.join(':').trim(); // por si el valor también tiene dos puntos
        result[cleanedKey] = value;
      }
    });

    return result;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const typedArray = new Uint8Array(e.target.result);
          const loadingTask = pdfjsLib.getDocument({ data: typedArray });
          const pdf = await loadingTask.promise;
            console.log(pdf)
          let fullText = '';

          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const content = await page.getTextContent();
          
            const lines = {};
            content.items.forEach((item) => {
              const y = Math.floor(item.transform[5]); // Posición vertical
              if (!lines[y]) lines[y] = [];
              lines[y].push(item.str);
            });
          
            const sortedY = Object.keys(lines).sort((a, b) => b - a); // De arriba hacia abajo
            const pageText = sortedY.map((y) => lines[y].join(' ')).join('\n');
            fullText += pageText + '\n';
          }

          console.log('Texto completo del PDF:\n', fullText);

          const parsedObject = parseTextToObject(fullText);
          setDataObject(parsedObject); // guardar en estado si querés mostrarlo
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
      }
    } else {
      alert('Por favor, carga un archivo PDF');
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4 p-3 border-2 border-gray-300 rounded-lg shadow-md hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
};

export default PdfReader;
