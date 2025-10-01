import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import revisarCorreoImg from '../../imagenes/revisar-correo.jpg'
import Swal from "sweetalert2";

export default function PaginaCorreoNoVerificado() {
  const location = useLocation();
  const navigate = useNavigate();
  const correo_electronico = location.state?.correo_electronico || "";

  const handleReenviar = async () => {
    try {
      const respuesta_back = await api.post("/oncologo/reenviar-verificacion", { correo_electronico });
      Swal.fire({
        title: respuesta_back.data.msg,
        icon: "success",
        confirmButtonText: "Aceptar",
        customClass: {
          title: "texto-azul",
          confirmButton: "btn-lg boton-verde"
        }
      }).then(() => {
        navigate("/login")
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.detail || "Ocurrió un error inesperado",
        icon: "error",
        confirmButtonColor: "#B3261E"
      });
    }
  };

  return (
    <div className="container-fluid row contenedor-prinipal d-flex justify-content-center align-items-center">

      {/*Contenedor central */}
      <div className="card col-12 col-md-3 shadow-lg d-flex flex-column justify-content-between ">

        <div className="text-center">
          <img
            src={revisarCorreoImg}
            alt="Imagen revisar correo"
            className="img-fluid mt-4"
            style={{ maxWidth: "50%" }}
          />
          <h1 className=" texto-azul m-5">¡Su correo no esta verificado!</h1>
          <p className=" texto-negro px-5 fs-4">Da clic en el  botón para reenviar enlace para verificar tu cuenta.</p>
        </div>

        <div className="text-center my-4">
          <button type="submit" className="btn boton-azul fs-5" onClick={handleReenviar}>Enviar enlace</button>
          <div className="d-flex align-items-center justify-content-center my-2 mx-5">
            <hr className="flex-grow-1" />
            <span className="mx-2 texto-negro">o</span>
            <hr className="flex-grow-1" />
          </div>
          <p className="text-center fs-5">
            <span className="link-primary texto-azul" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
              Volver inicio de sesión
            </span>
          </p>
        </div>


      </div>
    </div >
  );
}
