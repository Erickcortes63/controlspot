import { useState, useEffect, useMemo } from "react";

// ── Supabase client ──────────────────────────────────────────────────────────
const SUPA_URL = "https://zrcogyjdwgjmavilydyo.supabase.co";
const SUPA_KEY = "sb_publishable_1I8Ya1McHsS_8cFR0IEg0w_hNik0eVB";

async function sbFetch(path, options={}){
  const res = await fetch(SUPA_URL+path, {
    ...options,
    headers:{
      "apikey": SUPA_KEY,
      "Authorization": "Bearer "+SUPA_KEY,
      "Content-Type": "application/json",
      "Prefer": options.prefer||"",
      ...(options.headers||{})
    }
  });
  if(!res.ok){
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

async function dbGetWorkers(){ return await sbFetch("/rest/v1/workers?select=*&order=nombre.asc&limit=1000"); }
async function dbSaveWorker(w){
  const row={
    id:w.id, rut:w.rut, nombre:w.nombre, telefono:w.telefono, correo:w.correo,
    ciudad:w.ciudad, direccion:w.direccion, especialidad:w.especialidad,
    nacionalidad:w.nacionalidad, afp:w.afp, salud:w.salud,
    estado_civil:w.estadoCivil, estado_examen:w.estadoExamen,
    eval_psicologica:w.evalPsicologica, estado_habilitado:w.estadoHabilitado,
    tipo_servicio:w.tipoServicio, obs:w.obs, motivo_accion:w.motivoAccion,
    origen:w.origen, inductiones:w.inductiones, historial:w.historial||[],
    banco:w.banco||"", tipo_cuenta:w.tipoCuenta||"", numero_cuenta:w.numeroCuenta||"",
    certificado_antecedentes:w.certificadoAntecedentes||"",
    primeros_auxilios:w.primerosAuxilios||"",
    manejo_extintores:w.manejoExtintores||"",
    energia_potenciales:w.energiaPotenciales||"",
    fecha_vencimiento_examen:w.fechaVencimientoExamen||"",
    bloqueado:w.bloqueado||false,
    motivo_bloqueo:w.motivoBloqueo||"",
    observacion_seguimiento:w.observacionSeguimiento||""
  };
  return await sbFetch("/rest/v1/workers", {
    method:"POST", prefer:"resolution=merge-duplicates",
    headers:{"Prefer":"resolution=merge-duplicates"},
    body:JSON.stringify(row)
  });
}
async function dbDeleteWorker(id){ return await sbFetch(`/rest/v1/workers?id=eq.${id}`,{method:"DELETE"}); }
async function dbGetUsers(){ return await sbFetch("/rest/v1/users?select=*"); }
async function dbSaveUser(u){
  return await sbFetch("/rest/v1/users",{
    method:"POST", headers:{"Prefer":"resolution=merge-duplicates"},
    body:JSON.stringify({id:u.id,username:u.username,password:u.password,nombre:u.nombre,rol:u.rol})
  });
}
async function dbDeleteUser(id){ return await sbFetch(`/rest/v1/users?id=eq.${id}`,{method:"DELETE"}); }
async function dbAddAudit(e){
  return await sbFetch("/rest/v1/audit_log",{
    method:"POST", body:JSON.stringify({id:e.id,ts:e.ts,usuario:e.usuario,username:e.username,rol:e.rol,accion:e.accion,detalle:e.detalle,trabajador:e.trabajador})
  });
}
async function dbGetAudit(){ return await sbFetch("/rest/v1/audit_log?select=*&order=id.desc&limit=500"); }


const FULL_DATA = [{"id": 1, "rut": "15088123-4", "nombre": "ABRAHAM GERMAN ALBIÑA ESPINOZA", "telefono": "+56 9 8797 0943", "correo": "ae103253@gmail.com", "ciudad": "IQUIQUE", "direccion": "BARROS ARANA 1784", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1970-05-02", "edad": "56", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-06", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "15088123-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 2, "rut": "16438286-9", "nombre": "ADOLFO ESTEBAN CEA VARGAS", "telefono": "+56 9 9315 8883", "correo": "adolfoceavargas38@gmail.com", "ciudad": "IQUIQUE", "direccion": "LAS VIOLETAS #3848", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1986-12-02", "edad": "39", "afp": "CUPRUM", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-11", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "16438286-9", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 3, "rut": "23345450-8", "nombre": "AGUSTIN MEJIA MELGAR", "telefono": "+56 9 4075 9778", "correo": "leo.agus.mejia@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE KOREA DEL SUR, MANZANA 91, SITIO 13", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1988-12-05", "edad": "37", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "23345450-8", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 4, "rut": "20728393-2", "nombre": "ALEJANDRO ANDREÉ VELÁSQUEZ FLORES", "telefono": "+56 9 8864 8727", "correo": "ak.velasquez03@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "ANDACOLLO 4598", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2001-03-27", "edad": "25", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-09", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "20728393-2", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 5, "rut": "27898170-3", "nombre": "ALEXANDER MONTAÑO MANJON", "telefono": "+56 9 5058 1877", "correo": "alexitomanjon12345@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PILON 2264 CONDOMINIO LOS OLIVOS", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1990-01-03", "edad": "36", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-06-28", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "27898170-3", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 6, "rut": "23467053-0", "nombre": "ALFREDO COCHA CACERES", "telefono": "+56 9 9796 0895", "correo": "cochacaceresalfredo@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "JAPON 4289", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1969-12-10", "edad": "56", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-11", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "23467053-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 7, "rut": "22558394-3", "nombre": "ANACLETO PACHECO MARCE", "telefono": "+56 9 7755 3838", "correo": "pache1368@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AV. LAS AMERICAS MZ. 64 SITIO 10", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1968-07-13", "edad": "57", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2026-08-06", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "", "numeroCuenta": "", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 8, "rut": "21276343-8", "nombre": "ANGEL GABRIEL ROA CERECEDA", "telefono": "+56 9 6714 4655 / +56 9 9485 2142", "correo": "roaangel400@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE LOS FLAMENCOS N°3090", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2003-03-27", "edad": "23", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-09-17", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "21276343-8", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 9, "rut": "23505508-2", "nombre": "ANGEL GALINDO VELASQUEZ", "telefono": "+56 9 5002 9322", "correo": "donangel.galindo1970@gmail.com", "ciudad": "IQUIQUE", "direccion": "LINCOYAN 1670", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1970-05-05", "edad": "56", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-30", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "23505508-2", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 10, "rut": "15002058-1", "nombre": "ANTONIO ANDRES BRICEÑO HUIRCAL", "telefono": "+56 9 3223 5665", "correo": "abricenohuircal@gmail.com", "ciudad": "IQUIQUE", "direccion": "PATRICIO LYNCH 91 DEPTO 502", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1981-12-05", "edad": "44", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-20", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO BCI", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "49910701", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 11, "rut": "18372765-6", "nombre": "ANTONIO CHALLAPA GARCIA", "telefono": "+56 9 3292 0412", "correo": "challapa1219@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CALLE IRLANDA SITIO #31", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1993-09-12", "edad": "32", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-07-23", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "11270112619", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 12, "rut": "19976171-4", "nombre": "ARMIN DEREK CARRANZA LAZARO", "telefono": "+56 9 5989 4017", "correo": "armineduardo1998@gmail.com", "ciudad": "IQUIQUE", "direccion": "LAS ZAMPOÑAS 2480", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1998-06-02", "edad": "28", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-08-05", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19976171-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 13, "rut": "17800145-0", "nombre": "AYRTON GABRIEL GOMEZ RECABARREN", "telefono": "+56 9 4179 7273", "correo": "91ayrton.gr@gmail.com", "ciudad": "IQUIQUE", "direccion": "AVDA LA TIRANA 4450", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1991-06-20", "edad": "34", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2026-10-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "17800145-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 14, "rut": "21379602-K", "nombre": "BASTIAN ALEJANDRO NUNEZ CUELLAR", "telefono": "+56 9 4248 6069", "correo": "bnunezcuellarbastian@gmail.com", "ciudad": "IQUIQUE", "direccion": "RANCAGUA 3265", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2003-08-31", "edad": "22", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-09-05", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "19823147560", "origen": "HABILITADOS", "obs": "SOLO EN EMERGENCIA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 15, "rut": "27417929-5", "nombre": "BERNABE GARCIA QUINTELA", "telefono": "+56 9 7995 7396", "correo": "garciaquintelabernabe@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE SAN LORENZO #135 TOMA", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-03-26", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "27417929-5", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 16, "rut": "17432665-7", "nombre": "BORYS PATRICIO ABDON ROJAS SALAZAR", "telefono": "+56 9 4524 7509", "correo": "borysrojassalazar0@gmail.com", "ciudad": "IQUIQUE", "direccion": "SALVADOR ALLENDE CONDOMINIO BUENA VISTA", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1990-07-18", "edad": "35", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-05", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "", "numeroCuenta": "", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 17, "rut": "22528076-2", "nombre": "BRANDON ALAN PEREZ PEREZ", "telefono": "+56 9 3544 2512", "correo": "brandon22960@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "SANTA ROSA 3981", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1999-02-22", "edad": "27", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-24", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM. CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "VENCIDO", "Proyecto": "NO ESTA"}}, {"id": 18, "rut": "17430389-4", "nombre": "BRAULIO RODRIGO SARAVIA JORQUERA", "telefono": "+56 9 8676 6072", "correo": "braulio.s.j14@gmail.com", "ciudad": "LA TIRANA", "direccion": "SANTA ISABEL SUR PASAJE LOS PIONERO #6", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2026-11-07", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "17430389-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 19, "rut": "20250567-8", "nombre": "BRYAN ANDRES RUBIO CELIS", "telefono": "+56 9 6129 3589", "correo": "rubiobryan2000@gmail.com", "ciudad": "IQUIQUE", "direccion": "AV. LA TIRANA #1832", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2000-02-20", "edad": "26", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2026-09-25", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 20, "rut": "19433489-3", "nombre": "CAMILO ENRIQUE TELLO PEREZ", "telefono": "+56 9 9876 0492", "correo": "camilotelloperez1996@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE MACAYA #2851", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-09-09", "edad": "29", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-15", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19433489-3", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 21, "rut": "26720223-0", "nombre": "CARLOS ALBERTO SANTA CRUZ GUZMAN", "telefono": "+56 9 4142 2553", "correo": "csantacruz705@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PARQUE ORIENTE PSJ. BOLIVAR N°88", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1972-01-03", "edad": "54", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-05", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "26720223-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "VENCIDO", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 22, "rut": "13314347-5", "nombre": "CARLOS ALEJANDRO BASTIAS CARRIMAN", "telefono": "+56 9 8715 6590", "correo": "cebarti@hotmail.com", "ciudad": "IQUIQUE", "direccion": "PASAJE CALCOPIRITA 4249", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1976-10-15", "edad": "49", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2026-08-06", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "TIENE OTRO EMPLEO", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 23, "rut": "26142235-2", "nombre": "CARLOS CASTILLO AVALOS", "telefono": "+56 9 6607 1407", "correo": "castilloavaloscarlos@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AV. GLADYS MARIN MZT 44 SITIO 3", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-09", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM. CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 24, "rut": "14108522-0", "nombre": "CARLOS ENRIQUE BAEZ LILLO", "telefono": "+56 9 6388 8170", "correo": "cb4939819@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CALLE LA SERENA 4445", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1974-12-19", "edad": "51", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-29", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "14108522-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 25, "rut": "17068679-9", "nombre": "CESAR ANTONIO CEBALLOS CARCAMO", "telefono": "+56 9 6249 5946", "correo": "cceballo280@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "LAS AVELLANAS #3028", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1989-06-20", "edad": "36", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2026-10-03", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "BASE", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 26, "rut": "17799758-7", "nombre": "CLAUDIO ANDRES ARGOTE PEREZ", "telefono": "+56 9 4237 7963", "correo": "claudio.argote91@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE VALDIVIA 4546", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1991-04-19", "edad": "35", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2026-10-02", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "BASE", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 27, "rut": "24249226-9", "nombre": "CLAUDIO EDUARDO CHIPANA JIMENEZ", "telefono": "+56 9 8632 1402", "correo": "chipana.eduardo1234@yahoo.com", "ciudad": "ALTO HOSPICIO", "direccion": "AV. UNION 173", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1980-10-30", "edad": "45", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "BASE PUERTO", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 28, "rut": "21670358-8", "nombre": "CRISTIAN BASTIAN MAMANI GARCIA", "telefono": "+56 9 6648 0020", "correo": "cristian.mamani0989@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AVENIDA LA PAMPA 3728", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2004-09-20", "edad": "21", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-29", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "21670358-8", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 29, "rut": "24709163-7", "nombre": "CRISTIAN RUBEN CABALLERO", "telefono": "+56 9 9674 7034", "correo": "fabiomartinez2509@gmail.com", "ciudad": "IQUIQUE", "direccion": "LAS MONTAÑAS 1951", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1987-09-25", "edad": "38", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-29", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "24709163-7", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 30, "rut": "19979527-9", "nombre": "DANIEL ISMAEL VILCA PEREZ", "telefono": "+56 9 4541 1410", "correo": "d.vp676767@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AMANDA BREBIA CON VICENTE PEREZ ROSALES #318", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1999-02-08", "edad": "27", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-05", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19979527-9", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 31, "rut": "15684494-2", "nombre": "DAVID ANTONIO CHAVEZ CHAVEZ", "telefono": "+56 9 4689 5209", "correo": "david.ing.publicidad@gmail.com", "ciudad": "POZO ALMONTE", "direccion": "PASAJE QUEÑUA 1165", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1983-07-27", "edad": "42", "afp": "CUPRUM", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-03", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "15684494-2", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 32, "rut": "26514142-0", "nombre": "DAVID BISMAR CHIRILLA GONZALES", "telefono": "+56 9 6258 3542", "correo": "davidchirilla96@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "EL BORO TOMA INTEGRACION N 91", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2001-09-07", "edad": "24", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-11", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "26514142-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 33, "rut": "24728331-5", "nombre": "DECIDERIO GUARDIA RODRIGUEZ", "telefono": "+56 9 3173 2290", "correo": "deciderio23guardia@gmal.com", "ciudad": "ALTO HOSPICIO", "direccion": "SITIO 11", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1983-05-23", "edad": "43", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-03", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "24728331-5", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "VENCIDO", "Proyecto": "NO ESTA"}}, {"id": 34, "rut": "26294212-0", "nombre": "DENILSON MAYTA CHOQUE", "telefono": "+56 9 3881 8409", "correo": "maytadenilson028@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "ARTURO PEREZ CANTO 1704", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2002-01-05", "edad": "24", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-11", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "26294212-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 35, "rut": "24787661-8", "nombre": "DIEGO APONTE CORONADO", "telefono": "+56 9 4454 7413", "correo": "diegoo.apontee@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "RIO LOA 3046", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2004-02-05", "edad": "22", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2026-05-16", "estadoExamen": "VENCIDO", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "NO HABILITADO", "motivoAccion": "Examen: Vencido; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 36, "rut": "19177437-K", "nombre": "DIEGO IGNACIO MOSCOSO CUELLAR", "telefono": "+56 9 9894 8540", "correo": "diegoignaciomoscosocuellar5@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CALLE DOS 3291", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1995-07-11", "edad": "30", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2026-11-18", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19177437-K", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 37, "rut": "17800451-4", "nombre": "DIEGO SEBASTIAN PERALTA REYES", "telefono": "+56 9 3207 1643", "correo": "dperaltareyes@gmail.com", "ciudad": "IQUIQUE", "direccion": "CINCO SUR #4272", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1991-07-17", "edad": "34", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM. CON OBSERVACIÓN", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1-983-282135-2", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 38, "rut": "26648236-1", "nombre": "EDDY FERNANDO ESPINOZA FERNANDEZ", "telefono": "+56 9 9102 3388", "correo": "eeddy1052@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE ARGENTINA 30", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1985-02-23", "edad": "41", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-31", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 39, "rut": "24314655-0", "nombre": "EDDY MAMANI FLORES", "telefono": "+56 9 4252 4931", "correo": "eddymamaniflores82@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "TOMA TARAPACA PSJ. IQUIQUE CASA N°13", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1976-06-15", "edad": "49", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-23", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "24314655-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 40, "rut": "17528375-7", "nombre": "EDUARDO ANDRES GOMEZ CUELLAR", "telefono": "+56 9 9927 8426", "correo": "eduardo.cocho09@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE POLONIA 3129", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1990-09-21", "edad": "35", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-11", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "17528375-7", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 41, "rut": "13640560-8", "nombre": "EDUARDO PATRICIO BEYZAGA PORTILLO", "telefono": "+56 9 3332 5552", "correo": "eduardobeyzaga83@gmail.com", "ciudad": "IQUIQUE", "direccion": "PASAJE ESFUERZO #2079", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1979-06-25", "edad": "46", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-09", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "AGENDADO", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO SANTANDER", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "0 000 83 84516 3", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 42, "rut": "8414675-7", "nombre": "EDUARDO RAMON NUÑEZ TAPIA", "telefono": "+56 9 8838 2456", "correo": "kty.nunezrobledo@gmail.com", "ciudad": "IQUIQUE", "direccion": "LOS ALELIES 1818", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1970-03-27", "edad": "56", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-08-05", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "PENDIENTE ENVIO", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 43, "rut": "21979340-5", "nombre": "EHIVAN ANDRES MAMANI CHALLAPA", "telefono": "+56 9 8740 2438", "correo": "ehivanchallapa@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CALLE 4 N°3072", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-29", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "21979340-5", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 44, "rut": "22500618-0", "nombre": "ELMER DANY PEREZ GOMEZ", "telefono": "+56 9 3205 0547", "correo": "elmerperezgomez31@gmail.com", "ciudad": "IQUIQUE", "direccion": "CESPEDES Y GONZALEZ 2199", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "HABITAD", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-29", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "22500618-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 45, "rut": "24223688-2", "nombre": "ELVIS LAZARTE PAEZ", "telefono": "+56 9 4855 7912", "correo": "elvis.du.wilster777@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CALLE NUEVA 2 N°3345, CONDOMINIO PIONEROS 2", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1987-10-11", "edad": "38", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-29", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "BASE", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 46, "rut": "24262541-2", "nombre": "ERICK JOSE VILLANUEVA CALLE", "telefono": "+56 9 2929 3816", "correo": "ev2209615@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CALLE 12 SITIO 1250 TOMA LA PAMPA", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1993-12-17", "edad": "32", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-24", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "24262541-2", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 47, "rut": "15967231-K", "nombre": "ERNESTO JAVIER ÁVILA ALBORNOZ", "telefono": "+56 9 7162 5713", "correo": "ejavieravila@gmail.com", "ciudad": "IQUIQUE", "direccion": "MAR DEL NORTE 4788 POBLACIÓN", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1985-01-22", "edad": "41", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-06", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "15967231-K", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 48, "rut": "20250439-6", "nombre": "ESTEBAN GUILLERMO VELIZ BUSTAMANTE", "telefono": "+56 9 3483 4238", "correo": "estebanveliz711@gmail.com", "ciudad": "IQUIQUE", "direccion": "VILLA DON ARTURO PASAJE UNO # 3889", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2000-02-12", "edad": "26", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-04", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "20250439-6", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 49, "rut": "19691720-9", "nombre": "FELIPE ANDRES DIAZ TAPIA", "telefono": "+56 9 8721 5441", "correo": "felipeandresdiaztapia@gmail.com", "ciudad": "POZO ALMONTE", "direccion": "FUNDO SANTA EMILIA SUR SITIO 51 MANZANA, LA TIRANA", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1997-08-04", "edad": "28", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-29", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM. CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19691720-9", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 50, "rut": "21842681-6", "nombre": "FELIPE MAXIMILIANO DIAZ VALERA", "telefono": "+56 9 6788 5383", "correo": "felipemaxan12gmail.com", "ciudad": "IQUIQUE", "direccion": "AV. LA TIRANA 3441 BLOCK , DEPTO. 45", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2005-04-05", "edad": "21", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2026-12-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM. CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 51, "rut": "21945004-4", "nombre": "FERNANDO IVAN MAMANI MAMANI", "telefono": "+56 9 7669 3350", "correo": "fernandomamani2409@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "RANCAGUA CON SAN FERNANDO #3284", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2005-09-24", "edad": "20", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-29", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 52, "rut": "21878438-0", "nombre": "FRANCISCO ALEXANDER VILLAR NUÑEZ", "telefono": "+56 9 5527 7701", "correo": "villarf306@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "ALTO PIRÁMIDE 4545", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2005-05-12", "edad": "21", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-11", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "21878438-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 53, "rut": "15685588-K", "nombre": "FRANCISCO ALFREDO ESCUDERO MORALES", "telefono": "+56 9 6522 2335", "correo": "fescudero43@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "COLTAUCO N°3275", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-23", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "PENDIENTE", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA A LO QUE SE SOLICITA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 54, "rut": "13211462-5", "nombre": "FRANCISCO VLADIMIR ARQUEROS TRASLAVIÑA", "telefono": "+56 9 9411 9016", "correo": "fco_arqueros2@hotmail.com", "ciudad": "ARICA", "direccion": "LOS PLÁTANOS 2265", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1977-01-14", "edad": "49", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2026-07-23", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 55, "rut": "18564669-6", "nombre": "FRANCO ANDRES PEREZ PEÑA", "telefono": "+56 9 4132 7135", "correo": "francoperezpena29@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE CHILE CASA 24", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1992-12-03", "edad": "33", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2026-08-19", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 56, "rut": "11813392-7", "nombre": "FREDDY FLORENCIO HUARACHI BENITEZ", "telefono": "+56 9 4442 6419", "correo": "freddyhuarache23@gmail.com", "ciudad": "ARICA", "direccion": "POBLACION INDUSTRIALES 1, PSJ SAMO ALTO 3382", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1971-02-23", "edad": "55", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-26", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "VENCIDO", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 57, "rut": "23503620-7", "nombre": "FREDDY ISSAC PAUCAR ARRATIA", "telefono": "+56 9 2035 8933", "correo": "freddy1978paucar@gmail.com", "ciudad": "IQUIQUE", "direccion": "SOTOMAYOR 1748", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1978-03-14", "edad": "48", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-12-10", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "23503620-7", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 58, "rut": "21560602-3", "nombre": "GABRIEL ELIAS MORELLO ESCOBAR", "telefono": "+56 9 7138 6960", "correo": "gabrielmorello2004@gmail.com", "ciudad": "IQUIQUE", "direccion": "BUELNES #867", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2004-04-21", "edad": "22", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-29", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1-984-124472-9", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 59, "rut": "21328064-3", "nombre": "GEREMY AARON NICOLAS DIAZ CASTILLO", "telefono": "+56 9 8293 5375", "correo": "geremyaron13@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "SANTA ROSA DE ALTO MOLLE #4150 DEPTO 605", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2003-06-13", "edad": "22", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-09-17", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 60, "rut": "19734932-8", "nombre": "GERSON RODRIGO CHILA MAMANI", "telefono": "+56 9 8690 1612", "correo": "jrsoncm@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AV. LAS AMERICAS 9 SITIO 16", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1997-06-22", "edad": "28", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2026-11-03", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 61, "rut": "13006459-0", "nombre": "GILBERT ORLANDO CANTILLANO RIOS", "telefono": "+56 9 5229 5808", "correo": "gilbert953@hotmail.com", "ciudad": "IQUIQUE", "direccion": "TALCA #2625", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-09", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "AGENDADO", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1300401500", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 62, "rut": "17798062-5", "nombre": "GIORDAN REYNALDO NAVARRETE JAQUE", "telefono": "+56 9 6297 9889", "correo": "giordannavarrete@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "SAMARIA 2264", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1990-12-01", "edad": "35", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2026-12-16", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "17798062-5", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 63, "rut": "19980110-4", "nombre": "GONZALO ALEJANDRO PEREZ AMARO", "telefono": "+56 9 8718 3345", "correo": "gonzaloalejandro1702@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE CROACIA 4245", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1999-02-17", "edad": "27", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2026-11-03", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "19841743881", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 64, "rut": "17097165-5", "nombre": "GROWER MARCELO TERRAZAS FLORES", "telefono": "+56 9 7447 3522", "correo": "growerterrazas@gmail.com", "ciudad": "POZO ALMONTE", "direccion": "AV. DIEGO PORTALES 1070", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1989-08-24", "edad": "36", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-05", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "17097165-5", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 65, "rut": "25528835-0", "nombre": "GUIDO ASCENCIO LOPEZ CHAMBI", "telefono": "+56 9 3595 5743", "correo": "ascenciolopez321@gmail.com", "ciudad": "POZO ALMONTE", "direccion": "ALDUNATE 447", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1997-02-09", "edad": "29", "afp": "PLANVITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-24", "estadoExamen": "VIGENTE", "evalPsicologica": "ROCOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Revisar; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "25528835-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 66, "rut": "18898839-3", "nombre": "HÉCTOR FELIPE VARGAS GONZALEZ", "telefono": "+56 9 6776 8726", "correo": "felipe.vargas740@gmail.com", "ciudad": "IQUIQUE", "direccion": "PASAJE MACAYA 2358", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1995-01-11", "edad": "31", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "18898839-3", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 67, "rut": "23767087-6", "nombre": "HECTOR FERNANDO QUICAÑO CONDORI", "telefono": "+56 9 5975 7394", "correo": "quincanohector85@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AV.LAS AMERICAS MZ 73,SITIO 10", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1978-01-25", "edad": "48", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-23", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 68, "rut": "23885146-7", "nombre": "HECTOR RAUL ATENCIO ARCE", "telefono": "+56 9 4992 8240", "correo": "renny_@hotmail.com", "ciudad": "IQUIQUE", "direccion": "SOTOMAYOR 1748", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1984-09-16", "edad": "41", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-03", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "23885146-7", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 69, "rut": "23915657-6", "nombre": "HENRY VILLALOBOS BALCAZAR", "telefono": "+56 9 5613 0859", "correo": "henryvillalobos672@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "GLADYS MARIN CON SANTIAGO", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1978-09-18", "edad": "47", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-29", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "OK", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1-983-263977-3", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 70, "rut": "23206042-5", "nombre": "HUGO AROCUTIPA AQUINO", "telefono": "+56 9 8126 0436", "correo": "hugoarocutipa20@gmail.com", "ciudad": "IQUIQUE", "direccion": "LA CANTERA #2582", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1982-07-04", "edad": "43", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-16", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "23206042-5", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 71, "rut": "15685105-1", "nombre": "HUGO JAVIER HERRERA VALDES", "telefono": "+56 9 8779 6342", "correo": "hugoherreravaldes6@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE PAN DE AZÚCAR # 2939", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1983-10-20", "edad": "42", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-03", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "15685105-1", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 72, "rut": "26169630-4", "nombre": "HUGO RICARDO LAURA MARCA", "telefono": "+56 9 9995 6013", "correo": "hugolaura48@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "JESUS ES EL REY #23, TOMAS EL BORO", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1974-10-27", "edad": "51", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2026-09-11", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "OK"}}, {"id": 73, "rut": "19460113-1", "nombre": "IAN BORIS BARRAZA GODOY", "telefono": "+56 9 3251 7740", "correo": "ian.bori.barraza.godoy1997@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "RUTA A 616 SITIO 21 SECTOR EL BORO", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1997-08-28", "edad": "28", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-06", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM. CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19460113-1", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 74, "rut": "19977752-1", "nombre": "IGNACIO ALBERTO GUERRERO ROA", "telefono": "+56 9 9912 1999", "correo": "ignacio.nk18@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AV. PAMPA UNION 3330", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1998-09-30", "edad": "27", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-12-22", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "VENCIDO", "CMDIC": "VENCIDO", "Bloqueo": "VENCIDO", "Puerto": "VENCIDO", "Proyecto": "NO ESTA"}}, {"id": 75, "rut": "22220999-4", "nombre": "ISRAEL OSVALDO MURILLO MURILLO", "telefono": "+56 9 5165 8946", "correo": "mauriciotola66@gmail.com", "ciudad": "IQUIQUE", "direccion": "VILLA NAVIDAD PASAJE 4, N°2502", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2026-12-18", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "22220999-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 76, "rut": "20247699-6", "nombre": "IVAN MARCELO ZAMBRA VARGAS", "telefono": "+56 9 4797 0664", "correo": "ivanzambragb@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE TRES 3318 VILLA FREI", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1999-07-14", "edad": "26", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2026-08-21", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 77, "rut": "20726830-5", "nombre": "IVAN PATRICIO ESPINOZA IBACACHE", "telefono": "+56 9 3556 8447", "correo": "pfivan.espinoza@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE CINCO #3327", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2001-03-16", "edad": "25", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-10-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "20726830-5", "origen": "HABILITADOS", "obs": "PENDIENTE ENVIO", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 78, "rut": "12612292-6", "nombre": "IVAN PATRICIO ESPINOZA MERCADO", "telefono": "+56 9 2694 4433", "correo": "ivan.p.espinoza.mercado@gmail.com", "ciudad": "IQUIQUE", "direccion": "PASAJE COQUIMBO 2258", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1974-09-24", "edad": "51", "afp": "SURA", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-03", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM. CON OBSERVACIÓN", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NUMERO NO HABILITADO", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 79, "rut": "19496066-2", "nombre": "IVÁN RENÉ MAMANI CHOQUERIVE", "telefono": "+56 9 3331 8644", "correo": "ivan.rene3202@gmail.com", "ciudad": "ARICA", "direccion": "SERGIO FLORES TERNECIER 2011", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1998-02-18", "edad": "28", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2026-07-18", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 80, "rut": "10958047-3", "nombre": "JAVIER ENRIQUE CONDORI URRELO", "telefono": "+56 9 5748 0051", "correo": "javiercu789@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "SOR TERESA DE LOS ANDES 3980", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1970-02-02", "edad": "56", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-23", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "10958047-3", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 81, "rut": "17002174-6", "nombre": "JEAN PAUL CARLOS MATUS JARA", "telefono": "+56 9 8381 5542", "correo": "jeanpaul.matus@gmail.com", "ciudad": "PICA", "direccion": "ALTO VITAYLE PARCELA #2", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1988-07-28", "edad": "37", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2026-08-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO BCI", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "79842898", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 82, "rut": "27463392-1", "nombre": "JEANCARLOS ANTONIO ALVAREZ GIAMPAOLI", "telefono": "+56 9 4778 1403", "correo": "⁠jeancarlosaag@gmail.com", "ciudad": "IQUIQUE", "direccion": "⁠SALVADOR ALLENDE 2252", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-01-11", "estadoExamen": "VENCIDO", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "NO HABILITADO", "motivoAccion": "Examen: Vencido; Evaluación psicológica: Sin información", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 83, "rut": "24716290-9", "nombre": "JEFRY ALEXANDER CUERO GONZALEZ", "telefono": "+56 9 6314 8484", "correo": "alexander777gonzalez3@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "RIO LOA 3043", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1995-06-07", "edad": "31", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2026-12-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "24716290-9", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 84, "rut": "21378379-3", "nombre": "JEREMY HANS RIOS LOPEZ", "telefono": "+56 9 4187 3992", "correo": "jeremyhans200@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "EL PILÓN #2252", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2003-08-22", "edad": "22", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-29", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1-980-136122-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 85, "rut": "21818595-9", "nombre": "JEREMY WILDO CASTRO GOMEZ", "telefono": "+56 9 3464 8958", "correo": "jeremy.wildo@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CALLE VOLCAN PARINACOTA #4109", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2005-03-09", "edad": "21", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 86, "rut": "25175851-4", "nombre": "JESUS ALBERTO MENDOZA AGUILAR", "telefono": "+56 9 3015 8060", "correo": "jesusalbertomendozaaguilar64@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "LA PAMPA 39", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1991-05-02", "edad": "35", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2026-11-14", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "25175851-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "AGENDADO"}}, {"id": 87, "rut": "16865606-8", "nombre": "JHONNY ALEXIS MARIN RAMIREZ", "telefono": "+56 9 3410 4992", "correo": "jhonny.marin.6988@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "FLOR DEL DESIERTO CASA N°7", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1988-06-09", "edad": "37", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-02", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "SOLO PUERTO", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 88, "rut": "21316414-7", "nombre": "JOAQUÍN ALEJANDRO FERNÁNDEZ HIDALGO", "telefono": "+56 9 2010 1779", "correo": "joaquin.fh2003@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "EL MIRADOR #3642", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2003-06-07", "edad": "23", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "21316414-7", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 89, "rut": "19180741-3", "nombre": "JOEL ALEJANDRO CHALLAPA FLORES", "telefono": "+56 9 5235 0967", "correo": "jlchllp@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PJE MARTA COLVIN 4019", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-06-11", "estadoExamen": "POR VENCER", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Examen: Por vencer", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19180741-3", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 90, "rut": "19975944-2", "nombre": "JOEL OSEAS ABRAHAM ESTEBAN MAMANI", "telefono": "+56 9 5426 4419", "correo": "oseasabraham98@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "LOS NOGALES 3018", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1998-05-10", "edad": "28", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-29", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19975944-2", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "VENCIDO", "CMDIC": "VENCIDO", "Bloqueo": "VENCIDO", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 91, "rut": "25969893-6", "nombre": "JOHN NOE SANCHEZ RIVAS", "telefono": "+56 9 7526 6093", "correo": "isaiasnoe1201@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "LA PAMA 3 ESPERANZA PASAJE 5 CASA 4", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1989-04-19", "edad": "37", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-03", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "25969893-6", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 92, "rut": "27120248-2", "nombre": "JORGE ARIEL ORTEGA GUERRA", "telefono": "+56 9 7726 6767", "correo": "jogeortega.g1996@gmail.com", "ciudad": "IQUIQUE", "direccion": "PSJ. PROGRESO 115", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-03-09", "edad": "30", "afp": "CUPRUM", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-23", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "27120248-2", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 93, "rut": "20248279-1", "nombre": "JORGE JOSUE TRUJILLO GUZMAN", "telefono": "+56 9 2778 6697", "correo": "jorge.naaahmaa@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "SALITRERA LAGUNA 3240", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1999-06-17", "edad": "26", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-23", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "20248279-1", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 94, "rut": "26285532-5", "nombre": "JORGE LUIS GARCÍA QUITO", "telefono": "+56 9 2021 0113", "correo": "jorgegarciaquito95@gmail.com", "ciudad": "IQUIQUE", "direccion": "GENARO GALLO 2273", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-04-28", "edad": "30", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2026-09-11", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1-981-077595-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 95, "rut": "12801820-4", "nombre": "JORGE ROMULO MAITA CASTRO", "telefono": "+56 9 7405 7416", "correo": "jorge_maita_castro@hotmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "VOLCÁN ISLUGA 4160", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1975-07-17", "edad": "50", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2026-10-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "12801820-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 96, "rut": "27831237-2", "nombre": "JOSE HUGO SOTO RIVERA", "telefono": "+56 9 4981 4183", "correo": "josehsotorivera@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE BRIZAS SITIO 19 CAMPAMENTO SOL PAMPA", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-03-16", "edad": "30", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-24", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1-982-333838-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 97, "rut": "13914531-3", "nombre": "JOSE JULIAN NARVAEZ NARVAEZ", "telefono": "+56 9 7558 7541", "correo": "juliannarvaes1980@gmail.com", "ciudad": "IQUIQUE", "direccion": "AV. LA TIRANA 1750", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1980-01-06", "edad": "46", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-02", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "PENDIENTE", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "13914531-3", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 98, "rut": "13892286-3", "nombre": "JOSE LUIS CARVAJAL BAKRY", "telefono": "+56 9 5372 0607", "correo": "carvajalbakry@gmail.com", "ciudad": "IQUIQUE", "direccion": "JUAN MARTINEZ 1075", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1979-12-30", "edad": "46", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-02", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDADO", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO TIENE WTSP", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 99, "rut": "21803456-K", "nombre": "JOSE LUIS DIAZ MOSCOSO", "telefono": "+56 9 9307 6608", "correo": "jose.luis.diaz.mos@gmail.com", "ciudad": "IQUIQUE", "direccion": "AYSEN 2768", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2005-03-23", "edad": "21", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-13", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO SCOTIABANK", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "992929812", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 100, "rut": "27167839-8", "nombre": "JOSE LUIS MORALES FIGUEROA", "telefono": "+56 9 6602 4116", "correo": "joseluismfigueroa@gmail.com", "ciudad": "IQUIQUE", "direccion": "PASAJE ESPERANZA 3014", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1980-08-18", "edad": "45", "afp": "PLANVITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-09", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "27167839-8", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 101, "rut": "19432346-8", "nombre": "JOSE MIGUEL GUTIÉRREZ FLORES", "telefono": "+56 9 4119 0770", "correo": "josemiguelgutierrezflores0@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AV. SANTA MARIA 3055 DEPTO. 1202 TORRE B", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-05-31", "edad": "30", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-14", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "BASE", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 102, "rut": "26748635-2", "nombre": "JOSE NESTOR ESTOFANERO TITO", "telefono": "59177357483", "correo": "joseestofanerotito1973@gmail.com", "ciudad": "IQUIQUE", "direccion": "SOTOMAYOR #1299", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1973-10-13", "edad": "52", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-31", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "26748635-2", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 103, "rut": "26805177-5", "nombre": "JOYS ANTONY GRACIANO CORO", "telefono": "+56 9 6430 8797", "correo": "joysgracianocaro@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CHINA CON PROYECTADA 52", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1991-07-17", "edad": "34", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-20", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "26805177-5", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 104, "rut": "18478595-1", "nombre": "JUAN ALEJANDRO BELMAR GUTIÉRREZ", "telefono": "+56 9 6293 4853", "correo": "jbelmar2619@gmail.com", "ciudad": "IQUIQUE", "direccion": "EL ALMENDRAL #2548", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1993-02-19", "edad": "33", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-23", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1-984-129975-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 105, "rut": "14705269-3", "nombre": "JUAN CARLOS CASTILLO LEIVA", "telefono": "+56 9 3541 3742", "correo": "juank.leiva1985@gmail.com", "ciudad": "IQUIQUE", "direccion": "COLO COLO 2039", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-28", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "19802299183", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 106, "rut": "15010125-5", "nombre": "JUAN ESTEBAN DROGUETT PALMA", "telefono": "+56 9 9142 3255", "correo": "droguett.palma43@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PSJ. 1 N°2942, POBLACION CALICHE 3", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1983-02-13", "edad": "43", "afp": "PLANVITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-23", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NUMERO NO HABILITADO", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 107, "rut": "24243802-7", "nombre": "JUAN JOSE AYALA UGARTE", "telefono": "+56 9 2633 1177", "correo": "juanjoseayala83@gmail.com", "ciudad": "IQUIQUE", "direccion": "21 DE MAYO #459", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-12-24", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "24243802-7", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "OK"}}, {"id": 108, "rut": "21901356-6", "nombre": "JUAN JOSE SALAZAR MARTINEZ", "telefono": "+56 9 8455 2163", "correo": "juanjosesalazarmartinez04@gmail.com", "ciudad": "IQUIQUE", "direccion": "SOTOMAYOR 1748", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1965-10-25", "edad": "60", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2026-12-24", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 109, "rut": "19165852-3", "nombre": "JUAN JOSE SANDOVAL ORTIZ", "telefono": "+56 9 7743 6222", "correo": "juanjosesandovalortiz8@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CALLE UNO DEPTO N°2452", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-01-01", "edad": "30", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-08-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE CON OBSERVACIÓN", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 110, "rut": "25409731-4", "nombre": "JUAN MANUEL HUAYHUATA ZABALAGA", "telefono": "+56 9 9103 3907", "correo": "juanhuayhuata2@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE SANTA MARIA 81,LA PAMPA", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2026-07-31", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "25409731-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 111, "rut": "21876285-9", "nombre": "JUAN PABLO CANTILLANA CANTILLANA", "telefono": "+56 9 9685 6685", "correo": "juanpimullet@gmail.com", "ciudad": "IQUIQUE", "direccion": "DIECIOCHO DE SEPTIEMBRE 427", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2005-06-26", "edad": "20", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-29", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 112, "rut": "24312074-8", "nombre": "JUAN PEDRO HIGA ROMERO", "telefono": "+56 9 9055 2278", "correo": "juanpedrohigaromero@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PARQUE ORIENTE, PJE, TARPACA #64", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1987-02-25", "edad": "39", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-12-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "AGENDADO", "manejoExtintores": "AGENDADO", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "BASE", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 113, "rut": "19979129-K", "nombre": "JULIO CESAR CARPIO PLAZA", "telefono": "+56 9 8962 8359", "correo": "carpiojulio734@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "LOS PERALES #3371", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1999-01-08", "edad": "27", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-07", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 114, "rut": "19976193-5", "nombre": "KEVIN BENJAMIN LUQUE VIERA", "telefono": "+56 9 5890 9134", "correo": "duquek294@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "LOS PARRONES #2896", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1998-05-30", "edad": "28", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-22", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19976193-5", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 115, "rut": "22666060-7", "nombre": "LEO GAMBOA FLORES", "telefono": "+56 9 4444 8454", "correo": "pegasus.com.com@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "GABRIELA MISTRAL 4319", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1977-10-05", "edad": "48", "afp": "HABITAD", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-04", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "22666060-7", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 116, "rut": "17798404-3", "nombre": "LEONEL GUILLERMO ACUÑA CACERES", "telefono": "+56 9 3374 9017", "correo": "sr.guillermo02@gmail.com", "ciudad": "IQUIQUE", "direccion": "RANCAGUA N°2982C", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1991-01-02", "edad": "35", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-23", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "17798404-3", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 117, "rut": "19977729-7", "nombre": "LORENZO ANTONIO DEL ROSARIO CASTRO TAPIA", "telefono": "+56 9 4810 5141", "correo": "lorenzocastro9814@gmail.com", "ciudad": "IQUIQUE", "direccion": "SARGENTO ALDEA #1583", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1998-09-23", "edad": "27", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19977729-7", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 118, "rut": "15979149-1", "nombre": "LORENZO ENRIQUE BUGUEÑO AGUILERA", "telefono": "+56 9 5207 8775", "correo": "vato_30@hotmail.cl", "ciudad": "ARICA", "direccion": "PASAJE PICHILEMU 378", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1980-08-10", "edad": "45", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-26", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "15979149-1", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 119, "rut": "24392982-2", "nombre": "LUDWIN CAROL CAMARIA", "telefono": "+56 9 2216 2863", "correo": "ludwincito21021515@gmail.com", "ciudad": "IQUIQUE", "direccion": "AMUNATEGUI 729", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1988-02-21", "edad": "38", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-24", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "PENDIENTE", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 120, "rut": "23084428-3", "nombre": "LUIS ALBERTO CCAPA KAIRA", "telefono": "+56 9 5352 9320", "correo": "lccapakaira@gmail.com", "ciudad": "IQUIQUE", "direccion": "CALETA RIO SECO S/N", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1977-06-12", "edad": "48", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2026-10-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO DISPONIBLE", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 121, "rut": "26134117-4", "nombre": "LUIS ALBERTO MONTERO NIBUSCHA", "telefono": "+56 9 4076 0874", "correo": "rickymontero96@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AVENIDA PARQUE ORIENTE 17", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-05-20", "edad": "30", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "OK", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1-999-588372-9", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 122, "rut": "13008309-9", "nombre": "LUIS HERNAN SANHUEZA RIVERA", "telefono": "+56 9 7993 4438", "correo": "lusamrit@gmail.com", "ciudad": "IQUIQUE", "direccion": "CESPEDES Y GONZALEZ 827", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1976-02-20", "edad": "50", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-15", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "13008309-9", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 123, "rut": "22671171-6", "nombre": "LUIS MARIN BAPTISTA QUISPE", "telefono": "+56 9 8821 1324", "correo": "luisbaptista418@gmail.com", "ciudad": "IQUQUE", "direccion": "CALLE TOHOMSON #350", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1979-03-03", "edad": "47", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-15", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "22671171-6", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 124, "rut": "11410747-6", "nombre": "LUIS MOISES ACHIVURY PALMA", "telefono": "+56 9 3904 6979", "correo": "luis.moises.achivury.palma@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE MACAYA N°2724", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1969-02-25", "edad": "57", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-03-26", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "11410747-6", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 125, "rut": "13215392-2", "nombre": "MANUEL ALEJANDRO ROJO CATALDO", "telefono": "+56 9 3892 6562", "correo": "manuel.rojo34@hotmail.com", "ciudad": "IQUIQUE", "direccion": "PASAJE LOS CHUNCHOS # 3953", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1977-10-23", "edad": "48", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2026-10-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "13215392-2", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 126, "rut": "19433242-4", "nombre": "MANUEL IGNACIO MIRANDA MAMANI", "telefono": "+56 9 3686 7116", "correo": "manuelmirandam23@gmail.com", "ciudad": "IQUIQUE", "direccion": "PASAJE NICOLAS URRUTIA N°1999", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-08-23", "edad": "29", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-03-26", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 127, "rut": "13215346-9", "nombre": "MARCELO ALEJANDRO VILCHES MANCHECO", "telefono": "+56 9 3444 1166", "correo": "marcelovilches2732@gmail.com", "ciudad": "IQUIQUE", "direccion": "RANCAGUA 2808", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1977-10-20", "edad": "48", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-13", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "TIENE OTRO EMPLEO", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 128, "rut": "19388184-K", "nombre": "MARCELO ANDRES NAVARRETE ARAVIRE", "telefono": "+56 9 8258 0380", "correo": "marcelo.navarrete.aravire@gmail.com", "ciudad": "POZO ALMONTE", "direccion": "CALA CALA 695 SANTA ANA", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-10-01", "edad": "29", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-05", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19388184-K", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 129, "rut": "19434902-5", "nombre": "MARCELO FABIAN MILLA RAMOS", "telefono": "+56 9 3174 3863", "correo": "mfmilla@icloud.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE TREINTA Y TRES 3043", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-09-17", "edad": "29", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-11", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "OK", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 130, "rut": "16350127-9", "nombre": "MARCELO JESUS MONTAÑO MONTAÑO", "telefono": "+56 9 5637 3890", "correo": "marjesusmont@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "MARIA ENCARNACION 3580", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1986-04-06", "edad": "40", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2026-12-24", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "16350127-9", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 131, "rut": "24453032-K", "nombre": "MARIO CAMATICONA VALERIANO", "telefono": "+56 9 6272 2864", "correo": "mariocamaticona77@gmail.com", "ciudad": "IQUIQUE", "direccion": "SERRANO 1189", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1979-06-15", "edad": "46", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-05-15", "estadoExamen": "VENCIDO", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "NO HABILITADO", "motivoAccion": "Examen: Vencido; Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "24453032-K", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 132, "rut": "24216925-5", "nombre": "MARIO POMA MAMANI", "telefono": "+56 9 3253 9018", "correo": "mariopoma87@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AV. EL BORO, COMITE INTEGRACION, SITIO 74 A", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1974-06-11", "edad": "51", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "", "estadoExamen": "SIN FECHA", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "NO HABILITADO", "motivoAccion": "Examen: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 133, "rut": "23879053-0", "nombre": "MARIO RUIZ MARIN", "telefono": "+56 9 9612 9683", "correo": "mr8994115@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "COMITE 3°ESPERANZA, PJE.5 ST.14", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1974-01-16", "edad": "52", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-20", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "23879053-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 134, "rut": "21654831-0", "nombre": "MARTIN ANTONIO CUBILLOS MEZA", "telefono": "+56 9 3262 1490", "correo": "martincubillos70109@gmail.com", "ciudad": "IQUIQUE", "direccion": "ANTARTICA 2450", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2004-09-08", "edad": "21", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2026-07-11", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "BASE", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 135, "rut": "20839057-0", "nombre": "MATIAS IVAN SOISSA SOTO", "telefono": "+56 9 8811 7408", "correo": "msoissa3@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "OLEGARIO LAZO #3272", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2001-09-12", "edad": "24", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-19", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "20839057-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 136, "rut": "21846151-4", "nombre": "MATIAS VICENTE URRA FIGUEROA", "telefono": "+56 9 8956 4409", "correo": "matiasvicente115@gmail.com", "ciudad": "IQUIQUE", "direccion": "CONDOMINIO BAJO MOLLE #2661", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2005-05-11", "edad": "21", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-31", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "21846151-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "PENDIENTE", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 137, "rut": "22022520-8", "nombre": "MAXIMILIANO ANTONIO CASTRO RIQUELME", "telefono": "+56 9 2388 7995", "correo": "dlnengoflow@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE PETRA #2260 EL BORO", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2006-01-12", "edad": "20", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-28", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "22022520-8", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 138, "rut": "19434611-5", "nombre": "MICHAEL BRIAN MOSCOSO GARCIA", "telefono": "+56 9 2375 3916", "correo": "michaelbrianmg@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AV. LA PAMPA 2969", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-12-02", "edad": "29", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-02", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 139, "rut": "27809322-0", "nombre": "MICHAEL QUIROZ CORPA", "telefono": "+56 9 6864 6552", "correo": "quirozmichael02@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "EL MIRADOR #3664", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1993-10-04", "edad": "32", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-22", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1-980-342455-3", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 140, "rut": "13641853-K", "nombre": "MICHAEL RODRIGO GUERRERO VALDES", "telefono": "+56 9 6737 7586", "correo": "guerreromichael263@gmail.com", "ciudad": "IQUIQUE", "direccion": "ARTURO PEREZ CANTO 2227", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1979-10-22", "edad": "46", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2026-11-19", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "13641853-K", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 141, "rut": "26909871-6", "nombre": "MIGUEL ANGEL MONTOYA LLAVE", "telefono": "+56 9 3597 1309", "correo": "angelmont85.24@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE VOLCÁN SOCOMPA 3396", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-03", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "26909871-6", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 142, "rut": "22725064-K", "nombre": "MIGUEL ANGEL RIVAS MORAN", "telefono": "+56 9 3434 2081 / +56 9 4708 5797", "correo": "rivasmoranmiguel@gmail.com", "ciudad": "IQUIQUE", "direccion": "PASAJE BELLAVISTA 70", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1991-05-31", "edad": "35", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2026-08-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "22725064-K", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 143, "rut": "25539508-4", "nombre": "ORLANDO MARCOS GOMEZ", "telefono": "+56 9 6825 5234", "correo": "neymarorlandomarcos9@gmail.com", "ciudad": "POZO ALMONTE", "direccion": "CALLE UNO", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-05", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 144, "rut": "12686170-2", "nombre": "OSCAR DANIEL NAVARRO INOSTROZA", "telefono": "+56 9 9613 4170", "correo": "oscar.neil.navarro@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "LOS KIWIS 2872", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1973-04-06", "edad": "53", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-11", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "12686170-2", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 145, "rut": "26838270-4", "nombre": "PABLO ARTURO PAZ ORTEGA", "telefono": "+56 9 9305 2826", "correo": "paz84296@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "JAPÓN #89", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1991-07-11", "edad": "34", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-09", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "26838270-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 146, "rut": "20906846-K", "nombre": "PABLO CAMILO JESUS ZAMORA CORREA", "telefono": "+56 9 2628 6843", "correo": "pablocamilojzc@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "VICENTE PÉREZ ROSALES 3255", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2001-10-18", "edad": "24", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "OK", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "20906846-K", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 147, "rut": "18315300-5", "nombre": "PABLO ERNESTO GONZALEZ VARGAS", "telefono": "+56 9 4785 4120", "correo": "pabloernestoliam@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "SANTA INES #4035", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1993-03-31", "edad": "33", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "OK", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "18315300-5", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 148, "rut": "21543972-0", "nombre": "PABLO IGNACIO ROCHA LOPEZ", "telefono": "+56 9 5234 6939", "correo": "prochapablo16@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "LOS ALAMOS 2964", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2004-04-01", "edad": "22", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-12-04", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "21543972-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 149, "rut": "20093579-9", "nombre": "PAOLO ANDRES GONZALES AYMA", "telefono": "+56 9 6689 4682", "correo": "gonzalezaymap@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PSJ. ESPAÑA 3075", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1999-02-01", "edad": "27", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-24", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "PENDIENTE", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1-115-006850-6", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 150, "rut": "18265615-1", "nombre": "PATRICIO ANTONIO OLIVARES CORTES", "telefono": "+56 9 8152 9686", "correo": "patricioolivarescortes4@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "LOS NOGALES 3383", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1993-08-09", "edad": "32", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2026-05-15", "estadoExamen": "VENCIDO", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "NO HABILITADO", "motivoAccion": "Examen: Vencido; Evaluación psicológica: Sin información", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO TIENE WTSP", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 151, "rut": "21561762-9", "nombre": "PATRICK ABRAHAM ARANDA ANDRADE", "telefono": "+56 9 9302 5564", "correo": "maelgatten@gmail.com", "ciudad": "IQUIQUE", "direccion": "RANCAGUA 3024", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2004-04-29", "edad": "22", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-05-20", "estadoExamen": "VENCIDO", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "NO HABILITADO", "motivoAccion": "Examen: Vencido; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "21561762-9", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 152, "rut": "10612335-7", "nombre": "PEDRO ANDRES ROJAS RAMOS", "telefono": "+56 9 3971 3731", "correo": "andres.rojas@gmail.com", "ciudad": "IQUIQUE", "direccion": "PASAJE UJINA 3126", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-05", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "10612335-7", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 153, "rut": "23780016-8", "nombre": "PORFIRIO ROBERTO ESPEZUA MAQUERA", "telefono": "+56 9 8414 2670", "correo": "espezua.re@gmail.com", "ciudad": "IQUIQUE", "direccion": "18 DE SEPTIEMBRE 180", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1975-09-01", "edad": "50", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-09", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "23780016-8", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 154, "rut": "27572077-1", "nombre": "PRUDENCIO ARONI OSEDA", "telefono": "+56 9 4151 5297", "correo": "", "ciudad": "", "direccion": "", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "", "salud": "", "fechaVencimientoExamen": "2027-04-29", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "AGENDADO", "manejoExtintores": "OK", "energiaPotenciales": "OK", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 155, "rut": "15010436-K", "nombre": "RAMIRO AMBROSIO PERALTA OLIVARES", "telefono": "+56 9 9568 0454", "correo": "ramiroperaltaolivares@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "LOS PARRONES 2922", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1983-02-25", "edad": "43", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-23", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENRTA RUT", "numeroCuenta": "15010436-K", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 156, "rut": "24118569-9", "nombre": "RAUL MIGUEL SANTIESTEBAN MUÑOZ", "telefono": "+56 9 3372 7888", "correo": "miguelitosati73@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CERRO ESMERALDA 3737", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1976-02-12", "edad": "50", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-28", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "24118569-9", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 157, "rut": "25072842-5", "nombre": "REISON AYALA CUELLAR", "telefono": "+56 9 4055 8620", "correo": "reisonayala4@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PSJE ESPERANZA 131", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1991-08-22", "edad": "34", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2026-09-17", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "25072842-5", "origen": "HABILITADOS", "obs": "AGENDAR EXAMEN", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 158, "rut": "27781402-1", "nombre": "RENZO PERCY PILCO FLORES", "telefono": "+56 9 6698 9913", "correo": "renzoflorescastillo375@gmail.com", "ciudad": "IQUIQUE", "direccion": "PASAJE EL RIEL #1552", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1980-01-13", "edad": "46", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-02", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1-983-366121-6", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 159, "rut": "21837715-7", "nombre": "RICARDO JIMMY LAZARO ARROYO", "telefono": "+56 9 8598 7862", "correo": "ricardolazaroarroyo089@gmail.com", "ciudad": "IQUIQUE", "direccion": "LAS CARPAS 2747", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1978-01-31", "edad": "48", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-03", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 160, "rut": "17432991-5", "nombre": "RICARDO ROLANDO RIVEROS CAMPOS", "telefono": "+56 9 6461 8829", "correo": "ricardoriveroscampos@gmail.com", "ciudad": "IQUIQUE", "direccion": "SOTOMAYOR 14", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1990-04-05", "edad": "36", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-24", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENNTA RUT", "numeroCuenta": "17432991-5", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 161, "rut": "24811564-5", "nombre": "RICARDO ROMAN HURTADO SEGURA", "telefono": "+56 9 7274 8258", "correo": "ricardorhurtados@icloud.com", "ciudad": "IQUIQUE", "direccion": "THOMPSON 985", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1995-02-28", "edad": "31", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-30", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1127010894-8", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "PENDIENTE", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 162, "rut": "24026652-0", "nombre": "RICHARD BELTRAN RIOS", "telefono": "+56 9 8677 1507", "correo": "richardbeltranrios99@gmail.com", "ciudad": "IQUIQUE", "direccion": "CALLE TOMSON 1048", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1982-04-06", "edad": "44", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-05-15", "estadoExamen": "VENCIDO", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "NO HABILITADO", "motivoAccion": "Examen: Vencido; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "24026652-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 163, "rut": "26784266-3", "nombre": "RICHARD FLORES PASCUAL", "telefono": "+56 9 3773 7987", "correo": "rf1991ores@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CAMPAMENTO JESUS DE NAZARETH PASAJE 3, SITIO 42", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1991-10-11", "edad": "34", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-09", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "PENDIENTE ENVIO", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 164, "rut": "11512814-0", "nombre": "ROBERTO FABIAN CORTES ARAYA", "telefono": "+56 9 8414 5505 / +56 9 7125 7700", "correo": "robertofabiancortes@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "SANTA JIMENA 2897 BLOCK F DEPARTAMENTO 302", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1970-08-04", "edad": "55", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-31", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "11512814-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 165, "rut": "26681596-4", "nombre": "ROLANDO EUSEBIO RAMIREZ CARDOZO", "telefono": "+56 9 3662 2447", "correo": "ramirezcardozorolando@gmail.com", "ciudad": "IQUIQUE", "direccion": "AMPAMENTO LAGUNA VERDE, PSJ ESPERANZA 92", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1973-08-14", "edad": "52", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-18", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "26681596-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 166, "rut": "23598474-1", "nombre": "ROMAN BALDOMERO FULGUERA RODRIGUEZ", "telefono": "+56 9 7745 3002", "correo": "fulguera.roman@gmail.com", "ciudad": "IQUIQUE", "direccion": "CERRO DE LA CRUZ 955", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1968-02-27", "edad": "58", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-19", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "23598474-1", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 167, "rut": "26762858-0", "nombre": "RONALDO CANAVIRI MARTINEZ", "telefono": "+56 9 3652 3953", "correo": "venont360@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "UNION EUROPEA CON JAPON", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1997-07-31", "edad": "28", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-15", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "26762858-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 168, "rut": "18984582-0", "nombre": "SEBASTIAN ALFREDO PARRA DIAZ", "telefono": "+56 9 4202 0042", "correo": "sebastianparradiaz65@gmail.com", "ciudad": "IQUIQUE", "direccion": "TARAPACÁ DIEGO PORTALES 1322", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1994-12-15", "edad": "31", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-29", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 169, "rut": "21414166-3", "nombre": "SEBASTIAN ALONSO MALDONADO LUZA", "telefono": "+56 9 2015 0251", "correo": "sebastianmaldonadoluza@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CALLE CHINA 4412", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2003-10-09", "edad": "22", "afp": "UNO", "salud": "ISAPRE NUEVA MAS VIDA", "fechaVencimientoExamen": "2027-05-11", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "21414166-3", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 170, "rut": "21890569-2", "nombre": "SEBASTIAN ANTONIO GATICA ARRIAGADA", "telefono": "+56 9 7651 9709", "correo": "sebastiangatica783@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AVDA LAS PARCELAS 3232", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2005-07-14", "edad": "20", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "21890569-2", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 171, "rut": "21454613-2", "nombre": "SEBASTIAN IGNACIO ANDRÉS CORTEZ ORTIZ", "telefono": "+56 9 3207 9621", "correo": "sebastianocortez10@gmail.com", "ciudad": "IQUIQUE", "direccion": "ARGENTINA 1927", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2026-02-12", "estadoExamen": "VENCIDO", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "NO HABILITADO", "motivoAccion": "Examen: Vencido; Evaluación psicológica: Sin información", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 172, "rut": "19179883-K", "nombre": "SEBASTIÁN IGNACIO RODRÍGUEZ ARDILES", "telefono": "+56 9 9816 5160", "correo": "srd_1996@hotmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "LOS ALMENDROS 2858", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-01-18", "edad": "30", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-10-30", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "EXAMEN VENCIDO", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 173, "rut": "19180795-2", "nombre": "SERGIO ANDRES CEPEDA CONTRERAS", "telefono": "+56 9 2716 1214", "correo": "sergio.cepeda.c2@gmail.com", "ciudad": "IQUIQUE", "direccion": "SAN FRANCISCO 4119", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-04-09", "edad": "30", "afp": "PLANVITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-24", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19180795-2", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 174, "rut": "21990588-2", "nombre": "SILVANO ALFONSO ZUÑIGA GARCIA", "telefono": "+56 9 3333 8313", "correo": "silvano.zuniga19@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE ALBANIA SITIO 1", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-31", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 175, "rut": "12410368-1", "nombre": "ULISES ALFREDO VILLALOBOS TELLO", "telefono": "+56 9 8131 7765", "correo": "villaloboulises61@gmail.com", "ciudad": "IQUIQUE", "direccion": "CALLE TILIVICHE 2929", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1973-10-29", "edad": "52", "afp": "PROVIDA", "salud": "", "fechaVencimientoExamen": "2027-01-26", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "12410368-1", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 176, "rut": "22076944-5", "nombre": "VICENTE PAUL LOBOS DIAZ", "telefono": "+56 9 4079 6222", "correo": "vicentepaullobos17@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE GAMBIA MANZANA 10 SITIO 19", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2006-03-17", "edad": "20", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-16", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 177, "rut": "16764676-7", "nombre": "VICTOR CASTILLO LOZANO", "telefono": "", "correo": "", "ciudad": "", "direccion": "", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "", "salud": "FONASA", "fechaVencimientoExamen": "", "estadoExamen": "SIN FECHA", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "NO HABILITADO", "motivoAccion": "Examen: Sin información; Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO TIENE NUMERO", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "PENDIENTE", "CMDIC": "PENDIENTE", "Bloqueo": "PENDIENTE", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 178, "rut": "20960458-2", "nombre": "VICTOR DANIEL ARAYA GONZALEZ", "telefono": "+56 9 7633 2808", "correo": "adammmdanieledann@gmail.com", "ciudad": "IQUIQUE", "direccion": "CALETA LOS VERDES CASA 16", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2002-01-29", "edad": "24", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-29", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "OK", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 179, "rut": "12158668-1", "nombre": "VICTOR FERNANDO CORTES BARRIENTOS", "telefono": "+56 9 2067 8205", "correo": "victorcortesbarrientos7@gmail.com", "ciudad": "IQUIQUE", "direccion": "PSJE GERMANIA 3110", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1973-07-07", "edad": "52", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2026-09-17", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "BASE", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 180, "rut": "21211319-0", "nombre": "VICTOR MANUEL TREUQUIL RAMOS", "telefono": "+56 9 8747 7324", "correo": "vishho2003@gmail.com", "ciudad": "IQUIQUE", "direccion": "AV. SALVADOR ALLENDE #442", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2003-01-12", "edad": "23", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-28", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "21211319-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 181, "rut": "19432256-9", "nombre": "VICTOR MAURICIO ZÁRATE MAMANI", "telefono": "+56 9 7587 8961", "correo": "mauricio19969912@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "VIA TIPO LOCAL PASAJE 1 #2763", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1996-06-03", "edad": "30", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-24", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "IRRESPONSABLE", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 182, "rut": "24468875-6", "nombre": "WEIMAR HERRERA GALARZA", "telefono": "+56 9 7387 9875", "correo": "weimarherrera83@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "JOSE CUBILLOS CON GLADYS MARIN", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1982-01-11", "edad": "44", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-23", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 183, "rut": "26471291-2", "nombre": "WILBER WILSON MAMANI PACOHUANACO", "telefono": "+56 9 8636 9225", "correo": "mamaniwilber67@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "RUTA A 116, CAMPAMENTO JESUS ES EL REY", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1977-07-11", "edad": "48", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-10-02", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "BASE", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 184, "rut": "24126025-9", "nombre": "WILLAMS FLORES PÉREZ", "telefono": "+56 9 8154 0956", "correo": "wifloresperez@gmail.com", "ciudad": "IQUIQUE", "direccion": "GALBARINO 2022", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1991-04-06", "edad": "35", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-02-19", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "24126025-9", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 185, "rut": "24483637-2", "nombre": "WILLY COCHA CACERES", "telefono": "+56 9 5772 4655", "correo": "willycochacaceres@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CALLE JAPON 4289", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1974-01-04", "edad": "52", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2026-08-04", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM. CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "BASE", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 186, "rut": "27908364-4", "nombre": "WILSON RAMON VILLEGAS COLMENARES", "telefono": "+56 9 4267 9713", "correo": "wilsonchile1694@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "ALAMOS CON PARQUE ORIENTE", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1994-12-16", "edad": "31", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-23", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "27908364-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 187, "rut": "23647519-0", "nombre": "WILSON VIDAL VASQUEZ LAKY", "telefono": "+56 9 8686 7629", "correo": "wilson.vasquez.laky@gmail,com", "ciudad": "IQUIQUE", "direccion": "BLANCO ENCALADA 910", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1975-01-14", "edad": "51", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-19", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "23647519-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "VENCIDO", "CMDIC": "VENCIDO", "Bloqueo": "VENCIDO", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 188, "rut": "20126337-9", "nombre": "YAMPIERE ALEXIS VIVANCO SOLAR", "telefono": "+56 9 4453 3850", "correo": "alexisyampiere0@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CALLE 2 (3505)", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1990-01-02", "edad": "36", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-09", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1-983-312578-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 189, "rut": "21903184-K", "nombre": "YEHISON DAVID VILCHES ALVARADO", "telefono": "+56 9 7496 5513", "correo": "yehison.vilchess@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "JAPON 4412", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2005-08-06", "edad": "20", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2026-12-18", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 190, "rut": "21617140-3", "nombre": "YIMMY JEHAN PABLO LECAROS TRONCOSO", "telefono": "+56 9 6332 0004", "correo": "jehanpaulpalavercino@gmail.com", "ciudad": "IQUIQUE", "direccion": "VALLE VERDE 1817", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2004-07-09", "edad": "21", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-01-09", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "OK", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1-980-260713-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 191, "rut": "11822792-1", "nombre": "YOHNNY ANDRES REYES ROJAS", "telefono": "+56 9 4484 7626", "correo": "yohnnyandresreyesrojas@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CALLE 1#3506 CON TILIVICHE", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1971-02-27", "edad": "55", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-04-28", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "OK", "estadoHabilitado": "HABILITADO PARA SUBIR", "motivoAccion": "Cumple requisitos", "registroDuplicado": "ÚNICO", "banco": "BANCO SCOTIABANK", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "991469036", "origen": "HABILITADOS", "obs": "FALTA AFP", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "OK", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 192, "rut": "28089303-K", "nombre": "YONNY JUSTINIANO EGUEZ", "telefono": "+56 9 9828 0564", "correo": "yonnyjustiniano287@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AV. PROYECTADA PSJ. GABRIELA MISTRAL SITIO 3", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1982-03-21", "edad": "44", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2026-09-17", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOM.CON OBSERVACION", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "28089303-K", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "OK", "Proyecto": "NO ESTA"}}, {"id": 193, "rut": "20776201-6", "nombre": "MARTIN EDGARDO VALDERRAMA GARCES", "telefono": "+56 9 9234 0464", "correo": "valderramamartin199@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "AV. VALPARAISO", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2001-05-22", "edad": "25", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-05", "estadoExamen": "VIGENTE", "evalPsicologica": "RECOMENDABLE", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "AGENDADO", "manejoExtintores": "NO ESTA", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "20776201-6", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 194, "rut": "22090972-7", "nombre": "JUAN ANDRES MAMANI CARRION", "telefono": "+56 9 5309 6920", "correo": "tomaschelby433@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE COTASAYA 2844", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2004-10-23", "edad": "21", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-13", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "22090972-7", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 195, "rut": "19967182-0", "nombre": "NESTOR HUGO NILO GUZMAN", "telefono": "+56 9 3964 4186", "correo": "nilonestor3@gmail.com", "ciudad": "IQUQUE", "direccion": "CALLE EL MIRADOR 3664", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1998-07-06", "edad": "27", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2028-04-29", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19967182-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 196, "rut": "22623305-9", "nombre": "ALEXIS MIGUEL DOMINGUEZ JARA", "telefono": "+56 9 4592 0228", "correo": "alexismigueldominguezjara@gmail.com", "ciudad": "", "direccion": "", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1986-07-11", "edad": "39", "afp": "", "salud": "", "fechaVencimientoExamen": "2028-04-30", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 197, "rut": "22242905-6", "nombre": "JONATHAN ANDRES GOMEZ TORRES", "telefono": "+56 9 5165 0768", "correo": "jonathan.gomeztorrez20000@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PASAJE SIBAYA 2308", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2006-10-20", "edad": "19", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "22242905-6", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 198, "rut": "20504475-2", "nombre": "ASAD ULLAH KHAN SANZANA", "telefono": "+56 9 2005 6437", "correo": "khansanzanaaa@gmail.com", "ciudad": "IQUIQUE", "direccion": "SALITRERA CONSTANCIA 2615", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "AGENDADO", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO DE CHILE", "tipoCuenta": "CUENTA VISTA", "numeroCuenta": "00-025-36250-41", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 199, "rut": "15000309-1", "nombre": "PEDRO ADOLFO MEDINA VEGA", "telefono": "+56 9 2255 9280 / +56 9 2803 8351", "correo": "jeicobadolfomedina@gmail.com", "ciudad": "IQUIQUE", "direccion": "BALTAZAR CASA11 COMITÉ EMANUEL", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1980-07-11", "edad": "45", "afp": "PROVIDA", "salud": "ISAPRE BANMEDICA", "fechaVencimientoExamen": "2027-05-13", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "OK", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "15000309-1", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 200, "rut": "18373742-2", "nombre": "ALEX GABRIEL GUEVARA OPAZO", "telefono": "+56 9 7405 0654", "correo": "alex.guevara3131@gmail.com", "ciudad": "", "direccion": "", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1994-06-18", "edad": "31", "afp": "", "salud": "", "fechaVencimientoExamen": "2027-05-13", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "OK", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "CON OTRO TRABAJO", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 201, "rut": "15244442-7", "nombre": "MARCELO ANDRES PEREZ TORRES", "telefono": "+56 9 4876 0230 / +56 9 7467 9876", "correo": "mp5120873@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "DOÑIHUE 3264", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1975-09-04", "edad": "50", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-11", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "15244442-7", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 202, "rut": "26743510-3", "nombre": "DEYMAR ERICK MAMANI FERNANDEZ", "telefono": "+56 9 3215 7283", "correo": "deymarerickfernandez@gmail.com", "ciudad": "IQUIQUE", "direccion": "PROGRESO #2552", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1999-12-31", "edad": "26", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-09", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "OK", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "26743510-3", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 203, "rut": "13006814-6", "nombre": "HECTOR DOMINGO CAMPOS GALVEZ", "telefono": "+56 9 2234 3150", "correo": "camposgalvezhector@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CONDORES #3186", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1976-05-15", "edad": "50", "afp": "", "salud": "", "fechaVencimientoExamen": "2027-05-09", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 204, "rut": "22582732-K", "nombre": "OSWALDO ALEJANDRO DE LA CRUZ RAMIREZ", "telefono": "+56 9 4284 3049", "correo": "doswaldo28@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "ALTO MOLLE 112", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1976-02-04", "edad": "50", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-13", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "OK", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "22582732-K", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 205, "rut": "22374810-4", "nombre": "THOMAS ALEXANDER MUNOZ VEGA", "telefono": "+56 9 8916 8120", "correo": "thomasmunovega@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "CALLE 2 #3251", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2007-04-10", "edad": "19", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-09", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "OK", "manejoExtintores": "OK", "energiaPotenciales": "OK", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "22374810-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 206, "rut": "15683752-0", "nombre": "CRISTIAN EDUARDO VERGARA TAPIA", "telefono": "+56 9 3758 3122", "correo": "cris.vergara.26@hotmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "BULGARIA MANZANA 47 SITIO 19", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1983-04-03", "edad": "43", "afp": "HABITAT", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "AGENDADO", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "15683752-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 207, "rut": "22755843-1", "nombre": "ENRIQUE GONZALO ORELLANA MURILLO", "telefono": "+56 9 2089 2838", "correo": "orellanaenrique10@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "BULGARIA 4242", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2002-04-11", "edad": "24", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO FALABELLA", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "19802130984", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 208, "rut": "25589545-1", "nombre": "JULIO CESAR CAMPO GONZALEZ", "telefono": "+56 9 2388 2396", "correo": "juliocesarcampogonzalez@gmail.com", "ciudad": "IQUIQUE", "direccion": "SERRANO 772", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1982-08-09", "edad": "43", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO DE CHILE", "tipoCuenta": "CUENTA VISTA", "numeroCuenta": "00-004-47173-20", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 209, "rut": "10922541-K", "nombre": "CRISTIAN MAURICIO JERIA VARAS", "telefono": "+56 9 7406 0782", "correo": "cristianjeria811@gmail.com", "ciudad": "IQUIQUE", "direccion": "BERNARDO OHIGGINS 2051", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1967-10-28", "edad": "58", "afp": "CAPITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-11", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "10922541-K", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 210, "rut": "18373547-0", "nombre": "EDYSON JHOAN LEGUAT FUENTES", "telefono": "+56 9 5643 4948", "correo": "edyleg1994@gmail.com", "ciudad": "IQUIQUE", "direccion": "PASAJE EL COBRE 2346", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1994-05-31", "edad": "32", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "18373547-0", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 211, "rut": "20998664-7", "nombre": "BRIAN ANDRES PEÑAILILLO FIGUEROA", "telefono": "+56 9 2639 2398", "correo": "brianpenailillo995@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "LOS MANGOS #2861", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2002-04-08", "edad": "24", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "20998664-7", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 212, "rut": "21682059-2", "nombre": "BASTIAN ALEXIS MELGAREJO HERRERA", "telefono": "+56 9 5492 2394", "correo": "mbastianh@gmail.com", "ciudad": "ALTO HOSPICIO", "direccion": "PAN DE AZUCAR 2939", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2004-10-11", "edad": "21", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA CORRIENTE", "numeroCuenta": "1800083580", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 213, "rut": "25913522-2", "nombre": "OMAR ISAAC BELTRAN MAMANI", "telefono": "+56 9 7704 8653", "correo": "omarbeltranmamani@gmail.com", "ciudad": "POZO ALMONTE", "direccion": "ALIANZA 267", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1990-04-11", "edad": "36", "afp": "PLANVITAL", "salud": "NUEVA MAS VIDA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "25913522-2", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 214, "rut": "17432468-9", "nombre": "JUAN VICENTE SANTANDER PEREZ", "telefono": "+56 9 6756 2650", "correo": "pandakurtpanda@gmail.com", "ciudad": "POZO ALMONTE", "direccion": "AV HUMBERSTONE 191", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1990-06-07", "edad": "36", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "17432468-9", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 215, "rut": "20347199-8", "nombre": "NICOLAS MATIAS LEMUS ALVAREZ", "telefono": "+56 9 3372 9902", "correo": "nickolemus9@gmail.com", "ciudad": "POZO ALMONTE", "direccion": "PUEBLO DE LA TIRANA PASAJE 6 SITIO 20", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1999-12-09", "edad": "26", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "20347199-8", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 216, "rut": "25724113-0", "nombre": "JORGE ENRIQUE ARBOLEDA IBARGUEN", "telefono": "+56 9 5223 6721 / +56 9 3210 2088", "correo": "jorgeenrquearboleda@gmail.com", "ciudad": "", "direccion": "", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1963-04-12", "edad": "63", "afp": "", "salud": "", "fechaVencimientoExamen": "2027-05-13", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "PENDIENTE", "tipoCuenta": "PENDIENTE", "numeroCuenta": "PENDIENTE", "origen": "HABILITADOS", "obs": "NO CONTESTA", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 217, "rut": "21698161-8", "nombre": "BENJAMIN ALEJANDRO MANRIQUE AGUILERA", "telefono": "+56 9 3215 9069", "correo": "benjamin-92011@hotmail.com", "ciudad": "IQUIQUE", "direccion": "LUIS JASPARD 155", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "", "edad": "", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "21698161-8", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 218, "rut": "26462289-1", "nombre": "KENNER JORKAEL ANGULO MERCADO", "telefono": "+56 9 7774 5988", "correo": "ostinangulo2020@gmail.com", "ciudad": "IQUIQUE", "direccion": "LOS ANDES 1876", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2002-01-31", "edad": "24", "afp": "MODELO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "26462289-1", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 219, "rut": "20505596-7", "nombre": "JHON ALEXANDER GUERRA CORTEZ", "telefono": "+56 9 9877 2210", "correo": "johnalexander2015@outlook.es", "ciudad": "IQUIQUE", "direccion": "MOISES GONZALEZ 1851", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "2000-07-24", "edad": "25", "afp": "UNO", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "20505596-7", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 220, "rut": "16450807-2", "nombre": "CHRISTOPHER FERNANDO LOPEZ ARAYA", "telefono": "+56 9 3681 5051", "correo": "lopez.christopher1601@gmail.com", "ciudad": "POZO ALMONTE", "direccion": "PISIGA CARPA 365", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1987-01-16", "edad": "39", "afp": "PROVIDA", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "16450807-2", "origen": "HABILITADOS", "obs": "0", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}, {"id": 221, "rut": "19736330-4", "nombre": "ABEL ARTURO ARCE ALANES", "telefono": "+56 9 5786 6360", "correo": "a.arturoarce69@gmail.com", "ciudad": "IQUIQUE", "direccion": "PJE LITUANIA 3146", "especialidad": "OPERARIO DE ASEO", "fechaNacimiento": "1997-05-21", "edad": "29", "afp": "PLAN VITAL", "salud": "FONASA", "fechaVencimientoExamen": "2027-05-12", "estadoExamen": "VIGENTE", "evalPsicologica": "", "certificadoAntecedentes": "NO ESTA", "primerosAuxilios": "PENDIENTE", "manejoExtintores": "PENDIENTE", "energiaPotenciales": "PENDIENTE", "estadoHabilitado": "EN REVISIÓN", "motivoAccion": "Evaluación psicológica: Sin información; Inducciones críticas incompletas", "registroDuplicado": "ÚNICO", "banco": "BANCO ESTADO", "tipoCuenta": "CUENTA RUT", "numeroCuenta": "19736330-4", "origen": "HABILITADOS", "obs": "", "tipoServicio": "", "historial": [], "inductiones": {"Planta": "OK", "CMDIC": "PENDIENTE", "Bloqueo": "OK", "Puerto": "PENDIENTE", "Proyecto": "NO ESTA"}}];

const DEFAULT_USERS = [
  {id:1,username:"admin",     password:"admin123",  nombre:"Administrador",  rol:"admin"},
  {id:2,username:"supervisor",password:"super2025", nombre:"Supervisor OPI", rol:"supervisor"},
  {id:3,username:"visor",     password:"visor2025", nombre:"Solo Lectura",   rol:"viewer"},
];

const INDUCTIONES = ["Planta","CMDIC","Bloqueo","Puerto","Proyecto"];
const SERVICIOS   = ["Parada de Planta","ODS","Reemplazo Fijo","Contrato Base"];
const EXAMENES    = ["VIGENTE","VENCIDO","POR VENCER","SIN FECHA"];
const PAGE_SIZE   = 25;

function rolLabel(r){ return r==="admin"?"ADMIN":r==="supervisor"?"SUPERVISOR":"VISOR"; }
function rolCls(r)  { return r==="admin"?"role-admin":r==="supervisor"?"role-sup":"role-viewer"; }

// Verifica los 5 requisitos minimos para un servicio
function estadoBadge(e){
  if(!e||e==="SIN FECHA") return <span className="badge bg">SIN FECHA</span>;
  if(e==="VIGENTE")    return <span className="badge gn">VIGENTE</span>;
  if(e==="VENCIDO")    return <span className="badge rd">VENCIDO</span>;
  if(e==="POR VENCER") return <span className="badge yw">POR VENCER</span>;
  return <span className="badge bg">{e}</span>;
}

function habBadge(w){
  if(w.bloqueado)        return <span className="badge rd" style={{background:"rgba(239,68,68,.3)"}}>🚫 BLOQUEADO</span>;
  if(w._enDescanso)      return <span className="badge rd">EN DESCANSO</span>;
  if(w._pendDescanso)    return <span className="badge pu">PEND. DESCANSO</span>;
  if(w.estadoHabilitado==="HABILITADO PARA SUBIR"){
    const req=checkRequisitos(w);
    if(!req.cumple) return <span className="badge yw" title="Habilitado pero faltan requisitos mínimos">⚠️ HAB. INCOMPLETO</span>;
    return <span className="badge gn">HABILITADO</span>;
  }
  if(w.estadoHabilitado==="EN REVISIÓN") return <span className="badge yw">EN REVISIÓN</span>;
  return <span className="badge rd">NO HABILITADO</span>;
}

function indDot(val,lbl){
  const v=(val||"").toString().trim();
  const cls = (!v||v==="NO ESTA")?"i-no":v==="VENCIDO"?"i-warn":"i-ok";
  const t   = (!v||v==="NO ESTA")?"✗":v==="VENCIDO"?"!":"✓";
  return <span key={lbl} className={`idot ${cls}`} title={`${lbl}: ${v||"—"}`}>{t}</span>;
}

function servTag(tipo){
  if(!tipo) return <span className="muted-s">—</span>;
  const cls=tipo==="Parada de Planta"?"s-p":tipo==="ODS"?"s-o":tipo==="Contrato Base"?"s-c":"s-r";
  return <span className={`stag ${cls}`}>{tipo}</span>;
}

// ── Requisitos mínimos para servicio ────────────────────────────────────────
function checkRequisitos(w){
  const examenOk = w.estadoExamen==="VIGENTE";
  const psicoOk  = ["APTO","RECOMENDABLE","RECOMENDABLE CON OBSERVACION","RECOM. CON OBSERVACION"].includes((w.evalPsicologica||"").toUpperCase().trim());
  const cmdicOk  = (w.inductiones?.CMDIC||"").toUpperCase()==="OK";
  const plantaOk = (w.inductiones?.Planta||"").toUpperCase()==="OK";
  const antecOk  = (w.certificadoAntecedentes||"").toUpperCase()==="OK";
  return{
    cumple: examenOk&&psicoOk&&cmdicOk&&plantaOk&&antecOk,
    items:[
      {label:"Examen Preocupacional", ok:examenOk,  val:w.estadoExamen||"SIN FECHA"},
      {label:"Eval. Psicológica",     ok:psicoOk,   val:w.evalPsicologica||"SIN EVALUAR"},
      {label:"Inducción CMDIC",       ok:cmdicOk,   val:w.inductiones?.CMDIC||"NO ESTA"},
      {label:"Inducción Planta",      ok:plantaOk,  val:w.inductiones?.Planta||"NO ESTA"},
      {label:"Cert. Antecedentes",    ok:antecOk,   val:w.certificadoAntecedentes||"NO ESTA"},
    ]
  };
}

function calcDescanso(hist){
  if(!hist||!hist.length) return null;
  const last=hist[hist.length-1];
  if(!last.fechaFin) return null;
  const libre=new Date(last.fechaFin);
  libre.setDate(libre.getDate()+(Number(last.diasTrabajados)||0));
  const hoy=new Date();
  if(hoy<libre) return {enDescanso:true,dias:Math.ceil((libre-hoy)/(864e5)),servicio:last.tipoServicio};
  return {enDescanso:false};
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400;500;600&display=swap');
  :root{--bg:#f0f4f8;--sur:#ffffff;--bor:#e2e8f0;--acc:#f97316;--bl:#3b82f6;--gn:#16a34a;--rd:#dc2626;--yw:#ca8a04;--pu:#7c3aed;--mu:#64748b;--tx:#1e293b;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--tx);font-family:'Barlow',sans-serif;font-size:13px;}
  /* Layout */
  .wrap{display:flex;flex-direction:column;min-height:100vh;}
  .topbar{background:var(--sur);border-bottom:2px solid var(--acc);box-shadow:0 1px 4px rgba(0,0,0,.08);padding:0 20px;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
  .brand{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;letter-spacing:2px;}
  .brand span{color:var(--acc);}
  .body{display:flex;flex:1;overflow:hidden;}
  .sidebar{width:188px;background:#fff;border-right:1px solid var(--bor);display:flex;flex-direction:column;padding:10px 0;overflow-y:auto;box-shadow:1px 0 4px rgba(0,0,0,.04);}
  .main{flex:1;overflow-y:auto;padding:18px;}
  /* Nav */
  .ni{display:flex;align-items:center;gap:8px;padding:9px 16px;font-size:12px;font-weight:500;color:var(--mu);cursor:pointer;border-left:3px solid transparent;transition:.12s;}
  .ni:hover{color:var(--tx);background:rgba(255,255,255,.03);}
  .ni.act{color:var(--acc);border-left-color:var(--acc);background:rgba(249,115,22,.07);}
  .nsep{height:1px;background:var(--bor);margin:7px 14px;}
  .nlabel{padding:6px 16px 2px;font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--mu);text-transform:uppercase;}
  /* KPI */
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px;}
  .kpi{background:var(--sur);border:1px solid var(--bor);border-radius:8px;padding:14px 16px;}
  .kpi-l{font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--mu);text-transform:uppercase;margin-bottom:4px;}
  .kpi-v{font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:900;line-height:1;}
  .kpi-s{font-size:10px;color:var(--mu);margin-top:2px;}
  /* Toolbar */
  .tbar{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center;}
  .srch{flex:1;min-width:180px;background:#f8fafc;border:1px solid var(--bor);border-radius:6px;padding:7px 10px;color:var(--tx);font-size:12px;font-family:inherit;outline:none;}
  .srch:focus{border-color:var(--acc);}
  select.fsel{background:#f8fafc;border:1px solid var(--bor);border-radius:6px;padding:7px 9px;color:var(--tx);font-size:12px;font-family:inherit;outline:none;cursor:pointer;}
  select.fsel:focus{border-color:var(--bl);}
  /* Buttons */
  .btn{padding:7px 13px;border-radius:6px;border:none;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;transition:.12s;white-space:nowrap;}
  .btn-p{background:var(--acc);color:#fff;} .btn-p:hover{background:#ea6c0a;}
  .btn-s{background:var(--sur);border:1px solid var(--bor);color:var(--tx);} .btn-s:hover{border-color:var(--bl);color:var(--bl);}
  .btn-d{background:var(--rd);color:#fff;}
  .btn-sm{padding:4px 9px;font-size:11px;}
  /* Card */
  .card{background:var(--sur);border:1px solid var(--bor);border-radius:8px;padding:16px;}
  .card-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700;letter-spacing:1px;}
  /* Table */
  .tw{overflow-x:auto;}
  table{width:100%;border-collapse:collapse;}
  th{background:#f8fafc;padding:7px 9px;text-align:left;font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--mu);text-transform:uppercase;border-bottom:1px solid var(--bor);white-space:nowrap;}
  td{padding:8px 9px;border-bottom:1px solid rgba(48,54,61,.4);}
  tr:hover td{background:rgba(255,255,255,.025);}
  .nm{font-weight:600;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px;}
  .sm{font-size:10px;color:var(--mu);}
  /* Badges */
  .badge{display:inline-block;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:700;white-space:nowrap;}
  .gn{background:#dcfce7;color:var(--gn);border:1px solid #86efac;}
  .rd{background:#fee2e2;color:var(--rd);border:1px solid #fca5a5;}
  .yw{background:#fef9c3;color:var(--yw);border:1px solid #fde047;}
  .bl{background:#dbeafe;color:var(--bl);border:1px solid #93c5fd;}
  .bg{background:#f1f5f9;color:var(--mu);border:1px solid #cbd5e1;}
  .pu{background:#ede9fe;color:var(--pu);border:1px solid #c4b5fd;}
  .or{background:#ffedd5;color:var(--acc);border:1px solid #fdba74;}
  /* Induction dots */
  .idots{display:flex;gap:2px;}
  .idot{width:13px;height:13px;border-radius:2px;font-size:8px;display:flex;align-items:center;justify-content:center;font-weight:700;}
  .i-ok{background:#dcfce7;color:var(--gn);}
  .i-no{background:#fee2e2;color:var(--rd);}
  .i-warn{background:#fef9c3;color:var(--yw);}
  /* Service tags */
  .stag{display:inline-flex;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;}
  .s-p{background:#ffedd5;color:#c2410c;}
  .s-o{background:#dbeafe;color:#1d4ed8;}
  .s-r{background:#ede9fe;color:#6d28d9;}
  .s-c{background:#dcfce7;color:#15803d;}
  .muted-s{color:var(--mu);font-size:11px;}
  /* Pagination */
  .pag{display:flex;align-items:center;gap:5px;justify-content:flex-end;margin-top:12px;}
  .pbtn{background:var(--sur);border:1px solid var(--bor);border-radius:4px;padding:3px 9px;cursor:pointer;color:var(--tx);font-size:11px;font-family:inherit;}
  .pbtn:hover{border-color:var(--bl);}
  .pbtn.act{background:var(--acc);border-color:var(--acc);color:#fff;}
  .pbtn:disabled{opacity:.3;cursor:default;}
  /* Modal */
  .ov{position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:200;padding:14px;}
  .modal{background:var(--sur);border:1px solid var(--bor);border-radius:10px;width:100%;max-width:680px;max-height:93vh;overflow-y:auto;}
  .mhdr{padding:16px 20px;border-bottom:1px solid var(--bor);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:var(--sur);z-index:1;}
  .mtit{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;letter-spacing:1px;}
  .mcls{background:none;border:none;color:var(--mu);font-size:22px;cursor:pointer;line-height:1;}
  .mbdy{padding:20px;}
  .mftr{padding:12px 20px;border-top:1px solid var(--bor);display:flex;justify-content:flex-end;gap:8px;}
  /* Form */
  .fg{display:flex;flex-direction:column;gap:5px;margin-bottom:10px;}
  .fgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .full{grid-column:1/-1;}
  label{font-size:10px;font-weight:700;letter-spacing:1px;color:var(--mu);text-transform:uppercase;}
  input,select,textarea{background:#f8fafc;border:1px solid var(--bor);border-radius:6px;padding:7px 10px;color:var(--tx);font-size:12px;font-family:inherit;outline:none;transition:.12s;width:100%;}
  input:focus,select:focus,textarea:focus{border-color:var(--acc);}
  .fsec{grid-column:1/-1;padding:10px 0 3px;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;color:var(--acc);text-transform:uppercase;border-bottom:1px solid var(--bor);margin-bottom:2px;}
  /* Login */
  .lw{min-height:100vh;background:linear-gradient(135deg,#f0f4f8 0%,#e2e8f0 100%);display:flex;align-items:center;justify-content:center;}
  .lb{background:var(--sur);border:1px solid var(--bor);border-radius:12px;padding:38px 34px;width:100%;max-width:360px;box-shadow:0 4px 24px rgba(0,0,0,.10);}
  .lbrand{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:28px;letter-spacing:3px;text-align:center;margin-bottom:4px;}
  .lbrand span{color:var(--acc);}
  .lsub{text-align:center;font-size:11px;color:var(--mu);letter-spacing:1px;margin-bottom:26px;}
  .lerr{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:6px;padding:8px;font-size:12px;color:#fca5a5;margin-bottom:12px;text-align:center;}
  .lbtn{width:100%;padding:10px;background:var(--acc);color:#fff;border:none;border-radius:6px;font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;letter-spacing:1px;margin-top:4px;}
  .lbtn:hover{background:#ea6c0a;}
  .lhint{margin-top:18px;padding:12px;background:#f8fafc;border-radius:6px;font-size:10px;color:var(--mu);line-height:1.9;}
  .lhint b{font-size:10px;color:var(--mu);letter-spacing:1px;display:block;margin-bottom:2px;}
  /* User chip */
  .uchip{display:flex;align-items:center;gap:7px;background:#f8fafc;border:1px solid var(--bor);border-radius:6px;padding:4px 10px;font-size:12px;}
  .uavt{width:23px;height:23px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;}
  .role-admin{background:rgba(249,115,22,.2);color:var(--acc);}
  .role-sup{background:rgba(59,130,246,.2);color:var(--bl);}
  .role-viewer{background:rgba(139,148,158,.15);color:var(--mu);}
  /* Stats pills */
  .pills{display:flex;gap:8px;flex-wrap:wrap;}
  .pill{background:#f8fafc;border:1px solid var(--bor);border-radius:5px;padding:3px 9px;font-size:11px;font-weight:600;letter-spacing:.5px;display:flex;align-items:center;gap:5px;}
  .dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
  /* Audit */
  /* ── Dashboard ── */
  .dash-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:8px;}
  .dash-title{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;letter-spacing:2px;color:var(--tx);}
  .dash-sub{font-size:12px;color:var(--mu);margin-top:2px;}
  .dash-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:20px;}
  .dash-kpi{background:var(--sur);border:1px solid var(--bor);border-radius:10px;padding:16px 18px;position:relative;overflow:hidden;transition:.15s;cursor:default;}
  .dash-kpi:hover{box-shadow:0 4px 16px rgba(0,0,0,.08);transform:translateY(-1px);}
  .dash-kpi-accent{position:absolute;top:0;left:0;right:0;height:3px;border-radius:10px 10px 0 0;}
  .dash-kpi-icon{font-size:28px;margin-bottom:6px;line-height:1;}
  .dash-kpi-val{font-family:'Barlow Condensed',sans-serif;font-size:42px;font-weight:900;line-height:1;margin-bottom:2px;}
  .dash-kpi-label{font-size:11px;font-weight:600;letter-spacing:1px;color:var(--mu);text-transform:uppercase;}
  .dash-kpi-sub{font-size:10px;color:var(--mu);margin-top:3px;}
  .charts-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:16px;}
  .charts-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:16px;}
  .chart-wrap{background:var(--sur);border:1px solid var(--bor);border-radius:10px;padding:18px;box-shadow:0 1px 4px rgba(0,0,0,.04);}
  .chart-wrap-accent{border-top:3px solid;}
  .chart-title{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;letter-spacing:1px;color:var(--tx);margin-bottom:4px;}
  .chart-subtitle{font-size:11px;color:var(--mu);margin-bottom:14px;}
  /* Bar chart */
  .bar-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
  .bar-label{font-size:11px;color:var(--tx);width:130px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500;}
  .bar-track{flex:1;background:#f1f5f9;border-radius:20px;height:22px;overflow:hidden;position:relative;}
  .bar-fill{height:100%;border-radius:20px;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;font-size:10px;font-weight:700;color:#fff;transition:width .6s cubic-bezier(.4,0,.2,1);min-width:28px;}
  .bar-count{font-size:12px;font-weight:700;color:var(--tx);width:32px;text-align:right;flex-shrink:0;}
  .bar-pct{font-size:10px;color:var(--mu);width:36px;text-align:right;flex-shrink:0;}
  /* Donut */
  .donut-wrap{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
  .donut-legend{display:flex;flex-direction:column;gap:8px;flex:1;min-width:120px;}
  .legend-item{display:flex;align-items:center;gap:8px;font-size:11px;padding:3px 0;}
  .legend-dot{width:12px;height:12px;border-radius:3px;flex-shrink:0;}
  .legend-label{color:var(--tx);font-weight:500;flex:1;}
  .legend-val{font-weight:700;color:var(--tx);}
  .legend-pct{color:var(--mu);font-size:10px;}
  /* Progress bars */
  .prog-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
  .prog-label{font-size:12px;font-weight:600;color:var(--tx);flex:1;}
  .prog-track{width:120px;background:#f1f5f9;border-radius:20px;height:8px;overflow:hidden;}
  .prog-fill{height:100%;border-radius:20px;transition:width .6s ease;}
  .prog-val{font-size:12px;font-weight:700;color:var(--tx);width:32px;text-align:right;}
  @media(max-width:768px){.charts-grid,.charts-grid-3,.dash-kpis{grid-template-columns:1fr 1fr!important;}}
  @media(max-width:480px){.charts-grid,.charts-grid-3,.dash-kpis{grid-template-columns:1fr!important;}}
  /* Services page */
  .svc-card{background:var(--sur);border:1px solid var(--bor);border-radius:8px;padding:14px;margin-bottom:10px;}
  .svc-card-hdr{display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap;}
  .svc-participants{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
  .svc-participant{background:#f8fafc;border:1px solid var(--bor);border-radius:5px;padding:3px 8px;font-size:11px;}
  .arow{display:grid;grid-template-columns:140px 120px 80px 1fr;gap:8px;padding:7px 0;border-bottom:1px solid rgba(48,54,61,.35);font-size:11px;align-items:start;}
  .abadge{display:inline-block;padding:1px 6px;border-radius:10px;font-size:9px;font-weight:700;}
  .a-add{background:rgba(34,197,94,.15);color:var(--gn);}
  .a-edit{background:rgba(59,130,246,.15);color:var(--bl);}
  .a-delete{background:rgba(239,68,68,.15);color:var(--rd);}
  .a-service{background:rgba(249,115,22,.15);color:var(--acc);}
  .a-login{background:rgba(139,148,158,.1);color:var(--mu);}
  /* Banner */
  .banner{border-radius:6px;padding:7px 12px;font-size:12px;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
  .ban-rd{background:#fee2e2;border:1px solid #fca5a5;color:#991b1b;}
  .ban-pu{background:#ede9fe;border:1px solid #c4b5fd;color:#5b21b6;}
  /* Detail */
  .dsec{margin-bottom:16px;}
  .dsec-t{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;color:var(--acc);text-transform:uppercase;border-bottom:1px solid var(--bor);padding-bottom:5px;margin-bottom:10px;}
  .dgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .dk{font-size:10px;font-weight:600;letter-spacing:1px;color:var(--mu);text-transform:uppercase;}
  .dv{font-size:12px;margin-top:1px;}
  .itbl{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;}
  .iitem{background:#f8fafc;border:1px solid var(--bor);border-radius:5px;padding:7px;text-align:center;}
  .iitem-l{font-size:9px;color:var(--mu);margin-bottom:3px;}
  /* Toast */
  .toasts{position:fixed;bottom:18px;right:18px;z-index:300;display:flex;flex-direction:column;gap:6px;}
  .tst{background:var(--sur);border:1px solid var(--bor);border-radius:7px;padding:10px 14px;font-size:12px;min-width:250px;animation:fi .2s ease;display:flex;gap:8px;align-items:center;box-shadow:0 2px 12px rgba(0,0,0,.1);}
  .t-ok{border-left:3px solid var(--gn);}
  .t-err{border-left:3px solid var(--rd);}
  @keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
  .empty{text-align:center;padding:48px 20px;color:var(--mu);}
  .mc{max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;color:var(--mu);}
  /* ── Mobile ── */
  @media(max-width:768px){
    .topbar{padding:0 12px;height:52px;gap:8px;}
    .topbar img{height:30px!important;}
    .brand{font-size:15px!important;}
    .pills{display:none;}
    .uchip span:not(.badge){display:none;}
    .body{flex-direction:column;}
    .sidebar{width:100%;flex-direction:row;overflow-x:auto;padding:0;border-right:none;border-bottom:1px solid var(--bor);min-height:48px;align-items:center;}
    .ni{padding:8px 14px;white-space:nowrap;border-left:none!important;border-bottom:3px solid transparent;flex-direction:column;gap:2px;font-size:10px;}
    .ni.act{border-bottom-color:var(--acc)!important;border-left:none!important;background:rgba(249,115,22,.07);}
    .nsep{display:none;}
    .nlabel{display:none;}
    .main{padding:10px;}
    .kpis{grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;}
    .kpi{padding:10px 12px;}
    .kpi-v{font-size:28px;}
    .tbar{gap:6px;}
    .tbar .fsel{flex:1;min-width:120px;font-size:11px;padding:6px 7px;}
    .srch{font-size:12px;}
    .btn{padding:6px 10px;font-size:11px;}
    .card{padding:12px;}
    /* Hide less important table columns on mobile */
    /* tabla con scroll horizontal en mobile, sin ocultar columnas */
    .modal{max-width:100%!important;margin:0;border-radius:10px 10px 0 0;position:fixed;bottom:0;max-height:85vh;}
    .ov{align-items:flex-end;padding:0;}
    .fgrid{grid-template-columns:1fr!important;}
    .full{grid-column:1!important;}
    .arow{grid-template-columns:1fr 1fr!important;gap:4px;}
    .lw{padding:16px;}
    .lb{padding:28px 20px;}
    .lbrand{font-size:24px;}
    .itbl{grid-template-columns:repeat(5,1fr);}
    .dgrid{grid-template-columns:1fr!important;}
    /* Bottom nav bar for mobile */
    .mobile-nav{display:flex!important;}
    .sidebar{display:none;}
    .body{padding-bottom:60px;}
  }
  @media(min-width:769px){
    .mobile-nav{display:none!important;}
  }
  .mobile-nav{
    position:fixed;bottom:0;left:0;right:0;
    background:#fff;border-top:1px solid var(--bor);box-shadow:0 -2px 8px rgba(0,0,0,.08);
    display:none;z-index:90;
    justify-content:space-around;align-items:center;
    padding:4px 0 env(safe-area-inset-bottom,4px);
    height:56px;
  }
  .mnav-item{
    display:flex;flex-direction:column;align-items:center;gap:2px;
    font-size:9px;font-weight:600;color:var(--mu);cursor:pointer;
    padding:4px 8px;border-radius:6px;flex:1;letter-spacing:.5px;
    transition:.12s;
  }
  .mnav-item.act{color:var(--acc);}
  .mnav-item span:first-child{font-size:20px;line-height:1;}
`;

export default function App(){
  const [workers,  setWorkers]  = useState([]);
  const [users,    setUsers]    = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [curUser,  setCurUser]  = useState(null);
  const [loginF,   setLoginF]   = useState({u:"",p:""});
  const [loginErr, setLoginErr] = useState("");
  const [view,     setView]     = useState("workers");
  const [search,   setSearch]   = useState("");
  const [fHab,     setFHab]     = useState("ALL");
  const [fExam,    setFExam]    = useState("ALL");
  const [fCity,    setFCity]    = useState("ALL");
  const [fSvc,     setFSvc]     = useState("ALL");
  const [page,     setPage]     = useState(1);
  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [form,     setForm]     = useState({});
  const [svcForm,  setSvcForm]  = useState({tipoServicio:"",fechaInicio:"",fechaFin:"",diasTrabajados:0});
  const [userForm, setUserForm] = useState({});
  const [toasts,   setToasts]   = useState([]);
  const [selected2, setSelected2] = useState(new Set()); // multi-select worker IDs
  const [bulkSvcModal, setBulkSvcModal] = useState(false);
  const [bulkSvcForm, setBulkSvcForm] = useState({tipoServicio:"",fechaInicio:"",fechaFin:"",diasTrabajados:0});

  // ── Storage init ──────────────────────────────────────────────────────────
  useEffect(()=>{
    (async()=>{
      // Load workers from Supabase, fallback to local data
      try{
        const rows = await dbGetWorkers();
        if(rows && rows.length>0){
          // Map DB columns back to app format
          const mapped = rows.map(r=>({
            id:r.id, rut:r.rut, nombre:r.nombre, telefono:r.telefono,
            correo:r.correo, ciudad:r.ciudad, direccion:r.direccion,
            especialidad:r.especialidad, nacionalidad:r.nacionalidad,
            afp:r.afp, salud:r.salud, estadoCivil:r.estado_civil,
            estadoExamen:r.estado_examen, evalPsicologica:r.eval_psicologica,
            estadoHabilitado:r.estado_habilitado, tipoServicio:r.tipo_servicio,
            obs:r.obs, motivoAccion:r.motivo_accion, origen:r.origen,
            inductiones:r.inductiones||{Planta:"NO ESTA",CMDIC:"NO ESTA",Bloqueo:"NO ESTA",Puerto:"NO ESTA",Proyecto:"NO ESTA"},
            historial:r.historial||[],
            banco:r.banco||"", tipoCuenta:r.tipo_cuenta||"", numeroCuenta:r.numero_cuenta||"",
            certificadoAntecedentes:r.certificado_antecedentes||"NO ESTA",
            primerosAuxilios:r.primeros_auxilios||"NO ESTA",
            manejoExtintores:r.manejo_extintores||"NO ESTA",
            energiaPotenciales:r.energia_potenciales||"NO ESTA",
            fechaVencimientoExamen:r.fecha_vencimiento_examen||"",
            bloqueado:r.bloqueado||false,
            motivoBloqueo:r.motivo_bloqueo||"",
            observacionSeguimiento:r.observacion_seguimiento||"",
          }));
          setWorkers(mapped);
        } else {
          // First time: upload seed data to Supabase
          setWorkers(FULL_DATA);
          toast("Cargando base de datos inicial...");
          for(const w of FULL_DATA){
            try{ await dbSaveWorker(w); }catch{}
          }
          toast("Base de datos sincronizada con Supabase ✓");
        }
      }catch(e){ setWorkers(FULL_DATA); }

      try{
        const urows = await dbGetUsers();
        setUsers(urows && urows.length>0 ? urows : DEFAULT_USERS);
        if(!urows||urows.length===0){
          for(const u of DEFAULT_USERS){ try{ await dbSaveUser(u); }catch{} }
        }
      }catch{ setUsers(DEFAULT_USERS); }

      try{
        const arows = await dbGetAudit();
        setAuditLog(arows||[]);
      }catch{ setAuditLog([]); }

      setLoading(false);
    })();
  },[]);

  const saveW = async (d) => { /* Supabase saves happen inline */ };
  const saveU = async (d) => { /* Supabase saves happen inline */ };
  const saveA = async (d) => { /* Supabase saves happen inline */ };

  const toast = (msg,type="success") => {
    const id=Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3000);
  };

  // ── Audit log ─────────────────────────────────────────────────────────────
  function audit(accion,detalle,trabajador=""){
    if(!curUser) return;
    const e={id:Date.now(),ts:new Date().toLocaleString("es-CL"),
      usuario:curUser.nombre,username:curUser.username,rol:curUser.rol,
      accion,detalle,trabajador};
    setAuditLog(prev=>[e,...prev].slice(0,500));
    dbAddAudit(e).catch(()=>{});
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  function handleLogin(){
    const u=users.find(x=>x.username===loginF.u && x.password===loginF.p);
    if(!u){ setLoginErr("Usuario o contraseña incorrectos"); return; }
    setCurUser(u); setLoginErr("");
    const e={id:Date.now(),ts:new Date().toLocaleString("es-CL"),
      usuario:u.nombre,username:u.username,rol:u.rol,
      accion:"login",detalle:"Inicio de sesión",trabajador:""};
    setAuditLog(prev=>[e,...prev].slice(0,500));
    dbAddAudit(e).catch(()=>{});
  }
  function handleLogout(){
    audit("login","Cierre de sesión");
    setCurUser(null); setLoginF({u:"",p:""});
  }

  const canEdit  = curUser?.rol==="admin"||curUser?.rol==="supervisor";
  const canAdmin = curUser?.rol==="admin";

  // ── Enrich workers ────────────────────────────────────────────────────────
  const enriched = useMemo(()=>workers.map(w=>{
    const d = calcDescanso(w.historial);
    const enCurso = (w.historial||[]).some(h=>h.tipoServicio&&!h.fechaFin);
    return{...w,_descanso:d,_enDescanso:d?.enDescanso,_pendDescanso:d?.enDescanso||enCurso};
  }),[workers]);

  const cities = useMemo(()=>Array.from(new Set(enriched.map(w=>w.ciudad).filter(Boolean))).sort(),[enriched]);

  const filtered = useMemo(()=>{
    let r=enriched;
    if(search){ const q=search.toLowerCase(); r=r.filter(w=>w.nombre?.toLowerCase().includes(q)||w.rut?.includes(q)||w.ciudad?.toLowerCase().includes(q)||w.correo?.toLowerCase().includes(q)); }
    if(fHab==="HAB")     r=r.filter(w=>w.estadoHabilitado==="HABILITADO PARA SUBIR"&&!w._pendDescanso&&!w.bloqueado&&checkRequisitos(w).cumple);
    if(fHab==="HAB_INC") r=r.filter(w=>w.estadoHabilitado==="HABILITADO PARA SUBIR"&&!w._pendDescanso&&!w.bloqueado&&!checkRequisitos(w).cumple);
    if(fHab==="NOHAB")   r=r.filter(w=>w.estadoHabilitado!=="HABILITADO PARA SUBIR"&&!w.bloqueado);
    if(fHab==="DESC")    r=r.filter(w=>w._enDescanso);
    if(fHab==="PEND")    r=r.filter(w=>w._pendDescanso);
    if(fHab==="BLOQ")    r=r.filter(w=>w.bloqueado);
    if(fExam!=="ALL")  r=r.filter(w=>w.estadoExamen===fExam);
    if(fSvc!=="ALL")   r=r.filter(w=>w.tipoServicio===fSvc);
    if(fCity!=="ALL")  r=r.filter(w=>w.ciudad===fCity);
    return r;
  },[enriched,search,fHab,fExam,fSvc,fCity]);

  const totalPages = Math.ceil(filtered.length/PAGE_SIZE);
  const pageData   = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const kpi = useMemo(()=>({
    total:    enriched.length,
    hab:      enriched.filter(w=>checkRequisitos(w).cumple&&!w._pendDescanso&&!w.bloqueado).length,
    noApto:   enriched.filter(w=>!checkRequisitos(w).cumple&&!w.bloqueado&&!w._pendDescanso).length,
    pend:     enriched.filter(w=>w._pendDescanso).length,
    vencido:  enriched.filter(w=>w.estadoExamen==="VENCIDO").length,
    bloqueado:enriched.filter(w=>w.bloqueado).length,
  }),[enriched]);

  useEffect(()=>{ setPage(1); },[search,fHab,fExam,fSvc,fCity]);
  useEffect(()=>{
    setFHab("ALL");setFExam("ALL");
    if(view==="habilitados")  setFHab("HAB");  // aptos con 5 requisitos
    if(view==="descanso")     setFHab("DESC");
    if(view==="pendiente")    setFHab("PEND");
    if(view==="vencidos")     setFExam("VENCIDO");
    if(view==="bloqueados")   setFHab("BLOQ");
    // dashboard and servicios don't need filters
  },[view]);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  function openAdd(){ setForm({inductiones:{Planta:"NO ESTA",CMDIC:"NO ESTA",Bloqueo:"NO ESTA",Puerto:"NO ESTA",Proyecto:"NO ESTA"},historial:[]}); setModal("add"); }
  function openEdit(w){ setSelected(w); setForm({...w,inductiones:{...w.inductiones}}); setModal("edit"); }
  function openDetail(w){ setSelected(enriched.find(x=>x.id===w.id)||w); setModal("detail"); }
  function openSvc(w){ setSelected(w); setSvcForm({tipoServicio:"",fechaInicio:"",fechaFin:"",diasTrabajados:0}); setModal("svc"); }

  function handleSave(){
    let updated;
    if(modal==="add"){
      const nw={...form,id:Date.now(),historial:[]};
      updated=[...workers,nw];
      audit("add","Nuevo trabajador",nw.nombre||nw.rut||"");
      toast("Trabajador agregado ✓");
    } else {
      updated=workers.map(w=>w.id===form.id?{...form}:w);
      audit("edit","Datos editados",form.nombre||form.rut||"");
      toast("Datos actualizados ✓");
    }
    setWorkers(updated);
    // Save to Supabase
    const toSave = modal==="add" ? [updated[updated.length-1]] : [form];
    for(const w of toSave){ dbSaveWorker(w).catch(()=>{}); }
    setModal(null);
  }

  function handleDelete(id){
    if(!confirm("¿Eliminar este trabajador?")) return;
    const w=workers.find(x=>x.id===id);
    audit("delete","Trabajador eliminado",w?.nombre||w?.rut||""+id);
    const updated=workers.filter(x=>x.id!==id);
    setWorkers(updated);
    dbDeleteWorker(id).catch(()=>{});
    toast("Eliminado","error"); setModal(null);
  }

  function handleSvc(){
    const{tipoServicio,fechaInicio,fechaFin,diasTrabajados}=svcForm;
    if(!tipoServicio||!fechaInicio){ toast("Completa tipo y fecha inicio","error"); return; }
    const updated=workers.map(w=>{
      if(w.id!==selected.id) return w;
      const hist=[...(w.historial||[]),{tipoServicio,fechaInicio,fechaFin,diasTrabajados:Number(diasTrabajados)}];
      return{...w,historial:hist,tipoServicio};
    });
    setWorkers(updated);
    const updW = updated.find(x=>x.id===selected.id);
    if(updW) dbSaveWorker(updW).catch(()=>{});
    audit("service",`${tipoServicio} (${fechaInicio}→${fechaFin||"en curso"}, ${diasTrabajados}d)`,selected?.nombre||"");
    toast("Servicio registrado ✓"); setModal(null);
  }

  function downloadCSV(){
    const cols=["N°","RUT","Nombre","Teléfono","Ciudad","Especialidad","AFP","Salud","Estado Examen","Eval Psic","Planta","CMDIC","Bloqueo","Puerto","Proyecto","Estado","Servicio","Pend Descanso","Motivo","Correo","Dirección","Obs"];
    const rows=filtered.map((w,i)=>[
      i+1,w.rut,w.nombre,w.telefono,w.ciudad,w.especialidad,w.afp,w.salud,
      w.estadoExamen,w.evalPsicologica,
      w.inductiones?.Planta,w.inductiones?.CMDIC,w.inductiones?.Bloqueo,w.inductiones?.Puerto,w.inductiones?.Proyecto,
      w.estadoHabilitado,w.tipoServicio||"",w._pendDescanso?"SÍ":"NO",
      w.motivoAccion,w.correo,w.direccion,w.obs
    ].map(v=>`"${(v||"").toString().replace(/"/g,'""')}"`));
    const csv="\uFEFF"+[cols.map(c=>`"${c}"`).join(","),...rows.map(r=>r.join(","))].join("\n");
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    a.download=`OPI_Control_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast(`Descargando ${filtered.length} registros ✓`);
  }

  function handleBulkSvc(){
    const{tipoServicio,fechaInicio,fechaFin,diasTrabajados}=bulkSvcForm;
    if(!tipoServicio||!fechaInicio){toast("Completa tipo y fecha inicio","error");return;}
    if(selected2.size===0){toast("Selecciona al menos un trabajador","error");return;}
    const updated=workers.map(w=>{
      if(!selected2.has(w.id)) return w;
      const hist=[...(w.historial||[]),{tipoServicio,fechaInicio,fechaFin,diasTrabajados:Number(diasTrabajados)}];
      return{...w,historial:hist,tipoServicio};
    });
    setWorkers(updated);
    // Save each updated worker to Supabase
    updated.filter(w=>selected2.has(w.id)).forEach(w=>dbSaveWorker(w).catch(()=>{}));
    audit("service",`Servicio masivo: ${tipoServicio} asignado a ${selected2.size} trabajadores`,"");
    toast(`✓ Servicio asignado a ${selected2.size} trabajadores`);
    setSelected2(new Set());
    setBulkSvcModal(false);
  }

  function toggleSelect(id){
    setSelected2(prev=>{
      const n=new Set(prev);
      n.has(id)?n.delete(id):n.add(id);
      return n;
    });
  }

  function toggleSelectAll(){
    if(selected2.size===pageData.length){
      setSelected2(new Set());
    } else {
      setSelected2(new Set(pageData.map(w=>w.id)));
    }
  }

  function downloadTemplate(){
    const cols=["RUT","NOMBRE","TELEFONO","CORREO","CIUDAD","DIRECCION","ESPECIALIDAD","NACIONALIDAD","AFP","SALUD","ESTADO_CIVIL","ESTADO_EXAMEN","EVAL_PSICOLOGICA","ESTADO_HABILITADO","TIPO_SERVICIO","INDUCCION_PLANTA","INDUCCION_CMDIC","INDUCCION_BLOQUEO","INDUCCION_PUERTO","INDUCCION_PROYECTO","OBSERVACION"];
    const ejemplo=["12345678-9","JUAN PEDRO GONZALEZ LOPEZ","+56 9 1234 5678","juan@correo.com","IQUIQUE","AV. EJEMPLO 123","OPERARIO DE ASEO","CHILENA","HABITAT","FONASA","SOLTERO","VIGENTE","APTO","HABILITADO PARA SUBIR","Parada de Planta","OK","OK","OK","NO ESTA","NO ESTA",""];
    const csv="﻿"+[cols.join(","),ejemplo.map(v=>`"${v}"`).join(",")].join("\n");
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    a.download="OPI_Plantilla_Carga_Masiva.csv";
    a.click();
    toast("Plantilla descargada ✓");
  }

  function importCSV(file){
    if(!file) return;
    const reader=new FileReader();
    reader.onload=e=>{
      try{
        const text=e.target.result;
        const lines=text.split(/\r?\n/).filter(l=>l.trim());
        if(lines.length<2){toast("El archivo está vacío","error");return;}
        const header=lines[0].split(",").map(h=>h.replace(/"/g,"").trim().toUpperCase());
        const getCol=(row,name)=>{
          const idx=header.indexOf(name);
          if(idx===-1) return "";
          return row[idx]?.replace(/"/g,"").trim()||"";
        };
        let added=0, skipped=0;
        const existing=new Set(workers.map(w=>w.rut));
        const newWorkers=[];
        for(let i=1;i<lines.length;i++){
          const row=lines[i].match(/(".*?"|[^,]+|(?<=,)(?=,))/g)||lines[i].split(",");
          const rut=getCol(row,"RUT");
          if(!rut){skipped++;continue;}
          if(existing.has(rut)){skipped++;continue;}
          newWorkers.push({
            id:Date.now()+i,
            rut,
            nombre:getCol(row,"NOMBRE"),
            telefono:getCol(row,"TELEFONO"),
            correo:getCol(row,"CORREO"),
            ciudad:getCol(row,"CIUDAD"),
            direccion:getCol(row,"DIRECCION"),
            especialidad:getCol(row,"ESPECIALIDAD"),
            nacionalidad:getCol(row,"NACIONALIDAD"),
            afp:getCol(row,"AFP"),
            salud:getCol(row,"SALUD"),
            estadoCivil:getCol(row,"ESTADO_CIVIL"),
            estadoExamen:getCol(row,"ESTADO_EXAMEN")||"SIN FECHA",
            evalPsicologica:getCol(row,"EVAL_PSICOLOGICA"),
            estadoHabilitado:getCol(row,"ESTADO_HABILITADO")||"NO HABILITADO",
            tipoServicio:getCol(row,"TIPO_SERVICIO"),
            obs:getCol(row,"OBSERVACION"),
            inductiones:{
              Planta:getCol(row,"INDUCCION_PLANTA")||"NO ESTA",
              CMDIC:getCol(row,"INDUCCION_CMDIC")||"NO ESTA",
              Bloqueo:getCol(row,"INDUCCION_BLOQUEO")||"NO ESTA",
              Puerto:getCol(row,"INDUCCION_PUERTO")||"NO ESTA",
              Proyecto:getCol(row,"INDUCCION_PROYECTO")||"NO ESTA",
            },
            historial:[],
            origen:"CARGA MASIVA",
          });
          added++;
        }
        if(newWorkers.length===0){toast(`Sin registros nuevos. ${skipped} omitidos (RUT duplicado o vacío)`,"error");return;}
        const updated=[...workers,...newWorkers];
        setWorkers(updated);saveW(updated);
        audit("add",`Carga masiva: ${added} trabajadores agregados, ${skipped} omitidos`,"");
        toast(`✓ ${added} trabajadores importados. ${skipped} omitidos.`);
      }catch(err){
        toast("Error al leer el archivo: "+err.message,"error");
      }
    };
    reader.readAsText(file,"UTF-8");
  }

  // ── Form field helper ─────────────────────────────────────────────────────
  const F = key => ({
    value: key.includes(".")
      ? ((form[key.split(".")[0]]||{})[key.split(".")[1]]||"")
      : (form[key]||""),
    onChange: e => {
      if(key.includes(".")){
        const[o,k]=key.split(".");
        setForm(f=>({...f,[o]:{...(f[o]||{}),[k]:e.target.value}}));
      } else {
        setForm(f=>({...f,[key]:e.target.value}));
      }
    }
  });

  // ── Chart helpers ─────────────────────────────────────────────────────────
  function BarChart({title, subtitle, data, colors, accentColor}){
    const max = Math.max(...data.map(d=>d.v),1);
    const total = data.reduce((s,d)=>s+d.v,0);
    return(
      <div className="chart-wrap" style={{borderTop:`3px solid ${accentColor||colors[0]}`}}>
        <div className="chart-title">{title}</div>
        {subtitle&&<div className="chart-subtitle">{subtitle}</div>}
        {data.map((d,i)=>{
          const pct=total>0?Math.round(d.v/total*100):0;
          return(
            <div className="bar-row" key={d.l}>
              <div className="bar-label" title={d.l}>{d.l}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{width:`${Math.max(2,(d.v/max)*100)}%`,background:colors[i%colors.length]}}>
                  {(d.v/max)>0.15&&d.v}
                </div>
              </div>
              <div className="bar-count">{d.v}</div>
              <div className="bar-pct">{pct}%</div>
            </div>
          );
        })}
      </div>
    );
  }

  function DonutChart({title, subtitle, data, colors, accentColor}){
    const total = data.reduce((s,d)=>s+d.v,0)||1;
    let angle = -90;
    const R=58, r=36, cx=72, cy=72, size=144;
    const slices = data.map((d,i)=>{
      const pct=d.v/total, sweep=pct*360;
      if(sweep===0) return null;
      const a1=angle*Math.PI/180, a2=(angle+sweep-0.5)*Math.PI/180;
      const x1=cx+R*Math.cos(a1), y1=cy+R*Math.sin(a1);
      const x2=cx+R*Math.cos(a2), y2=cy+R*Math.sin(a2);
      const xi1=cx+r*Math.cos(a1), yi1=cy+r*Math.sin(a1);
      const xi2=cx+r*Math.cos(a2), yi2=cy+r*Math.sin(a2);
      const large=sweep>180?1:0;
      const path=`M${xi1},${yi1} A${r},${r},0,${large},1,${xi2},${yi2} L${x2},${y2} A${R},${R},0,${large},0,${x1},${y1} Z`;
      angle+=sweep;
      return{...d,path,color:colors[i%colors.length],pct:Math.round(pct*100)};
    }).filter(Boolean);
    const topSlice = slices.reduce((a,b)=>a.v>b.v?a:b,slices[0]||{pct:0,l:""});
    return(
      <div className="chart-wrap" style={{borderTop:`3px solid ${accentColor||colors[0]}`}}>
        <div className="chart-title">{title}</div>
        {subtitle&&<div className="chart-subtitle">{subtitle}</div>}
        <div className="donut-wrap">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
            {slices.map((s,i)=>(
              <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2">
                <title>{s.l}: {s.v} ({s.pct}%)</title>
              </path>
            ))}
            <circle cx={cx} cy={cy} r="32" fill="var(--sur)"/>
            <text x={cx} y={cy-8} textAnchor="middle" fontSize="18" fontWeight="900" fill="var(--tx)" fontFamily="Barlow Condensed,sans-serif">{total}</text>
            <text x={cx} y={cy+6} textAnchor="middle" fontSize="8" fill="var(--mu)" fontWeight="600" letterSpacing="1">TOTAL</text>
            <text x={cx} y={cy+18} textAnchor="middle" fontSize="8" fill={topSlice.color||"var(--mu)"} fontWeight="700">{topSlice.pct}% {topSlice.l?.split(" ")[0]}</text>
          </svg>
          <div className="donut-legend">
            {slices.map((s,i)=>(
              <div className="legend-item" key={i}>
                <div className="legend-dot" style={{background:s.color}}/>
                <span className="legend-label">{s.l}</span>
                <span className="legend-val">{s.v}</span>
                <span className="legend-pct">({s.pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function ProgressCard({title, subtitle, items, accentColor}){
    const max = Math.max(...items.map(d=>d.v),1);
    return(
      <div className="chart-wrap" style={{borderTop:`3px solid ${accentColor||"#3b82f6"}`}}>
        <div className="chart-title">{title}</div>
        {subtitle&&<div className="chart-subtitle">{subtitle}</div>}
        {items.map((d,i)=>(
          <div className="prog-row" key={i}>
            <div className="prog-label">{d.icon} {d.l}</div>
            <div className="prog-track">
              <div className="prog-fill" style={{width:`${Math.max(2,(d.v/max)*100)}%`,background:d.color||accentColor||"#3b82f6"}}/>
            </div>
            <div className="prog-val">{d.v}</div>
          </div>
        ))}
      </div>
    );
  }

  // ── Services page data ─────────────────────────────────────────────────────
  const allServices = useMemo(()=>{
    const map = {};
    enriched.forEach(w=>{
      (w.historial||[]).forEach(h=>{
        const key = `${h.tipoServicio}__${h.fechaInicio}`;
        if(!map[key]) map[key]={tipoServicio:h.tipoServicio,fechaInicio:h.fechaInicio,fechaFin:h.fechaFin,participantes:[]};
        map[key].participantes.push({nombre:w.nombre,rut:w.rut,especialidad:w.especialidad,diasTrabajados:h.diasTrabajados});
      });
    });
    return Object.values(map).sort((a,b)=>b.fechaInicio?.localeCompare(a.fechaInicio||"")||0);
  },[enriched]);

  // ── Dashboard data ─────────────────────────────────────────────────────────
  const dashData = useMemo(()=>{
    const byCity = {};
    enriched.forEach(w=>{ if(w.ciudad) byCity[w.ciudad]=(byCity[w.ciudad]||0)+1; });
    const topCities = Object.entries(byCity).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([l,v])=>({l,v}));

    const indData = INDUCTIONES.map(k=>({
      l:k,
      v:enriched.filter(w=>(w.inductiones?.[k]||"NO ESTA")==="NO ESTA").length
    }));

    const certData = [
      {l:"Cert. Antecedentes", v:enriched.filter(w=>!w.certificadoAntecedentes||w.certificadoAntecedentes==="NO ESTA"||w.certificadoAntecedentes==="PENDIENTE").length},
      {l:"Primeros Auxilios",  v:enriched.filter(w=>!w.primerosAuxilios||w.primerosAuxilios==="NO ESTA"||w.primerosAuxilios==="PENDIENTE").length},
      {l:"Manejo Extintores",  v:enriched.filter(w=>!w.manejoExtintores||w.manejoExtintores==="NO ESTA"||w.manejoExtintores==="PENDIENTE").length},
      {l:"Energía Potenciales",v:enriched.filter(w=>!w.energiaPotenciales||w.energiaPotenciales==="NO ESTA"||w.energiaPotenciales==="PENDIENTE").length},
    ];

    const svcCount = {};
    SERVICIOS.forEach(s=>{ svcCount[s]=enriched.filter(w=>w.tipoServicio===s).length; });

    return{topCities, indData, certData, svcCount};
  },[enriched]);

  // ── Render helpers ────────────────────────────────────────────────────────
  function Pager(){
    if(totalPages<=1) return null;
    const pages=[];
    const start=Math.max(1,page-2);
    const end=Math.min(totalPages,start+4);
    for(let i=start;i<=end;i++) pages.push(i);
    return(
      <div className="pag">
        <button className="pbtn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
        {start>1&&<><button className="pbtn" onClick={()=>setPage(1)}>1</button><span style={{color:"var(--mu)"}}>…</span></>}
        {pages.map(p=><button key={p} className={`pbtn${page===p?" act":""}`} onClick={()=>setPage(p)}>{p}</button>)}
        {end<totalPages&&<><span style={{color:"var(--mu)"}}>…</span><button className="pbtn" onClick={()=>setPage(totalPages)}>{totalPages}</button></>}
        <button className="pbtn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
      </div>
    );
  }

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if(loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--bg)",color:"var(--mu)",fontFamily:"Barlow,sans-serif"}}>⚙️ Cargando OPI Control...</div>;

  if(!curUser) return (
    <>
      <style>{CSS}</style>
      <div className="lw">
        <div className="lb">
          <div style={{display:"flex",justifyContent:"center",gap:20,alignItems:"center",marginBottom:18}}>
            <span style={{fontFamily:"Barlow Condensed,sans-serif",fontWeight:900,fontSize:26,letterSpacing:2,color:"#f97316"}}>RHIO RENTAL</span>
            <div style={{width:1,height:36,background:"#e2e8f0"}}/>
            <span style={{fontFamily:"Barlow Condensed,sans-serif",fontWeight:900,fontSize:26,letterSpacing:2,color:"#15803d"}}>COLLAHUASI</span>
          </div>
          <div className="lbrand">OPI <span>CONTROL</span></div>
          <div className="lsub">GESTIÓN PARADAS DE PLANTA</div>
          {loginErr && <div className="lerr">{loginErr}</div>}
          <div className="fg">
            <label>Usuario</label>
            <input value={loginF.u} onChange={e=>setLoginF(f=>({...f,u:e.target.value}))}
              placeholder="usuario" onKeyDown={e=>e.key==="Enter"&&handleLogin()} autoFocus/>
          </div>
          <div className="fg">
            <label>Contraseña</label>
            <input type="password" value={loginF.p} onChange={e=>setLoginF(f=>({...f,p:e.target.value}))}
              placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
          </div>
          <button className="lbtn" onClick={handleLogin}>INGRESAR</button>
        </div>
      </div>
    </>
  );

  // ── MAIN APP ──────────────────────────────────────────────────────────────
  const navMain=[
    {id:"workers",  label:"Todo el Personal", icon:"👷"},
    {id:"habilitados",label:"Habilitados",    icon:"✅"},
    {id:"pendiente",label:"Pend. Descanso",   icon:"⏳"},
    {id:"descanso", label:"En Descanso",       icon:"🛌"},
    {id:"vencidos", label:"Exám. Vencidos",   icon:"⚠️"},
    {id:"bloqueados",label:"Bloqueados",       icon:"🚫"},
    {id:"dashboard",  label:"Dashboard",        icon:"📊"},
    {id:"servicios",  label:"Servicios",         icon:"🗂️"},
  ];
  const navAdmin=[
    {id:"audit",label:"Bitácora",  icon:"📋"},
    {id:"users",label:"Usuarios",  icon:"👤"},
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="wrap">

        {/* ── Topbar ── */}
        <header className="topbar">
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontFamily:"Barlow Condensed,sans-serif",fontWeight:900,fontSize:20,letterSpacing:1,color:"#f97316"}}>RHIO RENTAL</span>
            <div style={{width:1,height:28,background:"var(--bor)"}}/>
            <span style={{fontFamily:"Barlow Condensed,sans-serif",fontWeight:900,fontSize:20,letterSpacing:1,color:"#15803d"}}>COLLAHUASI</span>
            <div style={{width:1,height:28,background:"var(--bor)"}}/>
            <div className="brand">OPI <span>CONTROL</span></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div className="pills">
              <div className="pill"><span className="dot" style={{background:"var(--gn)"}}/>APTOS: {kpi.hab}</div>
              <div className="pill"><span className="dot" style={{background:"var(--pu)"}}/>PEND: {kpi.pend}</div>
              <div className="pill"><span className="dot" style={{background:"var(--yw)"}}/>VENC: {kpi.vencido}</div>
              <div className="pill"><span className="dot" style={{background:"var(--bl)"}}/>TOTAL: {kpi.total}</div>
            </div>
            <div className="uchip">
              <div className={`uavt ${rolCls(curUser.rol)}`}>{curUser.nombre[0].toUpperCase()}</div>
              <span style={{fontSize:12}}>{curUser.nombre}</span>
              <span className={`badge ${curUser.rol==="admin"?"or":curUser.rol==="supervisor"?"bl":"bg"}`} style={{fontSize:9}}>{rolLabel(curUser.rol)}</span>
              <button onClick={handleLogout} style={{background:"none",border:"none",color:"var(--mu)",cursor:"pointer",fontSize:15,padding:"0 2px"}} title="Cerrar sesión">⏻</button>
            </div>
          </div>
        </header>

        <div className="body">

          {/* ── Sidebar ── */}
          <nav className="sidebar">
            {navMain.map(n=>(
              <div key={n.id} className={`ni${view===n.id?" act":""}`} onClick={()=>setView(n.id)}>
                <span>{n.icon}</span><span>{n.label}</span>
              </div>
            ))}
            {canAdmin&&<>
              <div className="nsep"/>
              <div className="nlabel">Admin</div>
              {navAdmin.map(n=>(
                <div key={n.id} className={`ni${view===n.id?" act":""}`} onClick={()=>setView(n.id)}>
                  <span>{n.icon}</span><span>{n.label}</span>
                </div>
              ))}
            </>}
            <div className="nsep"/>
            <div className="nlabel">Regla Descanso</div>
            <div style={{padding:"4px 16px",fontSize:11,color:"var(--mu)",lineHeight:1.6}}>
              1 día libre<br/>por día trabajado
            </div>
          </nav>

          {/* ── Main content ── */}
          <main className="main">

            {/* ── Audit View ── */}
            {view==="audit"&&canAdmin&&(
              <div className="card">
                <div className="card-hdr">
                  <span>📋 Bitácora de Cambios <span style={{fontSize:13,fontWeight:400,color:"var(--mu)"}}>{auditLog.length} entradas</span></span>
                  <button className="btn btn-s btn-sm" onClick={()=>{
                    const cols=["Fecha/Hora","Usuario","Username","Rol","Acción","Trabajador","Detalle"];
                    const rows=auditLog.map(e=>[e.ts,e.usuario,e.username,e.rol,e.accion,e.trabajador,e.detalle].map(v=>`"${(v||"").replace(/"/g,'""')}"`));
                    const csv="\uFEFF"+[cols.map(c=>`"${c}"`).join(","),...rows.map(r=>r.join(","))].join("\n");
                    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="OPI_Bitacora.csv";a.click();
                  }}>⬇ Exportar CSV</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"140px 120px 80px 1fr",gap:8,padding:"5px 0",borderBottom:"1px solid var(--bor)",fontSize:10,fontWeight:700,letterSpacing:1,color:"var(--mu)",textTransform:"uppercase"}}>
                  <span>Fecha/Hora</span><span>Usuario</span><span>Acción</span><span>Detalle</span>
                </div>
                {auditLog.length===0&&<div className="empty"><div style={{fontSize:32,marginBottom:8}}>📋</div>Sin registros aún</div>}
                {auditLog.map(e=>(
                  <div className="arow" key={e.id}>
                    <span style={{color:"var(--mu)",fontSize:10}}>{e.ts}</span>
                    <span style={{fontWeight:600,fontSize:11}}>
                      <span className={`badge ${e.rol==="admin"?"or":e.rol==="supervisor"?"bl":"bg"}`} style={{fontSize:8,marginRight:4}}>{rolLabel(e.rol)}</span>
                      {e.usuario}
                    </span>
                    <span><span className={`abadge a-${e.accion}`}>{e.accion==="add"?"AGREGAR":e.accion==="edit"?"EDITAR":e.accion==="delete"?"ELIMINAR":e.accion==="service"?"SERVICIO":"LOGIN"}</span></span>
                    <span style={{fontSize:11}}>
                      {e.trabajador&&<span style={{color:"var(--acc)",marginRight:5}}>{e.trabajador}</span>}
                      {e.detalle}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ── Users View ── */}
            {view==="users"&&canAdmin&&(
              <div className="card">
                <div className="card-hdr">👤 Gestión de Usuarios</div>
                <div className="tw" style={{marginBottom:20}}>
                  <table>
                    <thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Acciones</th></tr></thead>
                    <tbody>
                      {users.map(u=>(
                        <tr key={u.id}>
                          <td style={{fontWeight:600}}>{u.username}</td>
                          <td>{u.nombre}</td>
                          <td><span className={`badge ${u.rol==="admin"?"or":u.rol==="supervisor"?"bl":"bg"}`}>{rolLabel(u.rol)}</span></td>
                          <td>
                            <div style={{display:"flex",gap:4}}>
                              <button className="btn btn-s btn-sm" onClick={()=>setUserForm({mode:"edit",...u,newPass:""})}>✏️ Editar</button>
                              {u.id!==curUser.id&&<button className="btn btn-d btn-sm" onClick={()=>{
                                if(!confirm("¿Eliminar usuario?"))return;
                                const upd=users.filter(x=>x.id!==u.id);
                                setUsers(upd);dbDeleteUser(u.id).catch(()=>{});audit("edit",`Usuario eliminado: ${u.username}`);toast("Usuario eliminado","error");
                              }}>🗑</button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Edit form */}
                {userForm.mode==="edit"&&(
                  <div style={{background:"#f8fafc",border:"1px solid var(--bor)",borderRadius:6,padding:14,marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:1,color:"var(--bl)",marginBottom:10}}>EDITAR: {userForm.username}</div>
                    <div className="fgrid">
                      <div className="fg"><label>Nombre</label><input value={userForm.nombre||""} onChange={e=>setUserForm(f=>({...f,nombre:e.target.value}))}/></div>
                      <div className="fg"><label>Rol</label>
                        <select value={userForm.rol||""} onChange={e=>setUserForm(f=>({...f,rol:e.target.value}))}>
                          <option value="admin">Admin</option><option value="supervisor">Supervisor</option><option value="viewer">Visor</option>
                        </select>
                      </div>
                      <div className="fg full"><label>Nueva contraseña (vacío = sin cambio)</label><input type="password" value={userForm.newPass||""} onChange={e=>setUserForm(f=>({...f,newPass:e.target.value}))}/></div>
                    </div>
                    <div style={{display:"flex",gap:8,marginTop:8}}>
                      <button className="btn btn-p btn-sm" onClick={()=>{
                        const updU={...users.find(x=>x.id===userForm.id),nombre:userForm.nombre,rol:userForm.rol,...(userForm.newPass?{password:userForm.newPass}:{})};
                        const upd=users.map(u=>u.id===userForm.id?updU:u);
                        setUsers(upd);dbSaveUser(updU).catch(()=>{});audit("edit",`Usuario modificado: ${userForm.username}`);setUserForm({});toast("Usuario actualizado ✓");
                      }}>Guardar</button>
                      <button className="btn btn-s btn-sm" onClick={()=>setUserForm({})}>Cancelar</button>
                    </div>
                  </div>
                )}

                {/* New user form */}
                <div style={{background:"#f8fafc",border:"1px solid var(--bor)",borderRadius:6,padding:14}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:1,color:"var(--gn)",marginBottom:10}}>+ NUEVO USUARIO</div>
                  <div className="fgrid">
                    <div className="fg"><label>Nombre</label><input value={userForm.newNombre||""} onChange={e=>setUserForm(f=>({...f,newNombre:e.target.value}))}/></div>
                    <div className="fg"><label>Usuario</label><input value={userForm.newUser||""} onChange={e=>setUserForm(f=>({...f,newUser:e.target.value}))}/></div>
                    <div className="fg"><label>Contraseña</label><input type="password" value={userForm.newPassword||""} onChange={e=>setUserForm(f=>({...f,newPassword:e.target.value}))}/></div>
                    <div className="fg"><label>Rol</label>
                      <select value={userForm.newRol||"viewer"} onChange={e=>setUserForm(f=>({...f,newRol:e.target.value}))}>
                        <option value="admin">Admin</option><option value="supervisor">Supervisor</option><option value="viewer">Visor</option>
                      </select>
                    </div>
                  </div>
                  <button className="btn btn-p btn-sm" style={{marginTop:8}} onClick={()=>{
                    if(!userForm.newUser||!userForm.newPassword){toast("Completa usuario y contraseña","error");return;}
                    if(users.find(u=>u.username===userForm.newUser)){toast("Ese usuario ya existe","error");return;}
                    const nu={id:Date.now(),username:userForm.newUser,password:userForm.newPassword,nombre:userForm.newNombre||userForm.newUser,rol:userForm.newRol||"viewer"};
                    const upd=[...users,nu];setUsers(upd);dbSaveUser(nu).catch(()=>{});
                    audit("add",`Usuario creado: ${nu.username} (${nu.rol})`);
                    setUserForm({});toast("Usuario creado ✓");
                  }}>Crear Usuario</button>
                </div>
              </div>
            )}

            {/* ── Dashboard View ── */}
            {view==="dashboard"&&(()=>{
              const enRevision=enriched.filter(w=>!checkRequisitos(w).cumple&&!w.bloqueado&&!w._pendDescanso).length;
              const noHab=enriched.filter(w=>w.estadoHabilitado==="NO HABILITADO"&&!w.bloqueado).length;
              const vigente=enriched.filter(w=>w.estadoExamen==="VIGENTE").length;
              const vencido=enriched.filter(w=>w.estadoExamen==="VENCIDO").length;
              const porVencer=enriched.filter(w=>w.estadoExamen==="POR VENCER").length;
              const sinFecha=enriched.filter(w=>w.estadoExamen==="SIN FECHA").length;
              const pct=(v,t)=>t>0?Math.round(v/t*100):0;
              return(
              <div>
                {/* Header */}
                <div className="dash-hdr">
                  <div>
                    <div className="dash-title">📊 DASHBOARD OPERACIONAL</div>
                    <div className="dash-sub">Resumen general · {enriched.length} trabajadores registrados · Actualizado en tiempo real</div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{background:"#dcfce7",border:"1px solid #86efac",borderRadius:6,padding:"6px 12px",fontSize:11,fontWeight:700,color:"#15803d"}}>
                      ✅ {pct(kpi.hab,enriched.length)}% Habilitados
                    </div>
                    <div style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:6,padding:"6px 12px",fontSize:11,fontWeight:700,color:"#dc2626"}}>
                      ⚠️ {vencido} Exámenes vencidos
                    </div>
                  </div>
                </div>

                {/* KPI Strip */}
                <div className="dash-kpis">
                  {[
                    {icon:"✅",val:kpi.hab,      label:"Hab. Completos",  sub:`Cumplen 5 requisitos`,                          color:"#16a34a"},
                    {icon:"⚠️",val:kpi.habInc,   label:"Hab. Incompleto", sub:`Les falta algún req.`,                          color:"#ca8a04"},
                    {icon:"🔍",val:enRevision,   label:"En Revisión",     sub:"Pendiente evaluación",                          color:"#ca8a04"},
                    {icon:"❌",val:noHab,        label:"No Habilitados",  sub:"Requieren acción",                              color:"#dc2626"},
                    {icon:"⏳",val:kpi.pend,     label:"Pend. Descanso",  sub:"Servicio en curso",                             color:"#f97316"},
                    {icon:"🚫",val:kpi.bloqueado,label:"Bloqueados",      sub:"Sin acceso a servicios",                        color:"#7c3aed"},
                  ].map((k,i)=>(
                    <div className="dash-kpi" key={i} onClick={()=>{setView("workers");setFHab(["HAB","HAB_INC","NOHAB","PEND","BLOQ"][i]);}}>
                      <div className="dash-kpi-accent" style={{background:k.color}}/>
                      <div className="dash-kpi-icon">{k.icon}</div>
                      <div className="dash-kpi-val" style={{color:k.color}}>{k.val}</div>
                      <div className="dash-kpi-label">{k.label}</div>
                      <div className="dash-kpi-sub">{k.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Row 1: Donuts */}
                <div className="charts-grid-3">
                  <DonutChart
                    title="Estado de Habilitación"
                    subtitle="Distribución del personal por estado"
                    accentColor="#16a34a"
                    data={[
                      {l:"Aptos",           v:kpi.hab},
                      {l:"No Aptos",        v:kpi.noApto},
                      {l:"Pend. Descanso",  v:kpi.pend},
                      {l:"Bloqueados",      v:kpi.bloqueado},
                    ].filter(d=>d.v>0)}
                    colors={["#16a34a","#dc2626","#f97316","#7c3aed"]}
                  />
                  <DonutChart
                    title="Estado de Exámenes"
                    subtitle="Vigencia de exámenes médicos"
                    accentColor="#3b82f6"
                    data={[
                      {l:"Vigente",    v:vigente},
                      {l:"Por Vencer", v:porVencer},
                      {l:"Vencido",    v:vencido},
                      {l:"Sin Fecha",  v:sinFecha},
                    ].filter(d=>d.v>0)}
                    colors={["#16a34a","#ca8a04","#dc2626","#94a3b8"]}
                  />
                  <DonutChart
                    title="Requisitos Mínimos"
                    subtitle="Trabajadores que cumplen los 5 requisitos"
                    accentColor="#16a34a"
                    data={[
                      {l:"Cumple todos",    v:enriched.filter(w=>checkRequisitos(w).cumple).length},
                      {l:"Incompleto",      v:enriched.filter(w=>!checkRequisitos(w).cumple).length},
                    ]}
                    colors={["#16a34a","#dc2626"]}
                  />
                </div>

                {/* Row 2: Bars */}
                <div className="charts-grid">
                  <BarChart
                    title="Personal por Ciudad"
                    subtitle="Top 8 ciudades con más trabajadores registrados"
                    accentColor="#3b82f6"
                    data={dashData.topCities}
                    colors={["#3b82f6","#60a5fa","#93c5fd","#bfdbfe","#dbeafe","#eff6ff","#1d4ed8","#1e40af"]}
                  />
                  <BarChart
                    title="Inducciones Faltantes"
                    subtitle="Trabajadores sin inducción completada por tipo"
                    accentColor="#dc2626"
                    data={dashData.indData}
                    colors={["#dc2626","#f97316","#ca8a04","#7c3aed","#3b82f6"]}
                  />
                </div>

                {/* Row 3: Progress + Certs */}
                <div className="charts-grid">
                  <ProgressCard
                    title="Cumplimiento de Inducciones"
                    subtitle="% de trabajadores con inducción OK"
                    accentColor="#16a34a"
                    items={INDUCTIONES.map(k=>({
                      icon:"📋",
                      l:k,
                      v:enriched.filter(w=>w.inductiones?.[k]==="OK").length,
                      color:"#16a34a"
                    }))}
                  />
                  <ProgressCard
                    title="Estado de Certificados y Cursos"
                    subtitle="Trabajadores con documentación al día"
                    accentColor="#f97316"
                    items={[
                      {icon:"📄",l:"Cert. Antecedentes", v:enriched.filter(w=>w.certificadoAntecedentes==="OK").length, color:"#16a34a"},
                      {icon:"🏥",l:"Primeros Auxilios",  v:enriched.filter(w=>w.primerosAuxilios==="OK").length,       color:"#3b82f6"},
                      {icon:"🧯",l:"Manejo Extintores",  v:enriched.filter(w=>w.manejoExtintores==="OK").length,       color:"#f97316"},
                      {icon:"⚡",l:"Energía Potenciales",v:enriched.filter(w=>w.energiaPotenciales==="OK").length,     color:"#7c3aed"},
                    ]}
                  />
                </div>

                {/* Row 4: Requisitos Minimos */}
                <div className="chart-wrap" style={{borderTop:"3px solid #16a34a",marginBottom:16}}>
                  <div className="chart-title">Requisitos Mínimos para Servicio</div>
                  <div className="chart-subtitle">Trabajadores que cumplen cada requisito individual</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginTop:8}}>
                    {[
                      {l:"Examen Vigente",         v:enriched.filter(w=>w.estadoExamen==="VIGENTE").length,       color:"#3b82f6"},
                      {l:"Eval. Psicológica OK",   v:enriched.filter(w=>["APTO","RECOMENDABLE"].some(x=>(w.evalPsicologica||"").toUpperCase().includes(x))).length, color:"#7c3aed"},
                      {l:"Inducción CMDIC",        v:enriched.filter(w=>w.inductiones?.CMDIC==="OK").length,       color:"#f97316"},
                      {l:"Inducción Planta",       v:enriched.filter(w=>w.inductiones?.Planta==="OK").length,      color:"#ca8a04"},
                      {l:"Cert. Antecedentes",     v:enriched.filter(w=>w.certificadoAntecedentes==="OK").length,  color:"#16a34a"},
                    ].map((r,i)=>{
                      const pct2=Math.round(r.v/enriched.length*100);
                      return(
                        <div key={i} style={{textAlign:"center"}}>
                          <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"10px 8px",marginBottom:6}}>
                            <div style={{fontSize:22,fontWeight:900,color:r.color,lineHeight:1}}>{r.v}</div>
                            <div style={{fontSize:9,color:"#64748b",marginTop:2}}>{pct2}% del total</div>
                          </div>
                          <div style={{background:"#f1f5f9",borderRadius:20,height:6,overflow:"hidden",marginBottom:4}}>
                            <div style={{height:"100%",background:r.color,borderRadius:20,width:`${pct2}%`}}/>
                          </div>
                          <div style={{fontSize:9,color:"#64748b",fontWeight:600,lineHeight:1.3}}>{r.l}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{marginTop:14,padding:"10px 14px",background:kpi.hab>0?"#f0fdf4":"#fff7ed",border:`1px solid ${kpi.hab>0?"#86efac":"#fed7aa"}`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontSize:12,fontWeight:700,color:kpi.hab>0?"#15803d":"#c2410c"}}>
                      {kpi.hab>0?`✅ ${kpi.hab} trabajadores cumplen los 5 requisitos mínimos`:`⚠️ Ningún trabajador cumple los 5 requisitos mínimos`}
                    </span>
                    <span style={{fontSize:11,color:"#64748b"}}>{Math.round(kpi.hab/enriched.length*100)}% del total</span>
                  </div>
                </div>

                {/* Row 5: Eval Psicológica */}
                <div className="charts-grid">
                  <BarChart
                    title="Evaluación Psicológica"
                    subtitle="Distribución por resultado de evaluación"
                    accentColor="#7c3aed"
                    data={[...new Set(enriched.map(w=>w.evalPsicologica).filter(Boolean))].map(e=>({
                      l:e.length>25?e.slice(0,25)+"…":e,
                      v:enriched.filter(w=>w.evalPsicologica===e).length
                    })).sort((a,b)=>b.v-a.v).slice(0,6)}
                    colors={["#16a34a","#3b82f6","#ca8a04","#dc2626","#7c3aed","#f97316"]}
                  />
                  <BarChart
                    title="Certificados Pendientes"
                    subtitle="Trabajadores con documentos sin completar"
                    accentColor="#dc2626"
                    data={dashData.certData}
                    colors={["#dc2626","#f97316","#ca8a04","#7c3aed"]}
                  />
                </div>

              </div>
              );
            })()}

            {/* ── Services View ── */}
            {view==="servicios"&&(
              <div>
                <div style={{fontFamily:"Barlow Condensed,sans-serif",fontSize:22,fontWeight:900,letterSpacing:2,marginBottom:16,color:"var(--tx)"}}>🗂️ SERVICIOS REALIZADOS</div>
                {allServices.length===0
                  ?<div className="empty">No hay servicios registrados aún</div>
                  :allServices.map((svc,i)=>{
                    const cls=svc.tipoServicio==="Parada de Planta"?"s-p":svc.tipoServicio==="ODS"?"s-o":svc.tipoServicio==="Contrato Base"?"s-c":"s-r";
                    return(
                      <div className="svc-card" key={i}>
                        <div className="svc-card-hdr">
                          <span className={`stag ${cls}`} style={{fontSize:12,padding:"3px 10px"}}>{svc.tipoServicio}</span>
                          <span style={{fontSize:12,fontWeight:600,color:"var(--tx)"}}>📅 {svc.fechaInicio}</span>
                          {svc.fechaFin&&<span style={{fontSize:11,color:"var(--mu)"}}>→ {svc.fechaFin}</span>}
                          <span style={{background:"#f1f5f9",border:"1px solid var(--bor)",borderRadius:12,padding:"2px 10px",fontSize:11,fontWeight:700,color:"var(--mu)",marginLeft:"auto"}}>
                            👷 {svc.participantes.length} trabajador{svc.participantes.length!==1?"es":""}
                          </span>
                        </div>
                        <div className="svc-participants">
                          {svc.participantes.map((p,j)=>(
                            <div className="svc-participant" key={j}>
                              <span style={{fontWeight:600}}>{p.nombre}</span>
                              <span style={{color:"var(--mu)",marginLeft:4,fontSize:10}}>{p.rut}</span>
                              {p.diasTrabajados>0&&<span style={{color:"var(--acc)",marginLeft:4,fontSize:10}}>· {p.diasTrabajados}d</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            )}

            {/* ── Workers View ── */}
            {!["audit","users","dashboard","servicios"].includes(view)&&(<>
              <div className="kpis" style={{gridTemplateColumns:"repeat(5,1fr)"}}>
                <div className="kpi"><div className="kpi-l">Total</div><div className="kpi-v" style={{color:"var(--bl)"}}>{kpi.total}</div><div className="kpi-s">registros</div></div>
                <div className="kpi"><div className="kpi-l">Habilitados</div><div className="kpi-v" style={{color:"var(--gn)"}}>{kpi.hab}</div><div className="kpi-s">para programar</div></div>
                <div className="kpi"><div className="kpi-l">Pend. Descanso</div><div className="kpi-v" style={{color:"var(--pu)"}}>{kpi.pend}</div><div className="kpi-s">en curso</div></div>
                <div className="kpi"><div className="kpi-l">Exám. Vencidos</div><div className="kpi-v" style={{color:"var(--yw)"}}>{kpi.vencido}</div><div className="kpi-s">renovar</div></div>
                <div className="kpi" style={{cursor:"pointer"}} onClick={()=>setFHab("BLOQ")}><div className="kpi-l">Bloqueados</div><div className="kpi-v" style={{color:"var(--rd)"}}>{kpi.bloqueado}</div><div className="kpi-s">sin acceso</div></div>
              </div>

              <div className="tbar">
                <input className="srch" placeholder="🔍 Nombre, RUT, ciudad, correo…" value={search} onChange={e=>setSearch(e.target.value)}/>
                <select className="fsel" value={fHab} onChange={e=>setFHab(e.target.value)}>
                  <option value="ALL">Todos los estados</option>
                  <option value="HAB">✅ Habilitados (completos)</option>
                  <option value="HAB_INC">⚠️ Hab. incompletos</option>
                  <option value="NOHAB">❌ No Habilitados</option>
                  <option value="PEND">⏳ Pendiente Descanso</option>
                  <option value="DESC">🛌 En Descanso activo</option>
                  <option value="BLOQ">🚫 Bloqueados</option>
                </select>
                <select className="fsel" value={fExam} onChange={e=>setFExam(e.target.value)}>
                  <option value="ALL">Todos los exámenes</option>
                  {EXAMENES.map(e=><option key={e}>{e}</option>)}
                </select>
                <select className="fsel" value={fCity} onChange={e=>setFCity(e.target.value)}>
                  <option value="ALL">Todas las ciudades</option>
                  {cities.map(c=><option key={c}>{c}</option>)}
                </select>
                <select className="fsel" value={fSvc} onChange={e=>setFSvc(e.target.value)}>
                  <option value="ALL">Todos los servicios</option>
                  {SERVICIOS.map(s=><option key={s}>{s}</option>)}
                </select>
                <button className="btn btn-s" onClick={downloadCSV}>⬇ Descargar</button>
                <button className="btn btn-s" onClick={downloadTemplate} title="Descargar plantilla CSV para carga masiva">📋 Plantilla</button>
                {canEdit&&<>
                  <label className="btn btn-s" style={{cursor:"pointer"}} title="Importar trabajadores desde CSV">
                    📥 Importar CSV
                    <input type="file" accept=".csv" style={{display:"none"}} onChange={e=>{importCSV(e.target.files[0]);e.target.value="";}}/>
                  </label>
                  <button className="btn btn-p" onClick={openAdd}>+ Agregar</button>
                </>}
              </div>

              {selected2.size>0&&(
                <div style={{background:"rgba(249,115,22,.1)",border:"1px solid rgba(249,115,22,.3)",borderRadius:8,padding:"10px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                  <span style={{color:"var(--acc)",fontWeight:700,fontSize:13}}>✓ {selected2.size} trabajador{selected2.size!==1?"es":""} seleccionado{selected2.size!==1?"s":""}</span>
                  {canEdit&&<button className="btn btn-p btn-sm" onClick={()=>setBulkSvcModal(true)}>📅 Asignar Servicio</button>}
                  <button className="btn btn-s btn-sm" onClick={()=>setSelected2(new Set())}>✕ Deseleccionar todo</button>
                </div>
              )}
              <div className="card">
                <div className="card-hdr">
                  <span>Personal OPI — <span style={{color:"var(--acc)"}}>{filtered.length}</span> resultado{filtered.length!==1?"s":""}</span>
                  <span style={{fontSize:11,fontWeight:400,color:"var(--mu)"}}>Pág {page}/{totalPages||1}</span>
                </div>
                <div className="tw">
                  <table>
                    <thead><tr>
                      <th style={{width:32}}><input type="checkbox" onChange={toggleSelectAll} checked={selected2.size===pageData.length&&pageData.length>0} style={{cursor:"pointer"}}/></th>
                      <th>#</th><th>Nombre</th><th>RUT</th><th>Ciudad</th>
                      <th>Examen</th><th>Eval.Psic</th><th>Inducciones</th>
                      <th>Servicio</th><th>Estado Hab.</th><th>Apto</th><th>Motivo</th><th></th>
                    </tr></thead>
                    <tbody>
                      {pageData.length===0
                        ?<tr><td colSpan={13}><div className="empty">🔍 Sin resultados</div></td></tr>
                        :pageData.map((w,idx)=>(
                          <tr key={w.id} style={{background:selected2.has(w.id)?"rgba(249,115,22,.06)":""}}>
                            <td><input type="checkbox" checked={selected2.has(w.id)} onChange={()=>toggleSelect(w.id)} style={{cursor:"pointer"}}/></td>
                            <td style={{color:"var(--mu)",fontSize:10}}>{(page-1)*PAGE_SIZE+idx+1}</td>
                            <td>
                              <div className="nm">{w.nombre}</div>
                              {w.obs&&<div style={{fontSize:9,color:"var(--yw)"}}>{w.obs}</div>}
                            </td>
                            <td className="sm">{w.rut}</td>
                            <td style={{fontSize:11}}>{w.ciudad||"—"}</td>
                            <td>{estadoBadge(w.estadoExamen)}</td>
                            <td><div className="mc" title={w.evalPsicologica}>{w.evalPsicologica||"—"}</div></td>
                            <td><div className="idots">{INDUCTIONES.map(k=>indDot(w.inductiones?.[k],k))}</div></td>
                            <td>{servTag(w.tipoServicio)}</td>
                            <td>
                              <span className={`badge ${w.estadoHabilitado==="HABILITADO PARA SUBIR"?"gn":w.estadoHabilitado==="EN REVISIÓN"?"yw":"bg"}`} style={{fontSize:9}}>
                                {w.estadoHabilitado==="HABILITADO PARA SUBIR"?"HAB. SUBIR":w.estadoHabilitado==="EN REVISIÓN"?"EN REVISIÓN":w.estadoHabilitado||"—"}
                              </span>
                            </td>
                            <td>
                              {habBadge(w)}
                              {(()=>{
                                if(w.bloqueado||w._enDescanso||w._pendDescanso) return null;
                                const req=checkRequisitos(w);
                                const faltantes=req.items.filter(r=>!r.ok).length;
                                if(faltantes===0) return null;
                                return <div style={{fontSize:9,color:"#dc2626",marginTop:2,fontWeight:600}}>Faltan {faltantes}</div>;
                              })()}
                            </td>
                            <td><div className="mc" title={w.motivoAccion}>{w.motivoAccion||"—"}</div></td>
                            <td>
                              <div style={{display:"flex",gap:3,whiteSpace:"nowrap"}}>
                                <button className="btn btn-s btn-sm" onClick={()=>openDetail(w)}>Ver</button>
                                {canEdit&&<button className="btn btn-s btn-sm" onClick={()=>openEdit(w)}>✏️</button>}
                                {canEdit&&<button className="btn btn-s btn-sm" onClick={()=>openSvc(w)} title="Registrar servicio">📅</button>}
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
                <Pager/>
              </div>
            </>)}
          </main>
        </div>

        {/* ── Modal Add/Edit ── */}
        {(modal==="add"||modal==="edit")&&(
          <div className="ov" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
            <div className="modal">
              <div className="mhdr">
                <div className="mtit">{modal==="add"?"Nuevo Trabajador":"Editar Trabajador"}</div>
                <button className="mcls" onClick={()=>setModal(null)}>×</button>
              </div>
              <div className="mbdy">
                <div className="fgrid">
                  <div className="fsec">Datos Personales</div>
                  <div className="fg full"><label>Nombre Completo</label><input {...F("nombre")} placeholder="NOMBRE Y APELLIDOS"/></div>
                  <div className="fg"><label>RUT</label><input {...F("rut")} placeholder="12345678-9"/></div>
                  <div className="fg"><label>Teléfono</label><input {...F("telefono")}/></div>
                  <div className="fg"><label>Correo</label><input {...F("correo")}/></div>
                  <div className="fg"><label>Ciudad</label><input {...F("ciudad")}/></div>
                  <div className="fg"><label>Dirección</label><input {...F("direccion")}/></div>
                  <div className="fg"><label>Especialidad</label><input {...F("especialidad")}/></div>
                  <div className="fg"><label>Nacionalidad</label><input {...F("nacionalidad")}/></div>
                  <div className="fg"><label>AFP</label><input {...F("afp")}/></div>
                  <div className="fg"><label>Salud</label><input {...F("salud")}/></div>
                  <div className="fg"><label>Estado Civil</label>
                    <select {...F("estadoCivil")}><option value="">—</option>{["SOLTERO","CASADO","DIVORCIADO","VIUDO"].map(o=><option key={o}>{o}</option>)}</select>
                  </div>
                  <div className="fg"><label>Observación</label><input {...F("obs")}/></div>
                  <div className="fg full">
                    <label>Observaciones Seguimiento</label>
                    <textarea {...F("observacionSeguimiento")} rows={2} style={{resize:"vertical"}}/>
                  </div>
                  <div className="fg full" style={{background:"rgba(239,68,68,.05)",border:"1px solid rgba(239,68,68,.2)",borderRadius:6,padding:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                      <label style={{color:"var(--rd)",margin:0}}>🚫 BLOQUEO</label>
                      <input type="checkbox" checked={form.bloqueado||false} onChange={e=>setForm(f=>({...f,bloqueado:e.target.checked}))} style={{width:"auto"}}/>
                      <span style={{fontSize:11,color:"var(--mu)"}}>Bloquear acceso a servicios</span>
                    </div>
                    {form.bloqueado&&<div className="fg" style={{margin:0}}>
                      <label>Motivo del Bloqueo</label>
                      <textarea {...F("motivoBloqueo")} rows={2} placeholder="Ej: Evaluación psicológica no recomendable, conducta inapropiada..." style={{resize:"vertical"}}/>
                    </div>}
                  </div>
                  <div className="fsec">Habilitación</div>
                  <div className="fg"><label>Estado Examen</label>
                    <select {...F("estadoExamen")}><option value="">—</option>{EXAMENES.map(o=><option key={o}>{o}</option>)}</select>
                  </div>
                  <div className="fg"><label>Eval. Psicológica</label>
                    <select {...F("evalPsicologica")}><option value="">—</option>{["APTO","RECOMENDABLE","RECOMENDABLE CON OBSERVACION","RECOM. CON OBSERVACION","NO RECOMENDABLE","PENDIENTE"].map(o=><option key={o}>{o}</option>)}</select>
                  </div>
                  <div className="fg"><label>Estado Habilitado</label>
                    <select {...F("estadoHabilitado")}><option value="">—</option><option>HABILITADO PARA SUBIR</option><option>EN REVISIÓN</option><option>NO HABILITADO</option></select>
                  </div>
                  <div className="fg"><label>Tipo Servicio</label>
                    <select {...F("tipoServicio")}><option value="">Sin asignar</option>{SERVICIOS.map(s=><option key={s}>{s}</option>)}</select>
                  </div>
                  <div className="fsec">Datos Bancarios</div>
                  <div className="fg"><label>Banco</label><input {...F("banco")}/></div>
                  <div className="fg"><label>Tipo Cuenta</label>
                    <select {...F("tipoCuenta")}><option value="">—</option>{["CUENTA RUT","CUENTA CORRIENTE","CUENTA VISTA","CHEQUERA ELECTRÓNICA"].map(o=><option key={o}>{o}</option>)}</select>
                  </div>
                  <div className="fg"><label>N° Cuenta</label><input {...F("numeroCuenta")}/></div>
                  <div className="fsec">Certificados y Cursos</div>
                  <div className="fg"><label>Cert. Antecedentes</label>
                    <select {...F("certificadoAntecedentes")}><option value="NO ESTA">NO ESTA</option><option value="OK">OK</option><option value="VENCIDO">VENCIDO</option><option value="PENDIENTE">PENDIENTE</option></select>
                  </div>
                  <div className="fg"><label>Primeros Auxilios</label>
                    <select {...F("primerosAuxilios")}><option value="NO ESTA">NO ESTA</option><option value="OK">OK</option><option value="VENCIDO">VENCIDO</option><option value="PENDIENTE">PENDIENTE</option><option value="AGENDADO">AGENDADO</option></select>
                  </div>
                  <div className="fg"><label>Manejo Extintores</label>
                    <select {...F("manejoExtintores")}><option value="NO ESTA">NO ESTA</option><option value="OK">OK</option><option value="VENCIDO">VENCIDO</option><option value="PENDIENTE">PENDIENTE</option><option value="AGENDADO">AGENDADO</option></select>
                  </div>
                  <div className="fg"><label>Energía Potenciales</label>
                    <select {...F("energiaPotenciales")}><option value="NO ESTA">NO ESTA</option><option value="OK">OK</option><option value="VENCIDO">VENCIDO</option><option value="PENDIENTE">PENDIENTE</option><option value="AGENDADO">AGENDADO</option></select>
                  </div>
                  <div className="fsec">Inducciones</div>
                  {INDUCTIONES.map(ind=>(
                    <div className="fg" key={ind}>
                      <label>Inducción {ind}</label>
                      <select {...F(`inductiones.${ind}`)}><option value="NO ESTA">NO ESTA</option><option value="OK">OK</option><option value="VENCIDO">VENCIDO</option><option value="PENDIENTE">PENDIENTE</option></select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mftr">
                {modal==="edit"&&<button className="btn btn-d" onClick={()=>handleDelete(form.id)}>Eliminar</button>}
                <button className="btn btn-s" onClick={()=>setModal(null)}>Cancelar</button>
                <button className="btn btn-p" onClick={handleSave}>Guardar</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal Detail ── */}
        {modal==="detail"&&selected&&(()=>{
          const w=selected;
          return(
            <div className="ov" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
              <div className="modal">
                <div className="mhdr">
                  <div>
                    <div className="mtit">{w.nombre}</div>
                    <div style={{fontSize:11,color:"var(--mu)",marginTop:2}}>{w.rut} · {w.ciudad} · {w.especialidad}</div>
                  </div>
                  <button className="mcls" onClick={()=>setModal(null)}>×</button>
                </div>
                <div className="mbdy">
                  {w.bloqueado&&<div className="banner ban-rd" style={{background:"#fee2e2",borderColor:"#fca5a5",color:"#991b1b"}}>🚫 TRABAJADOR BLOQUEADO{w.motivoBloqueo?` — ${w.motivoBloqueo}`:""}</div>}
                  {(()=>{
                    const req=checkRequisitos(w);
                    return(
                      <div style={{background:req.cumple?"#f0fdf4":"#fff7ed",border:`1px solid ${req.cumple?"#86efac":"#fed7aa"}`,borderRadius:6,padding:"10px 14px",marginBottom:12}}>
                        <div style={{fontWeight:700,fontSize:12,color:req.cumple?"#15803d":"#c2410c",marginBottom:8}}>
                          {req.cumple?"✅ CUMPLE REQUISITOS MÍNIMOS — APTO PARA SERVICIO":"⚠️ NO CUMPLE TODOS LOS REQUISITOS MÍNIMOS"}
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                          {req.items.map((r,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:11}}>
                              <span style={{width:16,height:16,borderRadius:"50%",background:r.ok?"#dcfce7":"#fee2e2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:r.ok?"#15803d":"#dc2626",flexShrink:0}}>{r.ok?"✓":"✗"}</span>
                              <span style={{color:"#374151",fontWeight:500}}>{r.label}:</span>
                              <span style={{color:r.ok?"#15803d":"#dc2626",fontWeight:600}}>{r.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  {w._enDescanso&&<div className="banner ban-rd">🛌 EN DESCANSO — {w._descanso?.dias} días restantes · Servicio: {w._descanso?.servicio}</div>}
                  {!w._enDescanso&&w._pendDescanso&&<div className="banner ban-pu">⏳ SERVICIO EN CURSO — pendiente completar descanso al finalizar</div>}
                  {w.observacionSeguimiento&&<div className="banner" style={{background:"rgba(59,130,246,.08)",border:"1px solid rgba(59,130,246,.25)",color:"#93c5fd"}}>📝 {w.observacionSeguimiento}</div>}
                  <div className="dsec">
                    <div className="dsec-t">Estado</div>
                    <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:8}}>
                      {habBadge(w)}{estadoBadge(w.estadoExamen)}
                      {w.tipoServicio&&servTag(w.tipoServicio)}
                      {w.obs&&<span className="badge yw">{w.obs}</span>}
                      {w.registroDuplicado==="DUPLICADO RUT"&&<span className="badge or">DUPLICADO RUT</span>}
                    </div>
                    {w.motivoAccion&&<div style={{fontSize:11,color:"var(--acc)",background:"rgba(249,115,22,.07)",border:"1px solid rgba(249,115,22,.2)",borderRadius:5,padding:"6px 10px",marginBottom:8}}>📌 {w.motivoAccion}</div>}
                    {(()=>{
                      const req=checkRequisitos(w);
                      return(
                        <div style={{background:req.cumple?"#f0fdf4":"#fef9c3",border:`1px solid ${req.cumple?"#86efac":"#fde047"}`,borderRadius:6,padding:"10px 12px"}}>
                          <div style={{fontSize:11,fontWeight:700,marginBottom:8,color:req.cumple?"#15803d":"#854d0e",letterSpacing:.5}}>
                            {req.cumple?"✅ CUMPLE TODOS LOS REQUISITOS MÍNIMOS":"⚠️ REQUISITOS MÍNIMOS INCOMPLETOS"}
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px 16px"}}>
                            {req.items.map((r,i)=>(
                              <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:11}}>
                                <span style={{fontSize:13}}>{r.ok?"✅":"❌"}</span>
                                <span style={{fontWeight:600,color:"#1e293b"}}>{r.label}</span>
                                <span style={{color:r.ok?"#16a34a":"#dc2626",marginLeft:"auto",fontWeight:600,fontSize:10}}>{r.val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="dsec">
                    <div className="dsec-t">Datos Personales</div>
                    <div className="dgrid">
                      {[["Teléfono",w.telefono],["Correo",w.correo],["AFP",w.afp],["Salud",w.salud],["Nacionalidad",w.nacionalidad],["Estado Civil",w.estadoCivil],["Edad",w.edad],["Origen",w.origen],["Banco",w.banco],["Tipo Cuenta",w.tipoCuenta],["N° Cuenta",w.numeroCuenta],["F. Venc. Examen",w.fechaVencimientoExamen]].map(([k,v])=>(
                        <div key={k}><div className="dk">{k}</div><div className="dv">{v||"—"}</div></div>
                      ))}
                    </div>
                    {w.direccion&&<div style={{marginTop:7}}><div className="dk">Dirección</div><div className="dv">{w.direccion}</div></div>}
                  </div>
                  <div className="dsec">
                    <div className="dsec-t">Certificados y Cursos</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
                      {[["Cert. Antecedentes",w.certificadoAntecedentes],["Primeros Auxilios",w.primerosAuxilios],["Extintores",w.manejoExtintores],["Energía Pot.",w.energiaPotenciales]].map(([k,v])=>{
                        const ok=v==="OK"; const venc=v==="VENCIDO"; const pend=v==="PENDIENTE"||v==="AGENDADO";
                        return(<div className="iitem" key={k}><div className="iitem-l">{k}</div><span className={`badge ${ok?"gn":venc?"rd":pend?"yw":"bg"}`} style={{fontSize:9}}>{v||"FALTA"}</span></div>);
                      })}
                    </div>
                  </div>
                  <div className="dsec">
                    <div className="dsec-t">Inducciones</div>
                    <div className="itbl">
                      {INDUCTIONES.map(k=>{
                        const val=(w.inductiones?.[k]||"NO ESTA").toString().trim();
                        const ok=val==="OK"; const venc=val==="VENCIDO";
                        return(
                          <div className="iitem" key={k}>
                            <div className="iitem-l">{k.toUpperCase()}</div>
                            <span className={`badge ${ok?"gn":venc?"rd":"bg"}`} style={{fontSize:9}}>{ok?"OK ✓":venc?"VENCIDO":"FALTA"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="dsec">
                    <div className="dsec-t">Historial Servicios</div>
                    {(!w.historial||!w.historial.length)
                      ?<div style={{color:"var(--mu)",fontSize:12}}>Sin servicios registrados</div>
                      :w.historial.map((h,i)=>(
                        <div key={i} style={{background:"#f8fafc",border:"1px solid var(--bor)",borderRadius:6,padding:"9px 12px",marginBottom:7,fontSize:11}}>
                          <div style={{marginBottom:3}}>{servTag(h.tipoServicio)}</div>
                          <div style={{color:"var(--mu)"}}>Inicio: {h.fechaInicio} · Fin: {h.fechaFin||"En curso"} · Días: <b style={{color:"var(--tx)"}}>{h.diasTrabajados}</b></div>
                          {h.fechaFin&&<div style={{color:"var(--bl)",marginTop:3}}>Disponible desde: {(()=>{const d=new Date(h.fechaFin);d.setDate(d.getDate()+Number(h.diasTrabajados));return d.toISOString().split("T")[0];})()}</div>}
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div className="mftr">
                  {canEdit&&<button className="btn btn-s" onClick={()=>openSvc(w)}>+ Servicio</button>}
                  {canEdit&&<button className="btn btn-s" onClick={()=>{setModal(null);openEdit(w);}}>Editar</button>}
                  <button className="btn btn-s" onClick={()=>setModal(null)}>Cerrar</button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Modal Service ── */}
        {modal==="svc"&&selected&&(
          <div className="ov" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
            <div className="modal" style={{maxWidth:460}}>
              <div className="mhdr">
                <div className="mtit">Registrar Servicio</div>
                <button className="mcls" onClick={()=>setModal(null)}>×</button>
              </div>
              <div className="mbdy">
                <div style={{fontWeight:600,marginBottom:8,color:"var(--acc)"}}>{selected.nombre}</div>
              {(()=>{
                const req=checkRequisitos(selected);
                if(!req.cumple) return(
                  <div style={{background:"#fef9c3",border:"1px solid #fde047",borderRadius:6,padding:"8px 12px",marginBottom:12}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#854d0e",marginBottom:4}}>⚠️ Este trabajador NO cumple todos los requisitos mínimos:</div>
                    {req.items.filter(r=>!r.ok).map((r,i)=>(
                      <div key={i} style={{fontSize:11,color:"#dc2626"}}>❌ {r.label}: <b>{r.val}</b></div>
                    ))}
                  </div>
                );
                return <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:6,padding:"6px 12px",marginBottom:12,fontSize:11,color:"#15803d",fontWeight:600}}>✅ Cumple todos los requisitos mínimos</div>;
              })()}
                <div className="fgrid">
                  <div className="fg full"><label>Tipo de Servicio</label>
                    <select value={svcForm.tipoServicio} onChange={e=>setSvcForm(f=>({...f,tipoServicio:e.target.value}))}>
                      <option value="">— Seleccionar —</option>{SERVICIOS.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="fg"><label>Fecha Inicio</label><input type="date" value={svcForm.fechaInicio} onChange={e=>{
                    const fi=e.target.value;
                    setSvcForm(f=>{
                      const dias=f.fechaFin&&fi?Math.max(0,Math.ceil((new Date(f.fechaFin)-new Date(fi))/(864e5))):f.diasTrabajados;
                      return{...f,fechaInicio:fi,diasTrabajados:dias};
                    });
                  }}/></div>
                  <div className="fg"><label>Fecha Fin</label><input type="date" value={svcForm.fechaFin} onChange={e=>{
                    const ff=e.target.value;
                    setSvcForm(f=>{
                      const dias=f.fechaInicio&&ff?Math.max(0,Math.ceil((new Date(ff)-new Date(f.fechaInicio))/(864e5))):f.diasTrabajados;
                      return{...f,fechaFin:ff,diasTrabajados:dias};
                    });
                  }}/></div>
                  <div className="fg full"><label>Días Trabajados <span style={{fontSize:10,color:"var(--acc)"}}>(calculado automático)</span></label>
                    <input type="number" min={0} value={svcForm.diasTrabajados} onChange={e=>setSvcForm(f=>({...f,diasTrabajados:e.target.value}))} style={{background:"rgba(249,115,22,.05)"}}/>
                  </div>
                </div>
                <div style={{background:"#f8fafc",border:"1px solid var(--bor)",borderRadius:6,padding:12,marginTop:10}}>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:1,color:"var(--acc)",marginBottom:5}}>REGLA · 1 día libre por día trabajado</div>
                  <div style={{fontSize:11,color:"var(--mu)"}}>
                    {svcForm.diasTrabajados>0&&svcForm.fechaFin
                      ?<span style={{color:"var(--bl)"}}>Disponible desde: {(()=>{const d=new Date(svcForm.fechaFin);d.setDate(d.getDate()+Number(svcForm.diasTrabajados));return d.toISOString().split("T")[0];})()}</span>
                      :"Ingresa fecha fin y días para calcular disponibilidad."}
                  </div>
                </div>
              </div>
              <div className="mftr">
                <button className="btn btn-s" onClick={()=>setModal(null)}>Cancelar</button>
                <button className="btn btn-p" onClick={handleSvc}>Registrar</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Toasts ── */}
        {/* ── Modal Bulk Service ── */}
        {bulkSvcModal&&canEdit&&(
          <div className="ov" onClick={e=>e.target===e.currentTarget&&setBulkSvcModal(false)}>
            <div className="modal" style={{maxWidth:460}}>
              <div className="mhdr">
                <div className="mtit">📅 Asignar Servicio Masivo</div>
                <button className="mcls" onClick={()=>setBulkSvcModal(false)}>×</button>
              </div>
              <div className="mbdy">
                <div style={{background:"rgba(249,115,22,.08)",border:"1px solid rgba(249,115,22,.2)",borderRadius:6,padding:"8px 12px",marginBottom:14,fontSize:12,color:"var(--acc)"}}>
                  Asignando a <b>{selected2.size}</b> trabajador{selected2.size!==1?"es":""}
                </div>
                <div className="fgrid">
                  <div className="fg full"><label>Tipo de Servicio</label>
                    <select value={bulkSvcForm.tipoServicio} onChange={e=>setBulkSvcForm(f=>({...f,tipoServicio:e.target.value}))}>
                      <option value="">— Seleccionar —</option>{SERVICIOS.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="fg"><label>Fecha Inicio</label><input type="date" value={bulkSvcForm.fechaInicio} onChange={e=>{
                    const fi=e.target.value;
                    setBulkSvcForm(f=>{
                      const dias=f.fechaFin&&fi?Math.max(0,Math.ceil((new Date(f.fechaFin)-new Date(fi))/(864e5))):f.diasTrabajados;
                      return{...f,fechaInicio:fi,diasTrabajados:dias};
                    });
                  }}/></div>
                  <div className="fg"><label>Fecha Fin</label><input type="date" value={bulkSvcForm.fechaFin} onChange={e=>{
                    const ff=e.target.value;
                    setBulkSvcForm(f=>{
                      const dias=f.fechaInicio&&ff?Math.max(0,Math.ceil((new Date(ff)-new Date(f.fechaInicio))/(864e5))):f.diasTrabajados;
                      return{...f,fechaFin:ff,diasTrabajados:dias};
                    });
                  }}/></div>
                  <div className="fg full"><label>Días Trabajados <span style={{fontSize:10,color:"var(--acc)"}}>(calculado automático)</span></label>
                    <input type="number" min={0} value={bulkSvcForm.diasTrabajados} onChange={e=>setBulkSvcForm(f=>({...f,diasTrabajados:e.target.value}))} style={{background:"rgba(249,115,22,.05)"}}/>
                  </div>
                </div>
                <div style={{background:"#f8fafc",border:"1px solid var(--bor)",borderRadius:6,padding:10,marginTop:8,fontSize:11,color:"var(--mu)"}}>
                  <span style={{color:"var(--acc)",fontWeight:700,fontSize:10,letterSpacing:1}}>REGLA · </span>
                  {bulkSvcForm.diasTrabajados>0&&bulkSvcForm.fechaFin
                    ?<span style={{color:"var(--bl)"}}>Disponible desde: {(()=>{const d=new Date(bulkSvcForm.fechaFin);d.setDate(d.getDate()+Number(bulkSvcForm.diasTrabajados));return d.toISOString().split("T")[0];})()}</span>
                    :"1 día libre por día trabajado"}
                </div>
              </div>
              <div className="mftr">
                <button className="btn btn-s" onClick={()=>setBulkSvcModal(false)}>Cancelar</button>
                <button className="btn btn-p" onClick={handleBulkSvc}>Asignar a {selected2.size} trabajadores</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Mobile bottom nav ── */}
        <nav className="mobile-nav">
          {[
            {id:"workers",  icon:"👷", label:"PERSONAL"},
            {id:"habilitados",icon:"✅",label:"HAB."},
            {id:"pendiente",icon:"⏳", label:"PEND."},
            {id:"vencidos",  icon:"⚠️", label:"EXÁM."},
            {id:"bloqueados",icon:"🚫", label:"BLOQ."},
            {id:"dashboard", icon:"📊", label:"DASH."},
            {id:"servicios", icon:"🗂️", label:"SERV."},
            ...(canAdmin?[{id:"audit",icon:"📋",label:"LOG"}]:[]),
          ].map(n=>(
            <div key={n.id} className={`mnav-item${view===n.id?" act":""}`} onClick={()=>setView(n.id)}>
              <span>{n.icon}</span><span>{n.label}</span>
            </div>
          ))}
        </nav>

        <div className="toasts">
          {toasts.map(t=><div key={t.id} className={`tst ${t.type==="error"?"t-err":"t-ok"}`}>{t.type==="error"?"❌":"✅"} {t.msg}</div>)}
        </div>

      </div>
    </>
  );
}
