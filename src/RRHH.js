import { useState, useRef } from "react";

const SHEET_URL = "https://script.google.com/macros/s/AKfycbz_jVcXxcZoZbqbF5l07slEJuBFMh0s9e7gWUNihftIIUYQDdJLe6CxO9fQl2j7RdYc/exec";
const PIN = "2107";
const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const fmtDate = s => { if(!s) return ""; const [y,m,d]=s.split("-"); return `${+d} de ${MONTHS[+m-1]} de ${y}`; };

const Field = ({label,value,onChange,type="text",placeholder="",req=true,col2=false}) => (
  <div className={col2?"col-span-2":""}>
    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-widest">
      {label}{req&&<span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-gray-50 text-gray-800 placeholder-gray-400"/>
  </div>
);

const generatePDF = (p, j) => {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  @page { margin: 2cm 2.5cm; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 10.5pt; line-height: 1.6; color: #000; }
  
  /* MEMBRETE */
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0d1f4e; padding-bottom: 12px; margin-bottom: 20px; }
  .header-left { display: flex; align-items: center; gap: 12px; }
  .logo-box { width: 80px; height: 80px; object-fit: contain; }
  .company-info .name { font-size: 13pt; font-weight: 900; color: #0d1f4e; letter-spacing: 1px; }
  .company-info .slogan { font-size: 8pt; color: #555; font-style: italic; }
  .company-info .nit { font-size: 8pt; color: #888; }
  .header-right { text-align: right; font-size: 8pt; color: #555; line-height: 1.8; }

  /* TÍTULO */
  .titulo { text-align: center; margin: 20px 0 6px; font-size: 28pt; font-weight: 900; color: #000; letter-spacing: 2px; }
  .subtitulo { text-align: center; font-size: 16pt; font-style: italic; font-weight: 700; color: #1a56b0; margin-bottom: 20px; }
  .linea { border-bottom: 2px solid #0d1f4e; margin-bottom: 20px; }

  /* CUERPO */
  p { margin-bottom: 10px; text-align: justify; }
  .clausulas-titulo { text-align: center; font-weight: bold; font-size: 12pt; color: #0d1f4e; margin: 20px 0 10px; letter-spacing: 2px; }
  .clausula-titulo { font-weight: bold; margin-top: 14px; margin-bottom: 4px; }
  .clausula-lista { margin-left: 20px; margin-bottom: 10px; }
  .clausula-lista li { margin-bottom: 4px; }
  .bold { font-weight: bold; }

  /* FIRMAS */
  .firmas { margin-top: 50px; }
  .firmas-titulo { text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 40px; }
  .firmas-row { display: flex; justify-content: space-between; }
  .firma { width: 45%; }
  .firma-linea { border-top: 1px solid #000; padding-top: 8px; margin-top: 60px; }
  .firma-nombre { font-weight: bold; font-size: 9pt; }
  .firma-dato { font-size: 9pt; }

  /* PIE */
  .footer { border-top: 2px solid #0d1f4e; margin-top: 30px; padding-top: 8px; display: flex; justify-content: space-between; font-size: 7.5pt; color: #555; }
</style>
</head>
<body>

<!-- MEMBRETE -->
<div class="header">
  <div class="header-left">
    <img src="data:image/jpeg;base64,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" class="logo-box" alt="Colombia Tracking SAS"/>
    <div class="company-info">
      <div class="name">COLOMBIA TRACKING SAS</div>
      <div class="slogan">Innovative and Safety Logistics</div>
      <div class="nit">NIT 901.332.415 · Bogotá D.C., Colombia</div>
    </div>
  </div>
  <div class="header-right">
    Bogotá D.C., ${new Date().toLocaleDateString("es-CO",{day:"numeric",month:"long",year:"numeric"})}<br/>
    Trabajador: <b>${p.nombre.toUpperCase()}</b><br/>
    C.C. ${p.cedula}
  </div>
</div>

<!-- TÍTULO -->
<div class="titulo">CONTRATO</div>
<div class="subtitulo">A TÉRMINO FIJO</div>
<div class="linea"></div>

<!-- PARTES -->
<p><b>Entre:</b></p>
<p><b>1. COLOMBIA TRACKING SAS</b>, identificada con NIT <b>901.332.415</b>, con domicilio en Bogotá D.C., representada legalmente por <b>CRISTIAN CAMILO ALMARIO</b>, quien para efectos del presente contrato se denominará <b>EL EMPLEADOR</b>.</p>
<p><b>2. ${p.nombre.toUpperCase()}</b>, identificado(a) con cédula de ciudadanía No. <b>${p.cedula}</b>, domiciliado(a) en Bogotá, quien en adelante se denominará <b>EL TRABAJADOR</b>.</p>
<p>Ambas partes acuerdan celebrar el presente <b>contrato de trabajo a término fijo</b>, el cual se regirá por las siguientes cláusulas y por las disposiciones legales vigentes en la República de Colombia, iniciando la relación laboral el día <b>${fmtDate(j.fechaInicio)}</b></p>

<div class="clausulas-titulo">CLÁUSULAS</div>

<p class="clausula-titulo">PRIMERA. Objeto del Contrato</p>
<p>EL EMPLEADOR contrata a EL TRABAJADOR para desempeñar el cargo de <b>${j.cargo.toUpperCase()}</b>, conforme a los procesos y responsabilidades establecidas en los estatutos de la empresa, incluyendo la instalación y desinstalación de dispositivos GPS, así como otras actividades relacionadas que sean asignadas conforme a los procedimientos internos establecidos.</p>

<p class="clausula-titulo">SEGUNDA. Duración</p>
<p>El presente contrato es <b>a término fijo por un período de seis (6) meses</b>, contado a partir del <b>${fmtDate(j.fechaInicio)}</b>. El contrato <b>podrá renovarse automáticamente por períodos iguales</b>, salvo que cualquiera de las partes manifieste por escrito su intención de no renovarlo con una antelación mínima de <b>treinta (30) días calendario</b> a la fecha de vencimiento, conforme al Código Sustantivo del Trabajo.</p>

<p class="clausula-titulo">TERCERA. Período de Prueba</p>
<p>Se establece un <b>período de prueba de tres (3) meses</b>, contados a partir del inicio de la relación laboral. Durante este período cualquiera de las partes podrá dar por terminado el contrato de manera unilateral, sin lugar al pago de indemnización.</p>

<p class="clausula-titulo">CUARTA. Obligaciones del Trabajador</p>
<p>EL TRABAJADOR se compromete a:</p>
<ol class="clausula-lista">
  <li>Cumplir de manera diligente y eficiente con las funciones asignadas.</li>
  <li>Seguir estrictamente los protocolos, estatutos y manuales establecidos por EL EMPLEADOR.</li>
  <li>Participar en capacitaciones y evaluaciones de desempeño.</li>
  <li>Mantener un comportamiento ético, profesional y respetuoso.</li>
  <li>Reportar cualquier irregularidad técnica, operativa o de seguridad.</li>
  <li>Proteger la información confidencial y los datos sensibles a los que tenga acceso.</li>
</ol>

<p class="clausula-titulo">QUINTA. Obligaciones del Empleador</p>
<p>EL EMPLEADOR se compromete a:</p>
<ol class="clausula-lista">
  <li>Proveer las herramientas, equipos y capacitación necesarios.</li>
  <li>Pagar oportunamente salarios y prestaciones sociales.</li>
  <li>Garantizar un entorno laboral seguro y libre de discriminación.</li>
  <li>Respetar los derechos laborales y el debido proceso disciplinar.</li>
</ol>

<p class="clausula-titulo">SEXTA. Jornada Laboral y Remuneración</p>
<p><b>1. Jornada laboral:</b> EL TRABAJADOR laborará en una jornada de <b>lunes a sábado de 7:00 am a 4:00 pm</b>, conforme a las necesidades operativas del servicio de monitoreo y vigilancia tecnológica.</p>
<p><b>2. Remuneración:</b> EL EMPLEADOR pagará a EL TRABAJADOR la siguiente remuneración mensual:</p>
<ul class="clausula-lista">
  <li><b>Salario: $${j.salario} pesos m/cte</b></li>
  <li><b>Subsidio de transporte</b>, conforme a la ley, cuando haya lugar.</li>
  <li><b>Rodamiento fijo</b> pactado, sujeto a descuentos de ley. Pago quincenal.</li>
</ul>

<p class="clausula-titulo">SÉPTIMA. Faltas y Sanciones</p>
<p><b>Faltas graves</b> (terminación con justa causa): negligencia grave, manipulación indebida de datos, violación de confidencialidad, acoso laboral, incumplimiento del manual.</p>
<p><b>Faltas leves</b> (amonestación o suspensión): retrasos injustificados, descuidos en protocolos, conductas que afecten la convivencia.</p>

<p class="clausula-titulo">OCTAVA. Confidencialidad y Propiedad Intelectual</p>
<p>EL TRABAJADOR se obliga a mantener la confidencialidad de la información incluso después de terminado el contrato. Todo desarrollo o innovación realizada será propiedad exclusiva de EL EMPLEADOR.</p>

<p class="clausula-titulo">NOVENA. Seguridad y Salud en el Trabajo</p>
<p>EL EMPLEADOR afiliará a EL TRABAJADOR al sistema de seguridad social integral: salud, pensión, ARL y caja de compensación familiar.</p>

<p class="clausula-titulo">DÉCIMA. Solución de Conflictos</p>
<p>Las controversias se resolverán mediante conciliación y, en caso de no acuerdo, ante la jurisdicción laboral competente.</p>

<p class="clausula-titulo">DÉCIMA PRIMERA. SAGRILAFT</p>
<p>LAS PARTES certifican que sus recursos no provienen ni se destinan al ejercicio de ninguna actividad ilícita. Las Partes se comprometen a cumplir la normatividad vigente en materia de prevención del lavado de activos y financiación del terrorismo.</p>

<p class="clausula-titulo">DÉCIMA SEGUNDA. Privacidad y Protección de Datos Personales</p>
<p>Las partes cumplirán la Ley 1581 de 2012 y normas concordantes sobre protección de datos personales.</p>

<p class="clausula-titulo">DÉCIMA TERCERA. Anticorrupción</p>
<p>Las partes se obligan a cumplir las leyes nacionales e internacionales anticorrupción, incluyendo la Ley 1474 de 2011 y la Ley 1778 de 2016.</p>

<p class="clausula-titulo">DÉCIMA CUARTA. Poder Subordinante</p>
<p>EL TRABAJADOR acepta las modificaciones razonables que EL EMPLEADOR realice, siempre que no afecten su dignidad ni derechos mínimos, conforme al artículo 23 del CST.</p>

<p class="clausula-titulo">DÉCIMA QUINTA. Aceptación</p>
<p>EL TRABAJADOR declara haber leído y aceptado el contrato, así como conocer el Reglamento Interno de Trabajo, los estatutos y el Sistema de Seguridad y Salud en el Trabajo.</p>

<p><b>PARÁGRAFO PRIMERO:</b> El presente contrato se rige por el Código Sustantivo del Trabajo, Ley 50 de 1990, Ley 789 de 2002, Ley 1562 de 2012, Decreto 1072 de 2015 y demás normas concordantes.</p>

<!-- FIRMAS -->
<div class="firmas">
  <div class="firmas-titulo">FIRMAS</div>
  <div class="firmas-row">
    <div class="firma">
      <div class="bold">EL EMPLEADOR</div>
      <div class="firma-linea">
        <div class="firma-nombre">CRISTIAN CAMILO ALMARIO AREVALO</div>
        <div class="firma-dato">C.C. 1.018.508.016</div>
        <div class="firma-dato">Colombia Tracking SAS</div>
      </div>
    </div>
    <div class="firma">
      <div class="bold">EL TRABAJADOR</div>
      <div class="firma-linea">
        <div class="firma-nombre">${p.nombre.toUpperCase()}</div>
        <div class="firma-dato">C.C. ${p.cedula}</div>
      </div>
    </div>
  </div>
</div>

<!-- PIE DE PÁGINA -->
<div class="footer">
  <span>Colombia Tracking SAS · NIT 901.332.415 · Bogotá D.C.</span>
  <span>Documento generado el ${new Date().toLocaleDateString("es-CO",{day:"numeric",month:"long",year:"numeric"})}</span>
</div>

</body>
</html>`;

  const ventana = window.open("", "_blank");
  ventana.document.write(html);
  ventana.document.close();
  setTimeout(() => ventana.print(), 500);
};

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
    img.src = `${SHEET_URL}?${new URLSearchParams({
      origen:"RRHH", ...p, cargo:j.cargo, salario:j.salario,
      fechaInicio:j.fechaInicio, docs_cedula:"", docs_hv:"", docs_otros:""
    }).toString()}`;
    generatePDF(p, j);
    setStep(3);
  };

  const reset = () => { setStep(1); setP({nombre:"",cedula:"",fechaNac:"",direccion:"",ciudad:"",telefono:"",email:"",eps:"",pension:"",arl:""}); setJ({cargo:"",salario:"",fechaInicio:""}); };

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
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${done?"bg-blue-950 border-blue-950 text-white":active?"bg-white border-blue-950 text-blue-950":"bg-white border-gray-300 text-gray-400"}`}>{done?"✓":s}</div>
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
                    📄 Generar Contrato
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
                <p className="text-sm text-gray-500 mb-2">El contrato se abrió en una nueva ventana listo para imprimir o guardar como PDF.</p>
                <p className="text-xs text-gray-400 mb-6">En el diálogo de impresión selecciona <b>"Guardar como PDF"</b></p>
                <div className="bg-gray-50 border border-gray-200 rounded p-5 text-left max-w-xs mx-auto mb-6">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Resumen</p>
                  <p className="text-xs text-gray-700"><span className="font-semibold">Trabajador:</span> {p.nombre}</p>
                  <p className="text-xs text-gray-700"><span className="font-semibold">Cédula:</span> {p.cedula}</p>
                  <p className="text-xs text-gray-700"><span className="font-semibold">Cargo:</span> {j.cargo}</p>
                  <p className="text-xs text-gray-700"><span className="font-semibold">Salario:</span> ${j.salario}</p>
                  <p className="text-xs text-gray-700"><span className="font-semibold">Inicio:</span> {fmtDate(j.fechaInicio)}</p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button onClick={()=>generatePDF(p,j)} className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-2.5 rounded text-sm font-bold uppercase tracking-wider transition-colors">
                    🖨️ Imprimir / PDF de nuevo
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
}