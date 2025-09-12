import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

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
        <div className="d-flex flex-column vh-100">
            {/* Header fijo */}
            <header className="w-100 bg-primary text-white py-3 text-center" style={{ flex: "0 0 60px" }}>
                <h1>SR-DTCM</h1>
            </header>

            <div className="row flex-grow-1 justify-content-center align-items-center">
                <div className="card p-5 shadow w-100" style={{ maxWidth: "400px", width: "100%" }} id="contenedor-form-login">
                    <label className="text-center mb-4" id="titulo-login">Restablecer contraseña</label>
                    <form onSubmit={handleRestablecer}>
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