import { useState } from "react";

const SHEET_URL = "https://script.google.com/macros/s/AKfycbz_jVcXxcZoZbqbF5l07slEJuBFMh0s9e7gWUNihftIIUYQDdJLe6CxO9fQl2j7RdYc/exec";

const Field = ({ label, value, onChange, type = "text", placeholder = "", req = true, col2 = false }) => (
  <div className={col2 ? "col-span-2" : ""}>
    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-widest">
      {label}{req && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-gray-50 text-gray-800 placeholder-gray-400" />
  </div>
);

const ProgressBar = ({ step }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-2">
      {["Datos Personales", "Documentos"].map((lbl, i) => {
        const s = i + 1, active = step === s, done = step > s;
        return (
          <div key={s} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${done ? "bg-blue-900 border-blue-900 text-white" : active ? "bg-white border-blue-900 text-blue-900" : "bg-white border-gray-300 text-gray-400"}`}>
                {done ? "✓" : s}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${active ? "text-blue-900" : done ? "text-blue-900" : "text-gray-400"}`}>{lbl}</span>
            </div>
            {s < 2 && <div className={`flex-1 h-0.5 mx-3 ${done ? "bg-blue-900" : "bg-gray-200"}`} />}
          </div>
        );
      })}
    </div>
  </div>
);

