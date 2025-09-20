import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import loginImage from "../imagenes/cancer-mama-login.jpg";

export default function PaginaLogin({moverseRegistro} ) {
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

            //Si esta correcto entonces navegamos a la pagina principal o el board
            navigate("/oncologo/lista-pacientes");
        } catch (error) {
            //Si no esta verificado entonces mandamos la pagina para verificar su correo
            if (error.response?.status === 403 && error.response?.data.detail === "Correo no verificado") {
                navigate("/correo-no-verificado", { state: { correo_electronico } });
            } else if(error.response) {
                alert(error.response.data.detail);
            } else {
                alert("Error de conexión con el servidor");
            }
        }
    };

    return (
        <div className="container-fluid d-flex">
            {/* Contenido principal */}
            <div className="row flex-grow-1">
                {/* Izquierda: Formulario */}
                <div className="col-md-6 d-flex justify-content-center align-items-center" style={{backgroundColor:"white"}}>
                    <div className="card p-5 shadow w-100" style={{ maxWidth: "400px", width: "100%" }} id="contenedor-form-login">
                        <label className="text-center mb-4" id="titulo-login">¡Bienvenido!</label>
                        <form onSubmit={handleLogin}>
                            <div className="mb-5">
                                <label className="form-label">Correo</label>
                                <input
                                    type="email"
                                    className="form-control placeholder-opacity-max"
                                    value={correo_electronico}
                                    onChange={(e) => setCorreoElectronico(e.target.value)}
                                    placeholder="Ingrese correo"
                                />
                            </div>
                            <div className="mb-5">
                                <label className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={contrasenia}
                                    onChange={(e) => setContrasenia(e.target.value)}
                                    placeholder="Ingrese contraseña"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Inicar sesión</button>
                        </form>
                        <p className="text-center mt-3">
                            ¿Olvidaste tu contraseña? {" "}
                            <span className="link-primary" style={{cursor: "pointer"}} onClick={() => navigate("/olvido-contrasenia")}>
                                Restablecer
                            </span>
                        </p>
                        <p className="text-center mt-3">
                            ¿No tienes cuenta?{" "}
                            <span className="link-primary" style={{cursor: "pointer"}} onClick={moverseRegistro}>
                                Regístrate
                            </span>
                        </p>
                    </div>
                </div>

                {/* Derecha: Imagen */}
                <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
                    <img
                        src={loginImage} 
                        alt="Imagen login"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
            </div>
        </div>
    );
}
