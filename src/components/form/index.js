'use client';

import { useState } from 'react';

export default function FormularioExcel() {
  const [form, setForm] = useState({
    sae: '',
    fechaHecho: '',
    lugar: '',
    caratula: '',
    visualizador: '',
    intervenor: '',
    reseña: '',
  });

  // Formatea la fecha al formato dd-mm-aaaa
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedForm = {
      ...form,
      fechaHecho: formatDate(form.fechaHecho),
    };

    const res = await fetch('https://deai-gen.vercel.app/api/modificar-excel', {
      method: 'POST',
      body: JSON.stringify(formattedForm),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(res)
    if (!res.ok) {
      alert('Error al generar el archivo');
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PLANILLA DE VISUALIZACIÓN.xlsx';
    link.click();
  };

  const handleClear = () => {
    setForm({
      sae: '',
      fechaHecho: '',
      lugar: '',
      caratula: '',
      visualizador: '',
      intervenor: '',
      reseña: '',
    });
  };

  // 🔍 Verifica si hay algún campo vacío
  const isFormIncomplete = Object.values(form).some((value) => value.trim() === '');

  return (
    <form className="w-5/7 p-4" onSubmit={handleSubmit}>
      <label className="block mb-1">SAE</label>
      <input
        type="text"
        name="sae"
        value={form.sae}
        onChange={handleChange}
        className="block w-full mb-4 border border-gray-300 rounded px-2 py-1"
      />

      <label className="block mb-1">Fecha del hecho</label>
      <input
        type="date"
        name="fechaHecho"
        value={form.fechaHecho}
        onChange={handleChange}
        className="block w-full mb-4 border border-gray-300 rounded px-2 py-1"
      />

      <label className="block mb-1">Lugar</label>
      <input
        type="text"
        name="lugar"
        value={form.lugar}
        onChange={handleChange}
        className="block w-full mb-4 border border-gray-300 rounded px-2 py-1"
      />

      <label className="block mb-1">Carátula</label>
      <input
        type="text"
        name="caratula"
        value={form.caratula}
        onChange={handleChange}
        className="block w-full mb-4 border border-gray-300 rounded px-2 py-1"
      />

      <label className="block mb-1">Visualizador</label>
      <input
        type="text"
        name="visualizador"
        value={form.visualizador}
        onChange={handleChange}
        className="block w-full mb-4 border border-gray-300 rounded px-2 py-1"
      />

      <label className="block mb-1">Intervenor</label>
      <input
        type="text"
        name="intervenor"
        value={form.intervenor}
        onChange={handleChange}
        className="block w-full mb-4 border border-gray-300 rounded px-2 py-1"
      />

      <label className="block mb-1">Reseña</label>
      <textarea
        name="reseña"
        value={form.reseña}
        onChange={handleChange}
        className="block w-full mb-4 border border-gray-300 rounded px-2 py-1"
        rows="4"
      />

      <div className="flex gap-5">
        <button
          type="submit"
          disabled={isFormIncomplete}
          className={`mt-4 px-4 py-2 rounded text-white ${
            isFormIncomplete
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Descargar Excel
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Limpiar Campos
        </button>
      </div>
    </form>
  );
}
