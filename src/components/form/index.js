'use client';

import { Modalities } from '../../../public/data/modalities';
import { Operators } from '../../../public/data/operators';
import { Interveners } from '../../../public/data/interveners';
import { areas } from '../../../public/data/areas';
import { typeOfIntervention } from '../../../public/data/typeOfInterventions';
import { jurisdictions } from '../../../public/data/jurisdictions';
import { interveningJustices } from '../../../public/data/justice';
import Loading from '../loading';
import ModalAlert from '../modalAlert';

export default function Excel({
  setForm,
  form,
  loading,
  setIsLoading,
  fileInputRef,
  setPdfURL,
  setDataObject,
  setFileName
}) {
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'justice' || name === 'fiscal' || name === 'secretariat') {
      setForm({
        ...form,
        interveningJustice: {
          ...form.interveningJustice,
          [name]: value,
        },
      });
      return;
    } else {
      setForm({ ...form, [name]: value });
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formattedForm = {
      ...form,
      eventDate: formatDate(form.eventDate),
    };

    const res = await fetch(process.env.NEXT_PUBLIC_MODIFY_EXCEL_ROUTE, {
      method: 'POST',
      body: JSON.stringify(formattedForm),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      setIsLoading(false);
      ModalAlert('error', 'Error al generar el archivo');
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.typeOfIntervention}-${form.number}.xlsx`;
    link.click();
    setIsLoading(false);
  };

  const handleClear = () => {
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

    if (fileInputRef.current) fileInputRef.current.value = '';
    setFileName("")
    setPdfURL(null);
    setDataObject(null);
  };

  const isFormIncomplete = Object.entries(form).some(([key, value]) => {
    const optionalFields = ['intervener', 'operator', 'interveningJustice', 'jurisdiction'];
    if (optionalFields.includes(key)) return false;
    if (typeof value === 'string') return value.trim() === '';
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some((sub) => typeof sub === 'string' && sub.trim() === '');
    }
    return false;
  });

  return (
    <form
      className="relative overflow-hidden flex flex-col w-full max-w-6xl mx-auto bg-white/5 p-6 gap-6 rounded-xl shadow-lg ring-1 ring-white/10 backdrop-blur-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-bold text-white tracking-tight pb-2">Formulario de Visualización</h2>

      {/* GRUPO 1 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-white/80 mb-1">Área</label>
          <select
            name="area"
            value={form.area}
            onChange={handleChange}
            className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          >
            <option value="" disabled className="text-gray-400 bg-black">Seleccionar...</option>
            {areas.map((area, i) => (
              <option key={i} value={area} className="text-white bg-gray-900">{area}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="typeOfIntervention" className="block text-sm font-medium text-white/80 mb-1">Tipo</label>
          <select
            name="typeOfIntervention"
            value={form.typeOfIntervention}
            onChange={handleChange}
            className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          >
            <option value="" disabled className="text-gray-400 bg-black">Seleccionar...</option>
            {typeOfIntervention.map((type, i) => (
              <option key={i} value={type} className="text-white bg-gray-900">{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Nro / Nombre</label>
          <input
            type="text"
            name="number"
            value={form.number}
            onChange={handleChange}
            className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          />
        </div>
      </section>

      {/* GRUPO 2 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Visualizador</label>
          <select
            name="operator"
            value={form.operator}
            onChange={handleChange}
            className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          >
            <option value="" disabled className="text-gray-400 bg-black">Seleccionar...</option>
            {Operators.map(({ operator }, i) => (
              <option key={i} value={operator} className="text-white bg-gray-900">{operator}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Interventor</label>
          <select
            name="intervener"
            value={form.intervener}
            onChange={handleChange}
            className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          >
            <option value="" disabled className="text-gray-400 bg-black">Seleccionar...</option>
            {Interveners.map(({ intervener }, i) => (
              <option key={i} value={intervener} className="text-white bg-gray-900">{intervener}</option>
            ))}
          </select>
        </div>
      </section>

      {/* GRUPO 3 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Lugar</label>
          <input
            type="text"
            name="direction"
            value={form.direction}
            onChange={handleChange}
            className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Fecha del hecho</label>
          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Hora del llamado</label>
          <input
            type="time"
            name="callTime"
            step="1"
            value={form.callTime}
            onChange={handleChange}
            className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          />
        </div>
      </section>

      {/* GRUPO 4 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Modalidad</label>
          <select
            name="modalitie"
            value={form.modalitie}
            onChange={handleChange}
            className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          >
            <option value="" disabled className="text-gray-400 bg-black">Seleccionar...</option>
            {Modalities.map(({ modalitie }, i) => (
              <option key={i} value={modalitie} className="text-white bg-gray-900">{modalitie}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Jurisdicción</label>
          <select
            name="jurisdiction"
            value={form.jurisdiction}
            onChange={handleChange}
            className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          >
            <option value="" disabled className="text-gray-400 bg-black">Seleccionar...</option>
            {jurisdictions.map((jurisdiction, i) => (
              <option key={i} value={jurisdiction} className="text-white bg-gray-900">{jurisdiction}</option>
            ))}
          </select>
        </div>
      </section>

      {/* GRUPO 5 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Justicia interventora</label>
          <select
            name="justice"
            value={form.interveningJustice.justice}
            onChange={handleChange}
            className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          >
            <option value="" disabled className="text-gray-400 bg-black">Seleccionar...</option>
            {interveningJustices.map((j, i) => (
              <option key={i} value={j.justice} className="text-white bg-gray-900">{j.justice}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Fiscal a/c</label>
          <input
            type="text"
            name="fiscal"
            value={form.interveningJustice.fiscal}
            onChange={handleChange}
            className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Secretaría a/c</label>
          <input
            type="text"
            name="secretariat"
            value={form.interveningJustice.secretariat}
            onChange={handleChange}
            className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          />
        </div>
      </section>

      {/* GRUPO 6 */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Reseña</label>
        <textarea
          name="review"
          value={form.review}
          onChange={handleChange}
          rows="4"
          className="w-full bg-black/40 text-white border border-sky-700 rounded-lg px-3 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
        ></textarea>
      </div>

      {/* BOTONES */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <button
          type="submit"
          disabled={isFormIncomplete || loading}
          className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold transition shadow-lg ${isFormIncomplete || loading
              ? 'bg-sky-300 cursor-not-allowed text-white'
              : 'bg-sky-500 hover:bg-sky-600 text-white'
            }`}
        >
          Generar excel
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="bg-transparent border border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
        >
          Limpiar campos
        </button>
      </div>
    </form>


  );
}
