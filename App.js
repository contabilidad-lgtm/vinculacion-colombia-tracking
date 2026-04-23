import React from "react";
import Colaborador from "./Colaborador";
import RRHH from "./RRHH";

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const rol = params.get("rol");
  if(rol === "colaborador") return <Colaborador/>;
  if(rol === "rrhh") return <RRHH/>;
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0d1f4e,#1a56b0)",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
      <div style={{background:"white",borderRadius:"16px",padding:"32px",maxWidth:"360px",width:"100%",textAlign:"center"}}>
        <div style={{background:"#0d1f4e",color:"white",borderRadius:"12px",padding:"8px 16px",display:"inline-block",marginBottom:"16px"}}>
          <strong style={{fontSize:"12px",letterSpacing:"2px"}}>COLOMBIA TRACKING SAS</strong>
        </div>
        <p style={{fontWeight:"bold",color:"#1a1a1a",marginBottom:"4px"}}>Sistema de Vinculación</p>
        <p style={{fontSize:"12px",color:"#888",marginBottom:"24px"}}>NIT 901.332.415 · Bogotá D.C.</p>
        <a href="?rol=colaborador" style={{display:"block",padding:"16px",border:"2px solid #e0e7ff",borderRadius:"12px",marginBottom:"12px",textDecoration:"none",color:"#1a1a1a"}}>
          <strong>👤 Soy Colaborador</strong>
          <p style={{fontSize:"12px",color:"#888",margin:"4px 0 0"}}>Diligencia tus datos y documentos</p>
        </a>
        <a href="?rol=rrhh" style={{display:"block",padding:"16px",border:"2px solid #0d1f4e",borderRadius:"12px",textDecoration:"none",color:"#1a1a1a"}}>
          <strong>🏢 Soy de RRHH</strong>
          <p style={{fontSize:"12px",color:"#888",margin:"4px 0 0"}}>Gestiona la vinculación completa</p>
        </a>
      </div>
    </div>
  );
}