import api from "../services/api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Importa la imagen desde src
import registroImage from "../imagenes/cancer-mama-login.jpg";

export default function PaginaRegistroOncologo({moverseLogin}) {
    const [correo_electronico, setCorreoElectronico] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [institucion, setInstitucion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [errores, setErrores] = useState({});
    const navigate = useNavigate();

    const regex = {
        nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        apellido: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        contrasenia: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.\-_])[A-Za-z\d!@#$%^&*.\-_]{8,}$/,
        institucion: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        telefono: /^\d{10}$/,
    };

    const mensajesVerificacion = (name, value) => {
        let message = "";
        switch (name) {
            case "nombre":
                if (!regex.nombre.test(value)) message = "Solo letras, máximo 100 caracteres.";
                break;
            case "apellido":
                if (!regex.apellido.test(value)) message = "Solo letras, máximo 100 caracteres.";
                break;
            case "correo":
                if (!regex.correo.test(value)) message = "Formato de correo inválido.";
                break;
            case "contrasenia":
                if (!regex.contrasenia.test(value)) message = "Mínimo 8 caracteres, una mayúscula, un número y un símbolo.";
                break;
            case "confirmarContrasenia":
                if (value !== contrasenia) message = "Las contraseñas no coinciden.";
                break;
            case "institucion":
                if (!regex.institucion.test(value)) message = "Solo letras, máximo 100 caracteres.";
                break;
            case "telefono":
                if (!regex.telefono.test(value)) message = "El número debe de ser de 10 dígitos.";
                break;
            default:
                break;
        }
        setErrores((prev) => ({ ...prev, [name]: message }));
    };

    const validarErrores = () => {
        return (
            nombre &&
            apellido &&
            correo_electronico &&
            contrasenia &&
            confirmarContrasenia &&
            institucion &&
            telefono &&
            !Object.values(errores).some((err) => err !== "")
        );
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validarErrores()) {
            alert("Por favor corrige los errores antes de enviar.");
            return;
        }
        try {
            await api.post("/oncologo/register", {
                correo_electronico,
                contrasenia,
                nombre,
                apellido,
                institucion,
                telefono
            });
            alert("Oncólogo registrado correctamente");
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.detail || "Error al registrar");
        }
    };

    return (
        <div className="container-fluid d-flex">

            {/* Contenido principal */}
            <div className="row flex-grow-1">
                {/* Izquierda: Imagen */}
                <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
                    <img
                        src={registroImage}
                        alt="Registro"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>

                {/* Derecha: Formulario */}
                <div className="col-md-6 d-flex justify-content-center align-items-center bg-light">
                    <div className="card p-5 shadow w-100" style={{ maxWidth: "400px", width: "100%" }}>
                        <label className="text-center mb-4" id="titulo-login">¡Registrate!</label>
                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label className="form-label">Correo</label>
                                <input
                                    type="email"
                                    className={`form-control ${errores.correo ? "is-invalid" : ""}`}
                                    value={correo_electronico}
                                    onChange={(e) => {
                                    setCorreoElectronico(e.target.value);
                                    mensajesVerificacion("correo", e.target.value);
                                    }}
                                    placeholder="Ingresa correo"
                                />
                                {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                            </div>

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

                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input
                                    className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
                                    value={nombre}
                                    onChange={(e) => {
                                        setNombre(e.target.value);
                                        mensajesVerificacion("nombre", e.target.value);
                                    }}
                                    placeholder="Ingresa tu nombre"
                                />
                                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Apellido</label>
                                <input
                                    className={`form-control ${errores.apellido ? "is-invalid" : ""}`}
                                    value={apellido}
                                    onChange={(e) => {
                                        setApellido(e.target.value);
                                        mensajesVerificacion("apellido", e.target.value);
                                    }}
                                    placeholder="Ingresa tus apellidos"
                                />
                                {errores.apellido && <div className="invalid-feedback">{errores.apellido}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Institución</label>
                                <input
                                    className={`form-control ${errores.institucion ? "is-invalid" : ""}`}
                                    value={institucion}
                                    onChange={(e) => {
                                        setInstitucion(e.target.value);
                                        mensajesVerificacion("institucion", e.target.value);
                                    }}
                                    placeholder="Ingresa institución"
                                />
                                {errores.institucion && <div className="invalid-feedback">{errores.institucion}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Teléfono</label>
                                <input
                                    className={`form-control ${errores.telefono ? "is-invalid" : ""}`}
                                    value={telefono}
                                    onChange={(e) => {
                                        setTelefono(e.target.value);
                                        mensajesVerificacion("telefono", e.target.value);
                                    }}
                                    placeholder="Ingresa télefono"
                                />
                                {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
                            </div>

                            <button type="submit" className="btn btn-primary w-100" disabled={!validarErrores()}>
                                Registrar
                            </button>
                        </form>

                        <p className="text-center mt-3">
                            ¿Ya tienes cuenta?{" "}
                            <span className="link-primary" style={{cursor: "pointer"}} onClick={moverseLogin}>
                                Login
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
