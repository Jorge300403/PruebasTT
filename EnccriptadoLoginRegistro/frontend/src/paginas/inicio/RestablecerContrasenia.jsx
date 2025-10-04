import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import restablecerContraseniaImg from "../../imagenes/restablecer-conrasenia.jpg"
import revisarCorreoImg from "../../imagenes/revisar-correo.jpg"
import actualizadoImg   from "../../imagenes/actualizado.jpg"
import Swal from "sweetalert2";

export default function PaginaRestablecerContrasenia({ }) {
    //Definimos los parametros que debe de ingresar
    const [contrasenia, setContrasenia] = useState("");
    const [confirmarContrasenia, setConfirmarContrasenia] = useState("");

    //Definimos variables para mostrar o no la contrasenia
    const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    //Definimos el location
    const location = useLocation();

    //Definimos en donde se encuentra el token
    const token = new URLSearchParams(location.search).get("token");
    
    //Definimeos la lista de los errores
    const [errores, setErrores] = useState({});

    //Definimos el navigate par poder movernos de paginas
    const navigate = useNavigate();

    //Definimos la expresion regular de la ocntraseña
    const regex = {
        contrasenia: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.\-_])[A-Za-z\d!@#$%^&*.\-_]{8,}$/,
    };

    const mensajesVerificacion = (name, value) => {
        let message = "";
        switch (name) {
            case "contrasenia":
                if (!regex.contrasenia.test(value)) message = "Mínimo 8 caracteres, una mayúscula, un número y un símbolo.";
                break;
            case "confirmarContrasenia":
                if (value !== contrasenia) message = "Las contraseñas no coinciden.";
                break;
            default:
                break;
        }
        setErrores((prev) => ({ ...prev, [name]: message }));
    };

    const validarErrores = () => {
        return (
            contrasenia &&
            confirmarContrasenia &&
            !Object.values(errores).some((err) => err !== "")
        );
    };

    const handleRestablecer = async (e) => {
        e.preventDefault();
        if (!validarErrores()) {
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
                title: "Por favor corrige los errores antes de enviar.",
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
            await api.post("/oncologo/restablecer-contrasenia", { token, contrasenia });
            Swal.fire({
                imageUrl: actualizadoImg,
                title: "!Actualizada!",
                text: "Su contraseña ha sido cambiada exitosamente.",
                confirmButtonText: "Aceptar",
                customClass: {
                    image: "imagen-swal",
                    title: "texto-azul",
                    timerProgressBar: "barra-progreso-azul",
                    confirmButton: "btn-lg boton-azul"
                }
            }).then(() => {
                navigate("/login")
            });
        } catch (err) {
            console.error(err); // Para depuración
            alert(err.response?.data?.detail || "Error desconocido"); // Fallback
        }
    };

    return (
        <div className="container-fluid row contenedor-prinipal d-flex justify-content-center align-items-center">

            {/*Contenedor central */}
            <div className="card col-12 col-md-3 shadow-lg d-flex flex-column justify-content-between ">
                <div className="text-center">
                    <img
                        src={restablecerContraseniaImg}
                        alt="Olvido contrasenia"
                        className="img-fluid mt-4"
                        style={{ maxWidth: "50%" }}
                    />
                    <h1 className=" texto-azul m-5">Restablecer contraseña</h1>
                </div>
                <form onSubmit={handleRestablecer} className="px-5">
                    <div className="mb-3">
                        <label className="form-label fs-5 texto-negro">Contraseña</label>
                        <div className="input-group">
                            <input
                                type={mostrarContrasenia ? "text" : "password"}
                                className={`form-control fs-5 texto-negro ${errores.contrasenia ? "is-invalid" : ""}`}
                                value={contrasenia}
                                onChange={(e) => {
                                    setContrasenia(e.target.value);
                                    mensajesVerificacion("contrasenia", e.target.value);
                                }}
                                placeholder="Ingresa contraseña"
                            />
                            <button
                                type="button"
                                className="btn"
                                onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
                            >
                                {mostrarContrasenia ? <i class="bi bi-eye-slash"></i> : <i class="bi bi-eye"></i>}
                            </button>
                            {errores.contrasenia && <div className="invalid-feedback">{errores.contrasenia}</div>}
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fs-5 texto-negro">Confirmar Contraseña</label>
                        <div className="input-group">
                            <input
                                type={mostrarConfirmacion ? "text" : "password"}
                                className={`form-control fs-5 texto-negro ${errores.confirmarContrasenia ? "is-invalid fs-5 texto-negro" : ""}`}
                                value={confirmarContrasenia}
                                onChange={(e) => {
                                    setConfirmarContrasenia(e.target.value);
                                    mensajesVerificacion("confirmarContrasenia", e.target.value);
                                }}
                                placeholder="Confirma tu contraseña"
                            />
                            <button
                                type="button"
                                className="btn"
                                onClick={() => setMostrarConfirmacion(!mostrarConfirmacion)}
                            >
                                {mostrarConfirmacion ? <i class="bi bi-eye-slash"></i> : <i class="bi bi-eye"></i>}
                            </button>
                            {errores.confirmarContrasenia && <div className="invalid-feedback">{errores.confirmarContrasenia}</div>}
                        </div>
                    </div>
                    <div className="text-center my-4">
                        <button type="submit" className="btn boton-verde fs-5" disabled={!validarErrores()}>Actualizar contraseña</button>
                    </div>
                </form>

                <div className="m-5">
                    <p className="text-center fs-5">
                        <span className="link-primary texto-azul" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                            Volver inicio de sesión
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )

}