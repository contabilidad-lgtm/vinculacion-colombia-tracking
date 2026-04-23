import { useState } from "react";

const SHEET_URL = "https://script.google.com/macros/s/AKfycbz_jVcXxcZoZbqbF5l07slEJuBFMh0s9e7gWUNihftIIUYQDdJLe6CxO9fQl2j7RdYc/exec";

const Field = ({label,value,onChange,type="text",placeholder="",req=true,col2=false}) => (
  <div className={col2?"col-span-2":""}>
    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
      {label}{req&&<span className="text-red-400">*</span>}
    </label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"/>
  </div>
);

export default function App() {
  const [step, setStep] = useState(1);
  const [p, setP] = useState({nombre:"",cedula:"",fechaNac:"",direccion:"",ciudad:"",telefono:"",email:"",eps:"",pension:"",arl:""});
  const [cedula, setCedula] = useState(null);
  const [hv, setHv] = useState(null);
  const [otros, setOtros] = useState([]);
  const up = (k,v) => setP(x=>({...x,[k]:v}));

  const submit = () => {
    const img = new Image();
    img.src = `${SHEET_URL}?${new URLSearchParams({
      origen:"COLABORADOR", ...p,
      docs_cedula:cedula?.name||"",
      docs_hv:hv?.name||"",
      docs_otros:otros.map(f=>f.name).join(", ")
    }).toString()}`;
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl px-6 py-4 mb-4 shadow-sm flex items-center gap-3">
          <div className="bg-blue-950 text-white rounded-xl px-4 py-2">
            <span className="font-black text-xs tracking-widest">COLOMBIA TRACKING SAS</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700">Formulario de Vinculación</p>
            <p className="text-xs text-gray-400">NIT 901.332.415 · Bogotá D.C.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          {/* Indicador de pasos */}
          {step < 3 && (
            <div className="flex items-center justify-center mb-6">
              {["Datos Personales","Documentos"].map((lbl,i)=>{
                const s=i+1,active=step===s,done=step>s;
                return <div key={s} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${done?"bg-green-500 text-white":active?"bg-blue-900 text-white":"bg-gray-200 text-gray-400"}`}>{done?"✓":s}</div>
                    <span className={`text-xs mt-1 hidden sm:block ${active?"text-blue-900 font-semibold":"text-gray-400"}`}>{lbl}</span>
                  </div>
                  {s<2&&<div className={`w-20 h-0.5 mx-1 mb-4 ${done?"bg-green-400":"bg-gray-200"}`}/>}
                </div>;
              })}
            </div>
          )}

          {/* PASO 1 */}
          {step===1&&(
            <div>
              <h2 className="text-base font-bold text-gray-800 mb-1">Tus Datos Personales</h2>
              <p className="text-xs text-gray-400 mb-5">Por favor diligencia toda tu información</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre completo" value={p.nombre} onChange={v=>up("nombre",v)} placeholder="Juan Carlos Pérez López" col2/>
                <Field label="Cédula" value={p.cedula} onChange={v=>up("cedula",v)} placeholder="1.023.456.789"/>
                <Field label="Fecha de nacimiento" value={p.fechaNac} onChange={v=>up("fechaNac",v)} type="date"/>
                <Field label="Dirección" value={p.direccion} onChange={v=>up("direccion",v)} placeholder="Cra 15 # 80-45" col2/>
                <Field label="Ciudad" value={p.ciudad} onChange={v=>up("ciudad",v)} placeholder="Bogotá D.C."/>
                <Field label="Teléfono" value={p.telefono} onChange={v=>up("telefono",v)} placeholder="3001234567"/>
                <Field label="Correo electrónico" value={p.email} onChange={v=>up("email",v)} type="email" placeholder="correo@ejemplo.com" req={false} col2/>
                <Field label="EPS" value={p.eps} onChange={v=>up("eps",v)} placeholder="Nueva EPS"/>
                <Field label="Fondo de Pensión" value={p.pension} onChange={v=>up("pension",v)} placeholder="Porvenir"/>
                <Field label="ARL" value={p.arl} onChange={v=>up("arl",v)} placeholder="Sura" req={false}/>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={()=>{
                  if(!p.nombre||!p.cedula||!p.telefono) return alert("Completa nombre, cédula y teléfono.");
                  setStep(2);
                }} className="bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-blue-800 text-sm font-semibold">Continuar →</button>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {step===2&&(
            <div>
              <h2 className="text-base font-bold text-gray-800 mb-1">Sube tus Documentos</h2>
              <p className="text-xs text-gray-400 mb-5">Adjunta los documentos para tu vinculación</p>
              
              <div className="space-y-3">
                {/* Cédula */}
                <div className={`border-2 rounded-xl p-4 ${cedula?"border-green-400 bg-green-50":"border-dashed border-gray-200"}`}>
                  <p className="text-sm font-semibold text-gray-700 mb-2">📄 Cédula de Ciudadanía</p>
                  {cedula
                    ? <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600">✓ {cedula.name}</span>
                        <button onClick={()=>setCedula(null)} className="text-xs text-red-400 border border-red-200 rounded px-2 py-1">Quitar</button>
                      </div>
                    : <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e=>setCedula(e.target.files[0]||null)}
                        className="text-xs text-gray-500 w-full"/>
                  }
                </div>

                {/* Hoja de vida */}
                <div className={`border-2 rounded-xl p-4 ${hv?"border-green-400 bg-green-50":"border-dashed border-gray-200"}`}>
                  <p className="text-sm font-semibold text-gray-700 mb-2">📋 Hoja de Vida</p>
                  {hv
                    ? <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600">✓ {hv.name}</span>
                        <button onClick={()=>setHv(null)} className="text-xs text-red-400 border border-red-200 rounded px-2 py-1">Quitar</button>
                      </div>
                    : <input type="file" accept=".pdf,.doc,.docx"
                        onChange={e=>setHv(e.target.files[0]||null)}
                        className="text-xs text-gray-500 w-full"/>
                  }
                </div>

                {/* Otros */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">📎 Otros Documentos <span className="text-xs font-normal text-gray-400">(opcional)</span></p>
                  <input type="file" multiple
                    onChange={e=>setOtros(prev=>[...prev,...Array.from(e.target.files)])}
                    className="text-xs text-gray-500 w-full"/>
                  {otros.length>0&&(
                    <div className="mt-2 space-y-1">
                      {otros.map((f,i)=>(
                        <div key={i} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1">
                          <span className="text-xs text-gray-600">{f.name}</span>
                          <button onClick={()=>setOtros(x=>x.filter((_,j)=>j!==i))} className="text-xs text-red-400">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button onClick={()=>setStep(1)} className="text-sm text-gray-400 hover:text-gray-600">← Anterior</button>
                <button
                  onClick={submit}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold">
                  ✅ Enviar información
                </button>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {step===3&&(
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">¡Información enviada!</h2>
              <p className="text-sm text-gray-500 mb-5">Tu información fue recibida correctamente. El equipo de RRHH se pondrá en contacto contigo pronto.</p>
              <div className="bg-blue-50 rounded-xl p-4 text-left text-sm max-w-xs mx-auto">
                <p className="font-semibold text-blue-900 mb-2">Resumen enviado:</p>
                <p className="text-blue-800">👤 {p.nombre}</p>
                <p className="text-blue-800">🪪 CC {p.cedula}</p>
                <p className="text-blue-800">📱 {p.telefono}</p>
                {cedula&&<p className="text-blue-800">📄 {cedula.name}</p>}
                {hv&&<p className="text-blue-800">📋 {hv.name}</p>}
                {otros.length>0&&<p className="text-blue-800">📎 +{otros.length} adicional(es)</p>}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}