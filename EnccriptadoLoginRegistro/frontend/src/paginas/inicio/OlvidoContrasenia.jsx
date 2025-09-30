import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import olvidoContraseniaImg from "../../imagenes/olvido-contrasenia.jpg"

export default function PaginaOlvidoContrasenia() {
    const [correo_electronico, setCorreoElectronico] = useState("");
    const navigate = useNavigate();

    const handleRestablecer = async (e) => {
        e.preventDefault();
        try {
            await api.post("/oncologo/olvido-contrasenia", { correo_electronico });
            alert("Si el correo existe, recibirás un enlace para restablecer tu contraseña.");
        } catch (error) {
            alert(error.response.data.detail || error);
        }
    };

    return (
        <div className="container-fluid row contenedor-prinipal d-flex justify-content-center align-items-center">

            {/*Contenedor central */}
            <div className="card col-12 col-md-3 shadow-lg d-flex flex-column justify-content-between ">
                <div className="text-center">
                    <img
                        src={olvidoContraseniaImg}
                        alt="Olvido contrasenia"
                        className="img-fluid mt-4"
                        style={{ maxWidth: "50%" }}
                    />
                    <h1 className=" texto-azul m-5">¿Tienes problemas para iniciar sesión?</h1>
                    <p className=" texto-negro px-5"><h3>Introduce tu correo electrónico y te enviaremos un enlace para restaurar tu contraseña.</h3></p>
                </div>
                <form onSubmit={handleRestablecer} className="px-5">
                    <div className="mt-5">
                        <label className="form-label texto-negro"><h5>Correo</h5></label>
                        <input
                            type="email"
                            className="form-control placeholder-opacity-max"
                            value={correo_electronico}
                            onChange={(e) => setCorreoElectronico(e.target.value)}
                            placeholder="Ingrese correo"
                        />
                    </div>

                    <div className="text-center my-4">
                        <button type="submit" className="btn boton-azul">Enviar enlace</button>
                    </div>
                </form>



                <div className="m-5">
                    <p className="text-center">
                        <span className="link-primary texto-azul" style={{ cursor: "pointer" }} onClick={() => navigate("/registro-oncologo")}>
                            Crear cuenta nueva
                        </span>
                    </p>
                    <div className="d-flex align-items-center justify-content-center my-2">
                        <hr className="flex-grow-1" />
                        <span className="mx-2 texto-negro">o</span>
                        <hr className="flex-grow-1" />
                    </div>
                    <p className="text-center">
                        <span className="link-primary texto-azul" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
                            Volver inicio de sesión
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )

}