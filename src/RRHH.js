import { useState } from "react";

const SHEET_URL = "https://script.google.com/macros/s/AKfycbz_jVcXxcZoZbqbF5l07slEJuBFMh0s9e7gWUNihftIIUYQDdJLe6CxO9fQl2j7RdYc/exec";
const PIN = "2107";
const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const fmtDate = s => { if(!s) return ""; const [y,m,d]=s.split("-"); return `${+d} de ${MONTHS[+m-1]} de ${y}`; };

const generateWord = (p, j) => {
  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
    <head><meta charset='utf-8'/><style>
      body{font-family:Arial,sans-serif;font-size:11pt;margin:2cm 2.5cm;color:#000}
      .header{text-align:center;border-bottom:3px solid #0d1f4e;padding-bottom:12px;margin-bottom:20px}
      .company{font-size:16pt;font-weight:bold;color:#0d1f4e;letter-spacing:1px}
      .sub{font-size:9pt;color:#555}
      h1{font-size:24pt;font-weight:900;text-align:center;margin:20px 0 4px}
      h2{font-size:14pt;font-style:italic;color:#1a56b0;text-align:center;margin:0 0 24px}
      .clausula-titulo{font-weight:bold;margin-top:16px;margin-bottom:4px}
      .clausula-texto{margin:0 0 12px;text-align:justify}
      .firmas{margin-top:60px;display:flex;justify-content:space-between}
      .firma{width:45%}
      .linea{border-top:1px solid #000;margin-top:60px;margin-bottom:6px}
      .parrafo{font-weight:bold;margin-top:16px}
    </style></head>
    <body>
      <div class="header">
        <div class="company">COLOMBIA TRACKING SAS</div>
        <div class="sub">NIT 901.332.415 · Bogotá D.C., Colombia</div>
        <div class="sub"><i>Innovative and Safety Logistics</i></div>
      </div>
      <h1>CONTRATO</h1>
      <h2>A TÉRMINO FIJO</h2>
      <p><b>Entre:</b></p>
      <p><b>COLOMBIA TRACKING SAS</b>, identificada con NIT 901.332.415, con domicilio en Bogotá D.C., representada legalmente por <b>CRISTIAN CAMILO ALMARIO</b>, quien para efectos del presente contrato se denominará <b>EL EMPLEADOR</b>.</p>
      <p><b>${p.nombre.toUpperCase()}</b>, identificado(a) con cédula de ciudadanía No. <b>${p.cedula}</b>, domiciliado(a) en Bogotá, quien en adelante se denominará <b>EL TRABAJADOR</b>.</p>
      <p>Ambas partes acuerdan celebrar el presente <b>contrato de trabajo a término fijo</b>, el cual se regirá por las siguientes cláusulas y por las disposiciones legales vigentes en la República de Colombia, iniciando la relación laboral el día <b>${fmtDate(j.fechaInicio)}</b></p>
      <p style="text-align:center;font-weight:bold;font-size:13pt;color:#0d1f4e;margin:20px 0">CLÁUSULAS</p>
      ${clausulas(p,j).map(c=>`<p class="clausula-titulo">${c.titulo}</p><p class="clausula-texto">${c.texto}</p>`).join("")}
      <p class="parrafo">PARÁGRAFO PRIMERO:</p>
      <p>El presente contrato se rige por el Código Sustantivo del Trabajo, Ley 50 de 1990, Ley 789 de 2002, Ley 1562 de 2012, Decreto 1072 de 2015 y demás normas concordantes.</p>
      <table style="width:100%;margin-top:60px">
        <tr>
          <td style="width:50%;font-weight:bold">EL EMPLEADOR</td>
          <td style="width:50%;font-weight:bold">EL TRABAJADOR</td>
        </tr>
        <tr>
          <td style="padding-top:60px;border-top:1px solid #000;margin-top:60px">
            <br/><b>CRISTIAN CAMILO ALMARIO AREVALO</b><br/>C.C. 1.018.508.016<br/>Colombia Tracking SAS
          </td>
          <td style="padding-top:60px;border-top:1px solid #000;margin-top:60px">
            <br/><b>${p.nombre.toUpperCase()}</b><br/>C.C. ${p.cedula}
          </td>
        </tr>
      </table>
    </body></html>`;
  const blob = new Blob([html], {type:"application/msword"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Contrato_${p.nombre.replace(/ /g,"_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
};

const clausulas = (p, j) => [
  { titulo: "PRIMERA. Objeto del Contrato", texto: `EL EMPLEADOR contrata a EL TRABAJADOR para desempeñar el cargo de ${j.cargo.toUpperCase()}, conforme a los procesos y responsabilidades establecidas en los estatutos de la empresa, incluyendo la instalación y desinstalación de dispositivos GPS, así como otras actividades relacionadas que sean asignadas conforme a los procedimientos internos establecidos.` },
  { titulo: "SEGUNDA. Duración", texto: `El presente contrato es a término fijo por un período de seis (6) meses, contado a partir del ${fmtDate(j.fechaInicio)}. El contrato podrá renovarse automáticamente por períodos iguales, salvo que cualquiera de las partes manifieste por escrito su intención de no renovarlo con una antelación mínima de treinta (30) días calendario a la fecha de vencimiento, conforme al Código Sustantivo del Trabajo.` },
  { titulo: "TERCERA. Período de Prueba", texto: "Se establece un período de prueba de tres (3) meses, contados a partir del inicio de la relación laboral. Durante este período cualquiera de las partes podrá dar por terminado el contrato de manera unilateral, sin lugar al pago de indemnización." },
  { titulo: "CUARTA. Obligaciones del Trabajador", texto: "EL TRABAJADOR se compromete a: cumplir de manera diligente y eficiente con las funciones asignadas; seguir estrictamente los protocolos, estatutos y manuales establecidos por EL EMPLEADOR; participar en capacitaciones y evaluaciones de desempeño; mantener un comportamiento ético, profesional y respetuoso; reportar cualquier irregularidad técnica, operativa o de seguridad; proteger la información confidencial y los datos sensibles a los que tenga acceso." },
  { titulo: "QUINTA. Obligaciones del Empleador", texto: "EL EMPLEADOR se compromete a: proveer las herramientas, equipos y capacitación necesarios; pagar oportunamente salarios y prestaciones sociales; garantizar un entorno laboral seguro y libre de discriminación; respetar los derechos laborales y el debido proceso disciplinar." },
  { titulo: "SEXTA. Jornada Laboral y Remuneración", texto: `Jornada laboral: lunes a sábado de 7:00 am a 4:00 pm. EL EMPLEADOR pagará a EL TRABAJADOR un salario mensual de $${j.salario} pesos m/cte. Subsidio de transporte conforme a la ley. Pago quincenal.` },
  { titulo: "SÉPTIMA. Faltas y Sanciones", texto: "Faltas graves (terminación con justa causa): negligencia grave, manipulación indebida de datos, violación de confidencialidad, acoso laboral, incumplimiento del manual. Faltas leves (amonestación o suspensión): retrasos injustificados, descuidos en protocolos, conductas que afecten la convivencia." },
  { titulo: "OCTAVA. Confidencialidad y Propiedad Intelectual", texto: "EL TRABAJADOR se obliga a mantener la confidencialidad de la información incluso después de terminado el contrato. Todo desarrollo o innovación realizada será propiedad exclusiva de EL EMPLEADOR." },
  { titulo: "NOVENA. Seguridad y Salud en el Trabajo", texto: "EL EMPLEADOR afiliará a EL TRABAJADOR al sistema de seguridad social integral: salud, pensión, ARL y caja de compensación familiar." },
  { titulo: "DÉCIMA. Solución de Conflictos", texto: "Las controversias se resolverán mediante conciliación y, en caso de no acuerdo, ante la jurisdicción laboral competente." },
  { titulo: "DÉCIMA PRIMERA. SAGRILAFT", texto: "LAS PARTES certifican que sus recursos no provienen de actividades ilícitas y se comprometen a cumplir la normatividad vigente en materia de prevención del lavado de activos y financiación del terrorismo." },
  { titulo: "DÉCIMA SEGUNDA. Privacidad y Protección de Datos Personales", texto: "Las partes cumplirán la Ley 1581 de 2012 y normas concordantes sobre protección de datos personales." },
  { titulo: "DÉCIMA TERCERA. Anticorrupción", texto: "Las partes se obligan a cumplir las leyes nacionales e internacionales anticorrupción, incluyendo la Ley 1474 de 2011 y la Ley 1778 de 2016." },
  { titulo: "DÉCIMA CUARTA. Poder Subordinante", texto: "EL TRABAJADOR acepta las modificaciones razonables que EL EMPLEADOR realice, siempre que no afecten su dignidad ni derechos mínimos, conforme al artículo 23 del CST." },
  { titulo: "DÉCIMA QUINTA. Aceptación", texto: "EL TRABAJADOR declara haber leído y aceptado el contrato, así como conocer el Reglamento Interno de Trabajo, los estatutos y el Sistema de Seguridad y Salud en el Trabajo." },
];

const Field = ({label,value,onChange,type="text",placeholder="",req=true,col2=false}) => (
  <div className={col2?"col-span-2":""}>
    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-widest">
      {label}{req&&<span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-gray-50 text-gray-800 placeholder-gray-400"/>
  </div>
);

export default function App() {
  const [auth, setAuth] = useState(false);
  const [pin, setPin] = useState("");
  const [step, setStep] = useState(1);
  const [p, setP] = useState({nombre:"",cedula:"",fechaNac:"",direccion:"",ciudad:"",telefono:"",email:"",eps:"",pension:"",arl:""});
  const [j, setJ] = useState({cargo:"",salario:"",fechaInicio:""});
  const up = (k,v) => setP(x=>({...x,[k]:v}));
  const uj = (k,v) => setJ(x=>({...x,[k]:v}));

  const generate = () => {
    const img = new Image();
    img.src = `${SHEET_URL}?${new URLSearchParams({origen:"RRHH",...p,cargo:j.cargo,salario:j.salario,fechaInicio:j.fechaInicio,docs_cedula:"",docs_hv:"",docs_otros:""}).toString()}`;
    generateWord(p, j);
    setStep(3);
  };

  const reset = () => { setStep(1); setGenerated(false); setP({nombre:"",cedula:"",fechaNac:"",direccion:"",ciudad:"",telefono:"",email:"",eps:"",pension:"",arl:""}); setJ({cargo:"",salario:"",fechaInicio:""}); };

  const Header = () => (
    <>
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
      <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Panel de Recursos Humanos</h1>
            <p className="text-xs text-gray-500 mt-0.5">Gestión de Vinculación de Personal</p>
          </div>
          <span className="bg-blue-950 text-white text-xs px-3 py-1 rounded font-bold tracking-wide">🏢 RRHH</span>
        </div>
      </div>
    </>
  );

  if(!auth) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header/>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded shadow-sm border border-gray-200 p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-950 rounded flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl">🔐</span>
            </div>
            <h2 className="font-black text-gray-800 uppercase tracking-wider text-sm">Acceso Restringido</h2>
            <p className="text-xs text-gray-500 mt-1">Ingrese su PIN de acceso para continuar</p>
          </div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-widest">PIN de Acceso</label>
          <input type="password" value={pin} onChange={e=>setPin(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&(pin===PIN?setAuth(true):alert("PIN incorrecto"))}
            placeholder="••••" className="w-full border border-gray-300 rounded px-4 py-3 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-50 mb-4"/>
          <button onClick={()=>pin===PIN?setAuth(true):alert("PIN incorrecto")}
            className="w-full bg-blue-950 hover:bg-blue-900 text-white py-2.5 rounded text-sm font-bold uppercase tracking-wider transition-colors">
            Ingresar al Sistema
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header/>
      <div className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded shadow-sm border border-gray-200 p-8">
            {step<3&&(
              <div className="mb-8">
                <div className="flex items-center">
                  {["Datos Personales","Datos del Cargo"].map((lbl,i)=>{
                    const s=i+1,active=step===s,done=step>s;
                    return <div key={s} className="flex items-center flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${done?"bg-blue-950 border-blue-950 text-white":active?"bg-white border-blue-950 text-blue-950":"bg-white border-gray-300 text-gray-400"}`}>{done?"✓":s}</div>
                        <span className={`text-xs font-semibold hidden sm:block ${active?"text-blue-950":done?"text-blue-950":"text-gray-400"}`}>{lbl}</span>
                      </div>
                      {s<2&&<div className={`flex-1 h-0.5 mx-3 ${done?"bg-blue-950":"bg-gray-200"}`}/>}
                    </div>;
                  })}
                </div>
              </div>
            )}

            {step===1&&(
              <div>
                <div className="border-l-4 border-blue-950 pl-4 mb-6">
                  <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">Información Personal del Colaborador</h2>
                  <p className="text-xs text-gray-500 mt-1">Complete todos los campos requeridos</p>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Nombre completo" value={p.nombre} onChange={v=>up("nombre",v)} placeholder="Juan Carlos Pérez" col2/>
                  <Field label="Número de cédula" value={p.cedula} onChange={v=>up("cedula",v)} placeholder="1.023.456.789"/>
                  <Field label="Fecha de nacimiento" value={p.fechaNac} onChange={v=>up("fechaNac",v)} type="date"/>
                  <Field label="Dirección" value={p.direccion} onChange={v=>up("direccion",v)} placeholder="Cra 15 # 80-45" col2/>
                  <Field label="Ciudad" value={p.ciudad} onChange={v=>up("ciudad",v)} placeholder="Bogotá D.C."/>
                  <Field label="Teléfono" value={p.telefono} onChange={v=>up("telefono",v)} placeholder="3001234567"/>
                  <Field label="Correo electrónico" value={p.email} onChange={v=>up("email",v)} type="email" placeholder="correo@ejemplo.com" req={false} col2/>
                  <Field label="EPS" value={p.eps} onChange={v=>up("eps",v)} placeholder="Nueva EPS"/>
                  <Field label="Fondo de pensión" value={p.pension} onChange={v=>up("pension",v)} placeholder="Porvenir"/>
                  <Field label="ARL" value={p.arl} onChange={v=>up("arl",v)} placeholder="Sura" req={false}/>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <button onClick={()=>{
                    if(!p.nombre||!p.cedula) return alert("Complete nombre y cédula.");
                    setStep(2);
                  }} className="bg-blue-950 hover:bg-blue-900 text-white px-8 py-2.5 rounded text-sm font-bold uppercase tracking-wider transition-colors">
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {step===2&&(
              <div>
                <div className="border-l-4 border-blue-950 pl-4 mb-6">
                  <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">Condiciones del Cargo</h2>
                  <p className="text-xs text-gray-500 mt-1">Contrato a Término Fijo · 6 meses</p>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Cargo" value={j.cargo} onChange={v=>uj("cargo",v)} placeholder="Técnico GPS" col2/>
                  <Field label="Salario mensual ($)" value={j.salario} onChange={v=>uj("salario",v)} placeholder="1.423.500"/>
                  <Field label="Fecha de inicio" value={j.fechaInicio} onChange={v=>uj("fechaInicio",v)} type="date"/>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                  <button onClick={()=>setStep(1)} className="text-sm text-gray-500 hover:text-gray-700 font-semibold">← Anterior</button>
                  <button onClick={()=>{
                    if(!j.cargo||!j.salario||!j.fechaInicio) return alert("Complete todos los campos del cargo.");
                    generate();
                  }} className="bg-green-700 hover:bg-green-800 text-white px-8 py-2.5 rounded text-sm font-bold uppercase tracking-wider transition-colors">
                    📄 Generar Contrato Word
                  </button>
                </div>
              </div>
            )}

            {step===3&&(
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h2 className="text-lg font-black text-gray-800 uppercase tracking-wide mb-2">¡Contrato Generado!</h2>
                <p className="text-sm text-gray-500 mb-2">El contrato fue descargado automáticamente como archivo Word.</p>
                <p className="text-xs text-gray-400 mb-6">Revísalo, ajusta si es necesario y envíalo a firma.</p>
                <div className="bg-gray-50 border border-gray-200 rounded p-5 text-left max-w-xs mx-auto mb-6">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Resumen</p>
                  <p className="text-xs text-gray-700"><span className="font-semibold">Trabajador:</span> {p.nombre}</p>
                  <p className="text-xs text-gray-700"><span className="font-semibold">Cédula:</span> {p.cedula}</p>
                  <p className="text-xs text-gray-700"><span className="font-semibold">Cargo:</span> {j.cargo}</p>
                  <p className="text-xs text-gray-700"><span className="font-semibold">Salario:</span> ${j.salario}</p>
                  <p className="text-xs text-gray-700"><span className="font-semibold">Inicio:</span> {fmtDate(j.fechaInicio)}</p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button onClick={()=>generateWord(p,j)} className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-2.5 rounded text-sm font-bold uppercase tracking-wider transition-colors">
                    ⬇️ Descargar de nuevo
                  </button>
                  <button onClick={reset} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2.5 rounded text-sm font-bold uppercase tracking-wider transition-colors">
                    🔄 Nueva Vinculación
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">© 2026 Colombia Tracking SAS · NIT 901.332.415 · Bogotá D.C.</p>
          </div>
        </div>
      </div>
    </div>
  );
}