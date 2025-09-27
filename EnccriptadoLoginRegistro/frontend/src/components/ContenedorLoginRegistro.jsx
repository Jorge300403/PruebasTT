import { useState } from "react";
import PaginaLogin from "./Login";
import PaginaRegistroOncologo from "./RegistroOncologo";
import "../estilos/estilos-login-registro.css";

export default function PaginaSliderLoginRegistro() {
  const [isLogin, setIsLogin] = useState(true);

  const cambiarDeFormulario = () => setIsLogin(!isLogin);

  return (
    <div className="d-flex flex-column vh-100">
      {/* Header fijo */}
      <header className="w-100 bg-primary text-white py-3 text-center" id="header-oncologo" style={{ flex: "0 0 10vh" }}>
        <h1>SR-DTCM</h1>
      </header>

      {/* Contenedor de contenido */}
      <div
        className="flex-grow-1 d-flex justify-content-center align-items-center"
        style={{ overflowY: "auto", minHeight: 0 }}
      >
          {isLogin ? (
            <PaginaLogin moverseRegistro={cambiarDeFormulario} />
          ) : (
            <PaginaRegistroOncologo moverseLogin={cambiarDeFormulario} />
          )}
      </div>
    </div>
  );
}
