import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function PaginaRestablecerContrasenia({ }) {
    const [contrasenia, setContrasenia] = useState("");
    const [confirmarContrasenia, setConfirmarContrasenia] = useState("");    
    const location = useLocation();
    const token = new URLSearchParams(location.search).get("token");    
    const [errores, setErrores] = useState({});
    const navigate = useNavigate();

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
            alert("Por favor corrige los errores antes de enviar.");
            return;
        }
        try {
            await api.post("/oncologo/restablecer-contrasenia", { token, contrasenia });
            alert("Contraseña restablecida correctamente");
            navigate("/");
        } catch (err) {
            console.error(err); // Para depuración
            alert(err.response?.data?.detail || "Error desconocido"); // Fallback
        }
    };

    return (
        <div className="d-flex flex-column vh-100">
            {/* Header fijo */}
            <header className="w-100 bg-primary text-white py-3 text-center" style={{ flex: "0 0 60px" }}>
                <h1>SR-DTCM</h1>
            </header>

            <div className="row flex-grow-1 justify-content-center align-items-center">
                <div className="card p-5 shadow w-100" style={{ maxWidth: "400px", width: "100%" }} id="contenedor-form-login">
                    <label className="text-center mb-4" id="titulo-login">Restablecer contraseña</label>
                    <form onSubmit={handleRestablecer}>
                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className={`form-control ${errores.contrasenia ? "is-invalid" : ""}`}
                                value={contrasenia}
                                onChange={(e) => {
                                    setContrasenia(e.target.value);
                                    mensajesVerificacion("contrasenia", e.target.value);
                                }}
                                placeholder="Ingresa contraseña"
                            />
                            {errores.contrasenia && <div className="invalid-feedback">{errores.contrasenia}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Confirmar Contraseña</label>
                            <input
                                type="password"
                                className={`form-control ${errores.confirmarContrasenia ? "is-invalid" : ""}`}
                                value={confirmarContrasenia}
                                onChange={(e) => {
                                    setConfirmarContrasenia(e.target.value);
                                    mensajesVerificacion("confirmarContrasenia", e.target.value);
                                }}
                                placeholder="Confirma tu contraseña"
                            />
                            {errores.confirmarContrasenia && <div className="invalid-feedback">{errores.confirmarContrasenia}</div>}
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Restablecer</button>
                    </form>
                    <p className="text-center mt-3">
                        <span className="link-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                            Regresar Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )

}