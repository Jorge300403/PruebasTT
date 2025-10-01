import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import timepoExpiradoImg from '../../imagenes/tiempo-expirado.jpg'
import Swal from "sweetalert2";
import revisarCorreoImg from "../../imagenes/revisar-correo.jpg"

export default function PaginaTokenCorreoExpirado() {
    const navigate = useNavigate();
    const [correo_electronico, setCorreoElectronico] = useState("");

    const handleReenviar = async (e) => {
        e.preventDefault();

        if (correo_electronico == "") {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                iconColor: "#FFFFFF",
                title: "No dejes campos vacíos",
                width: "100%",
                background: "#B3261E",
                customClass: {
                    popup: "toast-grid",
                    title: "texto-blanco fs-3",
                    timerProgressBar: "barra-progreso-blanca"
                },
            });
            return;
        }

        try {
            const respuesta_back = await api.post("/oncologo/reenviar-verificacion", { correo_electronico });
            Swal.fire({
                imageUrl: revisarCorreoImg,
                title: "¡Enviado!",
                text: respuesta_back.data.msg,
                confirmButtonText: "Aceptar",
                customClass: {
                    image: "imagen-swal",
                    title: "texto-azul",
                    text: "texto-azul",
                    confirmButton: "btn-lg boton-azul"
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
                        src={timepoExpiradoImg}
                        alt="Imagen tiempo expirado"
                        className="img-fluid mt-4"
                        style={{ maxWidth: "50%" }}
                    />

                    <h1 className=" texto-azul m-5">¡Lo sentimos! <br />Este token ya no es valido.</h1>
                    <p className=" texto-negro px-5 fs-4">Introduce tu correo electrónico y te enviaremos un enlace para  tu autentificar tu cuenta.</p>

                </div>


                <form onSubmit={handleReenviar} className="px-5">
                    <div className="mt-5">
                        <label className="form-label texto-negro fs-5">Correo</label>
                        <input
                            type="email"
                            className="form-control placeholder-opacity-max fs-5 texto-negro"
                            value={correo_electronico}
                            onChange={(e) => setCorreoElectronico(e.target.value)}
                            placeholder="Ingrese correo"
                        />
                    </div>

                    <div className="text-center my-4">
                        <button type="submit" className="btn boton-azul fs-5">Enviar enlace</button>
                    </div>
                </form>

                <div className="text-center my-4">
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
                </div>F
            </div>
        </div>
    );
}
