import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useState } from "react";
import revisarCorreoImg from '../imagenes/revisar-correo.jpg'

export default function PaginaCorreoNoVerificado() {
  const location = useLocation();
  const naigate = useNavigate();
  const correo_electronico = location.state?.correo_electronico || "";

  const handleReenviar = async () => {
    try {
      const respuesta_back = await api.post("/oncologo/reenviar-verificacion", { correo_electronico });
      alert(respuesta_back.data.msg);
      naigate("/")
    } catch (err) {
      alert(err.response?.data?.detail);
    }
  };

  return (
    <div className="d-flex flex-column vh-100">


      {/*Header */}
      <header className="w-100 bg-primary text-white py-3 text-center" style={{ flex: "0 0 60px" }}>
        <h1>SR-DTCM</h1>
      </header>


      {/*Contenido de la pagina */}
      <div className="row flex-grow-1 justify-content-center align-items-center">
        <div className="card p-5 shadow w-100" style={{ maxWidth: "600px", width: "100%" }} id="contenedor-form-login">
          <label className="text-center mb-4" id="titulo-login">¡Su correo no esta verificado!</label>
          <img className="mb-5"
            src={revisarCorreoImg}
            alt="Imagen revisar correo"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <div className="d-flex justify-content-center align-items-center">
            <button type="submit" id="btn-reenviar-verificacion" className="btn btn-primary w-100" onClick={handleReenviar}>Reenviar</button>
          </div>
          <p className="text-center mt-3">
            Da clic en el  botón para reenviar correo para verificar tu cuenta. {" "}
          </p>
        </div>
      </div>
    </div>
  );
}
