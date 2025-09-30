import { useNavigate } from "react-router-dom";
import correoVerificadoImg from '../../imagenes/correo-verificado.jpg'

export default function PaginaCorreoVerificadoExito() {
  const navigate = useNavigate();  

  const handleLogin = () => {
    navigate("/");  
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <header className="w-100 bg-primary text-white py-3 text-center" style={{ flex: "0 0 60px" }}>
        <h1>SR-DTCM</h1>
      </header>

      {/* Contenido de la página */}
      <div className="row flex-grow-1 justify-content-center align-items-center">
        <div className="card p-5 shadow w-100" style={{ maxWidth: "600px", width: "100%" }} id="contenedor-form-login">
          <label className="text-center mb-4" id="titulo-login">¡Su correo ya ha sido verificado!</label>
          <img
            className="mb-5"
            src={correoVerificadoImg}
            alt="Imagen correo verificado"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <div className="d-flex justify-content-center align-items-center">
            <button
              type="button"
              id="btn-regresar-login"
              className="btn btn-primary w-100"
              onClick={handleLogin}
            >
              Regresar al Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