export default function App() {
  const [step, setStep] = useState(1);
  const [p, setP] = useState({ nombre: "", cedula: "", fechaNac: "", direccion: "", ciudad: "", telefono: "", email: "", eps: "", pension: "", arl: "" });
  const [cedula, setCedula] = useState(null);
  const [hv, setHv] = useState(null);
  const [otros, setOtros] = useState([]);
  const up = (k, v) => setP(x => ({ ...x, [k]: v }));

  const submit = () => {
    const img = new Image();
    img.src = `${SHEET_URL}?${new URLSearchParams({
      origen: "COLABORADOR", ...p,
      docs_cedula: cedula?.name || "",
      docs_hv: hv?.name || "",
      docs_otros: otros.map(f => f.name).join(", ")
    }).toString()}`;
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header corporativo */}
      <div className="bg-blue-950 text-white px-6 py-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
              <svg viewBox="0 0 110 110" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                <g transform="rotate(-38,55,55)"><rect x="2" y="44" width="38" height="18" rx="2" fill="#3a5fcd"/></g>
                <g transform="rotate(-38,55,55)"><rect x="70" y="44" width="38" height="18" rx="2" fill="#3a5fcd"/></g>
                <g transform="rotate(-38,55,55)"><rect x="42" y="40" width="26" height="26" rx="3" fill="#1a1a1a"/></g>
                <path d="M55 28 C46 28 39 35 39 44 C39 56 55 72 55 72 C55 72 71 56 71 44 C71 35 64 28 55 28Z" fill="#111"/>
                <circle cx="55" cy="44" r="7" fill="white"/><circle cx="55" cy="44" r="3" fill="#222"/>
              </svg>
            </div>
            <div>
              <p className="font-black text-sm tracking-widest">COLOMBIA TRACKING SAS</p>
              <p className="text-blue-300 text-xs">INNOVATIVE AND SAFETY LOGISTICS</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-blue-300">NIT 901.332.415</p>
            <p className="text-xs text-blue-300">Bogotá D.C., Colombia</p>
          </div>
        </div>
      </div>

      {/* Barra de título */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Formulario de Vinculación Laboral</h1>
            <p className="text-xs text-gray-500 mt-0.5">Por favor diligencia todos los campos requeridos</p>
          </div>
          <span className="bg-blue-950 text-white text-xs px-3 py-1 rounded font-semibold tracking-wide">COLABORADOR</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded shadow-sm border border-gray-200 p-8">
            {step < 3 && <ProgressBar step={step} />}

            {/* PASO 1 */}
            {step === 1 && (
              <div>
                <div className="border-l-4 border-blue-950 pl-4 mb-6">
                  <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">Información Personal</h2>
                  <p className="text-xs text-gray-500 mt-1">Complete todos los campos marcados con asterisco</p>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Nombre completo" value={p.nombre} onChange={v => up("nombre", v)} placeholder="Juan Carlos Pérez López" col2 />
                  <Field label="Número de cédula" value={p.cedula} onChange={v => up("cedula", v)} placeholder="1.023.456.789" />
                  <Field label="Fecha de nacimiento" value={p.fechaNac} onChange={v => up("fechaNac", v)} type="date" />
                  <Field label="Dirección de residencia" value={p.direccion} onChange={v => up("direccion", v)} placeholder="Cra 15 # 80-45" col2 />
                  <Field label="Ciudad" value={p.ciudad} onChange={v => up("ciudad", v)} placeholder="Bogotá D.C." />
                  <Field label="Teléfono celular" value={p.telefono} onChange={v => up("telefono", v)} placeholder="3001234567" />
                  <Field label="Correo electrónico" value={p.email} onChange={v => up("email", v)} type="email" placeholder="correo@ejemplo.com" req={false} col2 />
                  <Field label="EPS" value={p.eps} onChange={v => up("eps", v)} placeholder="Nueva EPS" />
                  <Field label="Fondo de pensión" value={p.pension} onChange={v => up("pension", v)} placeholder="Porvenir" />
                  <Field label="ARL" value={p.arl} onChange={v => up("arl", v)} placeholder="Sura" req={false} />
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <button onClick={() => {
                    if (!p.nombre || !p.cedula || !p.telefono) return alert("Complete los campos obligatorios: nombre, cédula y teléfono.");
                    setStep(2);
                  }} className="bg-blue-950 hover:bg-blue-900 text-white px-8 py-2.5 rounded text-sm font-bold uppercase tracking-wider transition-colors">
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <div>
                <div className="border-l-4 border-blue-950 pl-4 mb-6">
                  <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">Documentos Requeridos</h2>
                  <p className="text-xs text-gray-500 mt-1">Adjunte los documentos solicitados para completar su vinculación</p>
                </div>

                <div className="space-y-4">
                  {/* Cédula */}
                  <div className={`border rounded p-4 transition-all ${cedula ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">📄 Cédula de Ciudadanía</p>
                        <p className="text-xs text-gray-500 mt-0.5">Ambas caras · PDF, JPG o PNG</p>
                      </div>
                      {cedula && <span className="text-xs text-green-700 font-bold bg-green-100 px-2 py-1 rounded">✓ CARGADO</span>}
                    </div>
                    {cedula
                      ? <div className="flex items-center justify-between bg-white rounded border border-green-200 px-3 py-2">
                          <span className="text-xs text-gray-600">{cedula.name}</span>
                          <button onClick={() => setCedula(null)} className="text-xs text-red-500 font-semibold">Quitar</button>
                        </div>
                      : <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setCedula(e.target.files[0] || null)}
                          className="text-xs text-gray-600 w-full bg-white border border-gray-200 rounded px-3 py-2" />
                    }
                  </div>

                  {/* Hoja de vida */}
                  <div className={`border rounded p-4 transition-all ${hv ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">📋 Hoja de Vida</p>
                        <p className="text-xs text-gray-500 mt-0.5">Formato PDF, DOC o DOCX</p>
                      </div>
                      {hv && <span className="text-xs text-green-700 font-bold bg-green-100 px-2 py-1 rounded">✓ CARGADO</span>}
                    </div>
                    {hv
                      ? <div className="flex items-center justify-between bg-white rounded border border-green-200 px-3 py-2">
                          <span className="text-xs text-gray-600">{hv.name}</span>
                          <button onClick={() => setHv(null)} className="text-xs text-red-500 font-semibold">Quitar</button>
                        </div>
                      : <input type="file" accept=".pdf,.doc,.docx" onChange={e => setHv(e.target.files[0] || null)}
                          className="text-xs text-gray-600 w-full bg-white border border-gray-200 rounded px-3 py-2" />
                    }
                  </div>

                  {/* Otros */}
                  <div className="border border-gray-300 bg-gray-50 rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">📎 Documentos Adicionales</p>
                        <p className="text-xs text-gray-500 mt-0.5">Diplomas, certificados, soportes — Opcional</p>
                      </div>
                    </div>
                    <input type="file" multiple onChange={e => setOtros(prev => [...prev, ...Array.from(e.target.files)])}
                      className="text-xs text-gray-600 w-full bg-white border border-gray-200 rounded px-3 py-2" />
                    {otros.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {otros.map((f, i) => (
                          <div key={i} className="flex items-center justify-between bg-white rounded border border-gray-200 px-3 py-1.5">
                            <span className="text-xs text-gray-600">{f.name}</span>
                            <button onClick={() => setOtros(x => x.filter((_, j) => j !== i))} className="text-xs text-red-500 font-semibold">Quitar</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                  <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700 font-semibold">← Anterior</button>
                  <button onClick={submit} className="bg-blue-950 hover:bg-blue-900 text-white px-8 py-2.5 rounded text-sm font-bold uppercase tracking-wider transition-colors">
                    Enviar Información ✓
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3 */}
            {step === 3 && (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h2 className="text-lg font-black text-gray-800 uppercase tracking-wide mb-2">Información Recibida</h2>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">Su información fue registrada correctamente. El equipo de Recursos Humanos se comunicará con usted a la brevedad.</p>
                <div className="bg-gray-50 border border-gray-200 rounded p-5 text-left max-w-xs mx-auto">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Resumen del Registro</p>
                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-700"><span className="font-semibold">Nombre:</span> {p.nombre}</p>
                    <p className="text-xs text-gray-700"><span className="font-semibold">Cédula:</span> {p.cedula}</p>
                    <p className="text-xs text-gray-700"><span className="font-semibold">Teléfono:</span> {p.telefono}</p>
                    {cedula && <p className="text-xs text-gray-700"><span className="font-semibold">Cédula doc:</span> {cedula.name}</p>}
                    {hv && <p className="text-xs text-gray-700"><span className="font-semibold">Hoja de vida:</span> {hv.name}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">© 2026 Colombia Tracking SAS · NIT 901.332.415 · Bogotá D.C.</p>
            <p className="text-xs text-gray-400">Innovative and Safety Logistics</p>
          </div>
        </div>
      </div>
    </div>
  );
}