import { useState, useRef } from "react";

const SHEET_URL = "https://script.google.com/macros/s/AKfycbz_jVcXxcZoZbqbF5l07slEJuBFMh0s9e7gWUNihftIIUYQDdJLe6CxO9fQl2j7RdYc/exec";
const PIN = "2107";
const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const fmtDate = s => { if(!s) return ""; const [y,m,d]=s.split("-"); return `${+d} de ${MONTHS[+m-1]} de ${y}`; };

const LOGO = `<svg viewBox="0 0 110 110" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
<g transform="rotate(-38,55,55)"><rect x="2" y="44" width="38" height="18" rx="2" fill="#3a5fcd"/><line x1="15" y1="44" x2="15" y2="62" stroke="white" stroke-width="0.8" opacity="0.5"/><line x1="27" y1="44" x2="27" y2="62" stroke="white" stroke-width="0.8" opacity="0.5"/></g>
<g transform="rotate(-38,55,55)"><rect x="70" y="44" width="38" height="18" rx="2" fill="#3a5fcd"/><line x1="83" y1="44" x2="83" y2="62" stroke="white" stroke-width="0.8" opacity="0.5"/><line x1="95" y1="44" x2="95" y2="62" stroke="white" stroke-width="0.8" opacity="0.5"/></g>
<g transform="rotate(-38,55,55)"><rect x="42" y="40" width="26" height="26" rx="3" fill="#1a1a1a"/></g>
<path d="M55 28 C46 28 39 35 39 44 C39 56 55 72 55 72 C55 72 71 56 71 44 C71 35 64 28 55 28Z" fill="#111"/>
<circle cx="55" cy="44" r="7" fill="white"/><circle cx="55" cy="44" r="3" fill="#222"/>
<path d="M47 25 Q55 18 63 25" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>
<path d="M43 20 Q55 11 67 20" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round"/>
<path d="M39 15 Q55 4 71 15" fill="none" stroke="#111" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const buildContract = (p,j) => `Entre:

COLOMBIA TRACKING SAS, identificada con NIT 901.332.415, con domicilio en Bogotá D.C., representada legalmente por CRISTIAN CAMILO ALMARIO, quien para efectos del presente contrato se denominará EL EMPLEADOR.
${p.nombre.toUpperCase()}, identificado(a) con cédula de ciudadanía No. ${p.cedula}, domiciliado(a) en Bogotá, quien en adelante se denominará EL TRABAJADOR.

Ambas partes acuerdan celebrar el presente contrato de trabajo a término fijo, iniciando la relación laboral el día ${fmtDate(j.fechaInicio)}

CLÁUSULAS

PRIMERA. Objeto del Contrato
EL EMPLEADOR contrata a EL TRABAJADOR para desempeñar el cargo de ${j.cargo.toUpperCase()}, conforme a los procesos y responsabilidades establecidas en los estatutos de la empresa.

SEGUNDA. Duración
El presente contrato es a término fijo por un período de seis (6) meses, contado a partir del ${fmtDate(j.fechaInicio)}. El contrato podrá renovarse automáticamente por períodos iguales, salvo que cualquiera de las partes manifieste por escrito su intención de no renovarlo con una antelación mínima de treinta (30) días calendario.

TERCERA. Período de Prueba
Se establece un período de prueba de tres (3) meses. Durante este período cualquiera de las partes podrá dar por terminado el contrato unilateralmente, sin lugar al pago de indemnización.

CUARTA. Obligaciones del Trabajador
EL TRABAJADOR se compromete a: cumplir de manera diligente las funciones asignadas; seguir los protocolos y manuales establecidos; participar en capacitaciones; mantener comportamiento ético y profesional; reportar irregularidades técnicas o de seguridad; y proteger la información confidencial.

QUINTA. Obligaciones del Empleador
EL EMPLEADOR se compromete a: proveer herramientas y capacitación; pagar oportunamente salarios y prestaciones; garantizar un entorno laboral seguro; y respetar los derechos laborales.

SEXTA. Jornada Laboral y Remuneración
Jornada: lunes a sábado de 7:00 am a 4:00 pm.
Salario mensual: $${j.salario} pesos m/cte. Subsidio de transporte conforme a la ley. Pago quincenal.

SÉPTIMA. Confidencialidad y Propiedad Intelectual
EL TRABAJADOR mantendrá confidencialidad incluso después de terminado el contrato.

OCTAVA. Seguridad y Salud en el Trabajo
EL EMPLEADOR afiliará a EL TRABAJADOR al sistema de seguridad social integral.

NOVENA. Solución de Conflictos
Las controversias se resolverán mediante conciliación y, en caso de no acuerdo, ante la jurisdicción laboral competente.

DÉCIMA. SAGRILAFT
LAS PARTES certifican que sus recursos no provienen de actividades ilícitas.

DÉCIMA PRIMERA. Protección de Datos Personales
Las partes cumplirán la Ley 1581 de 2012.

DÉCIMA SEGUNDA. Anticorrupción
Las partes cumplirán las leyes anticorrupción: Ley 1474 de 2011 y Ley 1778 de 2016.

