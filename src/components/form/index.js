'use client';

import { Modalities } from '../../../public/data/modalities';
import { Operators } from '../../../public/data/operators';
import { Interveners } from '../../../public/data/interveners';
import { areas } from '../../../public/data/areas';
import { typeOfIntervention } from '../../../public/data/typeOfInterventions';
import { jurisdictions } from '../../../public/data/jurisdictions';
import { interveningJustices } from '../../../public/data/justice';

export default function FormularioExcel({ setForm, form }) {
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "interveningJustice") {
      const selected = interveningJustices.find(j => j.justice === value);
      if (selected) {
        setForm({ ...form, interveningJustice: selected });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedForm = {
      ...form,
      eventDate: formatDate(form.eventDate),
    };
    const res = await fetch('/api/modificar-excel', {
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
    link.download = `${form.typeOfIntervention}-${form.number}.xlsx`;
    link.click();
  };

  const handleClear = () => {
    setForm({
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
  };

  const isFormIncomplete = Object.entries(form).some(([key, value]) => {
    const optionalFields = ['intervener', 'operator', 'interveningJustice', 'jurisdiction'];
    if (optionalFields.includes(key)) return false;
    if (typeof value === 'string') return value.trim() === '';
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(sub => typeof sub === 'string' && sub.trim() === '');
    }
    return false;
  });

  return (
    <form className="flex flex-col w-full max-w-6xl mx-auto bg-white/5 p-6 gap-6 rounded-xl shadow-lg ring-1 ring-white/10 backdrop-blur-md" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-bold text-indigo-300">Formulario de Visualización</h2>

      {/* Secciones */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor='area' className="text-sm text-gray-300">Área</label>
          <select name="area" value={form.area} onChange={handleChange} className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2">
            <option value="" disabled>Seleccionar...</option>
            {areas.map((area, i) => <option key={i} value={area}>{area}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor='typeOfIntervention' className="text-sm text-gray-300">Tipo</label>
          <select name="typeOfIntervention" value={form.typeOfIntervention} onChange={handleChange} className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2">
            <option value="" disabled>Seleccionar...</option>
            {typeOfIntervention.map((type, i) => <option key={i} value={type}>{type}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Nro</label>
          <input type='text' name='number' value={form.number} onChange={handleChange} className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2" />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-gray-300">Visualizador</label>
          <select name="operator" value={form.operator} onChange={handleChange} className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2">
            <option value="" disabled>Seleccionar...</option>
            {Operators.map(({ operator }, i) => <option key={i} value={operator}>{operator}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Interventor</label>
          <select name="intervener" value={form.intervener} onChange={handleChange} className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2">
            <option value="" disabled>Seleccionar...</option>
            {Interveners.map(({ intervener }, i) => <option key={i} value={intervener}>{intervener}</option>)}
          </select>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-sm text-gray-300">Lugar</label>
          <input type="text" name="direction" value={form.direction} onChange={handleChange} className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2" />
        </div>

        <div>
          <label className="text-sm text-gray-300">Fecha del hecho</label>
          <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2" />
        </div>

        <div>
          <label className="text-sm text-gray-300">Hora del llamado</label>
          <input type="time" name="callTime" step="1" value={form.callTime} onChange={handleChange} className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2" />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-gray-300">Modalidad</label>
          <select name="modalitie" value={form.modalitie} onChange={handleChange} className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2">
            <option value="" disabled>Seleccionar...</option>
            {Modalities.map(({ modalitie }, i) => <option key={i} value={modalitie}>{modalitie}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Jurisdicción</label>
          <select name="jurisdiction" value={form.jurisdiction} onChange={handleChange} className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2">
            <option value="" disabled>Seleccionar...</option>
            {jurisdictions.map((jurisdiction, i) => <option key={i} value={jurisdiction}>{jurisdiction}</option>)}
          </select>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-sm text-gray-300">Justicia</label>
          <select name="interveningJustice" value={form.interveningJustice.justice} onChange={handleChange} className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2">
            <option value="" disabled>Seleccionar...</option>
            {interveningJustices.map((j, i) => <option key={i} value={j.justice}>{j.justice}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Fiscal</label>
          <input type="text" disabled value={form.interveningJustice.fiscal} className="w-full mt-1 bg-gray-700 text-gray-400 border border-gray-600 rounded px-3 py-2" />
        </div>

        <div>
          <label className="text-sm text-gray-300">Secretaría</label>
          <input type="text" disabled value={form.interveningJustice.secretariat} className="w-full mt-1 bg-gray-700 text-gray-400 border border-gray-600 rounded px-3 py-2" />
        </div>
      </section>

      <div>
        <label className="text-sm text-gray-300">Reseña</label>
        <textarea name="review" value={form.review} onChange={handleChange} rows="4" className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"></textarea>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <button type="submit" disabled={isFormIncomplete} className={`px-6 py-3 text-white font-medium rounded-md shadow transition ${isFormIncomplete ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
          Descargar Excel
        </button>

        <button type="button" onClick={handleClear} className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md shadow transition">
          Limpiar Campos
        </button>
      </div>
    </form>
  );
}
