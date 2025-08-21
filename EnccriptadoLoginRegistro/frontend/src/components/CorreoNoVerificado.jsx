import { useLocation } from "react-router-dom";
import api from "../services/api";
import { useState } from "react";

export default function PaginaCorreoNoVerificado() {
  const location = useLocation();
  const correoInicial = location.state?.correo_electronico || "";
  const [correo, setCorreo] = useState(correoInicial);
  const [msg, setMsg] = useState("");

  const reenviar = async () => {
    try {
      await api.post("/oncologo/resend-verification", null, { params: { correo_electronico: correo } });
      setMsg("Te enviamos un nuevo correo de verificación.");
    } catch (e) {
      setMsg(e.response?.data?.detail || "No se pudo reenviar.");
    }
  };

  return (
    <div>
      <h2>Tu correo no está verificado</h2>
      <p>Revisa tu bandeja de entrada o solicita reenviar el correo.</p>
      <input value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="tu@correo.com" />
      <button onClick={reenviar}>Reenviar correo de verificación</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