DÉCIMA TERCERA. Aceptación
EL TRABAJADOR declara haber leído y aceptado el contrato, el Reglamento Interno de Trabajo y el Sistema de SST.

PARÁGRAFO: Este contrato se rige por el CST, Ley 50/1990, Ley 789/2002, Ley 1562/2012 y Decreto 1072/2015.


FIRMAS


EL EMPLEADOR                                    EL TRABAJADOR


_______________________________         _______________________________
CRISTIAN CAMILO ALMARIO AREVALO        ${p.nombre.toUpperCase()}
C.C. 1.018.508.016                              C.C. ${p.cedula}
Colombia Tracking SAS`;

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
  const [auth, setAuth] = useState(false);
  const [pin, setPin] = useState("");
  const [step, setStep] = useState(1);
  const [contract, setContract] = useState(null);
  const printRef = useRef(null);
  const [p, setP] = useState({nombre:"",cedula:"",fechaNac:"",direccion:"",ciudad:"",telefono:"",email:"",eps:"",pension:"",arl:""});
  const [j, setJ] = useState({cargo:"",salario:"",fechaInicio:""});
  const up = (k,v) => setP(x=>({...x,[k]:v}));
  const uj = (k,v) => setJ(x=>({...x,[k]:v}));
  const today = new Date().toLocaleDateString("es-CO",{day:"numeric",month:"long",year:"numeric"});

  const generate = () => {
    const img = new Image();
    img.src = `${SHEET_URL}?${new URLSearchParams({
      origen:"RRHH", ...p, cargo:j.cargo, salario:j.salario, fechaInicio:j.fechaInicio,
      docs_cedula:"", docs_hv:"", docs_otros:""
    }).toString()}`;
    setContract(buildContract(p,j));
    setStep(3);
  };

  const handlePrint = () => {
    const el = printRef.current;
    if(!el) return;
    const style = document.createElement("style");
    style.innerHTML = `@media print{body>*:not(#print-root){display:none!important}#print-root{display:block!important}}`;
    document.head.appendChild(style);
    el.style.display = "block";
    window.print();
    el.style.display = "none";
    document.head.removeChild(style);
  };

  const reset = () => { setStep(1); setContract(null); setP({nombre:"",cedula:"",fechaNac:"",direccion:"",ciudad:"",telefono:"",email:"",eps:"",pension:"",arl:""}); setJ({cargo:"",salario:"",fechaInicio:""}); };

  if(!auth) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="flex justify-center mb-3" dangerouslySetInnerHTML={{__html:LOGO}}/>
        <h1 className="font-black text-blue-950 text-sm tracking-widest mb-1">COLOMBIA TRACKING SAS</h1>
        <p className="text-xs text-gray-400 mb-6">Acceso exclusivo · Recursos Humanos</p>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">PIN de acceso</label>
        <input type="password" value={pin} onChange={e=>setPin(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&(pin===PIN?setAuth(true):alert("PIN incorrecto"))}
          placeholder="••••" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"/>
        <button onClick={()=>pin===PIN?setAuth(true):alert("PIN incorrecto")}
          className="w-full bg-blue-950 text-white py-2.5 rounded-lg hover:bg-blue-800 text-sm font-semibold">
          Ingresar
        </button>
      </div>
    </div>
  );

  return (
    <>
    {/* Área de impresión */}
    <div id="print-root" ref={printRef} style={{display:"none",fontFamily:"Arial,sans-serif",fontSize:"10.5pt",lineHeight:"1.65",color:"#000"}}>
      <div style={{position:"relative",width:"100%",height:"90px",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:"55%",height:"100%",background:"#0d1f4e",clipPath:"polygon(12% 0%,100% 0%,100% 100%,0% 100%)"}}/>
        <div style={{position:"absolute",top:"10px",left:"18px",display:"flex",alignItems:"center",gap:"10px"}}>
          <div dangerouslySetInnerHTML={{__html:LOGO}}/>
          <div style={{display:"flex",flexDirection:"column"}}>
            <span style={{fontSize:"11pt",fontWeight:900,color:"#0d1f4e"}}>COLOMBIA TRACKING SAS</span>
            <span style={{fontSize:"7pt",color:"#555"}}>INNOVATIVE AND SAFETY LOGISTICS</span>
            <span style={{fontSize:"7pt",color:"#888"}}>NIT 901.332.415 · Bogotá D.C.</span>
          </div>
        </div>
        <div style={{position:"absolute",top:0,right:0,width:"55%",height:"100%",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:"20px"}}>
          <div style={{textAlign:"right",color:"white"}}>
            <div style={{fontSize:"9pt",fontWeight:"bold",letterSpacing:"1px"}}>COLOMBIA TRACKING SAS</div>
            <div style={{fontSize:"7pt",opacity:0.75}}>Monitoreo · Rastreo · Tecnología</div>
          </div>
        </div>
      </div>
      <div style={{padding:"20px 2.5cm 8px"}}>
        <div style={{fontSize:"28pt",fontWeight:900,lineHeight:1}}>CONTRATO</div>
        <div style={{fontSize:"16pt",fontStyle:"italic",color:"#1a56b0",fontWeight:700,margin:"4px 0 8px"}}>A TÉRMINO FIJO</div>
        <div style={{height:"2px",background:"linear-gradient(to right,#0d1f4e,#1a56b0,transparent)"}}/>
      </div>
      <div style={{padding:"0 2.5cm 2cm"}}>
        <pre style={{whiteSpace:"pre-wrap",fontFamily:"Arial,sans-serif",fontSize:"10pt",lineHeight:1.75}}>{contract}</pre>
      </div>
      <div style={{borderTop:"2px solid #0d1f4e",margin:"0 2.5cm",paddingTop:"8px",display:"flex",justifyContent:"space-between"}}>
        <span style={{fontSize:"7pt",color:"#555"}}>Colombia Tracking SAS · NIT 901.332.415 · Bogotá D.C.<br/>Generado el {today}</span>
        <span style={{fontSize:"7pt",color:"#555",textAlign:"right"}}>Trabajador: {p.nombre}<br/>C.C. {p.cedula}</span>
      </div>
    </div>

    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl px-6 py-4 mb-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div dangerouslySetInnerHTML={{__html:LOGO}}/>
            <div>
              <p className="font-black text-blue-950 text-sm tracking-wide">COLOMBIA TRACKING SAS</p>
              <p className="text-xs text-gray-400">Panel RRHH · Vinculación de Personal</p>
            </div>
          </div>
          <span className="bg-blue-950 text-white text-xs px-3 py-1 rounded-full font-semibold">🏢 RRHH</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          {step<3&&(
            <div className="flex items-center justify-center mb-6">
              {["Datos Personales","Datos del Cargo"].map((lbl,i)=>{
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

          {step===1&&(
            <div>
              <h2 className="text-base font-bold text-gray-800 mb-1">Datos Personales</h2>
              <p className="text-xs text-gray-400 mb-5">Información del nuevo colaborador</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre completo" value={p.nombre} onChange={v=>up("nombre",v)} placeholder="Juan Carlos Pérez" col2/>
                <Field label="Cédula" value={p.cedula} onChange={v=>up("cedula",v)} placeholder="1.023.456.789"/>
                <Field label="Fecha de nacimiento" value={p.fechaNac} onChange={v=>up("fechaNac",v)} type="date"/>
                <Field label="Dirección" value={p.direccion} onChange={v=>up("direccion",v)} placeholder="Cra 15 # 80-45" col2/>
                <Field label="Ciudad" value={p.ciudad} onChange={v=>up("ciudad",v)} placeholder="Bogotá D.C."/>
                <Field label="Teléfono" value={p.telefono} onChange={v=>up("telefono",v)} placeholder="3001234567"/>
                <Field label="Correo" value={p.email} onChange={v=>up("email",v)} type="email" placeholder="correo@ejemplo.com" req={false} col2/>
                <Field label="EPS" value={p.eps} onChange={v=>up("eps",v)} placeholder="Nueva EPS"/>
                <Field label="Pensión" value={p.pension} onChange={v=>up("pension",v)} placeholder="Porvenir"/>
                <Field label="ARL" value={p.arl} onChange={v=>up("arl",v)} placeholder="Sura" req={false}/>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={()=>{
                  if(!p.nombre||!p.cedula) return alert("Completa nombre y cédula.");
                  setStep(2);
                }} className="bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-blue-800 text-sm font-semibold">Continuar →</button>
              </div>
            </div>
          )}

          {step===2&&(
            <div>
              <h2 className="text-base font-bold text-gray-800 mb-1">Datos del Cargo</h2>
              <p className="text-xs text-gray-400 mb-5">Condiciones laborales · Contrato Término Fijo</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Cargo" value={j.cargo} onChange={v=>uj("cargo",v)} placeholder="Técnico GPS" col2/>
                <Field label="Salario mensual ($)" value={j.salario} onChange={v=>uj("salario",v)} placeholder="1.423.500"/>
                <Field label="Fecha de inicio" value={j.fechaInicio} onChange={v=>uj("fechaInicio",v)} type="date"/>
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={()=>setStep(1)} className="text-sm text-gray-400 hover:text-gray-600">← Anterior</button>
                <button onClick={()=>{
                  if(!j.cargo||!j.salario||!j.fechaInicio) return alert("Completa todos los campos.");
                  generate();
                }} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold">📄 Generar Contrato</button>
              </div>
            </div>
          )}

          {step===3&&contract&&(
            <div>
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <div>
                  <h2 className="text-base font-bold text-gray-800">✅ Contrato Generado</h2>
                  <p className="text-xs text-gray-400">{p.nombre} · {j.cargo} · Término Fijo</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={reset} className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50">🔄 Nueva vinculación</button>
                  <button onClick={handlePrint} className="bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-800 text-xs font-semibold">🖨️ Imprimir / PDF</button>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-xs font-mono leading-relaxed whitespace-pre-wrap text-gray-800 max-h-96 overflow-y-auto">
                {contract}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}