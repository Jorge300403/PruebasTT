import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import loginImage from "../../imagenes/cancer-mama-login.jpg";
import Swal from "sweetalert2";

export default function PaginaLogin({ }) {
    //Definimos las variales que vamos a ocupoar en el formualrio
    const [correo_electronico, setCorreoElectronico] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const navigate = useNavigate();


    //Definimos la funcion principal
    const handleLogin = async (e) => {
        e.preventDefault();
        if (correo_electronico == "" || contrasenia == "") {
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
                title: "Hay campos vacíos",
                background: "#B3261E",
                width: "100%",
                customClass: {
                    popup: "toast-grid",
                    title: "texto-blanco fs-3",
                    timerProgressBar: "barra-progreso-blanca"
                },
            });
            return;
        }
        try {
            //Hacemos la petición al back enviando las credenciales
            const respuesta_back = await api.post("/oncologo/login", { correo_electronico, contrasenia });

            //Obtenemos el token que regrese el back
            localStorage.setItem("token", respuesta_back.data.access_token);

            //Revisamos si es admin o oncólogo
            if (respuesta_back.data.tipo_usuario === 1) {
                // Es administrador
                navigate("/administrador/lista-oncologos");
            } else {
                // Es oncólogo
                navigate("/oncologo/lista-pacientes");
            }
        } catch (error) {
            //Si no esta verificado entonces mandamos la pagina para verificar su correo
            if (error.response?.status === 403 && error.response?.data.detail === "Correo no verificado") {
                navigate("/correo-no-verificado", { state: { correo_electronico } });
            } else if (error.response) {
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
                    title: error.response.data.detail,
                    background: "#B3261E",
                    width: "100%",
                    customClass: {
                        popup: "toast-grid",
                        title: "texto-blanco fs-3",
                        timerProgressBar: "barra-progreso-blanca"
                    },
                });
            } else {
                alert("Error de conexión con el servidor");
            }
        }
    };

    return (
        <div className="container-fluid row contenedor-prinipal" >

            {/* Izquierda: Formulario */}
            <div className="col-12 col-md-6 contenedor-form-inicio d-flex justify-content-center align-items-center">
                <div className="card col-md-4 col-12 shadow-lg d-flex flex-column justify-content-between" id="card-login">
                    <h1 className="text-center texto-azul m-5">¡Bienvenido!</h1>
                    <form onSubmit={handleLogin} className="px-5">
                        <div className="mt-4">
                            <label className="form-label texto-negro fs-5">Correo</label>
                            <input
                                type="email"
                                className="form-control placeholder-opacity-max fs-5 texto-negro"
                                value={correo_electronico}
                                onChange={(e) => setCorreoElectronico(e.target.value)}
                                placeholder="Ingrese correo"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="form-label texto-negro fs-5">Contraseña</label>
                            <input
                                type="password"
                                className="form-control fs-5 texto-negro"
                                value={contrasenia}
                                onChange={(e) => setContrasenia(e.target.value)}
                                placeholder="Ingrese contraseña"
                            />
                        </div>

                        <div className="text-center my-4">
                            <button type="submit" className="btn btn-lg mt-3 boton-verde">Inicar sesión</button>
                        </div>
                    </form>
                    <div className="m-5">
                        <p className="text-center mt-3 texto-negro fs-6">
                            ¿Olvidaste tu contraseña? {" "}
                            <span className="link-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/olvido-contrasenia")}>
                                Restablecer
                            </span>
                        </p>
                        <p className="text-center mt-3 texto-negro fs-6">
                            ¿No tienes cuenta?{" "}
                            <span className="link-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/registro-oncologo")}>
                                Regístrate
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Derecha: Imagen */}
            <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center contenedor-derecho-imagen-inicio ">
                <img
                    src={loginImage}
                    alt="Imagen login"
                    style={{
                        maxWidth: "100%",
                        maxHeight: "90vh",
                        objectFit: "cover",
                        borderRadius: "10px"
                    }}
                />

            </div>
        </div >
    );
}
