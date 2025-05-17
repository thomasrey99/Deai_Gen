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
      <h2 className="text-3xl font-bold text-indigo-300">Formulario de Visualización</h2>

      {/* ÁREA, TIPO, NRO */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="area" className="text-sm text-gray-300">Área</label>
          <select
            name="area"
            value={form.area}
            onChange={handleChange}
            className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
          >
            <option value="" disabled>Seleccionar...</option>
            {areas.map((area, i) => (
              <option key={i} value={area}>{area}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="typeOfIntervention" className="text-sm text-gray-300">Tipo</label>
          <select
            name="typeOfIntervention"
            value={form.typeOfIntervention}
            onChange={handleChange}
            className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
          >
            <option value="" disabled>Seleccionar...</option>
            {typeOfIntervention.map((type, i) => (
              <option key={i} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Nro</label>
          <input
            type="text"
            name="number"
            value={form.number}
            onChange={handleChange}
            className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
          />
        </div>
      </section>

      {/* VISUALIZADOR - INTERVENTOR */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-gray-300">Visualizador</label>
          <select
            name="operator"
            value={form.operator}
            onChange={handleChange}
            className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
          >
            <option value="" disabled>Seleccionar...</option>
            {Operators.map(({ operator }, i) => (
              <option key={i} value={operator}>{operator}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Interventor</label>
          <select
            name="intervener"
            value={form.intervener}
            onChange={handleChange}
            className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
          >
            <option value="" disabled>Seleccionar...</option>
            {Interveners.map(({ intervener }, i) => (
              <option key={i} value={intervener}>{intervener}</option>
            ))}
          </select>
        </div>
      </section>

      {/* LUGAR - FECHA - HORA */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-sm text-gray-300">Lugar</label>
          <input
            type="text"
            name="direction"
            value={form.direction}
            onChange={handleChange}
            className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Fecha del hecho</label>
          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Hora del llamado</label>
          <input
            type="time"
            name="callTime"
            step="1"
            value={form.callTime}
            onChange={handleChange}
            className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
          />
        </div>
      </section>

      {/* MODALIDAD - JURISDICCIÓN */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-gray-300">Modalidad</label>
          <select
            name="modalitie"
            value={form.modalitie}
            onChange={handleChange}
            className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
          >
            <option value="" disabled>Seleccionar...</option>
            {Modalities.map(({ modalitie }, i) => (
              <option key={i} value={modalitie}>{modalitie}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Jurisdicción</label>
          <select
            name="jurisdiction"
            value={form.jurisdiction}
            onChange={handleChange}
            className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
          >
            <option value="" disabled>Seleccionar...</option>
            {jurisdictions.map((jurisdiction, i) => (
              <option key={i} value={jurisdiction}>{jurisdiction}</option>
            ))}
          </select>
        </div>
      </section>

      {/* JUSTICIA INTERVENTORA */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-sm text-gray-300">Justicia interventora</label>
          <select
            name="justice"
            value={form.interveningJustice.justice}
            onChange={handleChange}
            className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
          >
            <option value="" disabled>Seleccionar...</option>
            {interveningJustices.map((j, i) => (
              <option key={i} value={j.justice}>{j.justice}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Fiscal a/c</label>
          <input
            type="text"
            name="fiscal"
            value={form.interveningJustice.fiscal}
            className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Secretaría a/c</label>
          <input
            type="text"
            name="secretariat"
            value={form.interveningJustice.secretariat}
            className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
            onChange={handleChange}
          />
        </div>
      </section>

      {/* RESEÑA */}
      <div>
        <label className="text-sm text-gray-300">Reseña</label>
        <textarea
          name="review"
          value={form.review}
          onChange={handleChange}
          rows="4"
          className="w-full mt-1 bg-black/40 text-white border border-gray-600 rounded px-3 py-2"
        ></textarea>
      </div>

      {/* BOTONES */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <button
          type="submit"
          disabled={isFormIncomplete}
          className={`px-6 py-3 text-white font-medium rounded-md shadow transition ${isFormIncomplete ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          Descargar Excel
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md shadow transition"
        >
          Limpiar Campos
        </button>
      </div>

      {loading && <Loading />}
    </form>
  );
}
