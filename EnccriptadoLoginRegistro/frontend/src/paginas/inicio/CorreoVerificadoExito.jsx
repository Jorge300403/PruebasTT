import { useNavigate } from "react-router-dom";
import correoVerificadoImg from '../../imagenes/correo-verificado.jpg'

export default function PaginaCorreoVerificadoExito() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className="container-fluid row contenedor-prinipal d-flex justify-content-center align-items-center">

      {/*Contenedor central */}
      <div className="card col-12 col-md-3 shadow-lg d-flex flex-column justify-content-between ">

        <div className="text-center">
          <img
            src={correoVerificadoImg}
            className="img-fluid mt-4"
            style={{ maxWidth: "50%" }}
          />
          <h1 className=" texto-azul m-5">¡Su correo ya ha sido verificado!</h1>
          <p className=" texto-negro px-5 fs-4">Da clic en el  botón para regresar al incio de sesión.</p>
        </div>


        <div className="text-center my-4">
          <button type="submit" className="btn boton-azul fs-5" onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>
    </div>
  );
}
