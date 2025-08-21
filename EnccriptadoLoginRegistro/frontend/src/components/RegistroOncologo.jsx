import api from "../services/api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function PaginaRegistroOncologo() {
    const [correo_electronico, setCorreoElectronico] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [institucion, setInstitucion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [errores, setErrores] = useState({});
    const navigate = useNavigate();

    // Creamos las expresiones regualres para ir validando cada uno de los campos del formualrio
    const regex = {
        nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        apellido: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        contrasenia: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.\-_])[A-Za-z\d!@#$%^&*.\-_]{8,}$/,
        institucion: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/,
        telefono: /^\d{10}$/,
    };

    // Hacemo función para verificar cuando el campo se esta editando, lo hacemos en tiempo real
    // Cada que escribe borramos el mensaje y si no cumple con la expresión regular, entonces le mandamos un mensaje
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
                if(!regex.institucion.test(value)) message = "Solo letras, máximo 100 caractres";
                break;
            case "telefono":
                if (!regex.telefono.test(value)) message = "El número debe de ser de 10 dígitos.";
                break;
            default:
                break;
        }
        // Actualozamos la lista de errores, sin editar lo que este ya escrito
        setErrores((prev) => ({ ...prev, [name]: message }));
    };

    // Verificamos is ya no hay ningun error para enviar el formulario
    // Esto cuando no esta vacio el campo o cuando no tienen algun error
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
        <div>
            <h2>Registro</h2>
            <form onSubmit={handleRegister}>
                <input
                    placeholder="Correo"
                    value={correo_electronico}
                    onChange={(e) => {
                        setCorreoElectronico(e.target.value);
                        mensajesVerificacion("correo", e.target.value);
                    }}
                />
                <p style={{ color: "red" }}>{errores.correo}</p>

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contrasenia}
                    onChange={(e) => {
                        setContrasenia(e.target.value);
                        mensajesVerificacion("contrasenia", e.target.value);
                    }}
                />
                <p style={{ color: "red" }}>{errores.contrasenia}</p>

                <input
                    type="password"
                    placeholder="Confirmar Contraseña"
                    value={confirmarContrasenia}
                    onChange={(e) => {
                        setConfirmarContrasenia(e.target.value);
                        mensajesVerificacion("confirmarContrasenia", e.target.value);
                    }}
                />
                <p style={{ color: "red" }}>{errores.confirmarContrasenia}</p>

                <input
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => {
                        setNombre(e.target.value);
                        mensajesVerificacion("nombre", e.target.value);
                    }}
                />
                <p style={{ color: "red" }}>{errores.nombre}</p>

                <input
                    placeholder="Apellido"
                    value={apellido}
                    onChange={(e) => {
                        setApellido(e.target.value);
                        mensajesVerificacion("apellido", e.target.value);
                    }}
                />
                <p style={{ color: "red" }}>{errores.apellido}</p>

                <input
                    placeholder="Institución"
                    value={institucion}
                    onChange={(e) => { 
                        setInstitucion(e.target.value);
                        mensajesVerificacion("institucion", e.target.value);
                    }}
                />
                
                <p style={{ color: "red" }}>{errores.institucion}</p>

                <input
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => {
                        setTelefono(e.target.value);
                        mensajesVerificacion("telefono", e.target.value);
                    }}
                />
                
                <p style={{ color: "red" }}>{errores.telefono}</p>

                <button type="submit" disabled={!validarErrores()}>
                    Registrar
                </button>
            </form>
            <p>Ya tienes cuenta? <Link to="/">Login</Link></p>
        </div>
    );
}
