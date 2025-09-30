import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import loginImage from "../../imagenes/cancer-mama-login.jpg";

export default function PaginaLogin({ }) {
    //Definimos las variales que vamos a ocupoar en el formualrio
    const [correo_electronico, setCorreoElectronico] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const navigate = useNavigate();


    //Definimos la funcion principal
    const handleLogin = async (e) => {
        e.preventDefault();
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
                alert(error.response.data.detail);
            } else {
                alert("Error de conexión con el servidor");
            }
        }
    };

    return (
        <div className="container-fluid row contenedor-prinipal">

            {/* Izquierda: Formulario */}
            <div className="col-12 col-md-6 contenedor-form-inicio d-flex justify-content-center align-items-center">
                <div className="card col-md-4 col-12 shadow-lg d-flex flex-column justify-content-between" id="card-login">
                    <h1 className="text-center texto-azul m-5">¡Bienvenido!</h1>
                    <form onSubmit={handleLogin} className="px-5">
                        <div className="mt-4">
                            <label className="form-label texto-negro"><h5>Correo</h5></label>
                            <input
                                type="email"
                                className="form-control placeholder-opacity-max"
                                value={correo_electronico}
                                onChange={(e) => setCorreoElectronico(e.target.value)}
                                placeholder="Ingrese correo"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="form-label texto-negro"><h5>Contraseña</h5></label>
                            <input
                                type="password"
                                className="form-control"
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
                        <p className="text-center mt-3 texto-negro">
                            ¿Olvidaste tu contraseña? {" "}
                            <span className="link-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/olvido-contrasenia")}>
                                Restablecer
                            </span>
                        </p>
                        <p className="text-center mt-3 texto-negro">
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
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>
        </div >
    );
}
